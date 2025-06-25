import { saveRecurringExpenses } from '../../src/services/storage';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RECURRING_EXPENSES } from './recurring';

function useCurrencyFormatter() {
  const formatCurrency = (valueInCents) => {
    const numericValue = parseInt(valueInCents || '0', 10);
    return (numericValue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  return { formatCurrency };
}
function useExpenseQueue() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const params = useLocalSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const selectedIds = JSON.parse(params.selectedIds || '[]');
    const itemsToValue = selectedIds
      .map(id => RECURRING_EXPENSES.find(exp => exp.id === id))
      .filter(Boolean);
    
    setExpenses(itemsToValue.map(item => ({ ...item, totalValue: 0, customName: '' })));
  }, [params.selectedIds]);

  const currentExpense = expenses[currentIndex];
  const isLastItem = currentIndex === expenses.length - 1;

  const updateExpenseValue = (updatedExpense) => {
    const newExpenses = [...expenses];
    newExpenses[currentIndex] = updatedExpense;
    setExpenses(newExpenses);
    return newExpenses;
  };

  const goToNextExpense = (updatedExpense) => {
    updateExpenseValue(updatedExpense);
    if (!isLastItem) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishOnboarding(updatedExpense);
    }
  };

  const finishOnboarding = async (lastUpdatedExpense) => {
    const finalExpenses = [...expenses];
    finalExpenses[currentIndex] = lastUpdatedExpense;

    console.log("Iniciando salvamento das despesas:", finalExpenses);
    try {
      await saveRecurringExpenses(finalExpenses);
      await completeOnboarding(); 
    } catch (e) {
      console.error("Falha ao finalizar onboarding", e);
      Alert.alert("Erro", "Não foi possível finalizar. Tente novamente.");
    }
  };

  return { currentExpense, isLastItem, goToNextExpense };
}

// --- COMPONENTES DA UI ---

const ExpenseHeader = ({ icon, name, isCustom }) => (
  <>
    <Ionicons name={icon} size={60} color="#333" />
    <Text style={styles.expenseName}>{isCustom ? 'Despesa customizada' : name}</Text>
  </>
);

const CustomNameInput = ({ value, onChange, onSubmit }) => (
  <TextInput
    style={styles.input}
    placeholder="Nome da despesa (ex: Academia)"
    value={value}
    onChangeText={onChange}
    returnKeyType="next"
    onSubmitEditing={onSubmit}
    blurOnSubmit={false}
    autoFocus
  />
);

const ValueInput = ({ value, onChange, onSubmit, inputRef, autoFocus }) => {
    const { formatCurrency } = useCurrencyFormatter();
    return (
        <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="R$ 0,00"
            keyboardType="decimal-pad"
            value={formatCurrency(value)}
            onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            maxLength={12}
            autoFocus={autoFocus}
        />
    )
};

const ExtraValuesSection = ({ expenseId, values, onAdd, onRemove, formatCurrency }) => (
  <>
    <TouchableOpacity
      style={[styles.button, styles.addAnotherButton]}
      onPress={onAdd}
    >
      <Text style={[styles.buttonText, { color: '#10b981' }]}>Adicionar outro valor</Text>
    </TouchableOpacity>

    {values.length > 0 && (
      <View style={styles.extraValuesContainer}>
        <Text style={styles.extraValuesTitle}>Valores adicionados:</Text>
        {values.map((val, idx) => (
          <View key={idx} style={styles.extraValueItem}>
            <Text style={styles.extraValueText}>{formatCurrency(val)}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(idx)}>
              <Ionicons name="close-circle" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    )}
  </>
);

// --- COMPONENTE PRINCIPAL ---

export default function AddValuesScreen() {
  const { currentExpense, isLastItem, goToNextExpense } = useExpenseQueue();
  const { formatCurrency } = useCurrencyFormatter();

  const [currentValue, setCurrentValue] = useState('');
  const [customName, setCustomName] = useState('');
  const [extraValues, setExtraValues] = useState([]);
  const valueInputRef = useRef(null);

  useEffect(() => {
    setCurrentValue('');
    setCustomName('');
    setExtraValues([]);
    if (currentExpense && currentExpense.id !== 'other') {
        setTimeout(() => valueInputRef.current?.focus(), 100);
    }
  }, [currentExpense]);

  if (!currentExpense) {
    return <View style={styles.container}><Text>Carregando...</Text></View>;
  }

  const getTotal = () => {
    const allValues = [currentValue, ...extraValues];
    return allValues.reduce((sum, val) => sum + parseInt(val || '0', 10), 0);
  };
  
  const handleAddAnotherValue = () => {
    if (!currentValue || parseInt(currentValue, 10) === 0) return;
    setExtraValues(prev => [...prev, currentValue]);
    setCurrentValue('');
  };

  const handleRemoveExtraValue = (index) => {
    setExtraValues(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleNext = () => {
    if (currentExpense.id === 'other' && !customName.trim()) {
      Alert.alert('Atenção', 'Digite o nome da despesa.');
      return;
    }

    const updatedExpense = {
      ...currentExpense,
      totalValue: getTotal(),
      customName: currentExpense.id === 'other' ? customName : '',
    };
    
    goToNextExpense(updatedExpense);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <ExpenseHeader
          icon={currentExpense.icon}
          name={currentExpense.name}
          isCustom={currentExpense.id === 'other'}
        />

        {currentExpense.id === 'other' && (
          <CustomNameInput
            value={customName}
            onChange={setCustomName}
            onSubmit={() => valueInputRef.current?.focus()}
          />
        )}

        <ValueInput 
            value={currentValue}
            onChange={setCurrentValue}
            onSubmit={handleNext}
            inputRef={valueInputRef}
            autoFocus={currentExpense.id !== 'other'}
        />

        <ExtraValuesSection
            values={extraValues}
            onAdd={handleAddAnotherValue}
            onRemove={handleRemoveExtraValue}
            formatCurrency={formatCurrency}
        />

        <Text style={styles.totalText}>Total: {formatCurrency(getTotal().toString())}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{isLastItem ? 'Finalizar' : 'Próximo'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    width: '100%',
    textAlign: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#10b981', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  extraValuesContainer: {
    width: '100%',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  extraValuesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  extraValueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  extraValueText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    padding: 5,
  },
  addAnotherButton: {
    backgroundColor: '#e0f7fa',
    borderColor: '#00796b',
    borderWidth: 1,
  },
  buttonTextSecondary: {
    color: '#00796b',
    fontWeight: 'bold',
  },
});