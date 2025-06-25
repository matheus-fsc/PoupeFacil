import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transações</Text>
        <Text style={styles.subtitle}>O que você gostaria de fazer?</Text>
      </View>
      
      <Link href="/manual-form" asChild>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="create-outline" size={32} color="#3b82f6" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Adicionar Nova Transação</Text>
            <Text style={styles.optionDescription}>Registre um novo gasto ou ganho.</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </Link>

      <Link href="/transaction-list" asChild>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="list-outline" size={32} color="#8b5cf6" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Gerenciar Transações</Text>
            <Text style={styles.optionDescription}>Consulte, edite ou apague seus registros.</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </Link>
      
      <Link href="/qr-scanner" asChild>
        <TouchableOpacity style={styles.optionButton}>
          <Ionicons name="qr-code-outline" size={32} color="#10b981" />
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>Escanear QR Code da Nota</Text>
            <Text style={styles.optionDescription}>Rápido e automático para notas fiscais.</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  header: { marginBottom: 32, marginTop: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#4b5563', marginTop: 8 },
  optionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  textContainer: { flex: 1, marginLeft: 16 },
  optionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  optionDescription: { fontSize: 14, color: '#6b7280', marginTop: 4 },
});
