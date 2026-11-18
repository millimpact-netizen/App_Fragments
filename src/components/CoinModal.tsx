
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useState } from 'react';

interface Props {
  visible: boolean;
  childName: string;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function CoinModal({
  visible,
  childName,
  onClose,
  onConfirm,
}: Props) {
  const [amount, setAmount] = useState('');

  const confirm = () => {
    const value = Number(amount);

    if (!Number.isInteger(value) || value <= 0) {
      return;
    }

    onConfirm(value);
    setAmount('');
  };

  const close = () => {
    setAmount('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            🪙 Asignar monedas
          </Text>

          <Text style={styles.subtitle}>
            Seleccionaste a {childName}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Cantidad de monedas"
            keyboardType="number-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <Pressable
            style={styles.confirm}
            onPress={confirm}
          >
            <Text style={styles.confirmText}>
              Asignar monedas
            </Text>
          </Pressable>

          <Pressable onPress={close}>
            <Text style={styles.cancel}>
              Cancelar
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 25,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7546C8',
    textAlign: 'center',
  },
  subtitle: {
    color: '#777',
    textAlign: 'center',
    marginVertical: 18,
  },
  input: {
    backgroundColor: '#F5F2FA',
    padding: 15,
    borderRadius: 12,
    fontSize: 17,
    marginBottom: 15,
  },
  confirm: {
    backgroundColor: '#7546C8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  cancel: {
    color: '#777',
    textAlign: 'center',
    marginTop: 18,
  },
});
