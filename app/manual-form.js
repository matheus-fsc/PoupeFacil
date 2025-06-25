import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addTransaction } from '../src/services/storage';

// Componente para o input de valor, que pode ser reutilizado
const ValueInput = ({ value, onChange, placeholder = 'R$ 0,00' }) => {
  const formatCurrency = (val) => {
    const numericValue = parseInt(val || '0', 10);
    return (numericValue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleChange = (text) => {
    const numeric = text.replace(/\D/g, '');
    onChange(numeric);
  };

  return (
    <TextInput
      style={styles.valueInput}
      placeholder={placeholder}
      value={formatCurrency(value)}
      onChangeText={handleChange}
      keyboardType="numeric"
      textAlign="center"
    />
  );
};

export default function ManualFormScreen() {
  const router = useRouter();
  const [type, setType] = useState('expense'); // 'expense' ou 'income'
  const [amount, setAmount] = useState(''); // Armazenado em centavos
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveTransaction = async () => {
    if (!amount || parseInt(amount, 10) === 0) {
      Alert.alert('Atenção', 'Por favor, insira um valor para a transação.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Atenção', 'Por favor, adicione uma descrição.');
      return;
    }

    const newTransaction = {
      id: `trans_${Date.now()}`,
      type,
      amount: parseInt(amount, 10),
      description: description.trim(),
      category: category.trim() || 'Geral',
      date: date.toISOString(),
    };

    try {
      await addTransaction(newTransaction);
      Alert.alert('Sucesso!', 'Sua transação foi salva.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a transação. Tente novamente.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* --- CABEÇALHO ATUALIZADO --- */}
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar Manualmente</Text>
            {/* Botão para fechar o modal */}
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                <Ionicons name="close-circle" size={32} color="#d1d5db" />
            </TouchableOpacity>
          </View>

          {/* Seletor de Tipo (Gasto / Ganho) */}
          <View style={styles.typeSelectorContainer}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.typeButtonText, type === 'expense' && styles.typeButtonTextActive]}>
                Gasto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.typeButtonText, type === 'income' && styles.typeButtonTextActive]}>
                Ganho
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input de Valor */}
          <ValueInput value={amount} onChange={setAmount} />

          {/* Outros Campos */}
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Descrição (ex: Almoço, Supermercado)"
              value={description}
              onChangeText={setDescription}
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder="Categoria (ex: Alimentação, Lazer)"
              value={category}
              onChangeText={setCategory}
            />
            <View style={styles.divider} />
            <TouchableOpacity style={styles.dateRow} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={24} color="#4b5563" />
              <Text style={styles.dateText}>{date.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Botão de Salvar */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveTransaction}>
            <Text style={styles.saveButtonText}>Salvar Transação</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row', // Alinha o título e o botão na mesma linha
    justifyContent: 'space-between', // Espaça os itens
    alignItems: 'center', // Alinha verticalmente
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4, // Adiciona uma área de toque maior
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  typeButtonTextActive: {
    color: '#10b981',
  },
  valueInput: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 16,
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#374151',
  },
  saveButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
