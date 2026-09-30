// Utilitário de Backup e Restauração de Partidas em JSON & LocalStorage

const STORAGE_KEY = 'BD_QUEST_GAME_STATE_V2';

// Salvar Estado Atual no LocalStorage
export function saveToLocalStorage(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

// Carregar Estado do LocalStorage
export function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao carregar do localStorage:', err);
    return null;
  }
}

// Exportar Backup Completo como Download de Arquivo JSON
export function exportBackupFile(state) {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bd-quest-backup-${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  } catch (err) {
    console.error('Erro ao exportar arquivo de backup:', err);
    return false;
  }
}

// Importar Backup a partir de um Arquivo JSON selecionado pelo usuário
export function importBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target.result);
        // Validação básica do formato
        if (parsedData && parsedData.players && Array.isArray(parsedData.players)) {
          resolve(parsedData);
        } else {
          reject(new Error('Formato de arquivo de backup inválido.'));
        }
      } catch (err) {
        reject(new Error('Erro ao processar JSON: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    reader.readAsText(file);
  });
}
