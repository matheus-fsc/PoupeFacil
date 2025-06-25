// Arquivo: app/(tabs)/index.jsx

import { useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { getRecurringExpenses } from '../../src/services/storage'; // Importe a função de busca

export default function HomeScreen() {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [totalMonthly, setTotalMonthly] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // useFocusEffect é um hook que roda toda vez que a tela entra em foco.
  // É melhor que o useEffect para garantir que os dados estejam sempre atualizados.
  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        setIsLoading(true);
        const expenses = await getRecurringExpenses();
        setRecurringExpenses(expenses);

        // Calcula o total mensal
        const total = expenses.reduce((sum, item) => sum + item.totalValue, 0);
        setTotalMonthly(total / 100); // Converte de centavos para reais

        setIsLoading(false);
      }

      loadData();
    }, [])
  );

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Carregando seus dados...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Matheus!</Text>
        <Text style={styles.title}>Resumo Mensal</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total de Despesas Fixas</Text>
        <Text style={styles.summaryValue}>{formatCurrency(totalMonthly)}</Text>
        <Text style={styles.summarySubtext}>Este é o valor base dos seus gastos recorrentes por mês.</Text>
      </View>

      <Text style={styles.listHeader}>Suas Despesas Recorrentes</Text>
      <FlatList
        data={recurringExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.expenseName}>{item.customName || item.name}</Text>
            <Text style={styles.expenseValue}>{formatCurrency(item.totalValue / 100)}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não adicionou despesas.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 18,
    color: '#4b5563',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10b981',
  },
  summarySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },
});