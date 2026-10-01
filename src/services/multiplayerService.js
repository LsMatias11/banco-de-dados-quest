// Service de Sincronização Multiplayer em Tempo Real (PubNub Streaming + BroadcastChannel v11)
// Compatibilidade total e rigorosa com Microsoft Edge, Google Chrome, Safari e Mobile

export const CLIENT_ID = typeof window !== 'undefined'
  ? `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  : 'server_client';

/**
 * Converte o código da sala em um nome de canal seguro para a rede PubNub
 */
export const getChannelName = (roomCode) => {
  const clean = (roomCode || 'BD-MAIN').toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `bd_quest_${clean}_v11`;
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

/**
 * Publica uma mensagem / ação na sala online
 * - Utiliza GET HTTP com URL-encoding: 100% livre de bloqueios CORS, sem preflight e compatível com Edge
 */
export const publishRoomState = async (roomCode, message) => {
  if (!message) return false;
  const channel = getChannelName(roomCode);
  const payload = {
    ...message,
    senderId: CLIENT_ID,
    msgId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    lastUpdated: Date.now(),
    timestamp: Date.now()
  };

  // 1. Broadcast instantâneo local (0ms entre abas no mesmo navegador)
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(`bc_${channel}`);
      bc.postMessage(payload);
      bc.close();
    }
  } catch (e) {
    // Ignora restrições locais de sandbox
  }

  // 2. Publicação na rede global PubNub via GET (padrão confiável sem bloqueios no Edge/Chrome)
  try {
    const encodedPayload = encodeURIComponent(JSON.stringify(payload));
    const url = `https://ps.pubnub.com/publish/demo/demo/0/${channel}/0/${encodedPayload}?_t=${Date.now()}`;
    const res = await fetch(url, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) && data[0] === 1;
    }
    return false;
  } catch (err) {
    console.error("Erro ao publicar estado na sala:", err);
    return false;
  }
};

/**
 * Inscreve um cliente para receber eventos em tempo real da sala
 * - Conecta via BroadcastChannel local (0ms)
 * - Conecta via streaming de PubNub (apenas eventos futuros a partir do momento da conexão)
 * - NUNCA faz polling de histórico repetitivo
 * - Filtra self-echo
 */
export const subscribeToRoom = (roomCode, onMessage) => {
  if (!roomCode) return () => {};
  const channel = getChannelName(roomCode);

  let isSubscribed = true;
  let currentTimetoken = '0';
  let abortController = null;
  const seenMsgIds = new Set();

  const handleIncomingMessage = (msg) => {
    if (!msg || typeof msg !== 'object') return;
    
    // 1. Evita self-echo: descarta mensagens enviadas por esta mesma aba
    if (msg.senderId && msg.senderId === CLIENT_ID) return;

    // 2. Deduplicação por msgId exclusivo
    if (msg.msgId) {
      if (seenMsgIds.has(msg.msgId)) return;
      seenMsgIds.add(msg.msgId);
      if (seenMsgIds.size > 200) {
        const first = seenMsgIds.values().next().value;
        seenMsgIds.delete(first);
      }
    }

    onMessage(msg);
  };

  // 1. Ouvinte local de BroadcastChannel (comunicação instantânea na mesma máquina)
  let localBc = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      localBc = new BroadcastChannel(`bc_${channel}`);
      localBc.onmessage = (event) => {
        if (!isSubscribed) return;
        handleIncomingMessage(event.data);
      };
    }
  } catch (e) {}

  // 2. Loop de Streaming em tempo real com PubNub
  const startStream = async () => {
    // Handshake inicial no timetoken 0: obtém o token de tempo atual do servidor instantaneamente sem histórico antigo
    try {
      const initRes = await fetch(`https://ps.pubnub.com/subscribe/demo/${channel}/0/0?_t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (initRes.ok) {
        const initData = await initRes.json();
        if (Array.isArray(initData) && initData[1]) {
          currentTimetoken = String(initData[1]);
        }
      }
    } catch (e) {
      currentTimetoken = String(Date.now() * 10000);
    }

    // Loop contínuo de escuta de mensagens em tempo real
    while (isSubscribed) {
      let timeoutId = null;
      try {
        abortController = new AbortController();
        timeoutId = setTimeout(() => {
          try {
            abortController.abort();
          } catch (e) {}
        }, 15000);

        const url = `https://ps.pubnub.com/subscribe/demo/${channel}/0/${currentTimetoken}?_t=${Date.now()}`;
        const res = await fetch(url, {
          signal: abortController.signal,
          cache: 'no-store'
        });
        clearTimeout(timeoutId);

        if (res.ok && isSubscribed) {
          const data = await res.json();
          if (Array.isArray(data) && Array.isArray(data[0])) {
            data[0].forEach((msg) => {
              handleIncomingMessage(msg);
            });
            if (data[1]) {
              currentTimetoken = String(data[1]);
            }
          }
        } else {
          await new Promise((r) => setTimeout(r, 400));
        }
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        if (!isSubscribed) break;
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  };

  startStream();

  return () => {
    isSubscribed = false;
    if (localBc) {
      try {
        localBc.close();
      } catch (e) {}
    }
    if (abortController) {
      try {
        abortController.abort();
      } catch (e) {}
    }
  };
};

// Aliases de conveniência global
export const publishGlobalState = (gameState) => publishRoomState('BD-MAIN', gameState);
export const subscribeToGlobalState = (onStateChange) => subscribeToRoom('BD-MAIN', onStateChange);
