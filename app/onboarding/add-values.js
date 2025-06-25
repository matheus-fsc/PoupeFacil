import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { saveRecurringExpenses } from '../../src/services/storage';
import { RECURRING_EXPENSES_DATA } from './recurring';

// --- HOOKS ---
function useCurrencyFormatter() {
  const formatCurrency = (valueInCents) => {
    const numericValue = parseInt(valueInCents || '0', 10);
    return (numericValue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  return { formatCurrency };
}

function useExpenseQueue() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { completeOnboarding } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const ids = JSON.parse(params.selectedIds || '[]');
    const custom = JSON.parse(params.customItems || '[]');
    const allPredefinedExpenses = RECURRING_EXPENSES_DATA.flatMap(section => section.data);

    const itemsToValue = ids.map(id => {
      if (id.startsWith('custom_')) {
        return custom.find(item => item.id === id);
      } else {
        return allPredefinedExpenses.find(exp => exp.id === id);
      }
    }).filter(Boolean);

    setExpenses(itemsToValue.map(item => ({ ...item, totalValue: 0, customName: '', recurrenceDate: new Date().toISOString() })));
  }, [params.selectedIds, params.customItems]);

  const currentExpense = expenses[currentIndex];
  const isLastItem = currentIndex === expenses.length - 1;

  const goToNextExpense = (updatedExpense) => {
    const newExpenses = [...expenses];
    newExpenses[currentIndex] = updatedExpense;
    setExpenses(newExpenses);

    if (!isLastItem) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishOnboarding(newExpenses);
    }
  };

  const finishOnboarding = async (finalExpenses) => {
    try {
      await saveRecurringExpenses(finalExpenses);
      await completeOnboarding();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível finalizar. Tente novamente.");
    }
  };

  return { currentExpense, isLastItem, goToNextExpense };
}

// --- Componentes de UI ---
const ExpenseHeader = ({ icon, name, isCustom }) => (
  <>
    <Ionicons name={icon} size={50} color="#374151" />
    <Text style={styles.expenseName}>{isCustom ? 'Nova Despesa' : name}</Text>
  </>
);

const CustomNameInput = ({ value, onChange, onSubmit }) => (
  <TextInput style={styles.input} placeholder="Nome da despesa (ex: Academia)" value={value} onChangeText={onChange} returnKeyType="next" onSubmitEditing={onSubmit} blurOnSubmit={false} autoFocus />
);

const ValueInput = ({ value, onChange, onSubmit, inputRef, autoFocus }) => {
    const { formatCurrency } = useCurrencyFormatter();
    return <TextInput ref={inputRef} style={styles.input} placeholder="R$ 0,00" keyboardType="decimal-pad" value={formatCurrency(value)} onChangeText={(text) => onChange(text.replace(/\D/g, ''))} returnKeyType="done" onSubmitEditing={onSubmit} maxLength={13} autoFocus={autoFocus} />
};

const ExtraValuesSection = ({ values, onAdd, onRemove, formatCurrency }) => (
  <>
    <TouchableOpacity style={[styles.button, styles.addAnotherButton]} onPress={onAdd}>
      <Text style={[styles.buttonText, styles.buttonTextSecondary]}>+ Adicionar outro valor</Text>
    </TouchableOpacity>
    {values.length > 0 && (
      <View style={styles.extraValuesContainer}>
        <Text style={styles.extraValuesTitle}>Valores adicionados</Text>
        {values.map((val, idx) => (
          <View key={idx} style={styles.extraValueItem}>
            <Text style={styles.extraValueText}>{formatCurrency(val)}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(idx)}>
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    )}
  </>
);

export default function AddValuesScreen() {
  const { currentExpense, isLastItem, goToNextExpense } = useExpenseQueue();
  const { formatCurrency } = useCurrencyFormatter();
  
  const [currentValue, setCurrentValue] = useState('');
  const [customName, setCustomName] = useState('');
  const [extraValues, setExtraValues] = useState([]);
  const [recurrenceDate, setRecurrenceDate] = useState(new Date()); 
  const [showDatePicker, setShowDatePicker] = useState(false);  
  const valueInputRef = useRef(null);

  useEffect(() => {
    setCurrentValue('');
    setCustomName('');
    setExtraValues([]);
    setRecurrenceDate(new Date()); // reseta a data para a atual
    if (currentExpense && !currentExpense.isCustom) {
        setTimeout(() => valueInputRef.current?.focus(), 100);
    }
  }, [currentExpense]);

  if (!currentExpense) {
    return <View style={styles.container}><Text>Carregando...</Text></View>;
  }

  const getTotal = () => [currentValue, ...extraValues].reduce((sum, val) => sum + parseInt(val || '0', 10), 0);
  
  const handleAddAnotherValue = () => {
    if (!currentValue || parseInt(currentValue, 10) === 0) return;
    setExtraValues(prev => [...prev, currentValue]);
    setCurrentValue('');
  };

  const handleRemoveExtraValue = (index) => setExtraValues(prev => prev.filter((_, i) => i !== index));
  
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || recurrenceDate;
    setShowDatePicker(Platform.OS === 'ios');
    setRecurrenceDate(currentDate);
  };
  
  const handleNext = () => {
    if (currentExpense.isCustom && !customName.trim()) {
      Alert.alert('Atenção', 'Digite o nome da despesa personalizada.');
      return;
    }
    const updatedExpense = {
      ...currentExpense,
      totalValue: getTotal(),
      name: currentExpense.isCustom ? customName.trim() : currentExpense.name,
      recurrenceDate: recurrenceDate.toISOString(), 
    };
    goToNextExpense(updatedExpense);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.content}>
        <ExpenseHeader icon={currentExpense.icon} name={currentExpense.name} isCustom={currentExpense.isCustom} />
        {currentExpense.isCustom && (
          <CustomNameInput value={customName} onChange={setCustomName} onSubmit={() => valueInputRef.current?.focus()} />
        )}
        <ValueInput value={currentValue} onChange={setCurrentValue} onSubmit={handleNext} inputRef={valueInputRef} autoFocus={!currentExpense.isCustom} />
        
        {/* 3. Campo para selecionar a data */}
        <TouchableOpacity style={styles.dateRow} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={24} color="#4b5563" />
            <Text style={styles.dateText}>Vencimento: {recurrenceDate.toLocaleDateString('pt-BR')}</Text>
        </TouchableOpacity>

        {showDatePicker && (
            <DateTimePicker
                value={recurrenceDate}
                mode="date"
                display="default"
                onChange={onDateChange}
            />
        )}

        <ExtraValuesSection values={extraValues} onAdd={handleAddAnotherValue} onRemove={handleRemoveExtraValue} formatCurrency={formatCurrency} />
        <Text style={styles.totalText}>Total: {formatCurrency(getTotal().toString())}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{isLastItem ? 'Finalizar e Salvar' : 'Próximo'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
    marginVertical: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    width: '100%',
    textAlign: 'center',
    marginBottom: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  extraValuesContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  extraValuesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: 8,
  },
  extraValueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  extraValueText: {
    fontSize: 16,
    color: '#374151',
  },
  removeButton: {
    padding: 4,
  },
  addAnotherButton: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  buttonTextSecondary: {
    color: '#4b5563',
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
});
