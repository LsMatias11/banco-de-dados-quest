// Service de Sincronização Global em Tempo Real (PubNub Engine)

const GLOBAL_CHANNEL = 'bd_quest_global_v6';

/**
 * Publica o estado global do jogo para todos os navegadores conectados
 */
export const publishGlobalState = async (gameState) => {
  try {
    const payload = {
      ...gameState,
      lastUpdated: Date.now()
    };
    
    await fetch(`https://ps.pubnub.com/publish/demo/demo/0/${GLOBAL_CHANNEL}/0`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Erro ao publicar estado global:", err);
  }
};

/**
 * Inscreve um cliente para receber o estado global em tempo real
 */
export const subscribeToGlobalState = (onStateChange) => {
  let lastReceivedTime = 0;
  let isSubscribed = true;

  const fetchLatestState = async () => {
    if (!isSubscribed) return;
    try {
      const res = await fetch(`https://ps.pubnub.com/v2/history/sub-key/demo/channel/${GLOBAL_CHANNEL}?count=1`);
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
      // Ignora pequenas oscilações de rede
    }
  };

  fetchLatestState();
  const interval = setInterval(fetchLatestState, 1000);

  return () => {
    isSubscribed = false;
    clearInterval(interval);
  };
};

// Aliases de compatibilidade
export const generateRoomCode = () => 'BD-MAIN';
export const publishRoomState = (_roomCode, gameState) => publishGlobalState(gameState);
export const subscribeToRoom = (_roomCode, onStateChange) => subscribeToGlobalState(onStateChange);
