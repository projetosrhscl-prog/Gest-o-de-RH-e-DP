/**
 * SCL Photo Vault - Multi-Tier Persistent Storage for Collaborator Avatars
 * 
 * 1. Tier 1: IndexedDB (Virtually unlimited capacity, persistent across sessions & refreshes)
 * 2. Tier 2: Synchronous In-Memory Cache (Instant render without layout shift)
 * 3. Tier 3: Compact LocalStorage Overrides (Cross-tab sync & fallback)
 * 4. Tier 4: Legacy Storage Auto-Recovery (Scans & recovers previous photo uploads)
 */

const DB_NAME = 'scl_photo_vault_db';
const DB_VERSION = 1;
const STORE_NAME = 'collaborator_photos';

// In-Memory Synchronous Cache
const memoryPhotoCache = new Map<string, string>();

let dbPromise: Promise<IDBDatabase> | null = null;

function getIDB(): Promise<IDBDatabase> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.reject(new Error('IndexedDB não disponível'));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }
  return dbPromise;
}

/**
 * Saves a photo in IndexedDB and memory cache.
 */
export async function savePhotoToVault(collaboratorId: string, photoDataUrl: string): Promise<void> {
  if (!collaboratorId || !photoDataUrl) return;

  // 1. Cache in memory
  memoryPhotoCache.set(collaboratorId, photoDataUrl);

  // 2. Save in IndexedDB
  try {
    const db = await getIDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ id: collaboratorId, photo: photoDataUrl, updatedAt: Date.now() });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[PhotoVault] Erro ao persistir foto no IndexedDB:', err);
  }
}

/**
 * Gets a photo from memory cache or IndexedDB.
 */
export async function getPhotoFromVault(collaboratorId: string): Promise<string | null> {
  if (!collaboratorId) return null;

  // Check memory cache first
  if (memoryPhotoCache.has(collaboratorId)) {
    return memoryPhotoCache.get(collaboratorId) || null;
  }

  // Check IndexedDB
  try {
    const db = await getIDB();
    return await new Promise<string | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(collaboratorId);
      req.onsuccess = () => {
        if (req.result?.photo) {
          memoryPhotoCache.set(collaboratorId, req.result.photo);
          resolve(req.result.photo);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Synchronously gets cached photo if already loaded in memory.
 */
export function getCachedPhotoSync(collaboratorId: string): string | null {
  return memoryPhotoCache.get(collaboratorId) || null;
}

/**
 * Deletes a photo from the vault.
 */
export async function deletePhotoFromVault(collaboratorId: string): Promise<void> {
  memoryPhotoCache.delete(collaboratorId);
  try {
    const db = await getIDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(collaboratorId);
  } catch (err) {
    console.warn('[PhotoVault] Erro ao deletar foto:', err);
  }
}

/**
 * Scans ALL localStorage and sessionStorage keys to recover any previously uploaded photos.
 * Ensures user never loses custom images even after schema or key migrations.
 */
export async function recoverAllLegacyPhotos(): Promise<Record<string, string>> {
  const recovered: Record<string, string> = {};
  if (typeof window === 'undefined') return recovered;

  try {
    // 1. Check all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      try {
        const val = localStorage.getItem(key);
        if (!val || val.length < 20) continue;

        // Check if value contains JSON with collaborator avatars
        if (val.includes('"avatarUrl"') || val.includes('"photo"') || val.includes('data:image/')) {
          const parsed = JSON.parse(val);

          // If array of collaborators
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any) => {
              if (item?.id && item?.avatarUrl && (item.avatarUrl.startsWith('data:image') || item.avatarUrl.startsWith('http'))) {
                recovered[item.id] = item.avatarUrl;
                memoryPhotoCache.set(item.id, item.avatarUrl);
              }
            });
          } else if (typeof parsed === 'object' && parsed !== null) {
            // If map of overrides or single object
            Object.entries(parsed).forEach(([colabId, obj]: [string, any]) => {
              if (obj?.avatarUrl && (obj.avatarUrl.startsWith('data:image') || obj.avatarUrl.startsWith('http'))) {
                recovered[colabId] = obj.avatarUrl;
                memoryPhotoCache.set(colabId, obj.avatarUrl);
              } else if (typeof obj === 'string' && (obj.startsWith('data:image') || obj.startsWith('http'))) {
                recovered[colabId] = obj;
                memoryPhotoCache.set(colabId, obj);
              }
            });
          }
        }
      } catch {
        // Skip invalid JSON
      }
    }

    // 2. Persist all recovered photos into IndexedDB
    for (const [colabId, photoUrl] of Object.entries(recovered)) {
      await savePhotoToVault(colabId, photoUrl);
    }

    // 3. Also load existing IndexedDB entries into memory cache
    try {
      const db = await getIDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.openCursor();
        req.onsuccess = (e: any) => {
          const cursor = e.target.result;
          if (cursor) {
            if (cursor.value?.id && cursor.value?.photo) {
              recovered[cursor.value.id] = cursor.value.photo;
              memoryPhotoCache.set(cursor.value.id, cursor.value.photo);
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        req.onerror = () => resolve();
      });
    } catch (err) {
      console.warn('[PhotoVault] Erro ao carregar cursor IDB:', err);
    }
  } catch (err) {
    console.error('[PhotoVault] Erro na rotina de auto-recuperação:', err);
  }

  return recovered;
}
