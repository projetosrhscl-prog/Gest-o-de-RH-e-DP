/**
 * Helper para cálculo de tempo de empresa e diferenciação entre
 * Colaboradores Efetivos, em Período de Experiência e Prestadores RPA / Estágio.
 */

export interface TenureInfo {
  days: number;
  isProbation: boolean;
  probationRemainingDays: number;
  probationDaysRemaining: number; // alias
  badgeLabel: string;
  badgeType: 'efetivo' | 'experiencia' | 'rpa' | 'estagio';
  tenureText: string; // Ex: "Efetivo há 438 dias" ou "Em experiência há 42 dias"
  detailedText: string;
}

/**
 * Calcula a quantidade de dias corridos entre a admissão e a data vigente atual.
 */
export function calculateTenureDays(admissionDate: string): number {
  if (!admissionDate) return 0;
  
  const parts = admissionDate.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    
    const admission = new Date(year, month, day);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffMs = today.getTime() - admission.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }

  const admission = new Date(admissionDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const admissionDay = new Date(admission.getFullYear(), admission.getMonth(), admission.getDate());
  
  const diffMs = today.getTime() - admissionDay.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Verifica se a admissão está dentro do período de experiência legal (até 90 dias).
 */
export function isProbationPeriod(admissionDate: string): boolean {
  return calculateTenureDays(admissionDate) <= 90;
}

/**
 * Formata os dias em texto descritivo.
 */
export function formatTenureDays(days: number): string {
  if (days === 0) return 'Admitido hoje';
  if (days === 1) return '1 dia';
  return `${days} dias`;
}

/**
 * Retorna as informações completas de vínculo e status de experiência/efetivação.
 * Aceita tanto uma string de data + contrato quanto um objeto de colaborador.
 */
export function getCollaboratorTenure(
  param: string | { admissionDate: string; contractType?: string },
  contractTypeParam?: string
): TenureInfo {
  let admissionDate = '';
  let contractType = contractTypeParam || 'CLT';

  if (typeof param === 'object' && param !== null) {
    admissionDate = param.admissionDate || '';
    contractType = param.contractType || contractTypeParam || 'CLT';
  } else if (typeof param === 'string') {
    admissionDate = param;
  }

  const days = calculateTenureDays(admissionDate);

  if (contractType === 'RPA' || contractType === 'PJ') {
    return {
      days,
      isProbation: false,
      probationRemainingDays: 0,
      probationDaysRemaining: 0,
      badgeLabel: 'Prestador RPA',
      badgeType: 'rpa',
      tenureText: `Prestador RPA há ${days} ${days === 1 ? 'dia' : 'dias'}`,
      detailedText: `Contrato RPA ativo há ${days} dias`
    };
  }

  if (contractType === 'ESTAGIO') {
    return {
      days,
      isProbation: false,
      probationRemainingDays: 0,
      probationDaysRemaining: 0,
      badgeLabel: 'Estágio',
      badgeType: 'estagio',
      tenureText: `Estágio há ${days} ${days === 1 ? 'dia' : 'dias'}`,
      detailedText: `Termo de estágio ativo há ${days} dias`
    };
  }

  // CLT: período de experiência legal padrão de 90 dias (45 + 45)
  const isProbation = days <= 90;
  const probationRemainingDays = Math.max(0, 90 - days);

  if (isProbation) {
    return {
      days,
      isProbation: true,
      probationRemainingDays,
      probationDaysRemaining: probationRemainingDays,
      badgeLabel: 'Período de Experiência',
      badgeType: 'experiencia',
      tenureText: `Em experiência há ${days} ${days === 1 ? 'dia' : 'dias'}`,
      detailedText: `Em experiência há ${days} dias (Restam ${probationRemainingDays} dias para os 90d)`
    };
  }

  return {
    days,
    isProbation: false,
    probationRemainingDays: 0,
    probationDaysRemaining: 0,
    badgeLabel: 'Efetivo',
    badgeType: 'efetivo',
    tenureText: `Efetivo há ${days} ${days === 1 ? 'dia' : 'dias'}`,
    detailedText: `Colaborador efetivo há ${days} dias`
  };
}
