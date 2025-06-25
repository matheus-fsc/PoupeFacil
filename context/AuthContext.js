import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);

  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('onboarding_completed');
        setOnboardingCompleted(status === 'true');
      } catch (e) {
        setOnboardingCompleted(false);
      }
    };
    loadOnboardingStatus();
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      setOnboardingCompleted(true);
    } catch (e) {
      console.error("Falha ao salvar status do onboarding", e);
    }
  };
  const value = {
    onboardingCompleted,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};