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
    const inOnboardingGroup = segments[0] === 'onboarding';

    if (onboardingCompleted && !inTabsGroup) {
      router.replace('/(tabs)');
    } else if (!onboardingCompleted && !inOnboardingGroup) {
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

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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