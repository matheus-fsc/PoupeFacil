import { useAuth, AuthProvider } from '../context/AuthContext';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const { onboardingCompleted } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (onboardingCompleted === null) return;

    const inTabsGroup = segments[0] === '(tabs)';
    
    const allowedRootRoutes = ['manual-form', 'qr-scanner', 'transaction-list'];
    const isExceptionRoute = allowedRootRoutes.includes(segments[0]);

    if (onboardingCompleted) {
      if (!inTabsGroup && !isExceptionRoute) {
        router.replace('/(tabs)');
      }
    } 
    else {
        const inOnboardingGroup = segments[0] === 'onboarding';
        if(!inOnboardingGroup) {
            router.replace('/onboarding/welcome');
        }
    }
  }, [onboardingCompleted, segments]);

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

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
