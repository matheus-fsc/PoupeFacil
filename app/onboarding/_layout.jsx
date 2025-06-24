// Arquivo: app/onboarding/_layout.js (VERSÃO ATUALIZADA)
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="recurring"
        options={{
          headerShown: false, // Também pode ocultar aqui se quiser foco total
        }}
      />
      <Stack.Screen 
        name="add-values" 
        options={{ 
          headerShown: true, // Mostraremos o header aqui para o usuário saber onde está
          title: 'Definir Valores',
        }} 
      />
    </Stack>
  );
}