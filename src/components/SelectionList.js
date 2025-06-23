import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function SelectionListItem({ item, isSelected, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.item, isSelected && styles.itemSelected]}
            onPress={onPress}
        >
            <Ionicons name={item.icon} size={24} color={isSelected ? '#10b981' : '#333'} />
            <Text style={[styles.itemName, isSelected && styles.itemNameSelected]}>{item.name}</Text>
            {isSelected && <Ionicons name="checkmark-circle" size={24} style={styles.checkIcon} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8fafc',
        borderRadius: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    itemSelected: {
        backgroundColor: '#e6fef7',
        borderColor: '#10b981',
    },
    itemName: {
        marginLeft: 15,
        fontSize: 16,
        flex: 1,
        color: '#333'
    },
    itemNameSelected: {
        fontWeight: 'bold'
    },
    checkIcon: {
        color: '#10b981'
    },
});