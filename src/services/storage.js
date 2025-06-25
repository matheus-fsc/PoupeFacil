import AsyncStorage from '@react-native-async-storage/async-storage';

const RECURRING_EXPENSES_KEY = '@PoupeFacil:recurring_expenses';
const TRANSACTIONS_KEY = '@PoupeFacil:transactions';
const USER_PROFILE_KEY = '@PoupeFacil:user_profile';

// --- Getters ---

export async function getRecurringExpenses() {
  try {
    const jsonValue = await AsyncStorage.getItem(RECURRING_EXPENSES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Storage Error: Falha ao buscar despesas recorrentes.", e);
    return [];
  }
}

export async function getTransactions() {
  try {
    const jsonValue = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Storage Error: Falha ao buscar transações.", e);
    return [];
  }
}

// --- Setters ---

export async function saveRecurringExpenses(expenses) {
  try {
    const jsonValue = JSON.stringify(expenses);
    await AsyncStorage.setItem(RECURRING_EXPENSES_KEY, jsonValue);
  } catch (e) {
    console.error("Storage Error: Falha ao salvar despesas recorrentes.", e);
    throw e;
  }
}

export async function addTransaction(newTransaction) {
  try {
    const existingTransactions = await getTransactions();
    const updatedTransactions = [...existingTransactions, newTransaction];
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
  } catch (e) {
    console.error("Storage Error: Falha ao adicionar transação.", e);
    throw e;
  }
}

// --- Update/Delete ---

export async function updateTransaction(updatedTransaction) {
  try {
    const transactions = await getTransactions();
    const transactionIndex = transactions.findIndex(t => t.id === updatedTransaction.id);
    if (transactionIndex > -1) {
      transactions[transactionIndex] = updatedTransaction;
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } else {
      throw new Error("Transação manual não encontrada.");
    }
  } catch (e) {
    console.error("Storage Error: Falha ao atualizar transação.", e);
    throw e;
  }
}

export async function deleteTransaction(transactionId) {
  try {
    const transactions = await getTransactions();
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
  } catch (e) {
    console.error("Storage Error: Falha ao deletar transação.", e);
    throw e;
  }
}

export async function updateRecurringExpense(updatedExpense) {
  try {
    const expenses = await getRecurringExpenses();
    const expenseIndex = expenses.findIndex(e => e.id === updatedExpense.id);
    if (expenseIndex > -1) {
      // Atualiza os campos relevantes
      expenses[expenseIndex].name = updatedExpense.description;
      expenses[expenseIndex].totalValue = updatedExpense.amount;
      await AsyncStorage.setItem(RECURRING_EXPENSES_KEY, JSON.stringify(expenses));
    } else {
      throw new Error("Despesa recorrente não encontrada.");
    }
  } catch (e) {
    console.error("Storage Error: Falha ao atualizar despesa recorrente.", e);
    throw e;
  }
}

export async function deleteRecurringExpense(expenseId) {
  try {
    const expenses = await getRecurringExpenses();
    const updatedExpenses = expenses.filter(e => e.id !== expenseId);
    await AsyncStorage.setItem(RECURRING_EXPENSES_KEY, JSON.stringify(updatedExpenses));
  } catch (e) {
    console.error("Storage Error: Falha ao deletar despesa recorrente.", e);
    throw e;
  }
}
