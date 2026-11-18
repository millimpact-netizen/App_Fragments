
import { useEffect, useState } from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ChildCard from '../components/ChildCard';
import CoinModal from '../components/CoinModal';
import Header from '../components/Header';
import RewardCard from '../components/RewardCard';

// TIPOS DE DATOS

interface Child {
  id: number;
  name: string;
  age: number;
  coins: number;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Request {
  id: number;
  childId: number;
  childName: string;
  rewardName: string;
  price: number;
  status: 'Pendiente' | 'Aprobada' | 'Rechazada';
}

interface Transaction {
  id: number;
  childName: string;
  type: string;
  amount: number;
  date: string;
}

// DATOS INICIALES

const initialChildren: Child[] = [
  {
    id: 1,
    name: 'Sofía',
    age: 8,
    coins: 150,
  },
  {
    id: 2,
    name: 'Mateo',
    age: 10,
    coins: 100,
  },
];

const initialRewards: Reward[] = [
  {
    id: 1,
    name: 'Juguete nuevo',
    description: 'Un juguete elegido por ti.',
    price: 100,
  },
  {
    id: 2,
    name: 'Golosinas',
    description: 'Tus dulces favoritos.',
    price: 50,
  },
  {
    id: 3,
    name: 'Tiempo de videojuegos',
    description: 'Una hora extra de videojuegos.',
    price: 150,
  },
];

// APLICACIÓN PRINCIPAL

export default function Index() {
  const [children, setChildren] = useState(initialChildren);
  const [rewards] = useState(initialRewards);

  const [requests, setRequests] = useState<Request[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [selectedChild, setSelectedChild] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  // CARGAR DATOS GUARDADOS

  useEffect(() => {
    async function loadData() {
      try {
        const saved = await AsyncStorage.getItem(
          'mi_tiendita_data'
        );

        if (saved) {
          const data = JSON.parse(saved);

          if (Array.isArray(data.children)) {
            setChildren(data.children);
          }

          if (Array.isArray(data.requests)) {
            setRequests(data.requests);
          }

          if (Array.isArray(data.transactions)) {
            setTransactions(data.transactions);
          }

        }
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudieron cargar los datos.'
        );
      } finally {
        setStorageReady(true);
      }
    }

    loadData();
  }, []);

  // GUARDAR DATOS AUTOMÁTICAMENTE

  useEffect(() => {
    if (!storageReady) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem(
          'mi_tiendita_data',
          JSON.stringify({
            children,
            requests,
            transactions,
          })
        );
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudieron guardar los cambios.'
        );
      }
    };

    saveData();
  }, [children, requests, transactions, storageReady]);

  // HIJO SELECCIONADO

  const currentChild = children.find(
    child => child.id === selectedChild
  );

  const familyCoins = children.reduce(
    (total, child) => total + child.coins,
    0
  );

  // REGISTRAR MOVIMIENTO

  const addTransaction = (
    childName: string,
    type: string,
    amount: number
  ) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      childName,
      type,
      amount,
      date: new Date().toLocaleString(),
    };

    setTransactions(previous => [
      newTransaction,
      ...previous,
    ]);
  };

  // ASIGNAR MONEDAS

  const assignCoins = (amount: number) => {
    const child = children.find(
      item => item.id === selectedChild
    );

    if (!child) return;

    setChildren(previous =>
      previous.map(item =>
        item.id === selectedChild
          ? {
              ...item,
              coins: item.coins + amount,
            }
          : item
      )
    );

    addTransaction(
      child.name,
      'Monedas recibidas',
      amount
    );

    setModalVisible(false);

    Alert.alert(
      '¡Monedas asignadas!',
      `${child.name} recibió ${amount} monedas.`
    );
  };

  // SOLICITAR PREMIO

  const requestReward = (reward: Reward) => {
    if (!currentChild) return;

    if (currentChild.coins < reward.price) {
      Alert.alert(
        'Saldo insuficiente',
        'No tienes suficientes monedas.'
      );
      return;
    }

    const alreadyRequested = requests.some(
      request =>
        request.childId === currentChild.id &&
        request.rewardName === reward.name &&
        request.status === 'Pendiente'
    );

    if (alreadyRequested) {
      Alert.alert(
        'Solicitud existente',
        'Ya tienes este premio pendiente de aprobación.'
      );
      return;
    }

    const newRequest: Request = {
      id: Date.now(),
      childId: currentChild.id,
      childName: currentChild.name,
      rewardName: reward.name,
      price: reward.price,
      status: 'Pendiente',
    };

    setRequests(previous => [
      newRequest,
      ...previous,
    ]);

    Alert.alert(
      '¡Solicitud enviada!',
      'Tus padres deben aprobar tu recompensa.'
    );
  };

  // APROBAR PREMIO

  const approveRequest = (request: Request) => {
    const child = children.find(
      item => item.id === request.childId
    );

    if (!child) return;

    if (child.coins < request.price) {
      Alert.alert(
        'Saldo insuficiente',
        'El hijo ya no tiene suficientes monedas para este premio.'
      );
      return;
    }

    setChildren(previous =>
      previous.map(item =>
        item.id === request.childId
          ? {
              ...item,
              coins: item.coins - request.price,
            }
          : item
      )
    );

    setRequests(previous =>
      previous.map(item =>
        item.id === request.id
          ? { ...item, status: 'Aprobada' }
          : item
      )
    );

    addTransaction(
      request.childName,
      `Premio: ${request.rewardName}`,
      -request.price
    );

    Alert.alert(
      '¡Recompensa aprobada!',
      `Se descontaron ${request.price} monedas de ${request.childName}.`
    );
  };

  // RECHAZAR PREMIO

  const rejectRequest = (request: Request) => {
    setRequests(previous =>
      previous.map(item =>
        item.id === request.id
          ? { ...item, status: 'Rechazada' }
          : item
      )
    );

    Alert.alert(
      'Solicitud rechazada',
      'No se descontaron monedas.'
    );
  };

  // INTERFAZ

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <Header />

        {/* SALDO FAMILIAR */}

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>
            Monedas de toda la familia
          </Text>

          <Text style={styles.balanceAmount}>
            🪙 {familyCoins}
          </Text>

          <Text style={styles.balanceDescription}>
            Monedas virtuales acumuladas
          </Text>
        </View>

        {/* HIJOS */}

        <Text style={styles.sectionTitle}>
          👨‍👩‍👧 Mis hijos
        </Text>

        <Text style={styles.helper}>
          Selecciona un hijo para administrar sus monedas.
        </Text>

        {children.map(child => (
          <ChildCard
            key={child.id}
            name={child.name}
            age={child.age}
            coins={child.coins}
            selected={selectedChild === child.id}
            onSelect={() => setSelectedChild(child.id)}
            onAssign={() => {
              setSelectedChild(child.id);
              setModalVisible(true);
            }}
          />
        ))}

        {/* TIENDA */}

        <Text style={styles.sectionTitle}>
          🎁 Tienda de recompensas
        </Text>

        <Text style={styles.helper}>
          Selecciona un premio para solicitarlo.
        </Text>

        <View style={styles.childSelector}>
          <Text style={styles.selectorLabel}>
            Comprar para:
          </Text>

          {children.map(child => (
            <Pressable
              key={child.id}
              onPress={() => setSelectedChild(child.id)}
              style={[
                styles.selectorButton,
                selectedChild === child.id &&
                  styles.selectorActive,
              ]}
            >
              <Text
                style={[
                  styles.selectorText,
                  selectedChild === child.id &&
                    styles.selectorTextActive,
                ]}
              >
                {child.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {currentChild && (
          <View style={styles.selectedBalance}>
            <Text style={styles.selectedBalanceText}>
              Saldo de {currentChild.name}: 🪙 {currentChild.coins}
            </Text>
          </View>
        )}

        {rewards.map(reward => (
          <RewardCard
            key={reward.id}
            name={reward.name}
            description={reward.description}
            price={reward.price}
            balance={currentChild?.coins ?? 0}
            onRequest={() => requestReward(reward)}
          />
        ))}

        {/* SOLICITUDES */}

        <Text style={styles.sectionTitle}>
          📋 Solicitudes de premios
        </Text>

        {requests.length === 0 ? (
          <Text style={styles.empty}>
            Todavía no hay solicitudes.
          </Text>
        ) : (
          requests.map(request => (
            <View
              key={request.id}
              style={styles.requestCard}
            >
              <Text style={styles.requestName}>
                🎁 {request.rewardName}
              </Text>

              <Text style={styles.requestInfo}>
                Hijo: {request.childName}
              </Text>

              <Text style={styles.requestInfo}>
                Precio: 🪙 {request.price}
              </Text>

              <Text style={styles.status}>
                Estado: {request.status}
              </Text>

              {request.status === 'Pendiente' && (
                <View style={styles.actions}>
                  <Pressable
                    style={styles.approveButton}
                    onPress={() => approveRequest(request)}
                  >
                    <Text style={styles.actionText}>
                      Aprobar
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.rejectButton}
                    onPress={() => rejectRequest(request)}
                  >
                    <Text style={styles.actionText}>
                      Rechazar
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))
        )}

        {/* HISTORIAL */}

        <Text style={styles.sectionTitle}>
          📜 Historial de movimientos
        </Text>

        {transactions.length === 0 ? (
          <Text style={styles.empty}>
            Todavía no hay movimientos registrados.
          </Text>
        ) : (
          transactions.map(transaction => (
            <View
              key={transaction.id}
              style={styles.transaction}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.transactionName}>
                  {transaction.childName}
                </Text>

                <Text style={styles.transactionType}>
                  {transaction.type}
                </Text>

                <Text style={styles.transactionDate}>
                  {transaction.date}
                </Text>
              </View>

              <Text
                style={[
                  styles.transactionAmount,
                  transaction.amount < 0 &&
                    styles.negative,
                ]}
              >
                {transaction.amount > 0 ? '+' : ''}
                {transaction.amount} 🪙
              </Text>
            </View>
          ))
        )}

        <Text style={styles.footer}>
          Mi Tiendita de Recompensas © 2026
        </Text>

      </ScrollView>

      {/* MODAL DE MONEDAS */}

      <CoinModal
        visible={modalVisible}
        childName={currentChild?.name ?? ''}
        onClose={() => setModalVisible(false)}
        onConfirm={assignCoins}
      />

    </View>
  );
}

// ESTILOS

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5FF',
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  balanceCard: {
    backgroundColor: '#7546C8',
    padding: 25,
    borderRadius: 20,
    marginBottom: 28,
  },

  balanceLabel: {
    color: '#E9DFFF',
    fontSize: 14,
  },

  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  balanceDescription: {
    color: '#E9DFFF',
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 15,
    marginBottom: 8,
  },

  helper: {
    color: '#888888',
    fontSize: 13,
    marginBottom: 15,
  },

  childSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },

  selectorLabel: {
    color: '#666666',
    fontWeight: 'bold',
  },

  selectorButton: {
    backgroundColor: '#EDE4FF',
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
  },

  selectorActive: {
    backgroundColor: '#7546C8',
  },

  selectorText: {
    color: '#7546C8',
    fontWeight: 'bold',
  },

  selectorTextActive: {
    color: '#FFFFFF',
  },

  selectedBalance: {
    backgroundColor: '#EEE8FA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  selectedBalanceText: {
    color: '#7546C8',
    fontWeight: 'bold',
  },

  empty: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    color: '#888888',
    textAlign: 'center',
    marginVertical: 10,
  },

  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 17,
    marginBottom: 12,
  },

  requestName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#7546C8',
  },

  requestInfo: {
    color: '#666666',
    marginTop: 7,
  },

  status: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#D99A17',
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },

  approveButton: {
    flex: 1,
    backgroundColor: '#239B62',
    padding: 12,
    borderRadius: 9,
    alignItems: 'center',
  },

  rejectButton: {
    flex: 1,
    backgroundColor: '#D94B4B',
    padding: 12,
    borderRadius: 9,
    alignItems: 'center',
  },

  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  transaction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionName: {
    fontWeight: 'bold',
    color: '#333333',
  },

  transactionType: {
    color: '#666666',
    marginTop: 5,
  },

  transactionDate: {
    color: '#AAAAAA',
    fontSize: 11,
    marginTop: 5,
  },

  transactionAmount: {
    color: '#239B62',
    fontWeight: 'bold',
    fontSize: 15,
  },

  negative: {
    color: '#D94B4B',
  },

  footer: {
    textAlign: 'center',
    color: '#AAAAAA',
    marginTop: 30,
    fontSize: 12,
  },
});
