// Arquivo: app/_layout.jsx (VERSÃO CORRIGIDA)

import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('onboarding_completed');
        setOnboardingCompleted(value === 'true');
      } catch (e) {
        setOnboardingCompleted(false);
      }
    };
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (onboardingCompleted === null) return;
    
    // Verificamos se o usuário está em alguma tela dentro do grupo (tabs) ou onboarding
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboardingGroup = segments[0] === 'onboarding'; // <-- Adicionamos esta variável

    // Lógica de redirecionamento CORRIGIDA
    if (onboardingCompleted && !inTabsGroup) {
      // Se o onboarding foi concluído e o usuário NÃO está no grupo de abas,
      // mande-o para a tela inicial do app.
      router.replace('/(tabs)');

    } else if (!onboardingCompleted && !inOnboardingGroup) {
      // Se o onboarding NÃO foi concluído E o usuário NÃO está no fluxo de onboarding,
      // aí sim, mande-o para o início do fluxo.
      router.replace('/onboarding/welcome');
    }

  }, [onboardingCompleted, segments]);


  if (onboardingCompleted === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  // Este layout agora usa Stack e esconde os headers por padrão
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
  );
}