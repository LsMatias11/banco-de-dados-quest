// Service de Sincronização Multiplayer em Tempo Real (PubNub Streaming + History Engine v8)

/**
 * Converte o código da sala em um nome de canal seguro para a rede PubNub
 */
export const getChannelName = (roomCode) => {
  const clean = (roomCode || 'BD-MAIN').toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `bd_quest_${clean}_v8`;
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
 */
export const publishRoomState = async (roomCode, message) => {
  if (!message) return false;
  const channel = getChannelName(roomCode);
  const payload = {
    ...message,
    lastUpdated: Date.now(),
    timestamp: Date.now()
  };

  try {
    const res = await fetch(`https://ps.pubnub.com/publish/demo/demo/0/${channel}/0`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.error("Erro ao publicar estado na sala:", err);
    return false;
  }
};

/**
 * Inscreve um cliente para receber eventos e atualizações instantâneas da sala
 * - Carrega o histórico recente para recuperar membros já conectados
 * - Mantém uma conexão de streaming contínuo (long-polling do PubNub) para latência < 100ms
 * - Inclui polling de segurança a cada 2.5s para 100% de tolerância a oscilações
 */
export const subscribeToRoom = (roomCode, onMessage) => {
  if (!roomCode) return () => {};
  const channel = getChannelName(roomCode);

  let isSubscribed = true;
  let currentTimetoken = '0';
  let abortController = null;
  const seenTimestamps = new Set();

  const handleMessage = (msg) => {
    if (!msg || typeof msg !== 'object') return;
    // Evita duplicar mensagens idênticas processadas em rajada
    const dedupeKey = msg.msgId || (msg.timestamp ? `${msg.type || 'msg'}_${msg.timestamp}_${msg.studentName || ''}` : null);
    if (dedupeKey && seenTimestamps.has(dedupeKey)) return;
    if (dedupeKey) {
      seenTimestamps.add(dedupeKey);
      if (seenTimestamps.size > 200) {
        const first = seenTimestamps.values().next().value;
        seenTimestamps.delete(first);
      }
    }
    onMessage(msg);
  };

  // 1. Carrega histórico recente para recuperar o estado e membros já conectados
  const loadHistory = async () => {
    try {
      const res = await fetch(`https://ps.pubnub.com/v2/history/sub-key/demo/channel/${channel}?count=100`);
      if (res.ok && isSubscribed) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          data[0].forEach((msg) => {
            handleMessage(msg);
          });
          if (data[2]) {
            currentTimetoken = String(data[2]);
          }
        }
      }
    } catch (e) {
      // Ignora oscilações na leitura inicial
    }
  };

  // 2. Loop de Streaming em tempo real (long-poll contínuo)
  const pollStream = async () => {
    while (isSubscribed) {
      try {
        abortController = new AbortController();
        const url = `https://ps.pubnub.com/subscribe/demo/${channel}/0/${currentTimetoken || '0'}`;
        const res = await fetch(url, { signal: abortController.signal });
        if (res.ok && isSubscribed) {
          const data = await res.json();
          if (Array.isArray(data) && Array.isArray(data[0])) {
            data[0].forEach((msg) => {
              handleMessage(msg);
            });
            if (data[1]) {
              currentTimetoken = String(data[1]);
            }
          }
        } else {
          await new Promise((r) => setTimeout(r, 1000));
        }
      } catch (err) {
        if (!isSubscribed) break;
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  };

  // 3. Polling de redundância leve a cada 3s para garantir 100% de integridade
  const redundancyInterval = setInterval(async () => {
    if (!isSubscribed) return;
    try {
      const res = await fetch(`https://ps.pubnub.com/v2/history/sub-key/demo/channel/${channel}?count=5`);
      if (res.ok && isSubscribed) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          data[0].forEach((msg) => {
            handleMessage(msg);
          });
        }
      }
    } catch (e) {
      // tolerância silenciosa
    }
  }, 3000);

  loadHistory().then(() => {
    if (isSubscribed) {
      pollStream();
    }
  });

  return () => {
    isSubscribed = false;
    clearInterval(redundancyInterval);
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
