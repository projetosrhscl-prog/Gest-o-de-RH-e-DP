export interface Department {
  id: string;
  code: string;
  name: string;
  costCenter: string;
  managerName?: string;
  activeCount: number;
}

export interface JobPosition {
  id: string;
  code: string;
  title: string;
  cboCode: string; // Classificação Brasileira de Ocupações
  salaryRangeMin: number;
  salaryRangeMax: number;
  level: 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista' | 'Coordenação' | 'Gerência' | 'Diretoria' | 'Operacional' | 'Técnico / Campo' | 'Estágio';
}

export type ContractType = 'CLT' | 'PJ' | 'ESTAGIO' | 'APRENDIZ' | 'TEMPORARIO' | 'RPA';

export type EmploymentStatus = 'ATIVO' | 'FERIAS' | 'AFASTADO' | 'AVISO_PREVIO' | 'DESLIGADO';

export interface EmployeeRecord {
  id: string;
  registrationNumber: string; // Matrícula SCL
  cpf: string;
  fullName: string;
  preferredName?: string;
  email: string;
  phone: string;
  branchId: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionTitle: string;
  contractType: ContractType;
  admissionDate: string;
  status: EmploymentStatus;
  workSchedule: string; // e.g. "44h semanais (08:00 - 17:48)"
  directSupervisor?: string;
}
