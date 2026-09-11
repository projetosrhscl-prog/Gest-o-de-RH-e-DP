import { CompanyBranch, UserProfile } from '../types/auth';
import { Department, JobPosition } from '../types/organization';
import { AuditLogEntry } from '../types/audit';
import { 
  CollaboratorProfile, 
  VacationRequest, 
  ElectronicDocument, 
  PayrollMonthRecord, 
  SmartReminderItem 
} from '../types/collaborator';
import { ALL_REAL_COLLABORATORS } from './collaboratorsData';

export const INITIAL_BRANCHES: CompanyBranch[] = [
  {
    id: 'op-apodi',
    name: 'Polo Apodi',
    corporateName: 'POLO APODI PROMOCAO DE VENDAS LTDA',
    cnpj: '36.779.792/0001-91',
    code: 'APD-RN',
    city: 'Apodi',
    state: 'RN',
    isHeadquarter: false
  },
  {
    id: 'op-joaocamara',
    name: 'Polo João Câmara',
    corporateName: 'DANTAS E CAMPELO PROMOCAO DE VENDAS LTDA',
    cnpj: '41.681.802/0001-91',
    code: 'JCR-RN',
    city: 'João Câmara',
    state: 'RN',
    isHeadquarter: false
  },
  {
    id: 'op-limoeiro',
    name: 'Polo Limoeiro do Norte',
    corporateName: 'POLO LIMOEIRO DO NORTE PROMOCAO DE VENDAS LTDA',
    cnpj: '54.707.841/0001-62',
    code: 'LNO-CE',
    city: 'Limoeiro do Norte',
    state: 'CE',
    isHeadquarter: false
  },
  {
    id: 'op-macau',
    name: 'Polo Macau',
    corporateName: 'POLO MACAU PROMOCAO DE VENDAS LTDA',
    cnpj: '40.397.157/0001-17',
    code: 'MCU-RN',
    city: 'Macau',
    state: 'RN',
    isHeadquarter: false
  },
  {
    id: 'op-paracatu',
    name: 'Polo Paracatu',
    corporateName: 'POLO PARACATU PROMOCAO DE VENDAS LTDA',
    cnpj: '51.254.418/0001-66',
    code: 'PAR-MG',
    city: 'Paracatu',
    state: 'MG',
    isHeadquarter: false
  },
  {
    id: 'op-parelhas',
    name: 'Polo Parelhas',
    corporateName: 'POLO PARELHAS PROMOCAO DE VENDAS LTDA',
    cnpj: '41.250.544/0001-99',
    code: 'PRL-RN',
    city: 'Parelhas',
    state: 'RN',
    isHeadquarter: false
  },
  {
    id: 'op-patos',
    name: 'Polo Patos',
    corporateName: 'POLO PATOS PROMOCAO DE VENDAS LTDA',
    cnpj: '48.286.909/0001-84',
    code: 'PAT-PB',
    city: 'Patos',
    state: 'PB',
    isHeadquarter: true
  },
  {
    id: 'op-trairi',
    name: 'Polo Trairi',
    corporateName: 'POLO TRAIRI PROMOCAO DE VENDAS LTDA',
    cnpj: '58.336.294/0001-07',
    code: 'TRC-CE',
    city: 'Trairi',
    state: 'CE',
    isHeadquarter: false
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-comercial',
    code: '',
    name: 'Comercial',
    costCenter: 'CC-3010',
    managerName: 'Sócios e Coordenadores Comerciais',
    activeCount: 35
  },
  {
    id: 'dept-logistica',
    code: '',
    name: 'Logística',
    costCenter: 'CC-2040',
    managerName: 'José Lenildo Barbosa Leite da Silva',
    activeCount: 12
  },
  {
    id: 'dept-interno',
    code: '',
    name: 'Interno',
    costCenter: 'CC-1010',
    managerName: 'Sem gestor da área',
    activeCount: 2
  }
];

export const INITIAL_POSITIONS: JobPosition[] = [
  {
    id: 'pos-socio',
    code: 'SOCIO',
    title: 'Sócio(a)',
    cboCode: '1210-10',
    salaryRangeMin: 12000,
    salaryRangeMax: 25000,
    level: 'Diretoria'
  },
  {
    id: 'pos-coordenador-comercial',
    code: 'COORD-COM',
    title: 'Coordenador(a) Comercial',
    cboCode: '1423-05',
    salaryRangeMin: 5500,
    salaryRangeMax: 8500,
    level: 'Coordenação'
  },
  {
    id: 'pos-coordenador-logistico',
    code: 'COORD-LOG',
    title: 'Coordenador Logístico',
    cboCode: '1423-10',
    salaryRangeMin: 5500,
    salaryRangeMax: 8500,
    level: 'Coordenação'
  },
  {
    id: 'pos-agente-comercial',
    code: 'AGT-COM',
    title: 'Agente Comercial Externo',
    cboCode: '3541-25',
    salaryRangeMin: 2200,
    salaryRangeMax: 4500,
    level: 'Operacional'
  },
  {
    id: 'pos-green-angel',
    code: 'GRN-ANG',
    title: 'Green Angel (Operador Logístico)',
    cboCode: '3143-05',
    salaryRangeMin: 2500,
    salaryRangeMax: 4800,
    level: 'Técnico / Campo'
  },
  {
    id: 'pos-analista-gg',
    code: 'ANL-GP',
    title: 'Analista de Gestão & Pessoas',
    cboCode: '4110-10',
    salaryRangeMin: 3500,
    salaryRangeMax: 5500,
    level: 'Pleno'
  },
  {
    id: 'pos-analista-adm',
    code: 'ANL-ADM',
    title: 'Analista Adm-Financeiro',
    cboCode: '4110-15',
    salaryRangeMin: 3500,
    salaryRangeMax: 5500,
    level: 'Pleno'
  },
  {
    id: 'pos-estagiario',
    code: 'ESTAG',
    title: 'Estágio Logística e Comercial',
    cboCode: '4110-10',
    salaryRangeMin: 1200,
    salaryRangeMax: 1800,
    level: 'Estágio'
  }
];

export const INITIAL_COLLABORATORS: CollaboratorProfile[] = ALL_REAL_COLLABORATORS;

export const INITIAL_EMPLOYEES = INITIAL_COLLABORATORS.map(c => ({
  id: c.id,
  registrationNumber: c.registrationNumber,
  cpf: c.cpf,
  fullName: c.fullName,
  preferredName: c.preferredName,
  email: c.email,
  phone: c.phone,
  branchId: c.branchId,
  departmentId: c.departmentId,
  departmentName: c.departmentName,
  positionId: c.positionId,
  positionTitle: c.positionTitle,
  contractType: c.contractType as any,
  admissionDate: c.admissionDate,
  status: c.status === 'EM_FERIAS' ? 'FERIAS' as any : 'ATIVO' as any,
  workSchedule: c.workSchedule,
  directSupervisor: c.directSupervisor
}));

export const INITIAL_VACATION_REQUESTS: VacationRequest[] = [
  {
    id: 'vr-101',
    collaboratorId: 'colab-1',
    collaboratorName: 'Anthony Mario Duarte',
    collaboratorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    collaboratorPosition: 'Sócio',
    branchName: 'Polo Patos',
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    daysCount: 15,
    abonoDays: 0,
    advance13th: false,
    status: 'APROVACAO_LIDER',
    requestDate: '2026-08-15',
    observations: 'Primeiro período de 15 dias planejado com o time comercial.'
  },
  {
    id: 'vr-102',
    collaboratorId: 'colab-2',
    collaboratorName: 'Rodrigo Alcantara Nunes',
    collaboratorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    collaboratorPosition: 'Coordenador',
    branchName: 'Polo Paracatu',
    startDate: '2026-09-10',
    endDate: '2026-09-29',
    daysCount: 20,
    abonoDays: 10,
    advance13th: true,
    status: 'APROVACAO_RH',
    requestDate: '2026-08-10',
    leaderApprovalDate: '2026-08-12',
    observations: 'Gozo de 20 dias com abono pecuniário de 10 dias.'
  },
  {
    id: 'vr-103',
    collaboratorId: 'colab-3',
    collaboratorName: 'Aline Barbosa Fontes',
    collaboratorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    collaboratorPosition: 'Agente Comercial',
    branchName: 'Polo Parelhas',
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    daysCount: 15,
    abonoDays: 0,
    advance13th: false,
    status: 'DOCUMENTACAO',
    requestDate: '2026-08-01',
    leaderApprovalDate: '2026-08-03',
    hrApprovalDate: '2026-08-05',
    observations: 'Aviso de férias gerado, aguardando assinatura digital.'
  },
  {
    id: 'vr-104',
    collaboratorId: 'colab-6',
    collaboratorName: 'Beatriz Farias Mendonça',
    collaboratorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    collaboratorPosition: 'Analista',
    branchName: 'Polo Limoeiro do Norte',
    startDate: '2026-11-03',
    endDate: '2026-11-22',
    daysCount: 20,
    abonoDays: 0,
    advance13th: true,
    status: 'APROVADO',
    requestDate: '2026-07-20',
    leaderApprovalDate: '2026-07-22',
    hrApprovalDate: '2026-07-25',
    observations: 'Documentação 100% assinada e programada na folha.'
  },
  {
    id: 'vr-105',
    collaboratorId: 'colab-4',
    collaboratorName: 'Carlos Eduardo Ramos',
    collaboratorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    collaboratorPosition: 'Coordenador',
    branchName: 'Polo Apodi',
    startDate: '2026-08-01',
    endDate: '2026-08-30',
    daysCount: 30,
    abonoDays: 0,
    advance13th: false,
    status: 'EM_FERIAS',
    requestDate: '2026-06-15',
    leaderApprovalDate: '2026-06-18',
    hrApprovalDate: '2026-06-20',
    observations: 'Em gozo regular durante o mês de Agosto.'
  }
];

export const INITIAL_ELECTRONIC_DOCUMENTS: ElectronicDocument[] = [];

export const INITIAL_PAYROLL_MONTHS: PayrollMonthRecord[] = [
  {
    id: 'pay-202608',
    competencyMonth: 'Agosto / 2026',
    month: 8,
    year: 2026,
    businessDays: 21,
    dsrDays: 5,
    model: 'Geral - Todos os Polos',
    status: 'RASCUNHO',
    totalGross: 52400.00,
    totalNet: 42100.00,
    collaboratorsCount: 8,
    events: [
      {
        collaboratorId: 'colab-1',
        collaboratorName: 'Anthony Mario Duarte',
        registrationNumber: 'SCL-01042',
        positionTitle: 'Sócio',
        departmentName: 'Comercial',
        costCenter: 'CC-3010',
        branchName: 'Polo Patos',
        baseSalary: 14500.00,
        additionalHazardPay: 0,
        additionalNightPay: 0,
        overtimePay: 0,
        bonusPay: 2500.00,
        commissionPay: 3200.00,
        grossTotal: 20200.00,
        inssDiscount: 908.86,
        irrfDiscount: 3820.15,
        benefitsDiscounts: { vrVa: 42.50, vt: 0, healthPlan: 78.00, other: 0 },
        netSalary: 15350.49,
        cajuFlexMonthlyRecharge: 0,
        hoursWorked: 176,
        daysWorked: 21,
        status: 'CONFERIDO'
      },
      {
        collaboratorId: 'colab-2',
        collaboratorName: 'Rodrigo Alcantara Nunes',
        registrationNumber: 'SCL-01089',
        positionTitle: 'Coordenador',
        departmentName: 'Comercial',
        costCenter: 'CC-3010',
        branchName: 'Polo Paracatu',
        baseSalary: 8200.00,
        additionalHazardPay: 0,
        additionalNightPay: 0,
        overtimePay: 0,
        bonusPay: 1200.00,
        commissionPay: 1800.00,
        grossTotal: 11200.00,
        inssDiscount: 850.40,
        irrfDiscount: 1450.20,
        benefitsDiscounts: { vrVa: 42.50, vt: 0, healthPlan: 68.00, other: 0 },
        netSalary: 8788.90,
        cajuFlexMonthlyRecharge: 0,
        hoursWorked: 176,
        daysWorked: 21,
        status: 'CONFERIDO'
      },
      {
        collaboratorId: 'colab-3',
        collaboratorName: 'Aline Barbosa Fontes',
        registrationNumber: 'SCL-01124',
        positionTitle: 'Agente Comercial',
        departmentName: 'Comercial',
        costCenter: 'CC-3010',
        branchName: 'Polo Parelhas',
        baseSalary: 3200.00,
        additionalHazardPay: 0,
        additionalNightPay: 0,
        overtimePay: 180.00,
        bonusPay: 800.00,
        commissionPay: 1450.00,
        grossTotal: 5630.00,
        inssDiscount: 520.10,
        irrfDiscount: 290.50,
        benefitsDiscounts: { vrVa: 42.50, vt: 0, healthPlan: 48.00, other: 0 },
        netSalary: 4728.90,
        cajuFlexMonthlyRecharge: 0,
        hoursWorked: 176,
        daysWorked: 21,
        status: 'CONFERIDO'
      },
      {
        collaboratorId: 'colab-7',
        collaboratorName: 'Gabriel Lindoso Pinheiro',
        registrationNumber: 'SCL-01290',
        positionTitle: 'Green Angel',
        departmentName: 'Logística',
        costCenter: 'CC-2040',
        branchName: 'Polo Macau',
        baseSalary: 2900.00,
        additionalHazardPay: 0,
        additionalNightPay: 0,
        overtimePay: 210.00,
        bonusPay: 400.00,
        commissionPay: 0,
        grossTotal: 3510.00,
        inssDiscount: 320.12,
        irrfDiscount: 110.40,
        benefitsDiscounts: { vrVa: 42.50, vt: 0, healthPlan: 0, other: 0 },
        netSalary: 3036.98,
        cajuFlexMonthlyRecharge: 0,
        hoursWorked: 176,
        daysWorked: 21,
        status: 'CONFERIDO'
      }
    ]
  },
  {
    id: 'pay-202607',
    competencyMonth: 'Julho / 2026',
    month: 7,
    year: 2026,
    businessDays: 23,
    dsrDays: 4,
    model: 'Geral - Todos os Polos',
    status: 'ENVIADA_CONTABILIDADE',
    totalGross: 51200.00,
    totalNet: 41800.00,
    collaboratorsCount: 8,
    sentToAccountingAt: '2026-07-31 16:40',
    accountingProviderName: 'Domínio Thomson Reuters / Escritório Parceiro',
    events: []
  }
];

export const INITIAL_SMART_REMINDERS: SmartReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Atenção: Vencimento de ASO (Exame Periódico)',
    category: 'ASO',
    collaboratorName: 'Gabriel Lindoso Pinheiro',
    collaboratorId: 'colab-7',
    branchName: 'Polo Macau',
    targetDate: '2026-09-10',
    alertDaysBefore: 20,
    status: 'ATIVO',
    urgency: 'ALTA',
    description: 'ASO periódico vence em menos de 30 dias. Agendar consulta clínica ocupacional.'
  },
  {
    id: 'rem-2',
    title: 'Alerta de Equipamento: Celular Corporativo & Chip Stone',
    category: 'EPI',
    collaboratorName: 'Anthony Mario Duarte',
    collaboratorId: 'colab-1',
    branchName: 'Polo Patos',
    targetDate: '2026-08-30',
    alertDaysBefore: 10,
    status: 'ATIVO',
    urgency: 'MEDIA',
    description: 'Revisão periódica de termo de celular corporativo e linha comercial.'
  },
  {
    id: 'rem-3',
    title: 'Vencimento do 1º Período de Experiência (45 dias)',
    category: 'EXPERIENCIA',
    collaboratorName: 'Thais Maria Silva',
    collaboratorId: 'colab-8',
    branchName: 'Polo João Câmara',
    targetDate: '2026-08-25',
    alertDaysBefore: 5,
    status: 'ATIVO',
    urgency: 'ALTA',
    description: 'Primeiro ciclo de estágio/experiência encerra dia 25/08. Gestor direto deve validar avaliação.'
  },
  {
    id: 'rem-4',
    title: 'Reunião Quinzenal de Pré-Inventário do Polo',
    category: 'ANIVERSARIO',
    collaboratorName: 'Carlos Eduardo Ramos',
    collaboratorId: 'colab-4',
    branchName: 'Polo Apodi',
    targetDate: '2026-08-28',
    alertDaysBefore: 7,
    status: 'ATIVO',
    urgency: 'NORMAL',
    description: 'Alinhamento de contagem de POS e escala de sábado flexível para Green Angels.'
  },
  {
    id: 'rem-5',
    title: 'Vencimento de Período Concessivo de Férias CLT',
    category: 'FERIAS',
    collaboratorName: 'Anthony Mario Duarte',
    collaboratorId: 'colab-1',
    branchName: 'Polo Patos',
    targetDate: '2026-01-31',
    alertDaysBefore: 60,
    status: 'ATIVO',
    urgency: 'NORMAL',
    description: 'Saldo de 15 dias deve ser gozado antes do limite de concessão para evitar pagamento em dobro.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-20 11:45:12',
    userId: 'usr-admin',
    userName: 'Aysla Mendes',
    userRole: 'Administrador do Sistema',
    category: 'SYSTEM',
    action: 'Estruturação dos 8 Polos Operacionais',
    targetEntity: 'Core System',
    targetId: 'SYS-ROOT',
    ipAddress: '192.168.1.10',
    details: 'Configuração dos 8 polos (Apodi, João Câmara, Limoeiro, Macau, Paracatu, Parelhas, Patos, Trairi) e jornada OWN IT.'
  },
  {
    id: 'log-102',
    timestamp: '2026-08-20 10:30:00',
    userId: 'usr-admin',
    userName: 'Rodrigo Alcantara',
    userRole: 'Gestor de RH',
    category: 'PERMISSION',
    action: 'Auditoria de Acessos RBAC',
    targetEntity: 'Perfil Operacional',
    targetId: 'ROLE-DP-ANALYST',
    ipAddress: '192.168.1.14',
    details: 'Validação de permissões para preparação de folha e comissionamento.'
  },
  {
    id: 'log-103',
    timestamp: '2026-08-20 09:12:44',
    userId: 'usr-dp',
    userName: 'Aline Fontes',
    userRole: 'Analista de DP',
    category: 'PAYROLL',
    action: 'Abertura de Competência',
    targetEntity: 'Competência 08/2026',
    targetId: 'COMP-202608',
    ipAddress: '192.168.2.33',
    details: 'Parâmetros de fechamento prévio e conferência de rubricas sincronizados.'
  }
];

export const AVAILABLE_USERS: UserProfile[] = [
  {
    id: 'usr-admin',
    name: 'Aysla Mendes',
    email: 'aysla.mendes@querostone.com.br',
    role: 'ADMIN',
    roleTitle: 'Gestão & Pessoas Master',
    department: 'Interno (G&P, Financeiro & Backoffice)',
    registrationNumber: 'SCL-ADM001',
    permissions: [
      'people:read', 'people:write',
      'dp:read', 'dp:write',
      'recruitment:read', 'recruitment:write',
      'reports:read', 'reports:export',
      'settings:read', 'settings:write',
      'audit:read'
    ]
  },
  {
    id: 'usr-dp',
    name: 'Aline Fontes',
    email: 'aline.fontes@querostone.com.br',
    role: 'DP_ANALYST',
    roleTitle: 'Analista de Gestão & Pessoas',
    department: 'Interno (G&P, Financeiro & Backoffice)',
    registrationNumber: 'SCL-01124',
    permissions: [
      'people:read',
      'dp:read', 'dp:write',
      'reports:read', 'reports:export'
    ]
  },
  {
    id: 'usr-hr',
    name: 'Rodrigo Alcantara',
    email: 'rodrigo.alcantara@querostone.com.br',
    role: 'HR_MANAGER',
    roleTitle: 'Coordenador Comercial',
    department: 'Comercial',
    registrationNumber: 'SCL-01089',
    permissions: [
      'people:read', 'people:write',
      'recruitment:read', 'recruitment:write',
      'reports:read', 'reports:export'
    ]
  }
];
