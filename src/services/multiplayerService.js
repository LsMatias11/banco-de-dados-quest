// Service de Sincronização Multiplayer em Tempo Real (WebSocket + SSE + BroadcastChannel v12)
// Compatibilidade Universal: Microsoft Edge, Google Chrome, Safari, Firefox, Mobile e Cross-Device

export const CLIENT_ID = typeof window !== 'undefined'
  ? `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  : 'server_client';

/**
 * Converte o código da sala em um nome de canal seguro para a rede de sincronização
 */
export const getChannelName = (roomCode) => {
  const clean = (roomCode || 'BD-MAIN').toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `bd_quest_${clean}_v12`;
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
 * - Envia no BroadcastChannel local (0ms para abas no mesmo navegador)
 * - Envia via HTTP POST global (suporte multiplataforma: Edge, Chrome, Safari, Mobile, outros PCs)
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

  // 2. Publicação na rede global via HTTP POST (sem limite de caracteres URL, 100% livre de bloqueios)
  try {
    const url = `https://ntfy.sh/${channel}`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.ok;
  } catch (err) {
    // Tentativa rápida de retry em caso de micro-instabilidade
    try {
      await new Promise((r) => setTimeout(r, 250));
      const retryRes = await fetch(`https://ntfy.sh/${channel}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return retryRes.ok;
    } catch (retryErr) {
      console.warn("Falha ao propagar estado na rede global:", retryErr);
      return false;
    }
  }
};

/**
 * Inscreve um cliente para receber eventos em tempo real da sala
 * - Conecta via BroadcastChannel local (0ms)
 * - Conecta via WebSocket global (baixa latência multiplataforma)
 * - Fallback inteligente para Server-Sent Events (SSE / EventSource) se WebSocket falhar
 * - Filtra self-echo e mensagens duplicadas
 */
export const subscribeToRoom = (roomCode, onMessage) => {
  if (!roomCode) return () => {};
  const channel = getChannelName(roomCode);

  let isSubscribed = true;
  let ws = null;
  let es = null;
  let reconnectTimeout = null;
  let reconnectAttempts = 0;
  const seenMsgIds = new Set();

  const handleIncomingMessage = (msg) => {
    if (!msg || typeof msg !== 'object') return;

    // 1. Evita self-echo: descarta mensagens enviadas por esta mesma aba
    if (msg.senderId && msg.senderId === CLIENT_ID) return;

    // 2. Deduplicação por msgId exclusivo
    if (msg.msgId) {
      if (seenMsgIds.has(msg.msgId)) return;
      seenMsgIds.add(msg.msgId);
      if (seenMsgIds.size > 300) {
        const first = seenMsgIds.values().next().value;
        seenMsgIds.delete(first);
      }
    }

    onMessage(msg);
  };

  const parseAndHandle = (rawString) => {
    try {
      const data = JSON.parse(rawString);
      if (data && data.event === 'message' && data.message) {
        const payload = typeof data.message === 'string' ? JSON.parse(data.message) : data.message;
        handleIncomingMessage(payload);
      }
    } catch (e) {
      // Formato inválido ou ping interno
    }
  };

  // 1. Ouvinte local de BroadcastChannel (comunicação instantânea na mesma máquina/navegador)
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

  // 2. Conexão SSE de segurança
  const startEventSource = () => {
    if (!isSubscribed || es) return;
    try {
      if (typeof EventSource !== 'undefined') {
        es = new EventSource(`https://ntfy.sh/${channel}/sse`);
        es.onmessage = (event) => {
          if (!isSubscribed) return;
          parseAndHandle(event.data);
        };
        es.onerror = () => {
          // EventSource se reconecta automaticamente pelo browser
        };
      }
    } catch (e) {
      console.warn("EventSource indisponível:", e);
    }
  };

  // 3. Conexão WebSocket em tempo real para sincronização global multiplataforma (Edge <-> Chrome <-> Mobile)
  const connectNetwork = () => {
    if (!isSubscribed) return;

    if (typeof WebSocket !== 'undefined') {
      try {
        if (ws) {
          try { ws.close(); } catch (e) {}
        }
        ws = new WebSocket(`wss://ntfy.sh/${channel}/ws`);

        ws.onmessage = (event) => {
          if (!isSubscribed) return;
          parseAndHandle(event.data);
        };

        ws.onopen = () => {
          reconnectAttempts = 0;
          // Se WebSocket abriu com sucesso e SSE estava ativo como fallback, fecha SSE
          if (es) {
            try { es.close(); } catch (e) {}
            es = null;
          }
        };

        ws.onerror = () => {
          // Se o WebSocket tiver problemas de firewall ou proxy, ativa SSE imediatamente
          if (!es) {
            startEventSource();
          }
        };

        ws.onclose = () => {
          if (!isSubscribed) return;
          // Se o WS fechar, garante que SSE receba os eventos
          if (!es) {
            startEventSource();
          }
          const delay = Math.min(1000 * Math.pow(1.5, reconnectAttempts), 8000);
          reconnectAttempts++;
          reconnectTimeout = setTimeout(connectNetwork, delay);
        };
        return;
      } catch (err) {
        console.warn("WebSocket falhou, usando fallback EventSource:", err);
      }
    }

    // Fallback se WebSocket não estiver disponível
    startEventSource();
  };

  connectNetwork();

  // Ouvintes de reativação da aba / reconexão de rede
  const handleVisibilityOrOnline = () => {
    if (!isSubscribed) return;
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
        connectNetwork();
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleVisibilityOrOnline);
    document.addEventListener('visibilitychange', handleVisibilityOrOnline);
  }

  return () => {
    isSubscribed = false;
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    if (localBc) {
      try { localBc.close(); } catch (e) {}
    }
    if (ws) {
      try { ws.close(); } catch (e) {}
    }
    if (es) {
      try { es.close(); } catch (e) {}
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', handleVisibilityOrOnline);
      document.removeEventListener('visibilitychange', handleVisibilityOrOnline);
    }
  };
};

// Aliases de conveniência global
export const publishGlobalState = (gameState) => publishRoomState('BD-MAIN', gameState);
export const subscribeToGlobalState = (onStateChange) => subscribeToRoom('BD-MAIN', onStateChange);
