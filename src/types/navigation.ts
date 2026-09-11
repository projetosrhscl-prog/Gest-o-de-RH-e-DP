export type MainModuleId = 
  | 'gestao-pessoas'
  | 'departamento-pessoal'
  | 'admissao-demissao'
  | 'lembretes'
  | 'auditorias'
  | 'configuracoes';

export interface SubModuleItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: 'default' | 'primary' | 'warning' | 'success';
  requiredPermission?: string;
  isPlanned?: boolean;
}

export interface MainModuleNav {
  id: MainModuleId;
  label: string;
  shortDescription: string;
  iconName: string;
  subModules: SubModuleItem[];
}
