// Arquivo: app/onboarding/add-values.js 
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RECURRING_EXPENSES } from './recurring';

export default function AddValuesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [expenses, setExpenses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentValue, setCurrentValue] = useState('');
  const [customName, setCustomName] = useState('');
  const [extraValues, setExtraValues] = useState({}); // Novo estado para múltiplos valores por despesa
  const valueInputRef = useRef(null);

  useEffect(() => {
    // Pega os IDs que vieram da tela anterior e prepara a lista de despesas
    const selectedIds = JSON.parse(params.selectedIds || '[]');
    const itemsToValue = selectedIds.map(id => {
      return RECURRING_EXPENSES.find(exp => exp.id === id);
    }).filter(Boolean); // .filter(Boolean) remove qualquer item não encontrado

    // Adiciona um campo de valor para cada um
    setExpenses(itemsToValue.map(item => ({ ...item, value: '', customName: '' })));
  }, [params.selectedIds]);

  // Formata o valor para moeda BRL, sempre mostrando ",00" se não houver centavos
  const formatCurrency = (value) => {
    // Remove tudo que não for número
    const numeric = value.replace(/\D/g, '');
    // Converte para centavos
    const cents = parseInt(numeric || '0', 10);
    // Divide por 100 e formata
    return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Atualiza o valor formatado conforme o usuário digita
  const handleValueChange = (text) => {
    // Permite apenas números
    const numeric = text.replace(/\D/g, '');
    setCurrentValue(numeric);
  };

  // Foca no campo de valor após preencher o nome customizado
  const handleCustomNameSubmit = () => {
    valueInputRef.current?.focus();
  };

  // Adiciona mais um valor para a despesa atual
  const handleAddAnotherValue = () => {
    if (!currentValue || parseInt(currentValue, 10) === 0) {
      Alert.alert('Atenção', 'Digite um valor válido antes de adicionar outro.');
      return;
    }
    const key = expenses[currentIndex].id;
    setExtraValues(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), currentValue]
    }));
    setCurrentValue('');
  };

  // Soma todos os valores (principal + extras) para a despesa atual
  const getTotalForCurrent = () => {
    const key = expenses[currentIndex].id;
    const extras = extraValues[key] || [];
    const allValues = [currentValue, ...extras];
    const total = allValues.reduce((sum, val) => sum + parseInt(val || '0', 10), 0);
    return formatCurrency(total.toString());
  };

  const handleNext = () => {
    // Permite avançar mesmo se o valor for 0
    // Apenas exige nome se for customizada
    if (expenses[currentIndex].id === 'other' && !customName.trim()) {
      Alert.alert('Atenção', 'Digite o nome da despesa.');
      return;
    }

    const newExpenses = [...expenses];
    newExpenses[currentIndex].value = formatCurrency(currentValue);
    if (newExpenses[currentIndex].id === 'other') {
      newExpenses[currentIndex].customName = customName;
    }
    setExpenses(newExpenses);

    setCurrentValue('');
    setCustomName('');

    if (currentIndex < expenses.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeout(() => valueInputRef.current?.focus(), 100);
    } else {
      finishOnboarding(newExpenses);
    }
  };

  const finishOnboarding = async (finalExpenses) => {
    console.log("Iniciando salvamento das despesas:", finalExpenses);

    try {
      // Salva todas as despesas localmente no AsyncStorage
      await AsyncStorage.setItem('user_expenses', JSON.stringify(finalExpenses));
      await AsyncStorage.setItem('onboarding_completed', 'true');
      router.replace('/');
    } catch (e) {
      console.error("Falha ao finalizar onboarding", e);
      Alert.alert("Erro", "Não foi possível finalizar o onboarding. Tente novamente mais tarde.");
    }
  };

  if (expenses.length === 0) {
    return <View style={styles.container}><Text>Carregando...</Text></View>;
  }

  const currentExpense = expenses[currentIndex];
  const isLastItem = currentIndex === expenses.length - 1;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons name={currentExpense.icon} size={60} color="#333" />
        <Text style={styles.expenseName}>
          {currentExpense.id === 'other'
            ? 'Despesa customizada'
            : currentExpense.name}
        </Text>

        {currentExpense.id === 'other' && (
          <TextInput
            style={styles.input}
            placeholder="Nome da despesa (ex: Academia)"
            value={customName}
            onChangeText={setCustomName}
            returnKeyType="next"
            onSubmitEditing={handleCustomNameSubmit}
            blurOnSubmit={false}
            autoFocus={true}
          />
        )}

        <TextInput
          ref={valueInputRef}
          style={styles.input}
          placeholder="R$ 0,00"
          keyboardType="decimal-pad"
          value={formatCurrency(currentValue)}
          onChangeText={handleValueChange}
          returnKeyType="done"
          onSubmitEditing={handleNext}
          maxLength={12}
          autoFocus={currentExpense.id !== 'other'}
          accessible
          accessibilityLabel="Campo de valor"
        />

        {/* Botão para adicionar mais um valor */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: '#f1f5f9', marginBottom: 10, opacity: (!currentValue || parseInt(currentValue, 10) === 0) ? 0.5 : 1 }
          ]}
          onPress={handleAddAnotherValue}
          disabled={!currentValue || parseInt(currentValue, 10) === 0}
        >
          <Text style={[styles.buttonText, { color: '#10b981' }]}>Adicionar outro valor</Text>
        </TouchableOpacity>

        {/* Lista de valores extras adicionados com opção de remover */}
        {(extraValues[currentExpense.id]?.length > 0) && (
          <View style={styles.extraValuesContainer}>
            <Text style={styles.extraValuesTitle}>Valores adicionados:</Text>
            {extraValues[currentExpense.id].map((val, idx) => (
              <View key={idx} style={styles.extraValueItem}>
                <Text style={styles.extraValueText}>{formatCurrency(val)}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    const key = currentExpense.id;
                    setExtraValues(prev => ({
                      ...prev,
                      [key]: prev[key].filter((_, i) => i !== idx)
                    }));
                  }}
                  accessibilityLabel="Remover valor"
                >
                  <Ionicons name="close-circle" size={22} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Exibe o total somado */}
        <Text style={styles.totalText}>
          Total: {getTotalForCurrent()}
        </Text>
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
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  extraValuesContainer: {
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  extraValuesTitle: {
    color: '#555',
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 15,
  },
  extraValueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  extraValueText: {
    color: '#333',
    fontSize: 16,
  },
  removeButton: {
    marginLeft: 10,
    padding: 2,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 10,
    color: '#10b981',
    alignSelf: 'flex-end',
  },
});