import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import { getRecurringExpenses, getTransactions } from '../../src/services/storage';

// --- Componentes reutilizados da tela de relatórios ---

const SummaryCard = ({ title, value, color, icon, style }) => (
  <View style={[styles.summaryCard, style]}>
    <Ionicons name={icon} size={24} color={color} />
    <View style={styles.summaryTextContainer}>
      <Text style={styles.summaryTitle}>{title}</Text>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    </View>
  </View>
);

const TransactionItem = ({ item }) => {
  const isExpense = item.type === 'expense';
  const amountColor = isExpense ? '#ef4444' : '#10b981';
  const amountSign = isExpense ? '- ' : '+ ';

  const formatCurrency = (valueInCents) => {
    return (valueInCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIconContainer, { backgroundColor: isExpense ? '#fee2e2' : '#dcfce7' }]}>
        <Ionicons 
            name={isExpense ? 'arrow-down-outline' : 'arrow-up-outline'} 
            size={24} 
            color={amountColor} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: amountColor }]}>
        {amountSign}{formatCurrency(item.amount)}
      </Text>
    </View>
  );
};


export default function HomeScreen() {
  const [summary, setSummary] = useState({ income: 0, totalExpenses: 0, fixedExpenses: 0, variableExpenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setIsLoading(true);
        
        const manualTransactions = await getTransactions();
        const recurring = await getRecurringExpenses();

        let totalIncome = 0;
        let totalVariableExpenses = 0;

        manualTransactions.forEach(t => {
          if (t.type === 'income') {
            totalIncome += t.amount;
          } else {
            totalVariableExpenses += t.amount;
          }
        });

        const totalFixedExpenses = recurring.reduce((sum, r) => sum + r.totalValue, 0);
        const totalExpenses = totalFixedExpenses + totalVariableExpenses;

        setSummary({
          income: totalIncome,
          totalExpenses: totalExpenses,
          fixedExpenses: totalFixedExpenses,
          variableExpenses: totalVariableExpenses,
          balance: totalIncome - totalExpenses,
        });

        setTransactions(manualTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)));
        
        setIsLoading(false);
      };

      loadData();
    }, [])
  );

  const formatCurrency = (valueInCents) => {
    return (valueInCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
        <FlatList
            ListHeaderComponent={
                <>
                    <Text style={styles.title}>Resumo do Mês</Text>
                    
                    {/* Cards de Resumo Geral */}
                    <View style={styles.summaryContainer}>
                        <SummaryCard title="Ganhos" value={formatCurrency(summary.income)} color="#10b981" icon="trending-up-outline" style={{flex: 1}}/>
                        <View style={{width: 16}} />
                        <SummaryCard title="Gastos" value={formatCurrency(summary.totalExpenses)} color="#ef4444" icon="trending-down-outline" style={{flex: 1}}/>
                    </View>
                    <View style={[styles.summaryCard, styles.balanceCard]}>
                        <Text style={styles.summaryTitle}>Saldo Atual</Text>
                        <Text style={[styles.summaryValue, {fontSize: 22, color: summary.balance >= 0 ? '#1f2937' : '#ef4444'}]}>{formatCurrency(summary.balance)}</Text>
                    </View>

                    {/* Seção de Análise de Gastos */}
                    <Text style={styles.listHeader}>Análise dos Gastos</Text>
                    <View style={styles.summaryContainer}>
                        <SummaryCard title="Gastos Fixos" value={formatCurrency(summary.fixedExpenses)} color="#8b5cf6" icon="receipt-outline" style={{flex: 1}}/>
                        <View style={{width: 16}} />
                        <SummaryCard title="Gastos Variáveis" value={formatCurrency(summary.variableExpenses)} color="#f97316" icon="cart-outline" style={{flex: 1}}/>
                    </View>
                    
                    {/* Lista de Transações Recentes */}
                    <Text style={styles.listHeader}>Histórico de Transações</Text>
                </>
            }
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionItem item={item} />}
            ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma transação manual registrada ainda.</Text>
            </View>
            }
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 24,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
    },
    balanceCard: {
        justifyContent: 'space-between',
        paddingVertical: 20,
        marginHorizontal: 20,
    },
    summaryTextContainer: {
        marginLeft: 12,
        flexShrink: 1,
    },
    summaryTitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 24,
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        marginHorizontal: 20,
    },
    transactionIconContainer: {
        padding: 10,
        borderRadius: 999, // Círculo
    },
    transactionDetails: {
        flex: 1,
        marginLeft: 12,
    },
    transactionDescription: {
        fontSize: 16,
        fontWeight: '500',
    },
    transactionCategory: {
        fontSize: 12,
        color: '#6b7280',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
    },
});

