import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, CompanyBranch, Permission } from '../types/auth';
import { AuditLogEntry } from '../types/audit';
import { AVAILABLE_USERS, INITIAL_BRANCHES, INITIAL_AUDIT_LOGS } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  switchUser: (userId: string) => void;
  currentBranch: CompanyBranch;
  branches: CompanyBranch[];
  selectedBranchIds: string[];
  selectedBranches: CompanyBranch[];
  toggleBranch: (branchId: string) => void;
  selectAllBranches: () => void;
  selectSingleBranch: (branchId: string) => void;
  switchBranch: (branchId: string) => void;
  isAllBranchesSelected: boolean;
  branchSelectionLabel: string;
  hasPermission: (permission: Permission) => boolean;
  auditLogs: AuditLogEntry[];
  recordAuditLog: (category: AuditLogEntry['category'], action: string, targetEntity: string, targetId: string, details: string) => void;
  logAction: (actionType: string, module: string, targetId: string, details: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(AVAILABLE_USERS[0]);
  const [selectedBranchIds, setSelectedBranchIds] = useState<string[]>(INITIAL_BRANCHES.map(b => b.id));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const selectedBranches = INITIAL_BRANCHES.filter(b => selectedBranchIds.includes(b.id));
  const currentBranch = selectedBranches[0] || INITIAL_BRANCHES[0];
  const isAllBranchesSelected = selectedBranchIds.length === INITIAL_BRANCHES.length;

  const switchUser = (userId: string) => {
    const found = AVAILABLE_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      recordAuditLog(
        'PERMISSION',
        'Alternância de Perfil (Simulação)',
        'Sessão do Usuário',
        found.id,
        `Sessão alternada para ${found.name} (${found.roleTitle})`
      );
    }
  };

  const branchSelectionLabel = (() => {
    if (selectedBranchIds.length === 0) return 'Nenhuma operação';
    if (selectedBranchIds.length === INITIAL_BRANCHES.length) return 'Todas as operações (8)';
    if (selectedBranchIds.length === 1) {
      const found = INITIAL_BRANCHES.find(b => b.id === selectedBranchIds[0]);
      return found ? found.name : '1 operação';
    }
    return `${selectedBranchIds.length} operações selecionadas`;
  })();

  const toggleBranch = (branchId: string) => {
    setSelectedBranchIds(prev => {
      let updated: string[];
      if (prev.includes(branchId)) {
        // Prevent deselecting everything, keep at least 1 or allow 0
        updated = prev.filter(id => id !== branchId);
        if (updated.length === 0) {
          // If empty, keep the clicked one
          updated = [branchId];
        }
      } else {
        updated = [...prev, branchId];
      }
      return updated;
    });
  };

  const selectAllBranches = () => {
    setSelectedBranchIds(INITIAL_BRANCHES.map(b => b.id));
    recordAuditLog(
      'SYSTEM',
      'Seleção Global de Operações',
      'Filiais / Estabelecimentos',
      'ALL',
      'Todas as 8 operações foram selecionadas para visualização consolidada.'
    );
  };

  const selectSingleBranch = (branchId: string) => {
    setSelectedBranchIds([branchId]);
    const found = INITIAL_BRANCHES.find(b => b.id === branchId);
    if (found) {
      recordAuditLog(
        'SYSTEM',
        'Filtro de Operação Exclusiva',
        'Filial / Estabelecimento',
        found.code,
        `Visualização restrita à operação ${found.name}`
      );
    }
  };

  const switchBranch = (branchId: string) => {
    selectSingleBranch(branchId);
  };

  const hasPermission = (permission: Permission): boolean => {
    return currentUser.permissions.includes(permission);
  };

  const recordAuditLog = (
    category: AuditLogEntry['category'],
    action: string,
    targetEntity: string,
    targetId: string,
    details: string
  ) => {
    const now = new Date();
    const formattedTime = now.toISOString().replace('T', ' ').substring(0, 19);
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: formattedTime,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.roleTitle,
      category,
      action,
      targetEntity,
      targetId,
      ipAddress: '192.168.1.100',
      details
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const logAction = (actionType: string, module: string, targetId: string, details: string) => {
    let cat: AuditLogEntry['category'] = 'SYSTEM';
    if (module.toLowerCase().includes('folha') || module.toLowerCase().includes('ponto') || module.toLowerCase().includes('rpa')) cat = 'PAYROLL';
    else if (module.toLowerCase().includes('férias') || module.toLowerCase().includes('ferias')) cat = 'VACATION';
    else if (module.toLowerCase().includes('benefício') || module.toLowerCase().includes('beneficio')) cat = 'BENEFIT';
    else if (module.toLowerCase().includes('admissão') || module.toLowerCase().includes('colaborador') || module.toLowerCase().includes('vaga')) cat = 'ADMISSION';
    else if (module.toLowerCase().includes('desligamento')) cat = 'TERMINATION';

    recordAuditLog(cat, `[${actionType}] ${module}`, module, targetId, details);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        availableUsers: AVAILABLE_USERS,
        switchUser,
        currentBranch,
        branches: INITIAL_BRANCHES,
        selectedBranchIds,
        selectedBranches,
        toggleBranch,
        selectAllBranches,
        selectSingleBranch,
        switchBranch,
        isAllBranchesSelected,
        branchSelectionLabel,
        hasPermission,
        auditLogs,
        recordAuditLog,
        logAction
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
