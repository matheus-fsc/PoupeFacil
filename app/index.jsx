// Arquivo: app/index.js (CÓDIGO DE TESTE ISOLADO)
// Removido: import { openDatabase } from 'expo-sqlite';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  // Exemplo simples de tela inicial sem SQLite
  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>Bem-vindo ao PoupeFácil!</Text>
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