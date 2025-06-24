import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../../src/components/PrimaryButton';
import SelectionListItem from '../../src/components/SelectionList';


export const RECURRING_EXPENSES = [
    { id: 'streaming', name: 'Serviços de Streaming', category: 'Assinaturas', icon: 'tv-outline' },
    { id: '2', name: 'Spotify', category: 'Assinaturas', icon: 'musical-notes-outline' },
    { id: '3', name: 'Aluguel', category: 'Moradia', icon: 'home-outline' },
    { id: '4', name: 'Conta de Luz', category: 'Contas', icon: 'bulb-outline' },
    { id: '5', name: 'Internet', category: 'Contas', icon: 'wifi-outline' },
    { id: '6', name: 'Plano de Celular', category: 'Contas', icon: 'phone-portrait-outline' },
    { id: 'other', name: 'Outro...', category: 'Custom', icon: 'add-circle-outline' },
];


export default function RecurringScreen() {
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleNextStep = () => {
        if (selectedItems.length === 0) {
            handleSkip();
            return;
        }
        router.push({
            pathname: '/onboarding/add-values',
            params: { selectedIds: JSON.stringify(selectedItems) }
        });
    };

    const handleSkip = async () => {
        try {
            await AsyncStorage.setItem('onboarding_completed', 'true');
            router.replace('/');
        } catch (e) {
            console.error("Falha ao pular onboarding", e);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gastos Recorrentes</Text>
            <Text style={styles.subtitle}>Selecione suas contas e assinaturas fixas para começar.</Text>

            <FlatList
                data={RECURRING_EXPENSES}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SelectionListItem
                        item={item}
                        isSelected={selectedItems.includes(item.id)}
                        onPress={() => handleSelectItem(item.id)}
                    />
                )}
                contentContainerStyle={{ paddingVertical: 10 }}
            />

            <View style={styles.footer}>
                {/* Usando o novo botão aqui! */}
                <PrimaryButton
                    title={selectedItems.length > 0 ? `Adicionar ${selectedItems.length} Itens` : 'Finalizar'}
                    onPress={handleNextStep}
                />
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Pular por enquanto</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// O StyleSheet fica muito menor agora!
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginTop: 30, textAlign: 'center' },
    subtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 10, marginBottom: 20 },
    footer: { paddingBottom: 20 },
    skipText: { color: 'gray', textAlign: 'center', marginTop: 15, fontSize: 16 }
});