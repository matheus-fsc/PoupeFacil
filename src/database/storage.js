import { openDatabase } from 'expo-sqlite';
const db = openDatabase('poupefacil.db');

export const initDB = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS expenses (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          value REAL NOT NULL,
          date TEXT NOT NULL,
          is_recurring INTEGER DEFAULT 0
        );`,
        [],
        () => {
          console.log("Banco de dados inicializado com sucesso!");
          resolve();
        },
        (_, error) => {
          console.error("Erro ao inicializar o banco de dados", error);
          reject(error);
        }
      );
    });
  });
  return promise;
};

export const addExpense = (expense) => {
  const { name, category, value, date, is_recurring } = expense;
  const numericValue = parseFloat(String(value).replace(',', '.'));
  const promise = new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO expenses (name, category, value, date, is_recurring) VALUES (?, ?, ?, ?, ?);`,
        [name, category, numericValue, date, is_recurring ? 1 : 0],
        (_, result) => { resolve(result); },
        (_, error) => { reject(error); }
      );
    });
  });
  return promise;
};