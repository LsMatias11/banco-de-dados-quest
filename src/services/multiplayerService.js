// Service de Sincronização Multiplayer em Tempo Real (PubNub Streaming + History Engine v8)
// Inclui proteção contra cache agressivo do Microsoft Edge, Safari e Chrome Mobile

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
 * Headers comuns com desativação total de cache HTTP para compatibilidade com Edge
 */
const NO_CACHE_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache'
};

/**
 * Publica uma mensagem / ação na sala online
 */
export const publishRoomState = async (roomCode, message) => {
  if (!message) return false;
  const channel = getChannelName(roomCode);
  const payload = {
    ...message,
    msgId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    lastUpdated: Date.now(),
    timestamp: Date.now()
  };

  try {
    const res = await fetch(`https://ps.pubnub.com/publish/demo/demo/0/${channel}/0?_t=${Date.now()}_${Math.random()}`, {
      method: 'POST',
      headers: NO_CACHE_HEADERS,
      cache: 'no-store',
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
 * - Desativa cache agressivo em navegadores Chromium/Edge/WebKit
 * - Carrega o histórico recente para recuperar membros já conectados
 * - Mantém uma conexão de streaming contínuo (long-polling do PubNub) para latência < 100ms
 * - Inclui polling de segurança rápido a cada 1.5s com anti-cache para 100% de estabilidade no Edge
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
      if (seenTimestamps.size > 300) {
        const first = seenTimestamps.values().next().value;
        seenTimestamps.delete(first);
      }
    }
    onMessage(msg);
  };

  // 1. Carrega histórico recente para recuperar o estado e membros já conectados (anti-cache)
  const loadHistory = async () => {
    try {
      const res = await fetch(`https://ps.pubnub.com/v2/history/sub-key/demo/channel/${channel}?count=30&_t=${Date.now()}_${Math.random()}`, {
        headers: NO_CACHE_HEADERS,
        cache: 'no-store'
      });
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

  // 2. Loop de Streaming em tempo real com timeout de segurança de 12s para o Edge não travar
  const pollStream = async () => {
    while (isSubscribed) {
      let timeoutId = null;
      try {
        abortController = new AbortController();
        timeoutId = setTimeout(() => {
          try {
            abortController.abort();
          } catch (e) {}
        }, 12000);

        const url = `https://ps.pubnub.com/subscribe/demo/${channel}/0/${currentTimetoken || '0'}?_t=${Date.now()}`;
        const res = await fetch(url, {
          signal: abortController.signal,
          headers: NO_CACHE_HEADERS,
          cache: 'no-store'
        });
        clearTimeout(timeoutId);

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
          await new Promise((r) => setTimeout(r, 400));
        }
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        if (!isSubscribed) break;
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  };

  // 3. Polling de redundância rápido a cada 1.2s com anti-cache (crucial para o Edge não congelar)
  const redundancyInterval = setInterval(async () => {
    if (!isSubscribed) return;
    try {
      const res = await fetch(`https://ps.pubnub.com/v2/history/sub-key/demo/channel/${channel}?count=10&_t=${Date.now()}_${Math.random()}`, {
        headers: NO_CACHE_HEADERS,
        cache: 'no-store'
      });
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
      // tolerância silenciosa
    }
  }, 1200);

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
