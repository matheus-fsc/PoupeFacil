import { Link } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Como deseja adicionar?</Text>
      
      {/* O Link do Expo Router faz a navegação para a tela do scanner */}
      <Link href="/qr-scanner" asChild>
        <View style={styles.buttonContainer}>
            <Button title="Escanear QR Code da Nota" />
        </View>
      </Link>
      
      {/* Este link levará para o formulário manual que criaremos depois */}
      <Link href="/manual-form" asChild>
        <View style={styles.buttonContainer}>
            <Button title="Adicionar Gasto Manualmente" />
        </View>
      </Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  }
});