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

export async function getUserProfile() {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Storage Error: Falha ao buscar perfil do usuário.", e);
    return null;
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
    const jsonValue = JSON.stringify(updatedTransactions);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, jsonValue);
  } catch (e) {
    console.error("Storage Error: Falha ao adicionar transação.", e);
    throw e;
  }
}

export async function saveUserProfile(profileData) {
  try {
    const jsonValue = JSON.stringify(profileData);
    await AsyncStorage.setItem(USER_PROFILE_KEY, jsonValue);
  } catch (e) {
    console.error("Storage Error: Falha ao salvar perfil do usuário.", e);
    throw e;
  }
}

// --- Update/Delete ---

export async function updateTransaction(updatedTransaction) {
  try {
    const transactions = await getTransactions();
    const transactionIndex = transactions.findIndex(t => t.id === updatedTransaction.id);

    if (transactionIndex === -1) {
      throw new Error("Transação não encontrada para atualização.");
    }

    transactions[transactionIndex] = updatedTransaction;
    const jsonValue = JSON.stringify(transactions);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, jsonValue);
  } catch (e) {
    console.error("Storage Error: Falha ao atualizar transação.", e);
    throw e;
  }
}

export async function deleteTransaction(transactionId) {
  try {
    const transactions = await getTransactions();
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    const jsonValue = JSON.stringify(updatedTransactions);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, jsonValue);
  } catch (e) {
    console.error("Storage Error: Falha ao deletar transação.", e);
    throw e;
  }
}

// --- Limpeza ---

export async function clearAllData() {
  try {
    const keys = [RECURRING_EXPENSES_KEY, TRANSACTIONS_KEY, USER_PROFILE_KEY];
    await AsyncStorage.multiRemove(keys);
    console.log("Todos os dados do app foram limpos do AsyncStorage.");
  } catch (e) {
    console.error("Storage Error: Falha ao limpar todos os dados.", e);
    throw e;
  }
}