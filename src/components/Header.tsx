
import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Mi Tiendita 🪙</Text>
        <Text style={styles.subtitle}>
          ¡Aprender, ahorrar y ganar premios!
        </Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>Familia</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#7546C8',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
  },
  badge: {
    backgroundColor: '#EDE4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#7546C8',
    fontWeight: 'bold',
  },
});
