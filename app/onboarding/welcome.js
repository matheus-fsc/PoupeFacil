// Arquivo: app/onboarding/welcome.js (VERSÃO ESTILIZADA)
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="sparkles-outline" size={80} color="#10b981" />
        <Text style={styles.title}>Bem-vindo ao PoupeFácil!</Text>
        <Text style={styles.subtitle}>
          Vamos organizar suas finanças de um jeito simples e rápido. O primeiro passo é adicionar suas contas e assinaturas recorrentes.
        </Text>
      </View>
      <Link href="/onboarding/recurring" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Começar a Organizar</Text>
        </TouchableOpacity>
      </Link>
    </View>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 24,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});