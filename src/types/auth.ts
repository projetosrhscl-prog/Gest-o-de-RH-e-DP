export type UserRole = 'ADMIN' | 'HR_MANAGER' | 'DP_ANALYST' | 'FINANCE_MANAGER' | 'COLLABORATOR';

export type Permission = 
  | 'people:read'
  | 'people:write'
  | 'dp:read'
  | 'dp:write'
  | 'recruitment:read'
  | 'recruitment:write'
  | 'reports:read'
  | 'reports:export'
  | 'settings:read'
  | 'settings:write'
  | 'audit:read';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  registrationNumber: string; // Matrícula
  avatarUrl?: string;
  permissions: Permission[];
}

export interface CompanyBranch {
  id: string;
  name: string;
  corporateName: string; // Razão Social
  cnpj: string;
  code: string;
  city: string;
  state: string;
  isHeadquarter: boolean;
}
