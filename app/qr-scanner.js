// Arquivo: app/qr-scanner.js (VERSÃO MODERNA COM EXPO-CAMERA)

import { Camera } from 'expo-camera'; // 1. MUDANÇA PRINCIPAL: Importamos Camera em vez de BarCodeScanner
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getCameraPermissions = async () => {
      // 2. Pedimos permissão para a Câmera, não mais para o BarCodeScanner
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  // O handler da leitura continua recebendo os mesmos dados
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Código de barras tipo ${type} com a URL: ${data} foi escaneado!`);
    if (router.canGoBack()) {
      router.back();
    }
  };

  if (hasPermission === null) {
    return <Text style={styles.permissionText}>Solicitando permissão para a câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.permissionText}>Sem acesso à câmera. Por favor, habilite nas configurações.</Text>;
  }

  return (
    <View style={styles.container}>
      {/* 3. Usamos o componente <Camera> e passamos a propriedade barCodeScannerSettings */}
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['qr'], // Especificamos que queremos ler apenas QR Codes
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
         <Text style={styles.text}>Aponte para o QR Code</Text>
      </View>
      {scanned && <Button title={'Escanear Novamente?'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column', justifyContent: 'center' },
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 18, color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 5 },
    permissionText: { flex: 1, textAlign: 'center', textAlignVertical: 'center', fontSize: 16 }
});