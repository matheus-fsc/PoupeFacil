import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { clearAllData } from '../../src/services/storage'; // 1. Importa a função correta do nosso storage
import { useAuth } from '../../context/AuthContext'; // Para resetar o onboarding sem recarregar

export default function SettingsScreen() {
  const [isDevMode, setIsDevMode] = useState(false);
  const { completeOnboarding } = useAuth();

  const showConfirmationAlert = (title, message, onConfirm) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: onConfirm,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Reseta apenas o onboarding
  const handleResetOnboarding = () => {
    showConfirmationAlert(
      "Resetar Onboarding?",
      "Isso irá apagar apenas o status de conclusão do onboarding. O aplicativo será reiniciado.",
      async () => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            await AsyncStorage.removeItem('onboarding_completed');
            await Updates.reloadAsync();
        } catch (e) {
            Alert.alert("Erro", "Não foi possível resetar o onboarding.");
        }
      }
    );
  };
  
  // Apaga TODOS os dados gerenciados pelo storage.js
  const handleClearDatabase = () => {
    showConfirmationAlert(
      "Apagar Todos os Dados?",
      "Esta ação é irreversível e removerá todas as despesas e transações salvas no aplicativo.",
      async () => {
        try {
          await clearAllData();
          await Updates.reloadAsync(); 
        } catch (e) {
          Alert.alert("Erro", "Não foi possível apagar os dados locais.");
          console.error("Erro ao apagar dados locais", e);
        }
      }
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      
      {/* --- Card de Opções Gerais --- */}
      <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
              <Ionicons name="person-circle-outline" size={24} color="#4b5563" />
              <Text style={styles.rowLabel}>Perfil</Text>
              <Ionicons name="chevron-forward-outline" size={24} color="#9ca3af" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
              <Ionicons name="notifications-outline" size={24} color="#4b5563" />
              <Text style={styles.rowLabel}>Notificações</Text>
              <Ionicons name="chevron-forward-outline" size={24} color="#9ca3af" />
          </TouchableOpacity>
      </View>

      {/* --- Card do Modo Desenvolvedor --- */}
      <View style={styles.card}>
        <View style={styles.row}>
            <Ionicons name="code-slash-outline" size={24} color="#4b5563" />
            <Text style={styles.rowLabel}>Modo de Desenvolvedor</Text>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isDevMode ? '#10b981' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setIsDevMode(previousState => !previousState)}
                value={isDevMode}
            />
        </View>

        {/* --- Ações de Desenvolvedor (Visíveis apenas se o modo estiver ativo) --- */}
        {isDevMode && (
          <>
            <View style={styles.divider} />
            <View style={styles.devActionsContainer}>
                <Text style={styles.devDescription}>
                    As opções abaixo são para fins de teste e podem causar perda de dados.
                </Text>
                
                <TouchableOpacity 
                    style={[styles.devButton, styles.resetButton]}
                    onPress={handleResetOnboarding}
                >
                    <Ionicons name="refresh-outline" size={20} color="#3b82f6" />
                    <Text style={[styles.devButtonText, { color: '#3b82f6' }]}>Resetar Onboarding</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.devButton, styles.deleteButton]}
                    onPress={handleClearDatabase}
                >
                    <Ionicons name="trash-bin-outline" size={20} color="#ef4444" />
                    <Text style={[styles.devButtonText, { color: '#ef4444' }]}>Apagar Todos os Dados</Text>
                </TouchableOpacity>
            </View>
          </>
        )}
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 56,
  },
  devActionsContainer: {
    paddingVertical: 16,
  },
  devDescription: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
    lineHeight: 18,
  },
  devButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  resetButton: {
    backgroundColor: '#eff6ff',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  devButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
