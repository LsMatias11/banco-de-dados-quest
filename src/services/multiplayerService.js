// Service de Sincronização Multiplayer em Tempo Real (MQTT over WebSockets + BroadcastChannel)
// Suporte Universal: Chrome, Edge, Safari, Firefox, Celulares Android / iOS e Múltiplos Computadores
import mqtt from 'mqtt';

export const CLIENT_ID = typeof window !== 'undefined'
  ? `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  : 'server_client';

/**
 * Converte o código da sala em um tópico MQTT seguro e padronizado
 */
export const getChannelName = (roomCode) => {
  const clean = (roomCode || 'BD-MAIN').toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `bdquest/v14/${clean}`;
};

/**
 * Gera um código de sala amigável (Ex: BD-8841 ou BD-X7K2)
 */
export const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BD-${code}`;
};

// Lista de brokers MQTT públicos com WebSockets (redundância e alta disponibilidade)
const BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt'
];

let activeClient = null;
let currentBrokerIndex = 0;
let isConnected = false;
const activeTopics = new Set();
const listeners = new Map(); // topic -> Set<callback>
const pendingMessages = []; // { topic, payload }
const seenMsgIds = new Set();

function getOrCreateClient() {
  if (activeClient) return activeClient;
  if (typeof window === 'undefined') return null;

  const brokerUrl = BROKERS[currentBrokerIndex];

  try {
    activeClient = mqtt.connect(brokerUrl, {
      clientId: `${CLIENT_ID}_${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
      connectTimeout: 6000,
      reconnectPeriod: 2500,
      keepalive: 30
    });

    activeClient.on('connect', () => {
      isConnected = true;
      // Reinscreve todos os tópicos ativos
      activeTopics.forEach((topic) => {
        try {
          activeClient.subscribe(topic, { qos: 0 });
        } catch (e) {}
      });

      // Envia mensagens acumuladas na fila
      while (pendingMessages.length > 0) {
        const item = pendingMessages.shift();
        try {
          activeClient.publish(item.topic, JSON.stringify(item.payload), { qos: 0 });
        } catch (e) {}
      }
    });

    activeClient.on('message', (topic, rawBuffer) => {
      try {
        const rawStr = rawBuffer.toString('utf-8');
        const data = JSON.parse(rawStr);
        dispatchIncomingMessage(topic, data);
      } catch (e) {}
    });

    activeClient.on('error', (err) => {
      console.warn('Alerta na conexão MQTT:', err?.message || err);
      // Alterna entre brokers se houver falha contínua
      if (!isConnected && BROKERS.length > 1) {
        currentBrokerIndex = (currentBrokerIndex + 1) % BROKERS.length;
      }
    });

    activeClient.on('offline', () => {
      isConnected = false;
    });

    activeClient.on('close', () => {
      isConnected = false;
    });
  } catch (err) {
    console.error('Falha ao inicializar cliente MQTT:', err);
  }

  return activeClient;
}

function dispatchIncomingMessage(topic, msg) {
  if (!msg || typeof msg !== 'object') return;

  // 1. Evita self-echo (mensagens da própria aba)
  if (msg.senderId && msg.senderId === CLIENT_ID) return;

  // 2. Deduplicação global por ID exclusivo
  if (msg.msgId) {
    if (seenMsgIds.has(msg.msgId)) return;
    seenMsgIds.add(msg.msgId);
    if (seenMsgIds.size > 500) {
      const first = seenMsgIds.values().next().value;
      seenMsgIds.delete(first);
    }
  }

  // 3. Distribuição para os listeners da sala
  const topicListeners = listeners.get(topic);
  if (topicListeners) {
    topicListeners.forEach((cb) => {
      try {
        cb(msg);
      } catch (e) {
        console.error('Erro no callback da sala:', e);
      }
    });
  }
}

/**
 * Publica um estado ou ação na sala online
 * - Envia localmente via BroadcastChannel (0ms na mesma máquina/navegador)
 * - Envia globalmente via WebSockets MQTT (Cross-Browser: Chrome, Edge, Safari, Celular)
 */
export const publishRoomState = async (roomCode, message) => {
  if (!message) return false;
  const topic = getChannelName(roomCode);
  const payload = {
    ...message,
    senderId: CLIENT_ID,
    msgId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    lastUpdated: Date.now(),
    timestamp: Date.now()
  };

  // 1. Broadcast instantâneo local (0ms no mesmo navegador)
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(`bc_${topic}`);
      bc.postMessage(payload);
      bc.close();
    }
  } catch (e) {}

  // 2. Publicação via WebSockets MQTT global (em milissegundos para todos os aparelhos)
  const client = getOrCreateClient();
  if (client && isConnected) {
    try {
      client.publish(topic, JSON.stringify(payload), { qos: 0 });
      return true;
    } catch (e) {}
  } else {
    // Se o socket estiver reconectando, enfileira
    if (pendingMessages.length < 40) {
      pendingMessages.push({ topic, payload });
    }
  }

  return true;
};

/**
 * Inscreve um cliente para receber eventos em tempo real da sala
 */
export const subscribeToRoom = (roomCode, onMessage) => {
  if (!roomCode) return () => {};
  const topic = getChannelName(roomCode);

  // 1. Registra listener
  if (!listeners.has(topic)) {
    listeners.set(topic, new Set());
  }
  listeners.get(topic).add(onMessage);

  // 2. Registra e assina tópico no MQTT
  activeTopics.add(topic);
  const client = getOrCreateClient();
  if (client && isConnected) {
    try {
      client.subscribe(topic, { qos: 0 });
    } catch (e) {}
  }

  // 3. Ouvinte local BroadcastChannel para abas no mesmo navegador
  let localBc = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      localBc = new BroadcastChannel(`bc_${topic}`);
      localBc.onmessage = (event) => {
        dispatchIncomingMessage(topic, event.data);
      };
    }
  } catch (e) {}

  // Ouvinte de reativação de aba (para quando o celular desbloquear a tela)
  const handleWakeUp = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      if (activeClient && !isConnected) {
        try {
          activeClient.reconnect();
        } catch (e) {}
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleWakeUp);
    document.addEventListener('visibilitychange', handleWakeUp);
  }

  return () => {
    if (localBc) {
      try { localBc.close(); } catch (e) {}
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', handleWakeUp);
      document.removeEventListener('visibilitychange', handleWakeUp);
    }

    const topicListeners = listeners.get(topic);
    if (topicListeners) {
      topicListeners.delete(onMessage);
      if (topicListeners.size === 0) {
        listeners.delete(topic);
        activeTopics.delete(topic);
        if (client && isConnected) {
          try {
            client.unsubscribe(topic);
          } catch (e) {}
        }
      }
    }
  };
};

export const publishRoomMessage = publishRoomState;
export const subscribeToRoomUpdates = subscribeToRoom;
