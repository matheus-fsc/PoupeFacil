import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import InputModal from '../../src/components/InputModal';
import PrimaryButton from '../../src/components/PrimaryButton';
import SelectionListItem from '../../src/components/SelectionList';
import { useAuth } from '../../context/AuthContext';

export const RECURRING_EXPENSES_DATA = [
  {
    title: 'Assinaturas e Lazer',
    data: [
      { id: 'streaming', name: 'Serviços de Streaming (Netflix, etc)', icon: 'tv-outline' },
      { id: 'musica', name: 'Música (Spotify, etc)', icon: 'musical-notes-outline' },
      { id: 'academia', name: 'Academia ou Clube', icon: 'barbell-outline' },
    ],
  },
  {
    title: 'Moradia e Contas',
    data: [
      { id: 'aluguel', name: 'Aluguel / Financiamento', icon: 'home-outline' },
      { id: 'condominio', name: 'Condomínio', icon: 'business-outline' },
      { id: 'luz', name: 'Conta de Luz', icon: 'bulb-outline' },
      { id: 'internet', name: 'Internet / TV / Telefone', icon: 'wifi-outline' },
      { id: 'celular', name: 'Plano de Celular', icon: 'phone-portrait-outline' },
    ],
  },
];

export default function RecurringScreen() {
    const router = useRouter();
    const { completeOnboarding } = useAuth();
    const [selectedIds, setSelectedIds] = useState([]);
    const [customItems, setCustomItems] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSelectItem = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };
    
    const handleAddCustomItem = (name) => {
        const newItemId = `custom_${Date.now()}`;
        const newItem = {
            id: newItemId,
            name: name,
            icon: 'pricetag-outline',
            isCustom: true,
        };
        setCustomItems(prev => [...prev, newItem]);
        handleSelectItem(newItemId);
    };

    const handleRemoveCustomItem = (idToRemove) => {
        setCustomItems(prev => prev.filter(item => item.id !== idToRemove));
        setSelectedIds(prev => prev.filter(id => id !== idToRemove));
    };

    const handleNextStep = () => {
        if (selectedIds.length === 0) {
            handleSkip();
            return;
        }
        router.push({
            pathname: '/onboarding/add-values',
            params: { 
                selectedIds: JSON.stringify(selectedIds),
                customItems: JSON.stringify(customItems),
            }
        });
    };

    const handleSkip = async () => {
        try {
          await completeOnboarding();
        } catch (e) {
          console.error("Falha ao pular onboarding", e);
          Alert.alert("Erro", "Não foi possível pular esta etapa.");
        }
    };
    
    const allSections = [...RECURRING_EXPENSES_DATA];
    if (customItems.length > 0) {
        allSections.push({ title: 'Despesas Personalizadas', data: customItems });
    }

    return (
        <View style={styles.container}>
            <InputModal 
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSave={handleAddCustomItem}
                title="Adicionar Nova Despesa"
                placeholder="Ex: Fatura do Cartão"
            />

            <Text style={styles.title}>Gastos Recorrentes</Text>
            <Text style={styles.subtitle}>Selecione suas contas e assinaturas fixas para começar.</Text>

            <SectionList
                sections={allSections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listItemContainer}>
                        <SelectionListItem
                            item={item}
                            isSelected={selectedIds.includes(item.id)}
                            onPress={() => handleSelectItem(item.id)}
                        />
                        {item.isCustom && (
                            <TouchableOpacity onPress={() => handleRemoveCustomItem(item.id)} style={styles.removeButton}>
                                <Ionicons name="trash-bin-outline" size={22} color="#ef4444" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={{ paddingBottom: 10 }}
                ListFooterComponent={
                    <TouchableOpacity style={styles.addCustomButton} onPress={() => setIsModalVisible(true)}>
                        <Ionicons name="add" size={24} color="#10b981" />
                        <Text style={styles.addCustomButtonText}>Adicionar Outra Despesa</Text>
                    </TouchableOpacity>
                }
            />

            <View style={styles.footer}>
                <PrimaryButton
                    title={selectedIds.length > 0 ? `Adicionar ${selectedIds.length} Itens` : 'Pular Etapa'}
                    onPress={handleNextStep}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 40, backgroundColor: '#fff' },
    title: { fontSize: 26, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' },
    subtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 8, marginBottom: 24 },
    footer: { paddingVertical: 20 },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
        backgroundColor: '#f8fafc',
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    removeButton: {
        marginLeft: 10,
        padding: 8,
    },
    addCustomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderStyle: 'dashed',
        backgroundColor: '#f9fafb',
        marginTop: 20,
    },
    addCustomButtonText: {
        color: '#10b981',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});
