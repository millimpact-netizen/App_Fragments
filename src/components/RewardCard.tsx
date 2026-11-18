
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  name: string;
  description: string;
  price: number;
  balance: number;
  onRequest: () => void;
}

export default function RewardCard({
  name,
  description,
  price,
  balance,
  onRequest,
}: Props) {
  const insufficient = balance < price;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.description}>
            {description}
          </Text>
        </View>

        <Text style={styles.price}>🪙 {price}</Text>
      </View>

      <Pressable
        style={[
          styles.button,
          insufficient && styles.disabled,
        ]}
        onPress={onRequest}
        disabled={insufficient}
      >
        <Text style={styles.buttonText}>
          {insufficient
            ? 'Monedas insuficientes'
            : 'Solicitar premio'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 17,
    borderRadius: 16,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    color: '#888',
    marginTop: 5,
    fontSize: 13,
  },
  price: {
    color: '#D99A17',
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#7546C8',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#BBBBBB',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
