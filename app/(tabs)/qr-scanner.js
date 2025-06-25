// Arquivo: app/qr-scanner.js (VERSÃO CORRIGIDA)

import { CameraView, useCameraPermissions } from 'expo-camera'; // 1. IMPORTAÇÃO ATUALIZADA
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function QRScannerScreen() {
  // 2. Usando o hook específico para permissões da câmera
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  // O useEffect agora só pede permissão se ainda não foi concedida.
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Código de barras tipo ${type} com a URL: ${data} foi escaneado!`);
    if (router.canGoBack()) {
      router.back();
    }
  };

  if (!permission) {
    // A permissão ainda não foi carregada
    return <View />;
  }

  if (!permission.granted) {
    // A permissão não foi concedida
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Precisamos da sua permissão para usar a câmera.</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 3. Usamos o componente <CameraView> */}
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
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
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionText: { 
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20,
    }
});
