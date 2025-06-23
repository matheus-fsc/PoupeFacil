// Arquivo: app/index.js (CÓDIGO DE TESTE ISOLADO)
import { openDatabase } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TestSQLiteScreen() {
  const [dbStatus, setDbStatus] = useState('Iniciando teste do SQLite...');

  useEffect(() => {
    try {
      // A linha que está falhando:
      const db = openDatabase('test.db');

      // Se a linha acima não quebrar, o teste passou.
      setDbStatus('SUCESSO! A função openDatabase foi encontrada e executada.');
      console.log('Objeto do banco de dados:', db);

    } catch (error) {
      // Se a linha quebrar, o erro será capturado aqui.
      setDbStatus(`FALHA! Erro: ${error.message}`);
      console.error(error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{dbStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  statusText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});