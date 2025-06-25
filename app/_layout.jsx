// Arquivo: app/_layout.jsx (VERSÃO COM ROTA CORRIGIDA)

import { useAuth, AuthProvider } from '../context/AuthContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Componente de navegação que usa o contexto
function RootLayoutNav() {
  const { onboardingCompleted } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (onboardingCompleted === null) return;

    const inTabsGroup = segments[0] === '(tabs)';
    
    // 1. DEFINIMOS AS EXCEÇÕES
    // Rotas que são permitidas fora do grupo de abas, mesmo após o onboarding.
    const allowedRootRoutes = ['manual-form', 'qr-scanner', 'transaction-list']; // <-- Adicionada a nova exceção
    const isExceptionRoute = allowedRootRoutes.includes(segments[0]);

    // Se o onboarding foi concluído...
    if (onboardingCompleted) {
      // ...e o usuário NÃO está no grupo de abas E NÃO está em uma rota de exceção...
      if (!inTabsGroup && !isExceptionRoute) {
        // ...então o mandamos para a tela inicial.
        router.replace('/(tabs)');
      }
    } 
    // Se o onboarding não foi concluído...
    else {
        const inOnboardingGroup = segments[0] === 'onboarding';
        // ...e o usuário NÃO está no fluxo de onboarding...
        if(!inOnboardingGroup) {
            // ...o mandamos para o início do onboarding.
            router.replace('/onboarding/welcome');
        }
    }
  }, [onboardingCompleted, segments]);

  // Enquanto o status do onboarding não for definido, mostra um indicador de carregamento.
  if (onboardingCompleted === null) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#10b981" />
        </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      
      {/* Configuração das telas modais */}
      <Stack.Screen
        name="manual-form"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="qr-scanner"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      {/* 2. CONFIGURAÇÃO DA NOVA TELA DE LISTA */}
      <Stack.Screen
        name="transaction-list"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

// O componente principal agora só precisa prover o contexto
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
