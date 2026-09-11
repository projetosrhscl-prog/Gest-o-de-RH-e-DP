import { CollaboratorProfile, ContractType, EmploymentStatus } from '../types/collaborator';
import { getOfficialVacationsForCollaborator, OFFICIAL_ACCOUNTANT_VACATIONS } from './accountantVacationData';

export interface RawColabData {
  id: string;
  fullName: string;
  preferredName?: string;
  cpf: string;
  email: string;
  phone: string;
  poloCode: 'apodi' | 'joaocamara' | 'limoeiro' | 'macau' | 'paracatu' | 'parelhas' | 'patos' | 'trairi' | 'interno';
  roleType: 'AGENTE_COMERCIAL' | 'COORDENADOR_COMERCIAL' | 'GREEN_ANGEL' | 'COORDENADOR_LOGISTICO' | 'SOCIO' | 'ANALISTA_GG' | 'ANALISTA_ADM' | 'ESTAGIARIO';
  admissionDate: string;
  birthDate: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  shirtSize?: string;
  favoriteCake?: string;
  pixKey?: string;
  bankInfo?: {
    bankName?: string;
    agency?: string;
    accountNumber?: string;
  };
  gender: 'Masculino' | 'Feminino';
  avatarUrl?: string;
}

export const POLO_INFO: Record<string, { id: string; name: string }> = {
  apodi: { id: 'op-apodi', name: 'Polo Apodi' },
  joaocamara: { id: 'op-joaocamara', name: 'Polo João Câmara' },
  limoeiro: { id: 'op-limoeiro', name: 'Polo Limoeiro do Norte' },
  macau: { id: 'op-macau', name: 'Polo Macau' },
  paracatu: { id: 'op-paracatu', name: 'Polo Paracatu' },
  parelhas: { id: 'op-parelhas', name: 'Polo Parelhas' },
  patos: { id: 'op-patos', name: 'Polo Patos' },
  trairi: { id: 'op-trairi', name: 'Polo Trairi' },
  interno: { id: 'op-patos', name: 'Sede / Interno' },
};

function formatPreferred(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export function buildProfile(raw: RawColabData, index: number): CollaboratorProfile {
  const polo = POLO_INFO[raw.poloCode] || POLO_INFO.patos;
  const pref = raw.preferredName || formatPreferred(raw.fullName);

  let departmentId = 'dept-comercial';
  let departmentName = 'Comercial';
  let costCenter = 'CC-3010';
  let positionId = 'pos-agente-comercial';
  let positionTitle = 'Agente Comercial Externo';
  let seniority: CollaboratorProfile['seniority'] = 'Operacional';
  let salary = 3200.00;
  let contractType: ContractType = 'CLT';
  let directSupervisor = 'Mateus Cavalcante Ramos';

  switch (raw.roleType) {
    case 'AGENTE_COMERCIAL':
      departmentId = 'dept-comercial';
      departmentName = 'Comercial';
      costCenter = 'CC-3010';
      positionId = 'pos-agente-comercial';
      positionTitle = 'Agente Comercial Externo';
      seniority = 'Operacional';
      salary = 2850.00;
      if (raw.poloCode === 'apodi') directSupervisor = 'Gilvan Dantas Junior';
      else if (raw.poloCode === 'joaocamara') directSupervisor = 'Denyeivisson da Silva Freire';
      else if (raw.poloCode === 'limoeiro') directSupervisor = 'Mateus Cavalcante Ramos';
      else if (raw.poloCode === 'parelhas') directSupervisor = 'Luciana Azevedo do Nascimento';
      else if (raw.poloCode === 'paracatu') directSupervisor = 'Sérgio Fernandes Mendonça Filho';
      else if (raw.poloCode === 'trairi') directSupervisor = 'Fernanda Letícia de Vasconcelos Medeiros';
      else if (raw.poloCode === 'patos') directSupervisor = 'Uderlan Rodrigues de França';
      else directSupervisor = 'Coordenação Comercial';
      break;

    case 'COORDENADOR_COMERCIAL':
      departmentId = 'dept-comercial';
      departmentName = 'Comercial';
      costCenter = 'CC-3010';
      positionId = 'pos-coordenador-comercial';
      positionTitle = 'Coordenador(a) Comercial';
      seniority = 'Coordenação';
      salary = 6800.00;
      directSupervisor = 'Sócios do Polo';
      break;

    case 'GREEN_ANGEL':
      departmentId = 'dept-logistica';
      departmentName = 'Logística';
      costCenter = 'CC-2040';
      positionId = 'pos-green-angel';
      positionTitle = 'Green Angel';
      seniority = 'Técnico / Campo';
      salary = 2950.00;
      directSupervisor = 'José Lenildo Barbosa Leite da Silva';
      break;

    case 'COORDENADOR_LOGISTICO':
      departmentId = 'dept-logistica';
      departmentName = 'Logística';
      costCenter = 'CC-2040';
      positionId = 'pos-coordenador-logistico';
      positionTitle = 'Coordenador Logístico';
      seniority = 'Coordenação';
      salary = 6500.00;
      directSupervisor = 'Diretoria';
      break;

    case 'SOCIO':
      departmentId = 'dept-comercial';
      departmentName = 'Comercial';
      costCenter = 'CC-3010';
      positionId = 'pos-socio';
      positionTitle = 'Sócio(a)';
      seniority = 'Diretoria';
      salary = 15000.00;
      directSupervisor = 'Conselho de Sócios';
      break;

    case 'ANALISTA_GG':
      departmentId = 'dept-interno';
      departmentName = 'Interno';
      costCenter = 'CC-1010';
      positionId = 'pos-analista-gg';
      positionTitle = 'Analista de Gestão & Pessoas';
      seniority = 'Pleno';
      salary = 4300.00;
      directSupervisor = 'Não possui gestor da área';
      break;

    case 'ANALISTA_ADM':
      departmentId = 'dept-interno';
      departmentName = 'Interno';
      costCenter = 'CC-1010';
      positionId = 'pos-analista-adm';
      positionTitle = 'Analista Adm-Financeiro';
      seniority = 'Pleno';
      salary = 4100.00;
      directSupervisor = 'Não possui gestor da área';
      break;

    case 'ESTAGIARIO':
      departmentId = 'dept-logistica';
      departmentName = 'Logística';
      costCenter = 'CC-2040';
      positionId = 'pos-estagiario';
      positionTitle = 'Estágio Logística e Comercial';
      seniority = 'Estágio';
      salary = 1400.00;
      contractType = 'ESTAGIO';
      directSupervisor = 'José Lenildo Barbosa Leite da Silva';
      break;
  }

  const avatar = raw.avatarUrl || '';

  return {
    id: raw.id,
    registrationNumber: (() => {
      const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const official = OFFICIAL_ACCOUNTANT_VACATIONS.find(o => norm(o.fullName) === norm(raw.fullName));
      return official ? `MAT-${official.employeeCode}` : `SCL-${String(1010 + index).padStart(5, '0')}`;
    })(),
    cpf: raw.cpf,
    rg: `${Math.floor(1000000 + Math.random() * 8999999)}`,
    rgIssuer: 'SSP',
    fullName: raw.fullName,
    preferredName: pref,
    email: raw.email,
    phone: raw.phone,
    avatarUrl: avatar,
    bio: `${positionTitle} no ${polo.name}. Integrante do time SCL Operações.`,
    skills: raw.roleType.includes('COMERCIAL') 
      ? ['Negociação', 'Vendas Consultivas', 'Atendimento Stone', 'Prospecção PAP', 'Relacionamento B2B']
      : raw.roleType.includes('LOGISTICO') || raw.roleType === 'GREEN_ANGEL'
      ? ['Roteirização', 'Instalação de POS', 'Logística Reversa', 'Green Angel', 'SLA de Atendimento']
      : raw.roleType.includes('SOCIO')
      ? ['Gestão Estratégica', 'Liderança de Polo', 'Expansão Comercial', 'Governança']
      : ['Gestão de Pessoas', 'Rotinas de DP', 'Controladoria', 'Auditoria'],
    branchId: polo.id,
    branchName: polo.name,
    departmentId: departmentId,
    departmentName: departmentName,
    costCenter: costCenter,
    positionId: positionId,
    positionTitle: positionTitle,
    seniority: seniority,
    directSupervisor: directSupervisor,
    admissionDate: raw.admissionDate,
    contractType: contractType,
    status: 'EM_ATIVIDADE',
    salary: salary,
    paymentMethod: 'TRANSFERENCIA_BANCARIA',
    workSchedule: raw.roleType === 'ESTAGIARIO' ? '30h semanais (08:00 às 14:00)' : '44h semanais (08:00 às 17:48)',
    personalData: {
      birthDate: raw.birthDate,
      gender: raw.gender,
      maritalStatus: 'Solteiro(a)',
      nationality: 'Brasileira',
      address: raw.address,
      shirtSize: raw.shirtSize || 'M',
      favoriteCake: raw.favoriteCake || 'Chocolate',
      emergencyContact: {
        name: 'Contato Familiar',
        phone: raw.phone,
        relationship: 'Familiar'
      }
    },
    bankAccount: {
      bankName: raw.bankInfo?.bankName || 'Banco do Brasil',
      bankCode: '001',
      agency: raw.bankInfo?.agency || '1234',
      accountNumber: raw.bankInfo?.accountNumber || `${Math.floor(10000 + Math.random() * 90000)}-1`,
      accountType: 'CORRENTE',
      pixKey: raw.pixKey || raw.cpf
    },
    dependents: [],
    benefits: [
      { id: `b-${raw.id}-1`, name: 'Vale Alimentação / Caju', type: 'VA', monthlyValue: 850.00, discountPercentage: 5, provider: 'Caju', status: 'ATIVO' },
      { id: `b-${raw.id}-2`, name: 'Seguro de Vida em Grupo', type: 'OUTRO', monthlyValue: 45.00, discountPercentage: 0, provider: 'Porto Seguro', status: 'ATIVO' },
      { id: `b-${raw.id}-3`, name: 'Plano de Saúde Unimed', type: 'SAUDE', monthlyValue: 380.00, discountPercentage: 10, provider: 'Unimed', status: 'ATIVO' }
    ],
    careerHistory: [
      {
        id: `ch-${raw.id}-1`,
        positionTitle: positionTitle,
        departmentName: departmentName,
        salary: salary,
        startDate: raw.admissionDate,
        reason: 'ADMISSAO'
      }
    ],
    vacationPeriods: getOfficialVacationsForCollaborator(raw.fullName) || [
      {
        id: `vac-${raw.id}-1`,
        startDate: raw.admissionDate,
        endDate: '2027-02-28',
        limitConcessionDate: '2027-01-31',
        totalDays: 30,
        acquiredDays: 10,
        takenDays: 0,
        plannedDays: 0,
        abonoDays: 0,
        remainingBalance: 30,
        status: 'ADQUIRINDO'
      }
    ],
    epis: [],
    disciplinaryActions: [],
    medicalExams: [
      {
        id: `med-${raw.id}-1`,
        type: 'ADMISSIONAL',
        examDate: raw.admissionDate,
        validUntil: '2027-08-31',
        clinicName: 'Clínica Ocupacional Polo Credenciada',
        result: 'APTO',
        status: 'EM_DIA'
      }
    ],
    onboardingChecklist: [
      { task: 'Documentação Admissional Aprovada', completed: true, date: raw.admissionDate },
      { task: 'ASO Admissional Realizado', completed: true, date: raw.admissionDate },
      { task: 'Entrega de Crachá e Credenciais Stone', completed: true, date: raw.admissionDate }
    ],
    trainingEnrollments: [
      {
        id: `tr-${raw.id}-1`,
        trainingId: 'tr-onboarding-culture',
        trainingTitle: 'Onboarding Cultural SCL & Código de Conduta',
        enrolledAt: raw.admissionDate,
        status: 'CONCLUIDO',
        completedAt: raw.admissionDate,
        score: 95
      },
      {
        id: `tr-${raw.id}-2`,
        trainingId: 'tr-stone-excellence',
        trainingTitle: 'Treinamento de Excelência Operacional Stone',
        enrolledAt: raw.admissionDate,
        status: 'CONCLUIDO',
        completedAt: raw.admissionDate,
        score: 98
      }
    ]
  };
}

/**
 * Relação completa dos 49 Colaboradores SCL alocados por Polo e Função
 */
export const RAW_COLLABORATORS: RawColabData[] = [
  // ===================== POLO APODI =====================
  {
    id: 'colab-apodi-01',
    fullName: 'Gilvan Dantas Junior',
    preferredName: 'Gilvan Dantas',
    cpf: '704.377.754-29',
    email: 'gilvan.djunior@querostone.com.br',
    phone: '(84) 99122-3001',
    poloCode: 'apodi',
    roleType: 'SOCIO',
    admissionDate: '2021-08-13',
    birthDate: '1990-04-12',
    gender: 'Masculino',
    address: { street: 'Rua Marechal Deodoro', number: '120', neighborhood: 'Centro', city: 'Apodi', state: 'RN', zipCode: '59700-000' },
    shirtSize: 'G', favoriteCake: 'Cenoura com Chocolate', pixKey: '704.377.754-29',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0853', accountNumber: '24560-1' }
  },
  {
    id: 'colab-apodi-02',
    fullName: 'João Paulo de Menezes',
    preferredName: 'João Paulo',
    cpf: '087.992.014-96',
    email: 'joao.pmenezes@querostone.com.br',
    phone: '(84) 99611-4022',
    poloCode: 'apodi',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-04-06',
    birthDate: '1998-07-22',
    gender: 'Masculino',
    address: { street: 'Rua Governador Dix-Sept Rosado', number: '340', neighborhood: 'Portal dos Olhos D’Água', city: 'Apodi', state: 'RN', zipCode: '59700-000' },
    shirtSize: 'M', favoriteCake: 'Chocolate', pixKey: '087.992.014-96',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '8839201-4' }
  },
  {
    id: 'colab-apodi-03',
    fullName: 'Pedro Bores Candido de Oliveira Mesquita',
    preferredName: 'Pedro Bores',
    cpf: '110.915.714-22',
    email: 'pedro.mesquita@querostone.com.br',
    phone: '(84) 99823-1190',
    poloCode: 'apodi',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2024-07-01',
    birthDate: '1997-11-05',
    gender: 'Masculino',
    address: { street: 'Av. Moacyr Góis', number: '78', neighborhood: 'Centro', city: 'Apodi', state: 'RN', zipCode: '59700-000' },
    shirtSize: 'G', favoriteCake: 'Red Velvet', pixKey: '110.915.714-22',
    bankInfo: { bankName: 'Banco Inter', agency: '0001', accountNumber: '4410293-8' }
  },
  {
    id: 'colab-apodi-04',
    fullName: 'Ricardo Martins Tavares Junior',
    preferredName: 'Ricardo Tavares',
    cpf: '067.304.784-97',
    email: 'ricardo.junior@querostone.com.br',
    phone: '(84) 99934-8821',
    poloCode: 'apodi',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2023-08-28',
    birthDate: '1995-02-18',
    gender: 'Masculino',
    address: { street: 'Rua Deputado Manoel Avelino', number: '215', neighborhood: 'Centro', city: 'Apodi', state: 'RN', zipCode: '59700-000' },
    shirtSize: 'M', favoriteCake: 'Maracujá', pixKey: '067.304.784-97',
    bankInfo: { bankName: 'Caixa Econômica', agency: '0754', accountNumber: '01034958-2' }
  },
  {
    id: 'colab-apodi-05',
    fullName: 'Antonio Afranio Nunes Costa',
    preferredName: 'Antonio Afranio',
    cpf: '089.410.294-88',
    email: 'antonio.costa@querostone.com.br',
    phone: '(84) 99877-3310',
    poloCode: 'apodi',
    roleType: 'GREEN_ANGEL',
    admissionDate: '2025-06-13',
    birthDate: '1996-03-12',
    gender: 'Masculino',
    address: { street: 'Rua Marechal Floriano', number: '180', neighborhood: 'Centro', city: 'Apodi', state: 'RN', zipCode: '59700-000' },
    shirtSize: 'G', favoriteCake: 'Chocolate', pixKey: '089.410.294-88',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0853', accountNumber: '33491-2' }
  },
  {
    id: 'colab-apodi-06',
    fullName: 'Erickson Matheus dos Reis Silva',
    preferredName: 'Erickson Reis',
    cpf: '702.910.484-91',
    email: 'erickson.reis@querostone.com.br',
    phone: '(84) 99650-8822',
    poloCode: 'apodi',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2025-03-10',
    birthDate: '1998-11-20',
    gender: 'Masculino',
    address: { street: 'Rua São João', number: '95', neighborhood: 'Portal', city: 'Apodi', state: 'RN', zipCode: '59700-000' },
    shirtSize: 'M', favoriteCake: 'Ninho com Nutella', pixKey: '702.910.484-91',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '7729104-1' }
  },

  // ===================== POLO JOÃO CÂMARA =====================
  {
    id: 'colab-jc-01',
    fullName: 'Ridon Dantas Borges Filho',
    preferredName: 'Ridon Dantas',
    cpf: '075.406.974-58',
    email: 'ridon.dantas@querostone.com.br',
    phone: '(84) 99105-7733',
    poloCode: 'joaocamara',
    roleType: 'SOCIO',
    admissionDate: '2019-11-01',
    birthDate: '1988-09-14',
    gender: 'Masculino',
    address: { street: 'Av. Alexandre Câmara', number: '500', neighborhood: 'Centro', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'GG', favoriteCake: 'Doce de Leite', pixKey: '075.406.974-58',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0714', accountNumber: '18940-3' }
  },
  {
    id: 'colab-jc-02',
    fullName: 'Denyeivisson da Silva Freire',
    preferredName: 'Denyeivisson Freire',
    cpf: '097.397.404-48',
    email: 'denyeivisson.freire@querostone.com.br',
    phone: '(84) 99422-5501',
    poloCode: 'joaocamara',
    roleType: 'COORDENADOR_COMERCIAL',
    admissionDate: '2023-07-17',
    birthDate: '1993-06-30',
    gender: 'Masculino',
    address: { street: 'Rua Jerônimo Câmara', number: '189', neighborhood: 'Centro', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'G', favoriteCake: 'Chocolate Belga', pixKey: '097.397.404-48',
    bankInfo: { bankName: 'Santander', agency: '3045', accountNumber: '13009482-1' }
  },
  {
    id: 'colab-jc-03',
    fullName: 'Abnner da Silva Mendes',
    preferredName: 'Abnner Silva',
    cpf: '124.924.134-03',
    email: 'abnner.mendes@querostone.com.br',
    phone: '(84) 99877-2210',
    poloCode: 'joaocamara',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2025-12-01',
    birthDate: '2000-01-15',
    gender: 'Masculino',
    address: { street: 'Rua Antonio Severiano', number: '45', neighborhood: 'Bela Vista', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'M', favoriteCake: 'Ninho com Nutella', pixKey: '124.924.134-03',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '7729104-5' }
  },
  {
    id: 'colab-jc-04',
    fullName: 'Hiago Felipe Vieira de Lima',
    preferredName: 'Hiago Felipe',
    cpf: '712.034.814-03',
    email: 'hiago.lima@querostone.com.br',
    phone: '(84) 99650-3341',
    poloCode: 'joaocamara',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2025-10-01',
    birthDate: '1999-03-27',
    gender: 'Masculino',
    address: { street: 'Rua da Esperança', number: '112', neighborhood: 'Centro', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'M', favoriteCake: 'Prestígio', pixKey: '712.034.814-03',
    bankInfo: { bankName: 'Banco Inter', agency: '0001', accountNumber: '3391048-2' }
  },
  {
    id: 'colab-jc-05',
    fullName: 'José Mota Da Silva Neto',
    preferredName: 'José Mota',
    cpf: '017.949.684-07',
    email: 'jose.sneto@querostone.com.br',
    phone: '(84) 99912-8874',
    poloCode: 'joaocamara',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2022-05-25',
    birthDate: '1994-08-10',
    gender: 'Masculino',
    address: { street: 'Rua Pedro Torquato', number: '88', neighborhood: 'Centro', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'G', favoriteCake: 'Abacaxi com Coco', pixKey: '017.949.684-07',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0714', accountNumber: '29810-7' }
  },
  {
    id: 'colab-jc-06',
    fullName: 'Pedro Paulino Lúcio Neto',
    preferredName: 'Pedro Paulino',
    cpf: '700.342.244-16',
    email: 'pedro.neto@querostone.com.br',
    phone: '(84) 99833-6629',
    poloCode: 'joaocamara',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-04-01',
    birthDate: '1996-12-03',
    gender: 'Masculino',
    address: { street: 'Rua Francisco de Assis', number: '204', neighborhood: 'Cohab', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'M', favoriteCake: 'Floresta Negra', pixKey: '700.342.244-16',
    bankInfo: { bankName: 'Caixa Econômica', agency: '0714', accountNumber: '01294819-0' }
  },
  {
    id: 'colab-jc-07',
    fullName: 'José Rivan Teixeira da Silva',
    preferredName: 'José Rivan',
    cpf: '006.968.164-40',
    email: 'jose.rivan@querostone.com.br',
    phone: '(84) 99981-4433',
    poloCode: 'joaocamara',
    roleType: 'GREEN_ANGEL',
    admissionDate: '2025-06-01',
    birthDate: '1992-05-19',
    gender: 'Masculino',
    address: { street: 'Rua São João', number: '73', neighborhood: 'Centro', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'G', favoriteCake: 'Cenoura com Chocolate', pixKey: '006.968.164-40',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '9910482-3' }
  },
  {
    id: 'colab-jc-08',
    fullName: 'Pedro Lucas Aguiar da Silva',
    preferredName: 'Pedro Lucas',
    cpf: '710.902.944-17',
    email: 'pedro.lsilva@querostone.com.br',
    phone: '(84) 99677-1192',
    poloCode: 'joaocamara',
    roleType: 'GREEN_ANGEL',
    admissionDate: '2025-05-01',
    birthDate: '2001-09-08',
    gender: 'Masculino',
    address: { street: 'Rua Senador Georgino Avelino', number: '310', neighborhood: 'Centro', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'M', favoriteCake: 'Limão Siciliano', pixKey: '710.902.944-17',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0714', accountNumber: '33491-0' }
  },
  {
    id: 'colab-jc-10',
    fullName: 'Yanca Clara Silva de Oliveira Barbosa',
    preferredName: 'Yanca Clara',
    cpf: '131.092.484-91',
    email: 'yanca.barbosa@querostone.com.br',
    phone: '(84) 99822-7711',
    poloCode: 'joaocamara',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-07-01',
    birthDate: '2001-04-19',
    gender: 'Feminino',
    address: { street: 'Rua Jerônimo Câmara', number: '205', neighborhood: 'Centro', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'P', favoriteCake: 'Chocolate', pixKey: '131.092.484-91',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '9920148-2' }
  },
  {
    id: 'colab-jc-09',
    fullName: 'Pedro Arthur Palhares de Oliveira',
    preferredName: 'Pedro Arthur',
    cpf: '129.840.104-55',
    email: 'pedro.palhares@querostone.com.br',
    phone: '(84) 99811-3377',
    poloCode: 'joaocamara',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-03-01',
    birthDate: '2000-02-14',
    gender: 'Masculino',
    address: { street: 'Rua da Esperança', number: '240', neighborhood: 'Centro', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'M', favoriteCake: 'Chocolate', pixKey: '129.840.104-55',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '5591024-8' }
  },

  // ===================== POLO LIMOEIRO DO NORTE =====================
  {
    id: 'colab-lim-01',
    fullName: 'Carlos Eduardo Maciel de Souza',
    preferredName: 'Carlos Maciel',
    cpf: '080.878.394-71',
    email: 'carlos.maciel@querostone.com.br',
    phone: '(88) 99112-9900',
    poloCode: 'limoeiro',
    roleType: 'SOCIO',
    admissionDate: '2024-05-01',
    birthDate: '1987-10-25',
    gender: 'Masculino',
    address: { street: 'Rua Coronel Malveira', number: '850', neighborhood: 'Centro', city: 'Limoeiro do Norte', state: 'CE', zipCode: '62930-000' },
    shirtSize: 'G', favoriteCake: 'Chocolate Trufado', pixKey: '080.878.394-71',
    bankInfo: { bankName: 'Bradesco', agency: '1280', accountNumber: '99201-4' }
  },
  {
    id: 'colab-lim-02',
    fullName: 'Mateus Cavalcante Ramos',
    preferredName: 'Mateus Ramos',
    cpf: '708.258.164-59',
    email: 'mateus.ramos@querostone.com.br',
    phone: '(88) 99455-8120',
    poloCode: 'limoeiro',
    roleType: 'COORDENADOR_COMERCIAL',
    admissionDate: '2024-07-01',
    birthDate: '1995-03-14',
    gender: 'Masculino',
    address: { street: 'Rua Francisco Remígio', number: '412', neighborhood: 'Centro', city: 'Limoeiro do Norte', state: 'CE', zipCode: '62930-000' },
    shirtSize: 'M', favoriteCake: 'Ninho com Morango', pixKey: '708.258.164-59',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0458', accountNumber: '48201-9' }
  },
  {
    id: 'colab-lim-03',
    fullName: 'Abner Rafaell Rodrigues Apolonio de Siqueira',
    preferredName: 'Abner Apolonio',
    cpf: '705.918.854-17',
    email: 'abner.siqueira@querostone.com.br',
    phone: '(88) 99841-2099',
    poloCode: 'limoeiro',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2025-07-01',
    birthDate: '1998-04-02',
    gender: 'Masculino',
    address: { street: 'Rua Cândido José de Souza', number: '105', neighborhood: 'Luiz Alves', city: 'Limoeiro do Norte', state: 'CE', zipCode: '62930-000' },
    shirtSize: 'M', favoriteCake: 'Prestígio', pixKey: '705.918.854-17',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '5510294-8' }
  },
  {
    id: 'colab-lim-04',
    fullName: 'Ana Kelvia Bezerra de Matos',
    preferredName: 'Ana Kelvia',
    cpf: '042.500.963-78',
    email: 'ana.kelvia@querostone.com.br',
    phone: '(88) 99632-1088',
    poloCode: 'limoeiro',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2024-07-01',
    birthDate: '1996-09-17',
    gender: 'Feminino',
    address: { street: 'Av. Dom Aureliano Matos', number: '620', neighborhood: 'Centro', city: 'Limoeiro do Norte', state: 'CE', zipCode: '62930-000' },
    shirtSize: 'P', favoriteCake: 'Red Velvet', pixKey: '042.500.963-78',
    bankInfo: { bankName: 'Banco Inter', agency: '0001', accountNumber: '2291048-0' }
  },
  {
    id: 'colab-lim-05',
    fullName: 'Arilson de Freitas Rabelo',
    preferredName: 'Arilson Rabelo',
    cpf: '076.496.983-86',
    email: 'arilson.rabelo@querostone.com.br',
    phone: '(88) 99920-4411',
    poloCode: 'limoeiro',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-06-01',
    birthDate: '1997-12-28',
    gender: 'Masculino',
    address: { street: 'Rua Sabino Guimarães', number: '315', neighborhood: 'Santa Luzia', city: 'Limoeiro do Norte', state: 'CE', zipCode: '62930-000' },
    shirtSize: 'G', favoriteCake: 'Chocolate', pixKey: '076.496.983-86',
    bankInfo: { bankName: 'Caixa Econômica', agency: '0458', accountNumber: '01849201-5' }
  },
  {
    id: 'colab-lim-06',
    fullName: 'Naylane Rívina Bezerra Oliveira',
    preferredName: 'Naylane Oliveira',
    cpf: '077.386.583-71',
    email: 'naylane.oliveira@querostone.com.br',
    phone: '(88) 99781-3302',
    poloCode: 'limoeiro',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-05-01', // Período de Experiência (~70 dias)
    birthDate: '2001-06-11',
    gender: 'Feminino',
    address: { street: 'Rua Sindulfo Chaves', number: '90', neighborhood: 'Centro', city: 'Limoeiro do Norte', state: 'CE', zipCode: '62930-000' },
    shirtSize: 'M', favoriteCake: 'Maracujá com Chocolate', pixKey: '077.386.583-71',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '6619204-1' }
  },
  {
    id: 'colab-lim-07',
    fullName: 'Antonio Alcenir Batista Morais',
    preferredName: 'Antonio Alcenir',
    cpf: '054.336.503-40',
    email: 'antonio.alcenir@querostone.com.br',
    phone: '(88) 99812-7744',
    poloCode: 'limoeiro',
    roleType: 'GREEN_ANGEL',
    admissionDate: '2025-10-01',
    birthDate: '1993-01-20',
    gender: 'Masculino',
    address: { street: 'Rua Inácio Mendes', number: '178', neighborhood: 'Bancários', city: 'Limoeiro do Norte', state: 'CE', zipCode: '62930-000' },
    shirtSize: 'G', favoriteCake: 'Cenoura', pixKey: '054.336.503-40',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0458', accountNumber: '39102-8' }
  },
  {
    id: 'colab-lim-08',
    fullName: 'José Ytalo de Menezes Pereira',
    preferredName: 'José Ytalo',
    cpf: '709.020.924-56',
    email: 'jose.pereira@querostone.com.br',
    phone: '(88) 99654-8800',
    poloCode: 'limoeiro',
    roleType: 'GREEN_ANGEL',
    admissionDate: '2024-10-28',
    birthDate: '1999-08-04',
    gender: 'Masculino',
    address: { street: 'Rua Raimundo Nonato', number: '44', neighborhood: 'Centro', city: 'Limoeiro do Norte', state: 'CE', zipCode: '62930-000' },
    shirtSize: 'M', favoriteCake: 'Doce de Leite', pixKey: '709.020.924-56',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '4491028-6' }
  },
  {
    id: 'colab-lim-09',
    fullName: 'Mayara Isa Maia',
    preferredName: 'Mayara Maia',
    cpf: '098.241.774-60',
    email: 'mayara.maia@querostone.com.br',
    phone: '(88) 99744-1188',
    poloCode: 'limoeiro',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-08-01',
    birthDate: '1999-11-23',
    gender: 'Feminino',
    address: { street: 'Rua Cel. Malveira', number: '412', neighborhood: 'Centro', city: 'Limoeiro do Norte', state: 'CE', zipCode: '62930-000' },
    shirtSize: 'M', favoriteCake: 'Red Velvet', pixKey: '098.241.774-60',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0482', accountNumber: '29481-9' }
  },

  // ===================== POLO MACAU =====================
  {
    id: 'colab-mac-01',
    fullName: 'Jefferson Araújo Pereira',
    preferredName: 'Jefferson Pereira',
    cpf: '130.002.824-67',
    email: 'jefferson.araujo@querostone.com.br',
    phone: '(84) 99612-4091',
    poloCode: 'macau',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2024-08-05',
    birthDate: '1996-05-14',
    gender: 'Masculino',
    address: { street: 'Rua São Pedro', number: '230', neighborhood: 'Valadão', city: 'Macau', state: 'RN', zipCode: '59500-000' },
    shirtSize: 'G', favoriteCake: 'Chocolate', pixKey: '130.002.824-67',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0684', accountNumber: '29104-5' }
  },
  {
    id: 'colab-mac-02',
    fullName: 'Jeyzandra da Silva Virgínio',
    preferredName: 'Jeyzandra Virgínio',
    cpf: '118.864.694-07',
    email: 'jeyzandra.virginio@querostone.com.br',
    phone: '(84) 99877-3390',
    poloCode: 'macau',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2022-03-01',
    birthDate: '1995-11-20',
    gender: 'Feminino',
    address: { street: 'Rua Marechal Deodoro', number: '145', neighborhood: 'Centro', city: 'Macau', state: 'RN', zipCode: '59500-000' },
    shirtSize: 'M', favoriteCake: 'Ninho com Morango', pixKey: '118.864.694-07',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '7749102-3' }
  },
  {
    id: 'colab-mac-03',
    fullName: 'Júlio César Araújo da Costa',
    preferredName: 'Júlio César',
    cpf: '118.895.024-05',
    email: 'devjuliocesarr@gmail.com',
    phone: '(84) 99933-2211',
    poloCode: 'macau',
    roleType: 'ESTAGIARIO',
    admissionDate: '2026-02-26',
    birthDate: '2004-03-18',
    gender: 'Masculino',
    address: { street: 'Rua São José', number: '67', neighborhood: 'Porto de São Pedro', city: 'Macau', state: 'RN', zipCode: '59500-000' },
    shirtSize: 'M', favoriteCake: 'Red Velvet', pixKey: '118.895.024-05',
    bankInfo: { bankName: 'Banco Inter', agency: '0001', accountNumber: '9920194-7' }
  },
  {
    id: 'colab-mac-04',
    fullName: 'Hellen White de Morais Fernandes',
    preferredName: 'Hellen Fernandes',
    cpf: '127.700.414-52',
    email: 'hellen.fernandes@querostone.com.br',
    phone: '(84) 99420-1188',
    poloCode: 'macau',
    roleType: 'GREEN_ANGEL',
    admissionDate: '2026-05-01', // Período de Experiência (~61 dias)
    birthDate: '2000-07-09',
    gender: 'Feminino',
    address: { street: 'Rua Feliciano Tetéu', number: '89', neighborhood: 'Centro', city: 'Macau', state: 'RN', zipCode: '59500-000' },
    shirtSize: 'P', favoriteCake: 'Limão Siciliano', pixKey: '127.700.414-52',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '3391048-5' }
  },
  {
    id: 'colab-mac-05',
    fullName: 'Kelson Felipe dos Santos Rodrigues',
    preferredName: 'Kelson Rodrigues',
    cpf: '095.344.734-05',
    email: 'kelson.rodrigues@querostone.com.br',
    phone: '(84) 99811-9944',
    poloCode: 'macau',
    roleType: 'GREEN_ANGEL',
    admissionDate: '2026-05-01', // Período de Experiência (~55 dias)
    birthDate: '1998-10-12',
    gender: 'Masculino',
    address: { street: 'Rua Frei Miguelinho', number: '190', neighborhood: 'Ilha de Santana', city: 'Macau', state: 'RN', zipCode: '59500-000' },
    shirtSize: 'G', favoriteCake: 'Chocolate Trufado', pixKey: '095.344.734-05',
    bankInfo: { bankName: 'Caixa Econômica', agency: '0684', accountNumber: '01948201-9' }
  },
  {
    id: 'colab-mac-07',
    fullName: 'Gilcelia Campos do Nascimento Ramos',
    preferredName: 'Gilcelia Campos',
    cpf: '124.819.304-88',
    email: 'gilcelia.campos@querostone.com.br',
    phone: '(84) 99411-8822',
    poloCode: 'macau',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-06-01',
    birthDate: '1997-08-14',
    gender: 'Feminino',
    address: { street: 'Rua São Pedro', number: '150', neighborhood: 'Centro', city: 'Macau', state: 'RN', zipCode: '59500-000' },
    shirtSize: 'M', favoriteCake: 'Ninho com Morango', pixKey: '124.819.304-88',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '8491028-1' }
  },
  {
    id: 'colab-mac-06',
    fullName: 'Priscilla Karen de Oliveira Goes',
    preferredName: 'Priscilla Karen',
    cpf: '128.910.294-11',
    email: 'priscilla.goes@querostone.com.br',
    phone: '(84) 99622-1144',
    poloCode: 'macau',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2024-09-09',
    birthDate: '1997-04-18',
    gender: 'Feminino',
    address: { street: 'Rua Manoel Gonçalves', number: '72', neighborhood: 'Centro', city: 'Macau', state: 'RN', zipCode: '59500-000' },
    shirtSize: 'M', favoriteCake: 'Ninho com Nutella', pixKey: '128.910.294-11',
    bankInfo: { bankName: 'Banco Inter', agency: '0001', accountNumber: '5591048-3' }
  },

  // ===================== POLO PARACATU =====================
  {
    id: 'colab-par-01',
    fullName: 'Sérgio Fernandes Mendonça Filho',
    preferredName: 'Sérgio Mendonça',
    cpf: '062.819.444-88',
    email: 'sergio.mendonca@querostone.com.br',
    phone: '(38) 99188-4422',
    poloCode: 'paracatu',
    roleType: 'SOCIO',
    admissionDate: '2021-05-10',
    birthDate: '1989-08-30',
    gender: 'Masculino',
    address: { street: 'Av. Olegário Maciel', number: '720', neighborhood: 'Centro', city: 'Paracatu', state: 'MG', zipCode: '38600-000' },
    shirtSize: 'GG', favoriteCake: 'Doce de Leite com Nozes', pixKey: '062.819.444-88',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0238', accountNumber: '10940-2' }
  },
  {
    id: 'colab-par-02',
    fullName: 'Beatriz Campos Alvarenga',
    preferredName: 'Beatriz Alvarenga',
    cpf: '019.331.646-38',
    email: 'beatriz.alvarenga@querostone.com.br',
    phone: '(38) 99877-1044',
    poloCode: 'paracatu',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-06-01', // Período de Experiência (~66 dias)
    birthDate: '2001-02-14',
    gender: 'Feminino',
    address: { street: 'Rua Goiás', number: '340', neighborhood: 'Paracatuzinho', city: 'Paracatu', state: 'MG', zipCode: '38600-000' },
    shirtSize: 'P', favoriteCake: 'Red Velvet', pixKey: '019.331.646-38',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '8849102-1' }
  },
  {
    id: 'colab-par-03',
    fullName: 'Dinarte Jovelino da Silva',
    preferredName: 'Dinarte Silva',
    cpf: '703.194.444-90',
    email: 'dinarte.silva@querostone.com.br',
    phone: '(38) 99932-8811',
    poloCode: 'paracatu',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2023-08-28',
    birthDate: '1993-04-19',
    gender: 'Masculino',
    address: { street: 'Rua Rio Grande do Sul', number: '115', neighborhood: 'Vila Alvorada', city: 'Paracatu', state: 'MG', zipCode: '38600-000' },
    shirtSize: 'M', favoriteCake: 'Chocolate', pixKey: '703.194.444-90',
    bankInfo: { bankName: 'Sicoob', agency: '4120', accountNumber: '39104-8' }
  },
  {
    id: 'colab-par-04',
    fullName: 'Victor Hugo Silva Mercês',
    preferredName: 'Victor Hugo',
    cpf: '094.973.393-80',
    email: 'victor.merces@querostone.com.br',
    phone: '(38) 99650-2277',
    poloCode: 'paracatu',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2025-08-01',
    birthDate: '1997-10-08',
    gender: 'Masculino',
    address: { street: 'Rua Euridamas Avelar', number: '480', neighborhood: 'Jardim', city: 'Paracatu', state: 'MG', zipCode: '38600-000' },
    shirtSize: 'G', favoriteCake: 'Maracujá', pixKey: '094.973.393-80',
    bankInfo: { bankName: 'Banco Inter', agency: '0001', accountNumber: '6610492-3' }
  },

  // ===================== POLO PARELHAS =====================
  {
    id: 'colab-prl-01',
    fullName: 'Paulo Campelo da Silva Neto',
    preferredName: 'Paulo Campelo',
    cpf: '074.965.684-06',
    email: 'paulo.campelo@querostone.com.br',
    phone: '(84) 99102-3344',
    poloCode: 'parelhas',
    roleType: 'SOCIO',
    admissionDate: '2019-11-01',
    birthDate: '1986-06-18',
    gender: 'Masculino',
    address: { street: 'Av. Mauro Medeiros', number: '600', neighborhood: 'Centro', city: 'Parelhas', state: 'RN', zipCode: '59360-000' },
    shirtSize: 'G', favoriteCake: 'Chocolate com Morango', pixKey: '074.965.684-06',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0758', accountNumber: '19402-7' }
  },
  {
    id: 'colab-prl-02',
    fullName: 'Luciana Azevedo do Nascimento',
    preferredName: 'Luciana Azevedo',
    cpf: '123.408.274-85',
    email: 'luciana.donascimento@querostone.com.br',
    phone: '(84) 99433-7722',
    poloCode: 'parelhas',
    roleType: 'COORDENADOR_COMERCIAL',
    admissionDate: '2023-02-01',
    birthDate: '1994-09-25',
    gender: 'Feminino',
    address: { street: 'Rua Comendador José Zelo', number: '195', neighborhood: 'Centro', city: 'Parelhas', state: 'RN', zipCode: '59360-000' },
    shirtSize: 'M', favoriteCake: 'Ninho com Nutella', pixKey: '123.408.274-85',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '4491028-2' }
  },
  {
    id: 'colab-prl-03',
    fullName: 'Anderson Azevedo da Silva',
    preferredName: 'Anderson Azevedo',
    cpf: '708.846.114-50',
    email: 'anderson.azevedo@querostone.com.br',
    phone: '(84) 99812-3099',
    poloCode: 'parelhas',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-03-01',
    birthDate: '1999-07-12',
    gender: 'Masculino',
    address: { street: 'Rua Manoel Fernandes', number: '80', neighborhood: 'Cruz do Monte', city: 'Parelhas', state: 'RN', zipCode: '59360-000' },
    shirtSize: 'M', favoriteCake: 'Prestígio', pixKey: '708.846.114-50',
    bankInfo: { bankName: 'Banco Inter', agency: '0001', accountNumber: '5510482-9' }
  },
  {
    id: 'colab-prl-04',
    fullName: 'João Rogério de Lucena Júnior',
    preferredName: 'João Rogério',
    cpf: '106.779.534-02',
    email: 'joao.rogerio@querostone.com.br',
    phone: '(84) 99650-7711',
    poloCode: 'parelhas',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2025-10-01',
    birthDate: '1998-03-05',
    gender: 'Masculino',
    address: { street: 'Rua Evaristo Bezerra', number: '142', neighborhood: 'Centro', city: 'Parelhas', state: 'RN', zipCode: '59360-000' },
    shirtSize: 'G', favoriteCake: 'Cenoura com Chocolate', pixKey: '106.779.534-02',
    bankInfo: { bankName: 'Caixa Econômica', agency: '0758', accountNumber: '01849102-4' }
  },
  {
    id: 'colab-prl-05',
    fullName: 'Pedro Henrique de Medeiros Silva',
    preferredName: 'Pedro Henrique',
    cpf: '107.808.054-29',
    email: 'pedro.silva4@querostone.com.br',
    phone: '(84) 99920-8844',
    poloCode: 'parelhas',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-05-01',
    birthDate: '2000-11-28',
    gender: 'Masculino',
    address: { street: 'Rua Maria Antônia', number: '95', neighborhood: 'Ivan Bezerra', city: 'Parelhas', state: 'RN', zipCode: '59360-000' },
    shirtSize: 'M', favoriteCake: 'Doce de Leite', pixKey: '107.808.054-29',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '2291048-7' }
  },
  {
    id: 'colab-prl-06',
    fullName: 'Gustavo Macedo Freire',
    preferredName: 'Gustavo Macedo',
    cpf: '106.175.254-20',
    email: 'g.freire@querostone.com.br',
    phone: '(84) 99877-4400',
    poloCode: 'parelhas',
    roleType: 'GREEN_ANGEL',
    admissionDate: '2025-08-01',
    birthDate: '1997-05-16',
    gender: 'Masculino',
    address: { street: 'Rua Padre Sinval', number: '210', neighborhood: 'Centro', city: 'Parelhas', state: 'RN', zipCode: '59360-000' },
    shirtSize: 'G', favoriteCake: 'Limão', pixKey: '106.175.254-20',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0758', accountNumber: '33104-9' }
  },

  // ===================== POLO PATOS =====================
  {
    id: 'colab-pat-01',
    fullName: 'Uderlan Rodrigues de França',
    preferredName: 'Uderlan França',
    cpf: '088.502.354-45',
    email: 'uderlan.franca@querostone.com.br',
    phone: '(83) 99111-2299',
    poloCode: 'patos',
    roleType: 'SOCIO',
    admissionDate: '2020-11-20',
    birthDate: '1985-12-04',
    gender: 'Masculino',
    address: { street: 'Rua Pedro Firmino', number: '850', neighborhood: 'Brasília', city: 'Patos', state: 'PB', zipCode: '58700-000' },
    shirtSize: 'GG', favoriteCake: 'Floresta Negra', pixKey: '088.502.354-45',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0151', accountNumber: '11094-5' }
  },
  {
    id: 'colab-pat-02',
    fullName: 'José Lenildo Barbosa Leite da Silva',
    preferredName: 'José Lenildo',
    cpf: '100.777.464-90',
    email: 'jose.lenildo@querostone.com.br',
    phone: '(83) 99402-8811',
    poloCode: 'patos',
    roleType: 'COORDENADOR_LOGISTICO',
    admissionDate: '2023-02-08',
    birthDate: '1991-07-21',
    gender: 'Masculino',
    address: { street: 'Rua Horácio Nóbrega', number: '420', neighborhood: 'Belo Horizonte', city: 'Patos', state: 'PB', zipCode: '58704-000' },
    shirtSize: 'G', favoriteCake: 'Chocolate Belga', pixKey: '100.777.464-90',
    bankInfo: { bankName: 'Santander', agency: '1420', accountNumber: '13094812-4' }
  },
  {
    id: 'colab-pat-03',
    fullName: 'Douglas Cavalcante Gomes',
    preferredName: 'Douglas Gomes',
    cpf: '103.230.714-57',
    email: 'douglas.cgomes@querostone.com.br',
    phone: '(83) 99833-2288',
    poloCode: 'patos',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-03-01',
    birthDate: '1998-08-15',
    gender: 'Masculino',
    address: { street: 'Rua Epitácio Pessoa', number: '310', neighborhood: 'Centro', city: 'Patos', state: 'PB', zipCode: '58700-000' },
    shirtSize: 'M', favoriteCake: 'Ninho com Morango', pixKey: '103.230.714-57',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '7710294-5' }
  },
  {
    id: 'colab-pat-04',
    fullName: 'Letícia de Lima Martins Diniz',
    preferredName: 'Letícia Diniz',
    cpf: '706.081.624-00',
    email: 'leticia.diniz@querostone.com.br',
    phone: '(83) 99650-9933',
    poloCode: 'patos',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2025-06-01',
    birthDate: '2000-04-22',
    gender: 'Feminino',
    address: { street: 'Rua Felizardo Leite', number: '180', neighborhood: 'Centro', city: 'Patos', state: 'PB', zipCode: '58700-000' },
    shirtSize: 'P', favoriteCake: 'Red Velvet', pixKey: '706.081.624-00',
    bankInfo: { bankName: 'Banco Inter', agency: '0001', accountNumber: '4491028-1' }
  },
  {
    id: 'colab-pat-05',
    fullName: 'Letícia Mayara Dias Moreira',
    preferredName: 'Letícia Moreira',
    cpf: '107.861.094-08',
    email: 'leticia.dias@querostone.com.br',
    phone: '(83) 99912-4400',
    poloCode: 'patos',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2023-08-16',
    birthDate: '1996-10-31',
    gender: 'Feminino',
    address: { street: 'Av. Severino Cruz', number: '95', neighborhood: 'Santo Antônio', city: 'Patos', state: 'PB', zipCode: '58701-000' },
    shirtSize: 'M', favoriteCake: 'Maracujá', pixKey: '107.861.094-08',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0151', accountNumber: '28401-9' }
  },
  {
    id: 'colab-pat-06',
    fullName: 'Renato Rodrigues Silva Santos',
    preferredName: 'Renato Santos',
    cpf: '105.248.804-84',
    email: 'renato.santos@querostone.com.br',
    phone: '(83) 99877-1122',
    poloCode: 'patos',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2024-06-03',
    birthDate: '1995-01-09',
    gender: 'Masculino',
    address: { street: 'Rua Leôncio Wanderley', number: '240', neighborhood: 'Centro', city: 'Patos', state: 'PB', zipCode: '58700-000' },
    shirtSize: 'G', favoriteCake: 'Cenoura com Chocolate', pixKey: '105.248.804-84',
    bankInfo: { bankName: 'Caixa Econômica', agency: '0151', accountNumber: '01948201-3' }
  },
  {
    id: 'colab-pat-07',
    fullName: 'Kelvys Gomes de Sousa',
    preferredName: 'Kelvys Sousa',
    cpf: '711.399.294-37',
    email: 'kelvys.sousa@querostone.com.br',
    phone: '(83) 99611-7788',
    poloCode: 'patos',
    roleType: 'GREEN_ANGEL',
    admissionDate: '2024-08-12',
    birthDate: '1997-03-29',
    gender: 'Masculino',
    address: { street: 'Rua Solon de Lucena', number: '150', neighborhood: 'Centro', city: 'Patos', state: 'PB', zipCode: '58700-000' },
    shirtSize: 'M', favoriteCake: 'Prestígio', pixKey: '711.399.294-37',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '3391048-9' }
  },
  {
    id: 'colab-pat-08',
    fullName: 'Luana Lucena de Morais',
    preferredName: 'Luana Morais',
    cpf: '704.912.834-01',
    email: 'luana.morais@querostone.com.br',
    phone: '(83) 99822-4411',
    poloCode: 'patos',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2025-10-01',
    birthDate: '1999-05-18',
    gender: 'Feminino',
    address: { street: 'Rua Pedro Firmino', number: '340', neighborhood: 'Centro', city: 'Patos', state: 'PB', zipCode: '58700-000' },
    shirtSize: 'P', favoriteCake: 'Limão', pixKey: '704.912.834-01',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '6610294-4' }
  },
  {
    id: 'colab-pat-09',
    fullName: 'Maria Rosileide Neves Pessoa',
    preferredName: 'Rosileide Pessoa',
    cpf: '068.912.444-22',
    email: 'rosileide.pessoa@querostone.com.br',
    phone: '(83) 99633-5599',
    poloCode: 'patos',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2024-04-22',
    birthDate: '1994-08-14',
    gender: 'Feminino',
    address: { street: 'Rua Rui Barbosa', number: '110', neighborhood: 'Centro', city: 'Patos', state: 'PB', zipCode: '58700-000' },
    shirtSize: 'M', favoriteCake: 'Chocolate com Brigadeiro', pixKey: '068.912.444-22',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0151', accountNumber: '44910-2' }
  },
  {
    id: 'colab-pat-10',
    fullName: 'Pedro Ferreira Leitao Filho',
    preferredName: 'Pedro Leitao',
    cpf: '131.840.294-09',
    email: 'pedro.leitao@querostone.com.br',
    phone: '(83) 99944-1188',
    poloCode: 'patos',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2026-03-01',
    birthDate: '2001-02-20',
    gender: 'Masculino',
    address: { street: 'Av. Epitácio Pessoa', number: '512', neighborhood: 'Belo Horizonte', city: 'Patos', state: 'PB', zipCode: '58704-000' },
    shirtSize: 'G', favoriteCake: 'Maracujá', pixKey: '131.840.294-09',
    bankInfo: { bankName: 'Banco Inter', agency: '0001', accountNumber: '5519204-7' }
  },

  // ===================== POLO TRAIRI =====================
  {
    id: 'colab-tra-01',
    fullName: 'Fernanda Letícia de Vasconcelos Medeiros',
    preferredName: 'Fernanda Medeiros',
    cpf: '108.003.824-80',
    email: 'fernanda.vasconcelos@querostone.com.br',
    phone: '(85) 99120-5588',
    poloCode: 'trairi',
    roleType: 'SOCIO',
    admissionDate: '2023-01-03',
    birthDate: '1991-03-16',
    gender: 'Feminino',
    address: { street: 'Av. Miguel Pinto Ferreira', number: '450', neighborhood: 'Centro', city: 'Trairi', state: 'CE', zipCode: '62690-000' },
    shirtSize: 'P', favoriteCake: 'Red Velvet Especial', pixKey: '108.003.824-80',
    bankInfo: { bankName: 'Banco do Brasil', agency: '2710', accountNumber: '18491-0' }
  },
  {
    id: 'colab-tra-02',
    fullName: 'Maria Helena Freitas Braga de Oliveira',
    preferredName: 'Maria Helena',
    cpf: '065.862.193-96',
    email: 'maria.holiveira@querostone.com.br',
    phone: '(85) 99844-3311',
    poloCode: 'trairi',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2025-05-26',
    birthDate: '1996-06-24',
    gender: 'Feminino',
    address: { street: 'Rua São Francisco', number: '110', neighborhood: 'Centro', city: 'Trairi', state: 'CE', zipCode: '62690-000' },
    shirtSize: 'M', favoriteCake: 'Chocolate', pixKey: '065.862.193-96',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '8810294-6' }
  },
  {
    id: 'colab-tra-03',
    fullName: 'Naelly Kelly Dantas de Oliveira',
    preferredName: 'Naelly Oliveira',
    cpf: '130.920.864-65',
    email: 'naelly.oliveira@querostone.com.br',
    phone: '(85) 99620-8899',
    poloCode: 'trairi',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2024-03-04',
    birthDate: '1999-12-10',
    gender: 'Feminino',
    address: { street: 'Rua José de Alencar', number: '78', neighborhood: 'Boa Esperança', city: 'Trairi', state: 'CE', zipCode: '62690-000' },
    shirtSize: 'P', favoriteCake: 'Ninho com Frutas Vermelhas', pixKey: '130.920.864-65',
    bankInfo: { bankName: 'Banco Inter', agency: '0001', accountNumber: '5591048-3' }
  },
  {
    id: 'colab-tra-04',
    fullName: 'Witalo da Silva Ferreira',
    preferredName: 'Witalo Ferreira',
    cpf: '080.166.643-00',
    email: 'witalo.ferreira@querostone.com.br',
    phone: '(85) 99933-4477',
    poloCode: 'trairi',
    roleType: 'AGENTE_COMERCIAL',
    admissionDate: '2025-03-10',
    birthDate: '1998-09-02',
    gender: 'Masculino',
    address: { street: 'Av. Beira Mar', number: '302', neighborhood: 'Praia de Flecheiras', city: 'Trairi', state: 'CE', zipCode: '62690-000' },
    shirtSize: 'G', favoriteCake: 'Doce de Leite', pixKey: '080.166.643-00',
    bankInfo: { bankName: 'Caixa Econômica', agency: '2710', accountNumber: '01849102-8' }
  },
  {
    id: 'colab-tra-05',
    fullName: 'Gustavo Santos de Carvalho',
    preferredName: 'Gustavo Santos',
    cpf: '087.362.773-39',
    email: 'gustavo.scarvalho@querostone.com.br',
    phone: '(85) 99411-9922',
    poloCode: 'trairi',
    roleType: 'GREEN_ANGEL',
    admissionDate: '2026-04-01', // Período de Experiência (~71 dias)
    birthDate: '2001-08-19',
    gender: 'Masculino',
    address: { street: 'Rua Principal', number: '45', neighborhood: 'Mundaú', city: 'Trairi', state: 'CE', zipCode: '62690-000' },
    shirtSize: 'M', favoriteCake: 'Cenoura com Chocolate', pixKey: '087.362.773-39',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '2210498-5' }
  },

  // ===================== ÁREA INTERNA (G&P E FINANCEIRO) =====================
  {
    id: 'colab-int-01',
    fullName: 'Aysla Candeia Mendes',
    preferredName: 'Aysla Mendes',
    cpf: '125.460.334-41',
    email: 'aysla.mendes@querostone.com.br',
    phone: '(83) 99850-2211',
    poloCode: 'patos',
    roleType: 'ANALISTA_GG',
    admissionDate: '2026-04-01',
    birthDate: '1996-05-23',
    gender: 'Feminino',
    address: { street: 'Rua Pedro Firmino', number: '510', neighborhood: 'Brasília', city: 'Patos', state: 'PB', zipCode: '58700-000' },
    shirtSize: 'M', favoriteCake: 'Chocolate com Frutas Vermelhas', pixKey: '125.460.334-41',
    bankInfo: { bankName: 'Banco do Brasil', agency: '0151', accountNumber: '49201-3' }
  },
  {
    id: 'colab-int-02',
    fullName: 'Nallanda Lorena Silva de Araujo',
    preferredName: 'Nallanda Araujo',
    cpf: '110.919.024-70',
    email: 'nallanda.araujo@querostone.com.br',
    phone: '(84) 99940-1177',
    poloCode: 'joaocamara',
    roleType: 'ANALISTA_ADM',
    admissionDate: '2022-03-01',
    birthDate: '1995-10-14',
    gender: 'Feminino',
    address: { street: 'Rua Coronel Alencastro', number: '130', neighborhood: 'Centro', city: 'João Câmara', state: 'RN', zipCode: '59550-000' },
    shirtSize: 'P', favoriteCake: 'Red Velvet', pixKey: '110.919.024-70',
    bankInfo: { bankName: 'Nubank', agency: '0001', accountNumber: '6610492-8' }
  }
];

export const ALL_REAL_COLLABORATORS: CollaboratorProfile[] = RAW_COLLABORATORS.map(buildProfile);
