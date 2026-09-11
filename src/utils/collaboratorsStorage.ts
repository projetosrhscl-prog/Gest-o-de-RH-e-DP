import { useState, useEffect, useCallback } from 'react';
import { CollaboratorProfile } from '../types/collaborator';
import { INITIAL_COLLABORATORS } from '../data/mockData';
import { sanitizeCollaboratorProfile } from './collaboratorDefaults';
import { 
  savePhotoToVault, 
  getPhotoFromVault, 
  getCachedPhotoSync, 
  recoverAllLegacyPhotos,
  deletePhotoFromVault 
} from './photoStorage';

// Chaves de armazenamento otimizadas (Deltas leves para manter LocalStorage < 20KB)
export const COLLABORATORS_OVERRIDES_KEY = 'scl_colab_overrides_v3';
export const COLLABORATORS_ADDED_KEY = 'scl_colab_added_v3';
export const COLLABORATORS_DELETED_KEY = 'scl_colab_deleted_v3';

export const COLLABORATORS_STORAGE_KEY = 'scl_collaborators_v1';
const LEGACY_STORAGE_KEY = 'scl_kiip_collaborators_v1';

export const COLLABORATORS_UPDATE_EVENT = 'scl_collaborators_updated';

/**
 * Normaliza o nome do colaborador para comparação estrita e remoção de duplicados
 */
export function normalizeCollaboratorName(name?: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Normaliza o CPF do colaborador removendo caracteres não numéricos
 */
export function normalizeCollaboratorCpf(cpf?: string): string {
  if (!cpf) return '';
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11 || digits === '00000000000' || digits === '12345678900') {
    return '';
  }
  return digits;
}

/**
 * Deduplica uma lista de colaboradores mantendo estritamente uma única entrada por nome completo e CPF.
 * Dá preferência ao cadastro base oficial da contabilidade ou ao registro com mais dados preenchidos.
 */
export function deduplicateCollaboratorsList(list: CollaboratorProfile[]): {
  deduped: CollaboratorProfile[];
  duplicatesRemovedCount: number;
  duplicateNames: string[];
  removedIds: string[];
} {
  const seenNames = new Map<string, CollaboratorProfile>();
  const seenCpfs = new Map<string, CollaboratorProfile>();
  const seenIds = new Set<string>();
  const deduped: CollaboratorProfile[] = [];
  const removedIds: string[] = [];
  const duplicateNames: string[] = [];

  for (const item of list) {
    if (!item || !item.fullName) continue;

    if (seenIds.has(item.id)) {
      removedIds.push(item.id);
      duplicateNames.push(item.fullName);
      continue;
    }

    const normName = normalizeCollaboratorName(item.fullName);
    const normCpf = normalizeCollaboratorCpf(item.cpf);

    let existing = seenNames.get(normName);
    if (!existing && normCpf) {
      existing = seenCpfs.get(normCpf);
    }

    if (existing) {
      // Registro com mesmo nome ou mesmo CPF encontrado: é uma duplicidade!
      duplicateNames.push(item.fullName);
      removedIds.push(item.id);

      // Preserva melhorias e dados do duplicado no registro principal
      if (!existing.avatarUrl && item.avatarUrl) {
        existing.avatarUrl = item.avatarUrl;
      }
      if ((!existing.bankAccount?.pixKey || existing.bankAccount.pixKey === 'Não informada') && item.bankAccount?.pixKey && item.bankAccount.pixKey !== 'Não informada') {
        if (existing.bankAccount) {
          existing.bankAccount.pixKey = item.bankAccount.pixKey;
        }
      }
      if ((!existing.phone || existing.phone.includes('0000')) && item.phone && !item.phone.includes('0000')) {
        existing.phone = item.phone;
      }
      continue;
    }

    seenIds.add(item.id);
    seenNames.set(normName, item);
    if (normCpf) {
      seenCpfs.set(normCpf, item);
    }
    deduped.push(item);
  }

  return {
    deduped,
    duplicatesRemovedCount: removedIds.length,
    duplicateNames: Array.from(new Set(duplicateNames)),
    removedIds
  };
}

/**
 * Varre e expurga ativamente qualquer colaborador duplicado com o mesmo nome ou CPF no armazenamento local.
 */
export function purgeDuplicateCollaborators(): {
  removedCount: number;
  removedNames: string[];
} {
  if (typeof window === 'undefined') {
    return { removedCount: 0, removedNames: [] };
  }

  try {
    const currentAdded = getStoredAdded();
    const baseList = INITIAL_COLLABORATORS.map(sanitizeCollaboratorProfile);
    const baseNames = new Set(baseList.map(c => normalizeCollaboratorName(c.fullName)));
    const baseCpfs = new Set(baseList.map(c => normalizeCollaboratorCpf(c.cpf)).filter(Boolean));

    const removedNames: string[] = [];
    const validAdded: CollaboratorProfile[] = [];
    const seenAddedNames = new Set<string>();

    for (const item of currentAdded) {
      const normName = normalizeCollaboratorName(item.fullName);
      const normCpf = normalizeCollaboratorCpf(item.cpf);

      // Se já existe na base oficial ou já apareceu na lista de adicionados
      if (baseNames.has(normName) || (normCpf && baseCpfs.has(normCpf)) || seenAddedNames.has(normName)) {
        removedNames.push(item.fullName);
        // Se tinha foto, tenta migrar para a base oficial
        if (item.avatarUrl) {
          const match = baseList.find(c => 
            normalizeCollaboratorName(c.fullName) === normName || 
            (normCpf && normalizeCollaboratorCpf(c.cpf) === normCpf)
          );
          if (match) {
            savePhotoToVault(match.id, item.avatarUrl);
          }
        }
      } else {
        seenAddedNames.add(normName);
        validAdded.push(item);
      }
    }

    if (removedNames.length > 0) {
      safeSetItem(COLLABORATORS_ADDED_KEY, JSON.stringify(validAdded));
      const freshList = getStoredCollaborators();
      window.dispatchEvent(
        new CustomEvent<CollaboratorProfile[]>(COLLABORATORS_UPDATE_EVENT, {
          detail: freshList
        })
      );
    }

    return {
      removedCount: removedNames.length,
      removedNames: Array.from(new Set(removedNames))
    };
  } catch (err) {
    console.error('Erro ao purgar duplicados:', err);
    return { removedCount: 0, removedNames: [] };
  }
}

// Flag de inicialização e recuperação
let isRecovered = false;

// Executa rotina de recuperação imediata e expurgo de duplicados
if (typeof window !== 'undefined') {
  // Limpeza de duplicados imediata
  try {
    purgeDuplicateCollaborators();
  } catch (e) {
    console.warn('[Storage] Erro na rotina de expurgo inicial:', e);
  }

  recoverAllLegacyPhotos().then((recoveredMap) => {
    isRecovered = true;
    if (Object.keys(recoveredMap).length > 0) {
      // Dispara evento para sincronizar estados React
      const updatedList = getStoredCollaborators();
      window.dispatchEvent(
        new CustomEvent<CollaboratorProfile[]>(COLLABORATORS_UPDATE_EVENT, {
          detail: updatedList
        })
      );
    }
  }).catch((err) => {
    console.warn('[Storage] Erro ao recuperar fotos legadas:', err);
  });
}

// Helper seguro para gravação em LocalStorage com proteção anti-quota
function safeSetItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`[SCL Storage] Não foi possível salvar chave '${key}' no LocalStorage (cota excedida ou restrição):`, err);
    return false;
  }
}

function getStoredOverrides(): Record<string, Partial<CollaboratorProfile>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(COLLABORATORS_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getStoredAdded(): CollaboratorProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COLLABORATORS_ADDED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(sanitizeCollaboratorProfile) : [];
  } catch {
    return [];
  }
}

function getStoredDeletedIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COLLABORATORS_DELETED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Carrega a lista de colaboradores aplicando os overrides, adições e fotos do Photo Vault com deduplicação rigorosa por nome e CPF.
 */
export function getStoredCollaborators(): CollaboratorProfile[] {
  const baseList = INITIAL_COLLABORATORS.map(sanitizeCollaboratorProfile);
  if (typeof window === 'undefined') {
    return deduplicateCollaboratorsList(baseList).deduped;
  }

  try {
    const overrides = getStoredOverrides();
    const addedList = getStoredAdded();
    const deletedIds = new Set(getStoredDeletedIds());

    // 1. Aplica filtros, overrides e fotos em cache na base padrão oficial
    const processedBase = baseList
      .filter(c => !deletedIds.has(c.id))
      .map(c => {
        let merged = { ...c };
        if (overrides[c.id]) {
          merged = { ...merged, ...overrides[c.id] };
        }
        // Verifica se há foto no Vault (IndexedDB / Memory)
        const vaultPhoto = getCachedPhotoSync(c.id);
        if (vaultPhoto) {
          merged.avatarUrl = vaultPhoto;
        }
        return sanitizeCollaboratorProfile(merged);
      });

    // 2. Mescla os colaboradores adicionados pelo usuário
    const processedAdded = addedList
      .filter(c => !deletedIds.has(c.id))
      .map(c => {
        let merged = { ...c };
        if (overrides[c.id]) {
          merged = { ...merged, ...overrides[c.id] };
        }
        const vaultPhoto = getCachedPhotoSync(c.id);
        if (vaultPhoto) {
          merged.avatarUrl = vaultPhoto;
        }
        return sanitizeCollaboratorProfile(merged);
      });

    // 3. Purga automaticamente da lista de adicionados quaisquer pessoas que já existam na base oficial
    const baseNames = new Set(processedBase.map(c => normalizeCollaboratorName(c.fullName)));
    const baseCpfs = new Set(processedBase.map(c => normalizeCollaboratorCpf(c.cpf)).filter(Boolean));

    let addedListChanged = false;
    const cleanAdded: CollaboratorProfile[] = [];
    const seenAddedNames = new Set<string>();

    for (const added of processedAdded) {
      const nName = normalizeCollaboratorName(added.fullName);
      const nCpf = normalizeCollaboratorCpf(added.cpf);

      const isDupOfBase = baseNames.has(nName) || (nCpf && baseCpfs.has(nCpf));
      const isDupInAdded = seenAddedNames.has(nName);

      if (isDupOfBase || isDupInAdded) {
        addedListChanged = true;
        // Se tinha foto ou chave PIX personalizada, assegura transferência para o cadastro base
        if (added.avatarUrl) {
          const match = processedBase.find(c => 
            normalizeCollaboratorName(c.fullName) === nName || 
            (nCpf && normalizeCollaboratorCpf(c.cpf) === nCpf)
          );
          if (match) {
            match.avatarUrl = added.avatarUrl;
            savePhotoToVault(match.id, added.avatarUrl);
          }
        }
      } else {
        seenAddedNames.add(nName);
        cleanAdded.push(added);
      }
    }

    if (addedListChanged) {
      safeSetItem(COLLABORATORS_ADDED_KEY, JSON.stringify(cleanAdded));
    }

    // 4. Junta os novos com a base oficial e executa a deduplicação final
    const combined = [...cleanAdded, ...processedBase];
    const { deduped } = deduplicateCollaboratorsList(combined);

    return deduped;
  } catch (err) {
    console.error('Erro ao reconstruir colaboradores armazenados:', err);
    return deduplicateCollaboratorsList(baseList).deduped;
  }
}

/**
 * Salva a lista completa decompondo em deltas (adicionados, deletados e modificados).
 */
export function saveStoredCollaborators(list: CollaboratorProfile[]): void {
  if (typeof window === 'undefined') return;

  try {
    const baseMap = new Map(INITIAL_COLLABORATORS.map(c => [c.id, c]));
    const currentListMap = new Map(list.map(c => [c.id, c]));

    const added: CollaboratorProfile[] = [];
    const overrides: Record<string, Partial<CollaboratorProfile>> = {};
    const deleted: string[] = [];

    // Identifica novos e modificados
    list.forEach(item => {
      // Salva foto no vault se for personalizada
      if (item.avatarUrl) {
        savePhotoToVault(item.id, item.avatarUrl);
      }

      const base = baseMap.get(item.id);
      if (!base) {
        added.push(sanitizeCollaboratorProfile(item));
      } else {
        // Armazena as modificações
        overrides[item.id] = sanitizeCollaboratorProfile(item);
      }
    });

    // Identifica deletados
    INITIAL_COLLABORATORS.forEach(base => {
      if (!currentListMap.has(base.id)) {
        deleted.push(base.id);
      }
    });

    safeSetItem(COLLABORATORS_OVERRIDES_KEY, JSON.stringify(overrides));
    safeSetItem(COLLABORATORS_ADDED_KEY, JSON.stringify(added));
    safeSetItem(COLLABORATORS_DELETED_KEY, JSON.stringify(deleted));

    // Notifica outros componentes
    window.dispatchEvent(
      new CustomEvent<CollaboratorProfile[]>(COLLABORATORS_UPDATE_EVENT, {
        detail: list
      })
    );
  } catch (err) {
    console.error('Erro ao salvar colaboradores:', err);
  }
}

/**
 * Atualiza um único colaborador de forma atômica e persistente.
 */
export function updateStoredCollaborator(updated: CollaboratorProfile): CollaboratorProfile {
  const sanitized = sanitizeCollaboratorProfile(updated);
  if (typeof window === 'undefined') return sanitized;

  try {
    if (sanitized.avatarUrl) {
      savePhotoToVault(sanitized.id, sanitized.avatarUrl);
    }

    const isAdded = getStoredAdded().some(c => c.id === sanitized.id);

    if (isAdded) {
      const added = getStoredAdded().map(c => c.id === sanitized.id ? sanitized : c);
      safeSetItem(COLLABORATORS_ADDED_KEY, JSON.stringify(added));
    } else {
      const overrides = getStoredOverrides();
      overrides[sanitized.id] = sanitized;
      safeSetItem(COLLABORATORS_OVERRIDES_KEY, JSON.stringify(overrides));
    }

    const fullList = getStoredCollaborators();
    window.dispatchEvent(
      new CustomEvent<CollaboratorProfile[]>(COLLABORATORS_UPDATE_EVENT, {
        detail: fullList
      })
    );
  } catch (err) {
    console.error('Erro ao atualizar colaborador:', err);
  }

  return sanitized;
}

/**
 * Atualiza especificamente a foto de perfil de um colaborador de forma imediata e permanente no Photo Vault.
 */
export function updateCollaboratorPhoto(collaboratorId: string, newPhotoUrl: string): CollaboratorProfile | null {
  const currentList = getStoredCollaborators();
  const target = currentList.find(c => c.id === collaboratorId);
  if (!target) return null;

  // 1. Salva no Photo Vault (IndexedDB + Memória)
  savePhotoToVault(collaboratorId, newPhotoUrl);

  // 2. Atualiza overrides
  const updated: CollaboratorProfile = {
    ...target,
    avatarUrl: newPhotoUrl
  };

  return updateStoredCollaborator(updated);
}

/**
 * Adiciona um novo colaborador de forma persistente com proteção contra duplicidade de nome e CPF.
 */
export function addStoredCollaborator(newColab: CollaboratorProfile): CollaboratorProfile {
  const sanitized = sanitizeCollaboratorProfile(newColab);
  if (typeof window === 'undefined') return sanitized;

  try {
    if (sanitized.avatarUrl) {
      savePhotoToVault(sanitized.id, sanitized.avatarUrl);
    }

    const normName = normalizeCollaboratorName(sanitized.fullName);
    const normCpf = normalizeCollaboratorCpf(sanitized.cpf);
    const currentList = getStoredCollaborators();

    // Se já existe um colaborador com o mesmo nome ou mesmo CPF
    const existing = currentList.find(c => 
      c.id !== sanitized.id && (
        normalizeCollaboratorName(c.fullName) === normName ||
        (normCpf && normalizeCollaboratorCpf(c.cpf) === normCpf)
      )
    );

    if (existing) {
      // Atualiza o colaborador existente mantendo o ID canônico para evitar duplicatas
      const merged: CollaboratorProfile = {
        ...existing,
        ...sanitized,
        id: existing.id // Preserva o ID original do cadastro
      };
      return updateStoredCollaborator(merged);
    }

    const added = [
      sanitized, 
      ...getStoredAdded().filter(c => 
        c.id !== sanitized.id && 
        normalizeCollaboratorName(c.fullName) !== normName &&
        (!normCpf || normalizeCollaboratorCpf(c.cpf) !== normCpf)
      )
    ];
    const deleted = getStoredDeletedIds().filter(id => id !== sanitized.id);

    safeSetItem(COLLABORATORS_ADDED_KEY, JSON.stringify(added));
    safeSetItem(COLLABORATORS_DELETED_KEY, JSON.stringify(deleted));

    const fullList = getStoredCollaborators();
    window.dispatchEvent(
      new CustomEvent<CollaboratorProfile[]>(COLLABORATORS_UPDATE_EVENT, {
        detail: fullList
      })
    );
  } catch (err) {
    console.error('Erro ao adicionar colaborador:', err);
  }

  return sanitized;
}

/**
 * Remove colaboradores que possuam o mesmo nome completo.
 */
export function deleteStoredCollaboratorsByName(targetName: string): number {
  if (typeof window === 'undefined') return 0;
  const normTarget = normalizeCollaboratorName(targetName);
  if (!normTarget) return 0;

  try {
    const currentList = getStoredCollaborators();
    const matches = currentList.filter(c => normalizeCollaboratorName(c.fullName) === normTarget);
    if (matches.length === 0) return 0;

    matches.forEach(m => {
      deleteStoredCollaborator(m.id);
    });

    return matches.length;
  } catch (err) {
    console.error('Erro ao excluir colaboradores por nome:', err);
    return 0;
  }
}

/**
 * Remove um colaborador de forma persistente.
 */
export function deleteStoredCollaborator(collaboratorId: string): void {
  if (typeof window === 'undefined') return;

  try {
    deletePhotoFromVault(collaboratorId);

    const added = getStoredAdded().filter(c => c.id !== collaboratorId);
    const overrides = getStoredOverrides();
    delete overrides[collaboratorId];

    const deletedIds = Array.from(new Set([...getStoredDeletedIds(), collaboratorId]));

    safeSetItem(COLLABORATORS_ADDED_KEY, JSON.stringify(added));
    safeSetItem(COLLABORATORS_OVERRIDES_KEY, JSON.stringify(overrides));
    safeSetItem(COLLABORATORS_DELETED_KEY, JSON.stringify(deletedIds));

    const fullList = getStoredCollaborators();
    window.dispatchEvent(
      new CustomEvent<CollaboratorProfile[]>(COLLABORATORS_UPDATE_EVENT, {
        detail: fullList
      })
    );
  } catch (err) {
    console.error('Erro ao deletar colaborador:', err);
  }
}

/**
 * Restaura para os colaboradores padrão do sistema.
 */
export function resetCollaboratorsToDefault(): CollaboratorProfile[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(COLLABORATORS_OVERRIDES_KEY);
      localStorage.removeItem(COLLABORATORS_ADDED_KEY);
      localStorage.removeItem(COLLABORATORS_DELETED_KEY);
    } catch (err) {
      console.warn('Erro ao resetar storage:', err);
    }
  }

  const defaultList = INITIAL_COLLABORATORS.map(sanitizeCollaboratorProfile);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<CollaboratorProfile[]>(COLLABORATORS_UPDATE_EVENT, {
        detail: defaultList
      })
    );
  }
  return defaultList;
}

/**
 * Hook do React para gerenciar colaboradores com persistência automática e Photo Vault.
 */
export function useStoredCollaborators() {
  const [collaborators, setCollaborators] = useState<CollaboratorProfile[]>(() => {
    return getStoredCollaborators();
  });

  useEffect(() => {
    // 1. Atualiza lista com o que estiver em memória/cache
    setCollaborators(getStoredCollaborators());

    // 2. Se a recuperação assíncrona ainda estiver executando, agenda sincronização
    recoverAllLegacyPhotos().then(() => {
      setCollaborators(getStoredCollaborators());
    });

    // 3. Listener para eventos customizados nesta janela
    const handleCustomUpdate = (event: CustomEvent<CollaboratorProfile[]>) => {
      if (event.detail && Array.isArray(event.detail)) {
        setCollaborators(event.detail);
      } else {
        setCollaborators(getStoredCollaborators());
      }
    };

    // 4. Listener para alterações de storage em outras abas
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === COLLABORATORS_OVERRIDES_KEY ||
        e.key === COLLABORATORS_ADDED_KEY ||
        e.key === COLLABORATORS_DELETED_KEY
      ) {
        setCollaborators(getStoredCollaborators());
      }
    };

    window.addEventListener(COLLABORATORS_UPDATE_EVENT as unknown as string, handleCustomUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(COLLABORATORS_UPDATE_EVENT as unknown as string, handleCustomUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateCollaborator = useCallback((updated: CollaboratorProfile) => {
    const sanitized = updateStoredCollaborator(updated);
    setCollaborators(getStoredCollaborators());
    return sanitized;
  }, []);

  const updatePhoto = useCallback((collaboratorId: string, newPhotoUrl: string) => {
    const updated = updateCollaboratorPhoto(collaboratorId, newPhotoUrl);
    setCollaborators(getStoredCollaborators());
    return updated;
  }, []);

  const addCollaborator = useCallback((newColab: CollaboratorProfile) => {
    const sanitized = addStoredCollaborator(newColab);
    setCollaborators(getStoredCollaborators());
    return sanitized;
  }, []);

  const removeCollaborator = useCallback((id: string) => {
    deleteStoredCollaborator(id);
    setCollaborators(getStoredCollaborators());
  }, []);

  const resetToDefaults = useCallback(() => {
    const list = resetCollaboratorsToDefault();
    setCollaborators(list);
    return list;
  }, []);

  const purgeDuplicates = useCallback(() => {
    const result = purgeDuplicateCollaborators();
    setCollaborators(getStoredCollaborators());
    return result;
  }, []);

  return {
    collaborators,
    updateCollaborator,
    updatePhoto,
    addCollaborator,
    removeCollaborator,
    purgeDuplicates,
    resetToDefaults
  };
}
