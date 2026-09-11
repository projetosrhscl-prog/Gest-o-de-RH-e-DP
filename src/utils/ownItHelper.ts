import { CollaboratorProfile, OwnItJourneyData, OwnItLevel, OwnItMilestone } from '../types/collaborator';

export interface OwnItLevelDefinition {
  letter: OwnItLevel;
  levelNumber: number;
  name: string;
  shortTag: string;
  themeColor: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    ring: string;
    gradient: string;
  };
  summary: string;
  coreExpectation: string;
  keyCompetencies: string[];
  promotionCriteria: string[];
  recommendedPositions: string[];
}

export const OWN_IT_LEVEL_DEFINITIONS: Record<OwnItLevel, OwnItLevelDefinition> = {
  O: {
    letter: 'O',
    levelNumber: 1,
    name: 'Origem & Onboarding',
    shortTag: 'Entrada & Cultura',
    themeColor: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800',
      ring: 'ring-emerald-500',
      gradient: 'from-emerald-500 to-teal-600'
    },
    summary: 'Ingresso na operação, integração aos valores e cultura de dono, conclusão de treinamentos regulatórios e assimilação do dia a dia.',
    coreExpectation: 'Aprender com humildade, dominar as ferramentas de trabalho e absorver a cultura ágil e focada no cliente.',
    keyCompetencies: [
      'Cultura & Sentimento de Dono',
      'Treinamentos Regulatórios (NR-10/NR-35)',
      'Uso de Sistemas (Kiip, Domínio, Ponto)',
      'Ética, Disciplina e Pontualidade'
    ],
    promotionCriteria: [
      '100% dos checklists de integração e segurança concluídos',
      'Atingimento estável das metas dos primeiros 90 dias',
      'Feedback positivo da liderança direta e do time'
    ],
    recommendedPositions: ['Estagiário(a)', 'Agente Comercial Júnior I', 'Green Angel I']
  },
  W: {
    letter: 'W',
    levelNumber: 2,
    name: 'Work & Warrior',
    shortTag: 'Execução & Consistência',
    themeColor: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
      ring: 'ring-blue-500',
      gradient: 'from-blue-500 to-indigo-600'
    },
    summary: 'Execução diária com excelência, resiliência operacional, entrega consistente de metas individuais e disciplina com padrões de qualidade.',
    coreExpectation: 'Fazer acontecer com energia e consistência todos os dias, superando obstáculos e honrando prazos.',
    keyCompetencies: [
      'Execução com Alta Qualidade',
      'Consistência no Batimento de Metas',
      'Resiliência e Foco no Resultado',
      'Gestão Eficiente do Próprio Tempo'
    ],
    promotionCriteria: [
      'Mínimo de 6 meses de atingimento contínuo de metas',
      'Zero não-conformidades graves de segurança ou conduta',
      'Avaliação de desempenho semestral acima de 85%'
    ],
    recommendedPositions: ['Agente Comercial Júnior II', 'Green Angel II', 'Assistente Operacional']
  },
  N: {
    letter: 'N',
    levelNumber: 3,
    name: 'Next Level & Notório',
    shortTag: 'Autonomia & Domínio',
    themeColor: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
      badge: 'bg-indigo-100 text-indigo-800',
      ring: 'ring-indigo-500',
      gradient: 'from-indigo-500 to-violet-600'
    },
    summary: 'Autonomia completa na tomada de decisão operacional/comercial, resolução proativa de problemas e referência técnica na sua unidade.',
    coreExpectation: 'Superar o padrão esperado, antecipar soluções para gargalos e ser exemplo de autonomia e precisão técnica.',
    keyCompetencies: [
      'Autonomia Operacional / Comercial',
      'Resolução de Problemas Complexos',
      'Visão Sistêmica de Processos',
      'Comunicação Clara e Assertiva'
    ],
    promotionCriteria: [
      'Superação de metas em pelo menos 2 ciclos consecutivos',
      'Proposição e implementação de ao menos 1 melhoria de processo',
      'Avaliação 360° com aprovação de pares e liderança'
    ],
    recommendedPositions: ['Agente Comercial Pleno', 'Green Angel Pleno', 'Analista de Operações']
  },
  I: {
    letter: 'I',
    levelNumber: 4,
    name: 'Impact & Inspirer',
    shortTag: 'Mentoria & Multiplicação',
    themeColor: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800',
      ring: 'ring-purple-500',
      gradient: 'from-purple-500 to-fuchsia-600'
    },
    summary: 'Geração de impacto exponencial no polo/unidade, mentoria ativa de novos talentos, multiplicação de conhecimento e liderança informal.',
    coreExpectation: 'Inspirar pelo exemplo, formar sucessores e elevar a barra de performance de todo o time ao redor.',
    keyCompetencies: [
      'Mentoria e Onboarding de Novos Talentos',
      'Liderança Técnica e Influência Positiva',
      'Inteligência Emocional e Colaboração',
      'Capacidade de Alinhamento Estratégico'
    ],
    promotionCriteria: [
      'Atuação comprovada como mentor de pelo menos 2 colaboradores',
      'Resultados de alta performance consistentes por mais de 1 ano',
      'Aprovação pelo comitê de gente e liderança regional'
    ],
    recommendedPositions: ['Agente Comercial Sênior', 'Green Angel Sênior', 'Coordenador(a) Trainee']
  },
  T: {
    letter: 'T',
    levelNumber: 5,
    name: 'Transform & True Owner',
    shortTag: 'Liderança & Dono',
    themeColor: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800',
      ring: 'ring-amber-500',
      gradient: 'from-amber-500 to-orange-600'
    },
    summary: 'O ápice da jornada: mentalidade de Sócio/Dono do negócio, visão estratégica de longo prazo, liderança transformadora e protagonismo institucional.',
    coreExpectation: 'Pensar e agir como dono da empresa, cuidar do time, zelar pelos recursos e liderar transformações estratégicas.',
    keyCompetencies: [
      'Mentalidade de Dono (True Ownership)',
      'Liderança de Pessoas e Equipes',
      'Visão de Negócios e Rentabilidade',
      'Gestão Estratégica e Inovação'
    ],
    promotionCriteria: [
      'Elegibilidade para Partnership / Quadro de Sócios',
      'Liderança consolidada de polos, projetos ou departamentos',
      'Defesa de case de impacto estratégico aprovado pela Diretoria'
    ],
    recommendedPositions: ['Coordenador(a) Comercial', 'Coordenador(a) Logístico(a)', 'Sócio(a) / Diretor(a)']
  }
};

export const ORDERED_OWN_IT_LETTERS: OwnItLevel[] = ['O', 'W', 'N', 'I', 'T'];

/**
 * Checks if a collaborator is eligible for the OWN IT Journey.
 * Rule: Exclusively applies to Agente Comercial and Coordenador Comercial.
 */
export function isOwnItEligible(colab: { positionTitle?: string; positionId?: string; departmentName?: string }): boolean {
  const title = (colab.positionTitle || '').toLowerCase();
  if (title.includes('agente comercial')) return true;
  if (title.includes('coordenador comercial')) return true;
  if (title === 'coordenador' && (colab.departmentName?.toLowerCase().includes('comercial') || colab.positionId === 'pos-coordenador')) {
    // If it's a commercial coordinator
    if (colab.departmentName?.toLowerCase().includes('logística') || title.includes('logístico')) return false;
    return true;
  }
  return false;
}

/**
 * Returns or dynamically builds the OWN IT Journey Data for a given collaborator.
 */
export function getCollaboratorOwnItJourney(colab: CollaboratorProfile): OwnItJourneyData {
  const isEligible = isOwnItEligible(colab);

  if (colab.ownItJourney && colab.ownItJourney.milestones?.length === 5) {
    return { ...colab.ownItJourney, isEligible };
  }

  // Derive level based on seniority/position/admission date if not present
  let currentLevel: OwnItLevel = 'W';
  if (colab.positionTitle.toLowerCase().includes('coordenador')) {
    currentLevel = 'I';
  } else {
    // Agente Comercial - base on admission date
    const admissionYear = parseInt(colab.admissionDate?.substring(0, 4) || '2024', 10);
    if (admissionYear <= 2023) {
      currentLevel = 'N';
    } else if (admissionYear === 2024 || admissionYear === 2025) {
      currentLevel = 'W';
    } else {
      currentLevel = 'O';
    }
  }

  const currentIndex = ORDERED_OWN_IT_LETTERS.indexOf(currentLevel);
  const admissionYear = parseInt(colab.admissionDate?.substring(0, 4) || '2024', 10);

  const milestones: OwnItMilestone[] = ORDERED_OWN_IT_LETTERS.map((letter, idx) => {
    const def = OWN_IT_LEVEL_DEFINITIONS[letter];
    const isCompleted = idx < currentIndex;
    const isCurrent = idx === currentIndex;
    const isNext = idx === currentIndex + 1;

    let status: 'CONCLUIDO' | 'ATUAL' | 'PROXIMO' | 'BLOQUEADO' = 'BLOQUEADO';
    if (isCompleted) status = 'CONCLUIDO';
    else if (isCurrent) status = 'ATUAL';
    else if (isNext) status = 'PROXIMO';

    let achievedDate: string | undefined;
    let promotedPosition: string | undefined;
    let salaryAtPromotion: number | undefined;

    if (isCompleted) {
      const year = admissionYear + idx;
      achievedDate = `${year}-06-15`;
      promotedPosition = def.recommendedPositions[0] || colab.positionTitle;
      salaryAtPromotion = Math.round((colab.salary || 4000) * (0.6 + (idx * 0.15)));
    } else if (isCurrent) {
      achievedDate = colab.careerHistory?.[colab.careerHistory.length - 1]?.startDate || colab.admissionDate;
      promotedPosition = colab.positionTitle;
      salaryAtPromotion = colab.salary;
    }

    return {
      letter,
      levelNumber: def.levelNumber,
      levelName: def.name,
      badgeTitle: `Nível ${letter} - ${def.name.split('&')[0].trim()}`,
      status,
      achievedDate,
      promotedPosition,
      salaryAtPromotion,
      evaluatorName: isCompleted || isCurrent ? colab.directSupervisor : undefined,
      feedback: isCompleted 
        ? `Promoção ao Nível ${letter} aprovada com excelência operacional e alinhamento cultural.`
        : isCurrent 
        ? `Nível ${letter} em andamento. Foco no desenvolvimento das competências para o próximo ciclo de promoção.`
        : undefined,
      keyCompetencies: def.keyCompetencies,
      promotionCriteria: def.promotionCriteria,
      currentProgressPercent: isCurrent ? 70 : isCompleted ? 100 : 0
    };
  });

  const completedCount = milestones.filter(m => m.status === 'CONCLUIDO').length;

  return {
    isEligible,
    currentLevel,
    journeyStartDate: colab.admissionDate || '2024-01-01',
    totalPromotions: completedCount,
    lastPromotionDate: milestones[currentIndex]?.achievedDate || colab.admissionDate,
    nextCycleDate: '2026-11-30',
    milestones
  };
}
