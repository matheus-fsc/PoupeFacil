import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EditTransactionModal from '../src/components/EditTransactionModal';
import { 
    getTransactions, 
    getRecurringExpenses, 
    deleteTransaction, 
    deleteRecurringExpense, 
    updateTransaction, 
    updateRecurringExpense 
} from '../src/services/storage';

export default function TransactionListScreen() {
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const loadTransactions = useCallback(async () => {
        const manualTransactions = await getTransactions();
        const recurring = await getRecurringExpenses();

        const recurringAsTransactions = recurring.map(expense => ({
            id: expense.id,
            type: 'expense',
            amount: expense.totalValue,
            description: expense.name,
            category: 'Gasto Fixo',
            date: new Date().toISOString(),
            isRecurring: true,
        }));

        const allTransactions = [...manualTransactions, ...recurringAsTransactions];
        setTransactions(allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }, []);

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                await loadTransactions();
            }
            fetchData();
        }, [loadTransactions])
    );

    const handleEdit = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalVisible(true);
    };

    const handleDelete = (transaction) => {
        const message = transaction.isRecurring 
            ? "Apagar esta despesa recorrente a removerá permanentemente."
            : "Esta ação é irreversível.";
            
        Alert.alert("Apagar Transação?", message, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Apagar',
                style: 'destructive',
                onPress: async () => {
                    if (transaction.isRecurring) {
                        await deleteRecurringExpense(transaction.id);
                    } else {
                        await deleteTransaction(transaction.id);
                    }
                    loadTransactions(); 
                },
            },
        ]);
    };
    
    const handleSaveEdit = async (updatedTransaction) => {
        try {
            if (updatedTransaction.isRecurring) {
                await updateRecurringExpense(updatedTransaction);
            } else {
                await updateTransaction(updatedTransaction);
            }
            setIsModalVisible(false);
            setSelectedTransaction(null);
            loadTransactions();
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar as alterações.");
        }
    };

    const formatCurrency = (value) => (value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <SafeAreaView style={styles.container}>
            <EditTransactionModal 
                visible={isModalVisible}
                transaction={selectedTransaction}
                onClose={() => setIsModalVisible(false)}
                onSave={handleSaveEdit}
            />

            <View style={styles.header}>
                <Text style={styles.title}>Gerenciar Transações</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close-circle" size={32} color="#d1d5db" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Ionicons name={item.isRecurring ? "repeat-outline" : "cash-outline"} size={24} color="#6b7280" />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                            <Text style={styles.itemDate}>{new Date(item.date).toLocaleDateString('pt-BR')}</Text>
                        </View>
                        <Text style={[styles.itemAmount, { color: item.type === 'expense' ? '#ef4444' : '#10b981' }]}>
                            {formatCurrency(item.amount)}
                        </Text>
                        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
                            <Ionicons name="pencil-outline" size={22} color="#6b7280" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
                            <Ionicons name="trash-outline" size={22} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold' },
    closeButton: { padding: 4 },
    itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, marginHorizontal: 20, marginBottom: 12, borderRadius: 12 },
    itemDetails: { flex: 1, marginLeft: 12 },
    itemDescription: { fontSize: 16, fontWeight: '500' },
    itemDate: { fontSize: 12, color: '#6b7280' },
    itemAmount: { fontSize: 16, fontWeight: 'bold', marginRight: 12 },
    actionButton: { padding: 8 },
    emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' }
});
