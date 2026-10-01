// Service de Sincronização Multiplayer em Tempo Real (PubNub Streaming + BroadcastChannel v10)
// Inclui proteção contra loops de histórico, self-echo e compatibilidade total com Edge/Chrome/Mobile

export const CLIENT_ID = typeof window !== 'undefined'
  ? `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  : 'server_client';

/**
 * Converte o código da sala em um nome de canal seguro para a rede PubNub
 */
export const getChannelName = (roomCode) => {
  const clean = (roomCode || 'BD-MAIN').toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `bd_quest_${clean}_v10`;
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
    senderId: CLIENT_ID,
    msgId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    lastUpdated: Date.now(),
    timestamp: Date.now()
  };

  // 1. Broadcast instantâneo local (comunicação 0ms entre abas do mesmo navegador Chrome <-> Chrome ou Edge <-> Edge)
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(`bc_${channel}`);
      bc.postMessage(payload);
      bc.close();
    }
  } catch (e) {
    // Ignora restrições locais de sandbox
  }

  // 2. Publicação na rede global PubNub (comunicação entre navegadores diferentes Chrome <-> Edge e Celular)
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
 * Inscreve um cliente para receber eventos em tempo real da sala
 * - Conecta via BroadcastChannel local (0ms)
 * - Conecta via streaming de PubNub (apenas eventos futuros a partir do momento da conexão)
 * - NUNCA faz polling de histórico repetitivo (elimina 100% o bug de tela piscando / ações repetidas)
 * - Filtra self-echo (mensagens enviadas por esta mesma aba são descartadas)
 */
export const subscribeToRoom = (roomCode, onMessage) => {
  if (!roomCode) return () => {};
  const channel = getChannelName(roomCode);

  let isSubscribed = true;
  let currentTimetoken = String(Date.now() * 10000);
  let abortController = null;
  const seenMsgIds = new Set();

  const handleIncomingMessage = (msg) => {
    if (!msg || typeof msg !== 'object') return;
    
    // 1. Evita self-echo: descarta mensagens que foram enviadas por esta mesma aba
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

  // 2. Obter timetoken inicial da PubNub para ouvir estritamente eventos a partir de AGORA
  const initTimetokenAndStartStream = async () => {
    try {
      const timeRes = await fetch(`https://ps.pubnub.com/time/0?_t=${Date.now()}`, {
        headers: NO_CACHE_HEADERS,
        cache: 'no-store'
      });
      if (timeRes.ok) {
        const timeData = await timeRes.json();
        if (Array.isArray(timeData) && timeData[0]) {
          currentTimetoken = String(timeData[0]);
        }
      }
    } catch (e) {
      currentTimetoken = String(Date.now() * 10000);
    }

    if (isSubscribed) {
      pollStream();
    }
  };

  // 3. Loop de Streaming em tempo real (long-polling HTTP nativo da PubNub)
  const pollStream = async () => {
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
          headers: NO_CACHE_HEADERS,
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

  initTimetokenAndStartStream();

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
