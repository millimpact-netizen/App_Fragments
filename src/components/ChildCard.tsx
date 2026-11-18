
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  name: string;
  age: number;
  coins: number;
  selected: boolean;
  onSelect: () => void;
  onAssign: () => void;
}

export default function ChildCard({
  name,
  age,
  coins,
  selected,
  onSelect,
  onAssign,
}: Props) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.card,
        selected && styles.selected,
      ]}
    >
      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👧</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.age}>{age} años</Text>
        </View>

        {selected && (
          <Text style={styles.check}>✓</Text>
        )}
      </View>

      <View style={styles.balance}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.coins}>🪙 {coins}</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={onAssign}
      >
        <Text style={styles.buttonText}>
          + Asignar monedas
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#EEEEEE',
    marginBottom: 13,
  },
  selected: {
    borderColor: '#7546C8',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    backgroundColor: '#F0E9FF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  age: {
    color: '#888',
    marginTop: 3,
  },
  check: {
    color: '#7546C8',
    fontSize: 22,
    fontWeight: 'bold',
  },
  balance: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#F8F5FF',
    borderRadius: 12,
  },
  balanceLabel: {
    color: '#777',
    fontSize: 12,
  },
  coins: {
    fontSize: 22,
    color: '#D99A17',
    fontWeight: 'bold',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#7546C8',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
