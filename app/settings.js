import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { Alert, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../src/components/PrimaryButton';

export default function SettingsScreen() {

  const handleResetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('onboarding_completed');
      
      Alert.alert(
        "Onboarding Resetado",
        "O aplicativo será reiniciado para exibir o fluxo de onboarding.",
        [{ text: "OK", onPress: () => Updates.reloadAsync() }]
      );

    } catch (e) {
      Alert.alert("Erro", "Não foi possível resetar o onboarding.");
      console.error("Falha ao resetar onboarding", e);
    }
  };

  // Função para deletar todos os dados locais (sem SQLite)
  const handleDeleteDatabase = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert(
        "Dados Apagados",
        "Todos os dados locais foram removidos.",
        [{ text: "OK", onPress: () => Updates.reloadAsync() }]
      );
    } catch (e) {
      Alert.alert("Erro", "Não foi possível apagar os dados locais.");
      console.error("Erro ao apagar dados locais", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      
      <View style={styles.devSection}>
        <Text style={styles.devTitle}>Modo de Desenvolvedor</Text>
        <PrimaryButton
          title="Resetar Onboarding"
          onPress={handleResetOnboarding}
        />
        <PrimaryButton
          title="Apagar Dados Locais"
          onPress={handleDeleteDatabase}
        />
        <Text style={styles.devDescription}>
          Este botão limpa o status de conclusão do onboarding e reinicia o app. Use para testar o fluxo inicial novamente.
        </Text>
        <Text style={styles.devDescription}>
          O botão "Apagar Dados Locais" remove todos os dados salvos no app.
        </Text>
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc', 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  devSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  devTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  devDescription: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 20,
  }
});