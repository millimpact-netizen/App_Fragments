
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.emoji}>🛍️</Text>

      <Text style={styles.title}>
        Mi Tiendita
      </Text>

      <Text style={styles.subtitle}>
        ¡Aprender, ahorrar y ganar recompensas!
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          ⭐ ¡Bienvenidos!
        </Text>

        <Text style={styles.description}>
          Cumple tus responsabilidades,
          gana monedas virtuales y
          canjéalas por premios increíbles.
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>
          Iniciar sesión
        </Text>
      </Pressable>

      <Pressable
        style={styles.registerButton}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.registerText}>
          Crear cuenta de padre
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5FF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  emoji: {
    fontSize: 75,
    marginBottom: 10,
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#7546C8',
  },

  subtitle: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 25,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F0AD25',
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#7546C8',
    width: '100%',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  registerButton: {
    marginTop: 20,
  },

  registerText: {
    color: '#7546C8',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
