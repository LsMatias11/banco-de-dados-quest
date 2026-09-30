// Service de Sincronização Multiplayer em Tempo Real (ntfy.sh SSE + Realtime Stream)

const getTopicName = (roomCode) => {
  const clean = (roomCode || 'BD-MAIN').toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `bd_quest_room_${clean}_v2`;
};

export const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BD-${code}`;
};

export const publishRoomState = async (roomCode, gameState) => {
  if (!roomCode) return;
  try {
    const topic = getTopicName(roomCode);
    const payload = {
      ...gameState,
      lastUpdated: Date.now()
    };

    await fetch(`https://ntfy.sh/${topic}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Erro ao publicar estado da sala:", err);
  }
};

export const subscribeToRoom = (roomCode, onStateChange) => {
  if (!roomCode) return () => {};

  const topic = getTopicName(roomCode);
  const streamUrl = `https://ntfy.sh/${topic}/sse`;

  let eventSource = null;
  let lastReceivedTime = 0;

  // 1. Polling do último estado publicado na sala
  const fetchLatestState = async () => {
    try {
      const res = await fetch(`https://ntfy.sh/${topic}/json?poll=1`);
      if (res.ok) {
        const text = await res.text();
        const lines = text.split('\n').filter(Boolean);
        if (lines.length > 0) {
          const lastMsg = JSON.parse(lines[lines.length - 1]);
          if (lastMsg && lastMsg.message) {
            const state = JSON.parse(lastMsg.message);
            if (state && state.lastUpdated && state.lastUpdated > lastReceivedTime) {
              lastReceivedTime = state.lastUpdated;
              onStateChange(state);
            }
          }
        }
      }
    } catch (e) {
      // silent network catch
    }
  };

  fetchLatestState();

  // 2. Conectar ao EventSource SSE para atualizações em tempo real (< 30ms)
  try {
    eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed && parsed.message) {
          const stateData = JSON.parse(parsed.message);
          if (stateData && stateData.lastUpdated && stateData.lastUpdated > lastReceivedTime) {
            lastReceivedTime = stateData.lastUpdated;
            onStateChange(stateData);
          }
        }
      } catch (e) {
        // silent json catch
      }
    };

    eventSource.onerror = () => {
      // EventSource reconecta automaticamente se a conexão oscilar
    };
  } catch (err) {
    console.error("Falha ao abrir conexão SSE:", err);
  }

  // Backup soft polling a cada 2s para garantir 100% de consistência
  const interval = setInterval(fetchLatestState, 2000);

  return () => {
    if (eventSource) eventSource.close();
    clearInterval(interval);
  };
};
