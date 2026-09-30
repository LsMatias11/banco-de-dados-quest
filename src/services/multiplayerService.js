// Service para Gerenciamento de Salas Online (Multiplayer em Tempo Real com Firebase)

const BASE_URL = "https://banco-de-dados-quest-default-rtdb.firebaseio.com/rooms";

/**
 * Gera um código de sala amigável de 4 caracteres (Ex: BD-8841 ou BD-X7K2)
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
 * Publica o estado da sala no Firebase Realtime DB
 */
export const publishRoomState = async (roomCode, gameState) => {
  if (!roomCode) return;
  try {
    const cleanCode = roomCode.toUpperCase().trim();
    const payload = {
      ...gameState,
      lastUpdated: Date.now()
    };

    await fetch(`${BASE_URL}/${cleanCode}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Erro ao publicar estado da sala online:", err);
  }
};

/**
 * Inscreve um cliente (aluno ou projetor) para receber atualizações instantâneas da sala
 */
export const subscribeToRoom = (roomCode, onStateChange) => {
  if (!roomCode) return () => {};

  const cleanCode = roomCode.toUpperCase().trim();
  const streamUrl = `${BASE_URL}/${cleanCode}.json`;

  let eventSource = null;

  try {
    eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed && parsed.data !== undefined) {
          if (parsed.data) onStateChange(parsed.data);
        } else if (parsed && typeof parsed === "object" && !parsed.path) {
          onStateChange(parsed);
        }
      } catch (e) {
        console.error("Erro ao ler atualização da sala:", e);
      }
    };

    eventSource.onerror = (err) => {
      // EventSource tentará reconectar automaticamente se houver instabilidade
    };
  } catch (err) {
    console.error("Falha ao iniciar listener da sala:", err);
  }

  // Backup polling suave a cada 1.5s para garantir 100% de sincronia
  const interval = setInterval(async () => {
    try {
      const res = await fetch(`${BASE_URL}/${cleanCode}.json`);
      if (res.ok) {
        const data = await res.json();
        if (data) onStateChange(data);
      }
    } catch (e) {
      // ignore network hiccups
    }
  }, 1500);

  return () => {
    if (eventSource) eventSource.close();
    clearInterval(interval);
  };
};
