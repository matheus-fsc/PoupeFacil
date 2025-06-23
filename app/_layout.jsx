// Arquivo: app/_layout.js (VERSÃO FINAL E COMPLETA)

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// 1. Importamos nossa função de inicialização do Banco de Dados
import { initDB } from '../src/database/storage';

// Componente principal do Layout
export default function RootLayout() {
  // 2. Adicionamos um novo estado para controlar a inicialização do DB
  const [dbInitialized, setDbInitialized] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const router = useRouter();
  const segments = useSegments();

  // 3. Este useEffect agora cuida de TODA a preparação do app
  useEffect(() => {
    // Prepara o banco de dados
    initDB()
      .then(() => {
        setDbInitialized(true);
        console.log("Banco de dados pronto.");
      })
      .catch(err => {
        console.error("Erro fatal na inicialização do DB:", err);
      });
    
    // Verifica o status do onboarding
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('onboarding_completed');
        const hasCompleted = value === 'true';
        setOnboardingCompleted(hasCompleted);
        console.log("Status do onboarding verificado:", hasCompleted);
      } catch (e) {
        console.error("Falha ao ler status do onboarding", e);
        setOnboardingCompleted(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Este useEffect cuida APENAS do redirecionamento
  useEffect(() => {
    // Não faça nada até que o DB e o Onboarding estejam verificados
    if (onboardingCompleted === null || !dbInitialized) {
      return;
    }
    
    const inOnboardingGroup = segments[0] === 'onboarding';

    if (!onboardingCompleted && !inOnboardingGroup) {
      router.replace('/onboarding/welcome');
    } else if (onboardingCompleted && inOnboardingGroup) {
      router.replace('/');
    }

  }, [onboardingCompleted, dbInitialized, segments]);

  // 4. A tela de carregamento agora espera por AMBAS as tarefas
  if (onboardingCompleted === null || !dbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  // Se tudo estiver pronto, mostra as abas do app
  return <MainAppTabs />;
}

// Componente das abas principais (sem alterações)
function MainAppTabs() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'reports') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0'
        }
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="add" options={{ title: 'Adicionar' }} />
      <Tabs.Screen name="reports" options={{ title: 'Relatórios' }} />
      <Tabs.Screen name="settings" options={{ title: 'Configurações' }} /> 
      <Tabs.Screen name="onboarding" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    }
})
