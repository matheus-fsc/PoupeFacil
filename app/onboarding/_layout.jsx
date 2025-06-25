import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="recurring" />
      <Stack.Screen name="add-values" />
    </Stack>
  );
}