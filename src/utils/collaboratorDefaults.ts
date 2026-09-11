import { CollaboratorProfile, EmploymentStatus, ContractType } from '../types/collaborator';

export function sanitizeCollaboratorProfile(raw: Partial<CollaboratorProfile> | null | undefined): CollaboratorProfile {
  if (!raw) {
    throw new Error('Collaborator profile is null or undefined');
  }

  return {
    id: raw.id || `colab-${Date.now()}`,
    registrationNumber: raw.registrationNumber || 'MAT-0000',
    cpf: raw.cpf || '000.000.000-00',
    rg: raw.rg || '0000000',
    rgIssuer: raw.rgIssuer || 'SSP',
    fullName: raw.fullName || 'Colaborador sem Nome',
    preferredName: raw.preferredName || (raw.fullName ? raw.fullName.split(' ')[0] : 'Colaborador'),
    email: raw.email || 'colaborador@scloperacoes.com.br',
    phone: raw.phone || '(83) 98888-0000',
    avatarUrl: raw.avatarUrl || '',
    coverBannerUrl: raw.coverBannerUrl || '',
    bio: raw.bio || 'Colaborador integrante do quadro operacional da SCL.',
    skills: Array.isArray(raw.skills) ? raw.skills : ['Comunicação', 'Trabalho em Equipe'],

    // Org
    branchId: raw.branchId || 'op-patos',
    branchName: raw.branchName || 'Polo Patos',
    departmentId: raw.departmentId || 'dept-comercial',
    departmentName: raw.departmentName || 'Comercial',
    costCenter: raw.costCenter || 'CC-3010',
    positionId: raw.positionId || 'pos-agente-comercial',
    positionTitle: raw.positionTitle || 'Agente Comercial',
    seniority: raw.seniority || 'Operacional',
    directSupervisor: raw.directSupervisor || 'Aysla Mendes',
    admissionDate: raw.admissionDate || new Date().toISOString().split('T')[0],
    contractType: (raw.contractType as ContractType) || 'CLT',
    status: (raw.status as EmploymentStatus) || 'EM_ATIVIDADE',
    salary: typeof raw.salary === 'number' ? raw.salary : 2500,
    paymentMethod: raw.paymentMethod || 'TRANSFERENCIA_BANCARIA',
    workSchedule: raw.workSchedule || '44h semanais (Segunda a Sexta 08:00 - 17:48)',

    personalData: {
      birthDate: raw.personalData?.birthDate || '1995-01-01',
      gender: raw.personalData?.gender || 'Não informado',
      maritalStatus: raw.personalData?.maritalStatus || 'Solteiro(a)',
      nationality: raw.personalData?.nationality || 'Brasileira',
      address: {
        street: raw.personalData?.address?.street || 'Rua Principal',
        number: raw.personalData?.address?.number || 'S/N',
        neighborhood: raw.personalData?.address?.neighborhood || 'Centro',
        city: raw.personalData?.address?.city || 'Patos',
        state: raw.personalData?.address?.state || 'PB',
        zipCode: raw.personalData?.address?.zipCode || '58700-000'
      },
      emergencyContact: {
        name: raw.personalData?.emergencyContact?.name || 'Contato Familiar',
        phone: raw.personalData?.emergencyContact?.phone || '(83) 99999-0000',
        relationship: raw.personalData?.emergencyContact?.relationship || 'Familiar'
      },
      shirtSize: raw.personalData?.shirtSize || 'M',
      favoriteCake: raw.personalData?.favoriteCake || 'Chocolate'
    },

    bankAccount: {
      bankName: raw.bankAccount?.bankName || 'Banco do Brasil',
      bankCode: raw.bankAccount?.bankCode || '001',
      agency: raw.bankAccount?.agency || '0001',
      accountNumber: raw.bankAccount?.accountNumber || '12345-6',
      accountType: raw.bankAccount?.accountType || 'CORRENTE',
      pixKey: raw.bankAccount?.pixKey || ''
    },

    dependents: Array.isArray(raw.dependents) ? raw.dependents : [],
    benefits: Array.isArray(raw.benefits) ? raw.benefits : [
      {
        id: 'b-caju-padrao',
        name: 'Cartão Benefício Flexível (Caju)',
        type: 'CAJU_FLEX',
        monthlyValue: 750,
        discountPercentage: 0,
        provider: 'Caju Benefícios',
        status: 'ATIVO'
      }
    ],
    careerHistory: Array.isArray(raw.careerHistory) ? raw.careerHistory : [],
    vacationPeriods: Array.isArray(raw.vacationPeriods) ? raw.vacationPeriods : [
      {
        id: `vac-${Date.now()}`,
        startDate: raw.admissionDate || '2025-01-01',
        endDate: '2026-01-01',
        limitConcessionDate: '2026-12-01',
        totalDays: 30,
        takenDays: 0,
        plannedDays: 0,
        abonoDays: 0,
        remainingBalance: 30,
        status: 'DISPONIVEL'
      }
    ],
    epis: Array.isArray(raw.epis) ? raw.epis : [],
    disciplinaryActions: Array.isArray(raw.disciplinaryActions) ? raw.disciplinaryActions : [],
    medicalExams: Array.isArray(raw.medicalExams) ? raw.medicalExams : [
      {
        id: `exam-${Date.now()}`,
        type: 'ADMISSIONAL',
        examDate: raw.admissionDate || '2025-01-01',
        validUntil: '2026-01-01',
        clinicName: 'Clínica Ocupacional Credenciada',
        result: 'APTO',
        status: 'EM_DIA'
      }
    ],
    onboardingChecklist: Array.isArray(raw.onboardingChecklist) ? raw.onboardingChecklist : [
      { task: 'Entrega de Documentos de Admissão', completed: true, date: raw.admissionDate },
      { task: 'Assinatura do Contrato de Trabalho Digital', completed: true, date: raw.admissionDate },
      { task: 'Entrega de Crachá e Kit de Boas-Vindas', completed: true, date: raw.admissionDate },
      { task: 'Treinamento de Integração da Operação', completed: true, date: raw.admissionDate }
    ],
    ownItJourney: raw.ownItJourney
  };
}
