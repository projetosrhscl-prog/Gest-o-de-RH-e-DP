import { VacationAcquisitivePeriod, CollaboratorProfile } from '../types/collaborator';

export interface VacationCalculatedPeriod extends VacationAcquisitivePeriod {
  collaboratorId: string;
  collaboratorName: string;
  registrationNumber: string;
  branchId: string;
  branchName: string;
  departmentName: string;
  positionTitle: string;
  admissionDate: string;
  daysToDeadline: number;
  urgencyLevel: 'CRITICO' | 'ATENCAO' | 'NORMAL' | 'EM_FORMACAO' | 'CONCLUIDO';
  urgencyLabel: string;
  isForming: boolean; // Se ainda está conquistando o período de 30 dias
  totalPeriodsCount?: number;
  hasAdditionalPeriods?: boolean;
  allPeriods?: VacationAcquisitivePeriod[];
  totalAvailableBalance?: number;
}

export interface VacationDashboardMetrics {
  totalMonitoredPeriods: number; // Quantidade de colaboradores únicos monitorados
  totalCollaboratorsCLT: number;
  criticalDobraRiskCount: number; // <= 180 dias (pelo menos 6 meses pra vencer o saldo)
  warningDobraRiskCount: number; // 181 a 240 dias (6 a 8 meses)
  tranquilCount: number; // > 240 dias (mais de 8 meses - tranquilo)
  availableForImmediateVacation: number; // Colaboradores com saldo pronto para gozo
  formingPeriodsCount: number; // Colaboradores em aquisição proporcional
  totalAvailableDays: number; // Soma de dias restantes prontos
  totalFormingDays: number; // Soma de dias em aquisição
}

/**
 * Retorna a diferença em dias entre a data atual de referência (08/09/2026 base do relatório ou hoje) e a data limite
 */
export function calculateDaysToDeadline(limitDateStr: string, baseDateStr: string = '2026-09-08'): number {
  if (!limitDateStr) return 999;
  const deadline = new Date(limitDateStr).getTime();
  const base = new Date(baseDateStr).getTime();
  const diffDays = Math.ceil((deadline - base) / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Classifica a urgência e situação do período de férias conforme as diretrizes:
 * - Crítico: quem tem pelo menos 6 meses pra vencer o saldo (<= 180 dias restantes)
 * - Atenção: de 6 a 8 meses (181 a 240 dias restantes)
 * - Tranquilo: mais que isso (> 240 dias restantes)
 */
export function getVacationUrgency(
  period: VacationAcquisitivePeriod,
  baseDateStr: string = '2026-09-08'
): { level: 'CRITICO' | 'ATENCAO' | 'NORMAL' | 'EM_FORMACAO' | 'CONCLUIDO'; label: string; daysToDeadline: number; isForming: boolean } {
  const daysToDeadline = calculateDaysToDeadline(period.limitConcessionDate, baseDateStr);
  const acquired = period.acquiredDays ?? period.totalDays;
  const isForming = (acquired < 30 && period.takenDays === 0) || (period.status === 'ADQUIRINDO' && acquired < 30);

  if (period.remainingBalance <= 0) {
    return {
      level: 'CONCLUIDO',
      label: 'Férias Concluídas',
      daysToDeadline,
      isForming: false
    };
  }

  if (isForming) {
    return {
      level: 'EM_FORMACAO',
      label: 'Em Aquisição Proporcional',
      daysToDeadline,
      isForming: true
    };
  }

  // Regra do Usuário:
  // - Crítico: até 6 meses pra vencer o saldo (<= 180 dias)
  if (daysToDeadline <= 180) {
    return {
      level: 'CRITICO',
      label: `Crítico (≤ 6 meses)`,
      daysToDeadline,
      isForming: false
    };
  }

  // - Atenção: de 6 a 8 meses (181 a 240 dias)
  if (daysToDeadline <= 240) {
    return {
      level: 'ATENCAO',
      label: `Atenção (6 a 8 meses)`,
      daysToDeadline,
      isForming: false
    };
  }

  // - Tranquilo: mais que isso (> 240 dias / > 8 meses)
  return {
    level: 'NORMAL',
    label: `Tranquilo (> 8 meses)`,
    daysToDeadline,
    isForming: false
  };
}

/**
 * Retorna os períodos calculados para uma lista de colaboradores com DEDUPLICAÇÃO ESTRITA.
 * Cada colaborador com o mesmo nome aparece EXATAMENTE UMA ÚNICA VEZ, exibindo seu período prioritário
 * com maior urgência de gozo e consolidando os saldos.
 */
export function getAllCalculatedVacationPeriods(
  collaborators: CollaboratorProfile[],
  baseDateStr: string = '2026-09-08'
): VacationCalculatedPeriod[] {
  const result: VacationCalculatedPeriod[] = [];

  // 1. Deduplicação estrita de perfis de colaboradores por nome normalizado
  const uniqueCollaborators: CollaboratorProfile[] = [];
  const seenNames = new Set<string>();

  collaborators.forEach((colab) => {
    if (!colab || !colab.fullName) return;
    const norm = colab.fullName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();

    if (!seenNames.has(norm)) {
      seenNames.add(norm);
      uniqueCollaborators.push(colab);
    }
  });

  // 2. Para cada colaborador único, consolida em exatamente UM registro único
  uniqueCollaborators.forEach((colab) => {
    if (!colab.vacationPeriods || colab.vacationPeriods.length === 0) return;

    const periods = colab.vacationPeriods;

    // Identifica períodos que possuem saldo restante pendente de gozo
    const withRemainingBalance = periods.filter((p) => p.remainingBalance > 0);

    let priorityPeriod: VacationAcquisitivePeriod;

    if (withRemainingBalance.length > 0) {
      // Ordena pelo menor prazo para a concessão (data limite mais próxima = mais urgente a vencer)
      const sorted = [...withRemainingBalance].sort((a, b) => {
        const timeA = a.limitConcessionDate ? new Date(a.limitConcessionDate).getTime() : 9999999999999;
        const timeB = b.limitConcessionDate ? new Date(b.limitConcessionDate).getTime() : 9999999999999;
        return timeA - timeB;
      });
      priorityPeriod = sorted[0];
    } else {
      // Se não tem saldo pendente, utiliza o período mais recente
      priorityPeriod = periods[periods.length - 1];
    }

    const urgency = getVacationUrgency(priorityPeriod, baseDateStr);
    const totalAvailableBalance = withRemainingBalance.reduce((acc, p) => acc + (p.remainingBalance || 0), 0);

    result.push({
      ...priorityPeriod,
      collaboratorId: colab.id,
      collaboratorName: colab.fullName,
      registrationNumber: colab.registrationNumber,
      branchId: colab.branchId,
      branchName: colab.branchName,
      departmentName: colab.departmentName,
      positionTitle: colab.positionTitle,
      admissionDate: colab.admissionDate,
      daysToDeadline: urgency.daysToDeadline,
      urgencyLevel: urgency.level,
      urgencyLabel: urgency.label,
      isForming: urgency.isForming,
      totalPeriodsCount: periods.length,
      hasAdditionalPeriods: periods.length > 1,
      allPeriods: periods,
      totalAvailableBalance
    });
  });

  return result;
}

/**
 * Calcula os indicadores executivos do painel de férias baseados em colaboradores únicos
 */
export function calculateVacationDashboardMetrics(
  periods: VacationCalculatedPeriod[],
  collaborators: CollaboratorProfile[]
): VacationDashboardMetrics {
  let criticalDobraRiskCount = 0;
  let warningDobraRiskCount = 0;
  let tranquilCount = 0;
  let availableForImmediateVacation = 0;
  let formingPeriodsCount = 0;
  let totalAvailableDays = 0;
  let totalFormingDays = 0;

  periods.forEach((p) => {
    if (p.urgencyLevel === 'CRITICO') {
      criticalDobraRiskCount++;
    } else if (p.urgencyLevel === 'ATENCAO') {
      warningDobraRiskCount++;
    } else if (p.urgencyLevel === 'NORMAL') {
      tranquilCount++;
    }

    if (p.isForming) {
      formingPeriodsCount++;
      totalFormingDays += (p.acquiredDays || 0);
    } else if (p.remainingBalance > 0) {
      availableForImmediateVacation++;
      totalAvailableDays += p.remainingBalance;
    }
  });

  const totalCLT = periods.length;

  return {
    totalMonitoredPeriods: periods.length,
    totalCollaboratorsCLT: totalCLT,
    criticalDobraRiskCount,
    warningDobraRiskCount,
    tranquilCount,
    availableForImmediateVacation,
    formingPeriodsCount,
    totalAvailableDays,
    totalFormingDays
  };
}
