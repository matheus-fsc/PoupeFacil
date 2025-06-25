import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'report') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'qr-scanner') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          }
          
          if (!iconName) {
            return null; // Não mostra ícone para rotas não mapeadas.
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
      {/* A ordem das telas aqui DEFINE a ordem visual das abas. */}
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="add" options={{ title: 'Adicionar' }} />
      <Tabs.Screen name="report" options={{ title: 'Relatórios' }} />
      <Tabs.Screen name="qr-scanner" options={{ title: 'QR Scanner' }} />
      <Tabs.Screen name="settings" options={{ title: 'Configurações' }} />
    </Tabs>
  );
}
