import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.logo}
        />
        <Text style={styles.title}>Bem-vindo ao PoupeFácil!</Text>
        <Text style={styles.subtitle}>
          Vamos organizar suas finanças de um jeito simples e rápido, começando pelas suas despesas recorrentes.
        </Text>
      </View>
      
      {/* Botão posicionado na parte inferior da tela */}
      <View style={styles.footer}>
        {/* 1. O caminho do link foi corrigido para o caminho absoluto. */}
        <Link href="/onboarding/recurring" asChild>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Começar a Organizar</Text>
                <Ionicons name="arrow-forward-outline" size={22} color="#fff" />
            </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Fundo mais suave
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30, // Adiciona um respiro nas laterais
  },
  logo: {
      width: 140, // Aumenta o tamanho do logo
      height: 140,
      resizeMode: 'contain',
      marginBottom: 24,
  },
  title: {
    fontSize: 28, // Título mais impactante
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937', // Cor mais escura para o texto principal
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17, // Subtítulo mais legível
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 25, // Melhora a legibilidade de múltiplas linhas
  },
  footer: {
      // 2. Aumentado o padding inferior para dar mais espaço.
      paddingHorizontal: 20,
      paddingBottom: 40,
      width: '100%',
  },
  button: {
    flexDirection: 'row', // Alinha o texto e o ícone na mesma linha
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16, // Bordas mais arredondadas
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#10b981", // Adiciona uma sombra para dar profundidade
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8, // Espaço entre o texto e o ícone
  },
});
