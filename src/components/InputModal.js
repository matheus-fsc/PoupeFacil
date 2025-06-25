import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

/**
 * Um modal genérico para solicitar uma entrada de texto do usuário.
 * @param {object} props
 * @param {boolean} props.visible - Controla a visibilidade do modal.
 * @param {function} props.onClose - Função a ser chamada ao fechar o modal.
 * @param {function} props.onSave - Função que recebe o texto digitado ao salvar.
 * @param {string} props.title - O título exibido no modal.
 * @param {string} props.placeholder - O placeholder para o campo de texto.
 * @param {string} props.saveButtonText - O texto para o botão de salvar (padrão: "Salvar").
 */
export default function InputModal({
  visible,
  onClose,
  onSave,
  title,
  placeholder,
  saveButtonText = 'Salvar',
}) {
    const [name, setName] = useState('');

    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
            setName('');
            onClose();
        } else {
            Alert.alert("Atenção", "Por favor, preencha o campo.");
        }
    };

    const handleClose = () => {
        setName(''); // Limpa o campo ao cancelar/fechar
        onClose();
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder={placeholder}
                        value={name}
                        onChangeText={setName}
                        autoFocus={true}
                    />
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleClose}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>{saveButtonText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    modalInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f1f5f9',
    },
    saveButton: {
        backgroundColor: '#10b981',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
