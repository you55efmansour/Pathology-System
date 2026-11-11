const DATABASE = 'histora-images-v1';
const sessionImages = new Map();
const objectUrls = new Map();

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error('imageStorage'));
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('images');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('imageStorage'));
    request.onblocked = () => reject(new Error('imageStorage'));
  });
}

async function transaction(mode, operation) {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const tx = database.transaction('images', mode);
      const request = operation(tx.objectStore('images'));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = tx.onabort = () => reject(new Error('imageStorage'));
    });
  } finally { database.close(); }
}

export const imageRepository = {
  async put(id, file) {
    try { await transaction('readwrite', (store) => store.put(file, id)); return true; }
    catch { sessionImages.set(id, file); return false; }
  },
  async get(id) {
    if (sessionImages.has(id)) return sessionImages.get(id);
    return transaction('readonly', (store) => store.get(id));
  },
  async url(id) {
    if (objectUrls.has(id)) return objectUrls.get(id);
    const blob = await this.get(id);
    if (!blob) throw new Error('imageMissing');
    const url = URL.createObjectURL(blob);
    objectUrls.set(id, url);
    return url;
  },
  async remove(id) {
    sessionImages.delete(id);
    if (objectUrls.has(id)) URL.revokeObjectURL(objectUrls.get(id));
    objectUrls.delete(id);
    try { await transaction('readwrite', (store) => store.delete(id)); } catch { /* An unavailable database cannot hold this session's image. */ }
  },
};
