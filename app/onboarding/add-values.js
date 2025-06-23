// Arquivo: app/onboarding/add-values.js 
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addExpense } from '../../src/database/storage';
import { RECURRING_EXPENSES } from './recurring';

export default function AddValuesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [expenses, setExpenses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentValue, setCurrentValue] = useState('');
  const [customName, setCustomName] = useState('');

  useEffect(() => {
    // Pega os IDs que vieram da tela anterior e prepara a lista de despesas
    const selectedIds = JSON.parse(params.selectedIds || '[]');
    const itemsToValue = selectedIds.map(id => {
      return RECURRING_EXPENSES.find(exp => exp.id === id);
    }).filter(Boolean); // .filter(Boolean) remove qualquer item não encontrado

    // Adiciona um campo de valor para cada um
    setExpenses(itemsToValue.map(item => ({ ...item, value: '', customName: '' })));
  }, [params.selectedIds]);

  const handleNext = () => {
    // Salva o valor da despesa atual
    const newExpenses = [...expenses];
    newExpenses[currentIndex].value = currentValue;
    if (newExpenses[currentIndex].id === 'other') {
      newExpenses[currentIndex].customName = customName;
    }
    setExpenses(newExpenses);

    // Limpa os campos para a próxima
    setCurrentValue('');
    setCustomName('');

    // Se não for o último item, avança para o próximo
    if (currentIndex < expenses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Se for o último, finaliza o processo
      finishOnboarding(newExpenses);
    }
  };

  const finishOnboarding = async (finalExpenses) => {
    console.log("Iniciando salvamento das despesas:", finalExpenses);

    try {
      const today = new Date().toISOString().split('T')[0]; // Pega a data de hoje no formato AAAA-MM-DD

      // Um loop para salvar cada despesa
      for (const expense of finalExpenses) {
        await addExpense({
          name: expense.id === 'other' ? expense.customName : expense.name,
          category: expense.category,
          value: expense.value,
          date: today,
          is_recurring: 1,
        });
      }

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
        <Text style={styles.expenseName}>{currentExpense.id === 'other' ? 'Despesa customizada' : currentExpense.name}</Text>

        {currentExpense.id === 'other' && (
          <TextInput
            style={styles.input}
            placeholder="Nome da despesa (ex: Academia)"
            value={customName}
            onChangeText={setCustomName}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          keyboardType="numeric"
          value={currentValue}
          onChangeText={setCurrentValue}
          autoFocus={true} 
        />
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
});