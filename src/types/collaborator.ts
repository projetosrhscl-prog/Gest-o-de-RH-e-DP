export type SCLRole = 'ADMIN' | 'HR_MANAGER' | 'DP_ANALYST' | 'COLLABORATOR';
export type UserRole = SCLRole;

export type EmploymentStatus = 
  | 'EM_ATIVIDADE' 
  | 'EM_ADMISSAO' 
  | 'EM_FERIAS' 
  | 'AFASTADO' 
  | 'DESLIGADO' 
  | 'PENDENTE_ATUALIZACAO';

// Compatibility alias
export type EmploymentStatusKIIP = EmploymentStatus;

export type ContractType = 'CLT' | 'RPA' | 'PJ' | 'ESTAGIO' | 'INTERMITENTE' | 'APRENDIZ' | 'TEMPORARIO';
// Compatibility alias
export type ContractTypeKIIP = ContractType;

export interface DependentInfo {
  id: string;
  name: string;
  relationship: 'FILHO' | 'CONJUGE' | 'PAI_MAE' | 'OUTRO';
  birthDate: string;
  cpf: string;
  isTaxDependent: boolean;
}

export interface BankAccountInfo {
  bankName: string;
  bankCode: string;
  agency: string;
  accountNumber: string;
  accountType: 'CORRENTE' | 'POUPANCA';
  pixKey?: string;
}

export interface BenefitItem {
  id: string;
  name: string;
  type: 'VA' | 'VR' | 'VT' | 'MOBILIDADE' | 'SAUDE' | 'ODONTO' | 'CAJU_FLEX' | 'OUTRO';
  monthlyValue: number;
  discountPercentage: number;
  provider: string;
  status: 'ATIVO' | 'INATIVO';
}

export interface EPIItem {
  id: string;
  name: string;
  caNumber: string; // Certificado de Aprovação
  deliveryDate: string;
  expirationDate: string;
  status: 'VALIDO' | 'A_VENCER' | 'VENCIDO';
}

export interface DisciplinaryAction {
  id: string;
  type: 'ADVERTENCIA_VERBAL' | 'ADVERTENCIA_ESCRITA' | 'SUSPENSAO';
  date: string;
  reason: string;
  signedDocumentUrl?: string;
  appliedBy: string;
}

export interface MedicalExamASO {
  id: string;
  type: 'ADMISSIONAL' | 'PERIODICO' | 'RETORNO_TRABALHO' | 'MUDANCA_FUNCAO' | 'DEMISSIONAL';
  examDate: string;
  validUntil: string;
  clinicName: string;
  result: 'APTO' | 'INAPTO';
  status: 'EM_DIA' | 'A_VENCER' | 'VENCIDO';
}

export type OwnItLevel = 'O' | 'W' | 'N' | 'I' | 'T';

export interface OwnItMilestone {
  letter: OwnItLevel;
  levelNumber: number; // 1 a 5
  levelName: string; // ex: "Origem & Onboarding"
  badgeTitle: string; // ex: "Nível O - Onboarding"
  status: 'CONCLUIDO' | 'ATUAL' | 'PROXIMO' | 'BLOQUEADO';
  achievedDate?: string;
  promotedPosition?: string;
  salaryAtPromotion?: number;
  evaluatorName?: string;
  feedback?: string;
  keyCompetencies: string[];
  promotionCriteria: string[];
  currentProgressPercent?: number; // Para o nível atual (ex: 75%)
}

export interface OwnItJourneyData {
  isEligible?: boolean;
  currentLevel: OwnItLevel;
  journeyStartDate: string;
  totalPromotions: number;
  lastPromotionDate?: string;
  nextCycleDate?: string;
  milestones: OwnItMilestone[];
}

export interface CareerHistoryItem {
  id: string;
  positionTitle: string;
  departmentName: string;
  salary: number;
  startDate: string;
  reason: 'ADMISSAO' | 'PROMOCAO' | 'MERITO' | 'ENQUADRAMENTO' | 'TRANSFERENCIA';
  ownItLevel?: OwnItLevel;
}

export interface VacationAcquisitivePeriod {
  id: string;
  startDate: string;
  endDate: string;
  limitConcessionDate: string; // Data limite para gozo (antes da dobra)
  totalDays: number; // Dias nominais do ciclo (geralmente 30)
  acquiredDays?: number; // Dias de direito acumulados até a data base (ex: 7.5, 10, 27.5, 30)
  takenDays: number; // Dias gozados deste período
  remainingBalance: number; // Dias restantes para gozar
  plannedDays?: number;
  abonoDays?: number; // Venda de até 10 dias
  fractionAvos?: string; // Ex: '03/12', '11/12', '01/12'
  absenceDays?: number; // Dias de afastamento
  faultDays?: number; // Dias de faltas
  status: 'ADQUIRINDO' | 'DISPONIVEL' | 'VENCENDO' | 'VENCIDO' | 'CONCLUIDO';
}

export interface CollaboratorProfile {
  id: string;
  registrationNumber: string; // Matrícula
  cpf: string;
  rg: string;
  rgIssuer: string;
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  coverBannerUrl?: string;
  bio?: string;
  skills: string[];
  
  // Organization & Allocation
  branchId: string; // Polo / Operação (Patos, Paracatu, Parelhas, Apodi, Macau, João Câmara, Trairi, Limoeiro)
  branchName: string;
  departmentId: string;
  departmentName: string;
  costCenter: string;
  positionId: string;
  positionTitle: string;
  seniority: 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista' | 'Coordenação' | 'Gerência' | 'Diretoria' | 'Operacional' | 'Técnico / Campo' | 'Estágio';
  directSupervisor: string;
  admissionDate: string;
  contractType: ContractType;
  status: EmploymentStatus;
  salary: number;
  paymentMethod: 'TRANSFERENCIA_BANCARIA' | 'PIX' | 'CHEQUE';
  workSchedule: string; // Ex: 44h semanais (Segunda a Sexta 08:00 - 17:48)

  // Sub-domains
  personalData: {
    birthDate: string;
    gender: string;
    maritalStatus: string;
    nationality: string;
    address: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
    shirtSize?: string;
    favoriteCake?: string;
    rgIssuerDate?: string;
    voterTitle?: string;
    voterZone?: string;
    voterSection?: string;
    motherName?: string;
    fatherName?: string;
    pisPasep?: string;
    ctpsNumber?: string;
    ctpsSeries?: string;
    militaryCertificate?: string;
    cnhNumber?: string;
    cnhCategory?: string;
    educationLevel?: string;
  };
  admissionData?: {
    processId?: string;
    completedAt?: string;
    sentToAccountingDate?: string;
    diasTrabalhadosPrimeiroMes?: number;
    stoneStartApprovedAt?: string;
    stoneStartApprovedBy?: string;
    admissionDocuments: {
      id: string;
      name: string;
      category: string;
      uploadedAt: string;
      fileSize: string;
      url?: string;
      verified: boolean;
      accessRestricted: boolean;
      source: 'FORMULARIO_ADMISSAO' | 'UPLOAD_MANUAL' | 'COLETA_PREVIA';
    }[];
  };
  bankAccount: BankAccountInfo;
  dependents: DependentInfo[];
  benefits: BenefitItem[];
  careerHistory: CareerHistoryItem[];
  vacationPeriods: VacationAcquisitivePeriod[];
  epis: EPIItem[];
  disciplinaryActions: DisciplinaryAction[];
  medicalExams: MedicalExamASO[];
  onboardingChecklist: { task: string; completed: boolean; date?: string }[];
  trainingEnrollments?: { id: string; trainingId: string; trainingTitle: string; enrolledAt: string; status: string; completedAt?: string; score?: number }[];
  ownItJourney?: OwnItJourneyData;
}

export type VacationKanbanStatus = 
  | 'APROVACAO_LIDER' 
  | 'APROVACAO_RH' 
  | 'DOCUMENTACAO' 
  | 'APROVADO' 
  | 'EM_FERIAS';

export type VacationStatus = VacationKanbanStatus;
// Compatibility alias
export type VacationStatusKIIP = VacationStatus;

export interface VacationRequest {
  id: string;
  collaboratorId: string;
  collaboratorName: string;
  collaboratorAvatar?: string;
  collaboratorPosition: string;
  branchName: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  abonoDays: number; // 0 ou até 10 dias
  advance13th: boolean; // Adiantamento 1ª parcela do 13º
  status: VacationKanbanStatus;
  requestDate: string;
  leaderApprovalDate?: string;
  hrApprovalDate?: string;
  observations?: string;
}

export type ElectronicDocCategory = 'CONTRATO_TRABALHO' | 'EXPERIENCIA' | 'BANCO_HORAS' | 'EPI' | 'IMAGEM' | 'HOLERITE' | 'CONFIDENCIALIDADE' | 'OUTRO';

export interface DocumentTemplate {
  id: string;
  title: string;
  category: ElectronicDocCategory;
  description: string;
  placeholders: string[];
  version: string;
}
// Compatibility alias
export type DocumentTemplateKIIP = DocumentTemplate;

export interface ElectronicDocument {
  id: string;
  title: string;
  collaboratorId: string;
  collaboratorName: string;
  collaboratorAvatar?: string;
  category: 'CONTRATO_TRABALHO' | 'EXPERIENCIA' | 'BANCO_HORAS' | 'EPI' | 'IMAGEM' | 'HOLERITE' | 'OUTRO';
  templateName: string;
  createdAt: string;
  status: 'AGUARDANDO_ASSINATURA' | 'ASSINADO' | 'PENDENTE_INFORMACOES' | 'EM_PROCESSAMENTO';
  signatureProvider: 'DIGITAL_SIGN' | 'MANUAL';
  deliveryChannel: 'WHATSAPP' | 'EMAIL';
  signedAt?: string;
  documentFileUrl?: string;
}

export interface PayrollEventItem {
  collaboratorId: string;
  collaboratorName: string;
  registrationNumber: string;
  positionTitle: string;
  departmentName: string;
  costCenter: string;
  branchName: string;
  baseSalary: number;
  additionalHazardPay: number; // Periculosidade / Insalubridade
  additionalNightPay: number; // Noturno
  overtimePay: number; // Horas extras
  bonusPay: number; // Bônus / Gratificações
  commissionPay: number; // Comissões
  grossTotal: number; // Total Bruto
  inssDiscount: number;
  irrfDiscount: number;
  benefitsDiscounts: {
    vrVa: number;
    vt: number;
    healthPlan: number;
    other: number;
  };
  netSalary: number; // Salário Líquido
  cajuFlexMonthlyRecharge: number; // Valor crédito cartão flexível Caju
  hoursWorked: number;
  daysWorked: number;
  status: 'APURADO' | 'CONFERIDO' | 'FECHADO';
  observations?: string;
}

export interface PayrollMonthRecord {
  id: string;
  competencyMonth: string; // ex: "Agosto / 2026"
  month: number;
  year: number;
  businessDays: number;
  dsrDays: number;
  model: string; // ex: "Geral", "Time de Operações & Usinas", "Vendas"
  status: 'RASCUNHO' | 'FECHADA' | 'ENVIADA_CONTABILIDADE';
  totalGross: number;
  totalNet: number;
  collaboratorsCount: number;
  events: PayrollEventItem[];
  sentToAccountingAt?: string;
  accountingProviderName?: string;
}

export interface SmartReminderItem {
  id: string;
  title: string;
  category: 'ASO' | 'EXPERIENCIA' | 'FERIAS' | 'EPI' | 'ANIVERSARIO' | 'CONTRATO_PJ';
  collaboratorName: string;
  collaboratorId: string;
  branchName: string;
  targetDate: string;
  alertDaysBefore: number;
  status: 'ATIVO' | 'RESOLVIDO' | 'IGNORADO';
  urgency: 'ALTA' | 'MEDIA' | 'NORMAL';
  description: string;
}
