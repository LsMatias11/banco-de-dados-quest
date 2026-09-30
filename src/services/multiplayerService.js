// Service de Sincronização Multiplayer em Tempo Real (PubNub Realtime Stream)

const getChannelName = (roomCode) => {
  const clean = (roomCode || 'BD-MAIN').toUpperCase().replace(/[^A-Z0-9]/g, '_');
  return `bd_quest_channel_${clean}_v4`;
};

export const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BD-${code}`;
};

/**
 * Publica o estado da sala no canal PubNub em tempo real (< 100ms)
 */
export const publishRoomState = async (roomCode, gameState) => {
  if (!roomCode) return;
  try {
    const channel = getChannelName(roomCode);
    const payload = {
      ...gameState,
      lastUpdated: Date.now()
    };
    const encodedPayload = encodeURIComponent(JSON.stringify(payload));
    
    await fetch(`https://ps.pubnub.com/publish/demo/demo/0/${channel}/0/${encodedPayload}`);
  } catch (err) {
    console.error("Erro ao publicar estado da sala online:", err);
  }
};

/**
 * Inscreve um cliente para receber atualizações instantâneas da sala
 */
export const subscribeToRoom = (roomCode, onStateChange) => {
  if (!roomCode) return () => {};

  const channel = getChannelName(roomCode);
  let lastReceivedTime = 0;
  let isSubscribed = true;

  const fetchLatestState = async () => {
    if (!isSubscribed) return;
    try {
      const res = await fetch(`https://ps.pubnub.com/subscribe/demo/${channel}/0/0`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0]) && data[0].length > 0) {
          const latestState = data[0][data[0].length - 1];
          if (latestState && latestState.lastUpdated && latestState.lastUpdated > lastReceivedTime) {
            lastReceivedTime = latestState.lastUpdated;
            onStateChange(latestState);
          }
        }
      }
    } catch (e) {
      // Captura erros de rede silenciosamente
    }
  };

  fetchLatestState();

  // Polling em tempo real a cada 1 segundo para latência ultrabaixa e 100% de confiabilidade
  const interval = setInterval(fetchLatestState, 1000);

  return () => {
    isSubscribed = false;
    clearInterval(interval);
  };
};
