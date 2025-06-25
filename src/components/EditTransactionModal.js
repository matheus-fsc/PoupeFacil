import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ValueInput = ({ value, onChange }) => {
    const formatCurrency = (val) => (parseInt(val || '0', 10) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const handleChange = (text) => onChange(text.replace(/\D/g, ''));
    return <TextInput style={styles.valueInput} value={formatCurrency(value)} onChangeText={handleChange} keyboardType="numeric" />;
};

export default function EditTransactionModal({ visible, transaction, onClose, onSave }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (transaction) {
            setDescription(transaction.description);
            setAmount(transaction.amount.toString());
            setDate(new Date(transaction.date));
        }
    }, [transaction]);

    const handleSave = () => {
        if (!description.trim() || !amount) {
            Alert.alert("Erro", "Todos os campos são obrigatórios.");
            return;
        }
        onSave({
            ...transaction,
            description: description.trim(),
            amount: parseInt(amount, 10),
            date: date.toISOString(),
        });
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    if (!transaction) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Editar Transação</Text>

                    <Text style={styles.label}>Descrição</Text>
                    <TextInput style={styles.input} value={description} onChangeText={setDescription} />

                    <Text style={styles.label}>Valor</Text>
                    <ValueInput value={amount} onChange={setAmount} />

                    <Text style={styles.label}>Data</Text>
                    <TouchableOpacity style={styles.dateRow} onPress={() => setShowDatePicker(true)}>
                        <Ionicons name="calendar-outline" size={24} color="#4b5563" />
                        <Text style={styles.dateText}>{date.toLocaleDateString('pt-BR')}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 16, padding: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 14, color: '#6b7280', marginBottom: 4, marginLeft: 4 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 16 },
    valueInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    dateRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 20 },
    dateText: { fontSize: 16, marginLeft: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
    cancelButton: { backgroundColor: '#f1f5f9' },
    saveButton: { backgroundColor: '#10b981' },
    saveButtonText: { color: '#fff', fontWeight: 'bold' }
});
