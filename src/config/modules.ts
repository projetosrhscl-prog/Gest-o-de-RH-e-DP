import { MainModuleNav } from '../types/navigation';

export const SYSTEM_MODULES: MainModuleNav[] = [
  {
    id: 'gestao-pessoas',
    label: 'Gestão de Pessoas',
    shortDescription: 'Gestão de colaboradores, prontuários, férias, licenças e desligamentos',
    iconName: 'Users',
    subModules: [
      {
        id: 'colaboradores',
        title: 'Quadro de Colaboradores',
        description: 'Diretório completo de colaboradores ativos, cadastros e dados contratuais',
        badge: 'Operacional',
        badgeColor: 'primary'
      },
      {
        id: 'ferias-afastamentos',
        title: 'Férias & Afastamentos',
        description: 'Controle de períodos aquisitivos, concessões e licenças médicas',
        badge: 'Em Breve',
        badgeColor: 'warning',
        isPlanned: true
      },
      {
        id: 'documentos-prontuarios',
        title: 'Prontuários & Documentos',
        description: 'Repositório digital de documentos admissionais, ASOs e termos',
        badge: 'Em Breve',
        badgeColor: 'warning',
        isPlanned: true
      },
      {
        id: 'desligamentos',
        title: 'Desligamentos',
        description: 'Gestão de rescisões, homologações e cálculo rescisório preliminar',
        badge: 'Em Breve',
        badgeColor: 'warning',
        isPlanned: true
      }
    ]
  },
  {
    id: 'departamento-pessoal',
    label: 'Departamento Pessoal',
    shortDescription: 'Rotinas trabalhistas, preparação da folha, ponto, benefícios e RPA',
    iconName: 'Building2',
    subModules: [
      {
        id: 'folha-preparacao',
        title: 'Preparação da Folha',
        description: 'Pré-fechamento mensal, eventos, rubricas, adicionais e descontos',
        badge: 'Operacional',
        badgeColor: 'primary'
      },
      {
        id: 'controle-ponto',
        title: 'Controle de Ponto & Jornada',
        description: 'Espelhos de ponto, banco de horas, horas extras e marcações',
        badge: 'Em Breve',
        badgeColor: 'warning',
        isPlanned: true
      },
      {
        id: 'beneficios',
        title: 'Gestão de Benefícios',
        description: 'Vale-transporte, refeição, plano de saúde e coparticipações',
        badge: 'Em Breve',
        badgeColor: 'warning',
        isPlanned: true
      },
      {
        id: 'contratos-rpa',
        title: 'RPA & Terceiros',
        description: 'Gestão de prestadores autônomos, contratos e retenções tributárias',
        badge: 'Em Breve',
        badgeColor: 'warning',
        isPlanned: true
      },
      {
        id: 'esocial-obrigacoes',
        title: 'eSocial & Obrigações Fiscais',
        description: 'Transmissão e monitoramento de eventos periódicos e não periódicos',
        badge: 'Em Breve',
        badgeColor: 'warning',
        isPlanned: true
      }
    ]
  },
  {
    id: 'admissao-demissao',
    label: 'Admissão e Demissão',
    shortDescription: 'Automação completa dos fluxos de admissão digital e desligamentos/rescisões',
    iconName: 'UserCheck',
    subModules: [
      {
        id: 'painel-automacoes',
        title: 'Painel de Automações',
        description: 'Visão geral, fila de processos ativos, disparos e status de integrações',
        badge: 'Automação Ativa',
        badgeColor: 'success'
      },
      {
        id: 'admissoes-digitais',
        title: 'Admissão Digital Automatizada',
        description: 'Link ao candidato, validação automática com OCR, eSocial S-2200 e contrato digital',
        badge: 'Operacional',
        badgeColor: 'primary'
      },
      {
        id: 'demissoes-rescisao',
        title: 'Demissão & Rescisão Automatizada',
        description: 'Aviso prévio, TRCT, cálculo rescisório preliminar, ASO demissional e eSocial S-2299',
        badge: 'Operacional',
        badgeColor: 'primary'
      },
      {
        id: 'checklist-integracoes',
        title: 'Checklists & Integrações',
        description: 'Controle de ativos, acessos de TI, baixa em sistemas e geração de kits documentais',
        badge: 'Configurável',
        badgeColor: 'default'
      }
    ]
  },
  {
    id: 'lembretes',
    label: 'Lembretes & Calendário',
    shortDescription: 'Calendário de vencimentos de experiência CLT, ASOs, DP, férias e pop-ups de alerta',
    iconName: 'CalendarDays',
    subModules: [
      {
        id: 'calendario-geral',
        title: 'Calendário Geral de Eventos',
        description: 'Grade mensal e timeline com mapeamento de datas críticas e lembretes programados',
        badge: 'Operacional',
        badgeColor: 'primary'
      },
      {
        id: 'experiencia-contratos',
        title: 'Vencimento de Experiência CLT',
        description: 'Acompanhamento do 45º e 90º dia probatório e disparo de contratos definitivos',
        badge: 'Automação Ativa',
        badgeColor: 'success'
      },
      {
        id: 'alertas-vencimentos',
        title: 'Central de Pop-ups & Alertas',
        description: 'Notificações ativas antes do prazo para DP, Gestão de Pessoas e SST',
        badge: 'Operacional',
        badgeColor: 'primary'
      }
    ]
  },
  {
    id: 'auditorias',
    label: 'Auditorias',
    shortDescription: 'Trilha de auditoria, conformidade trabalhista, eSocial e evidências fiscais',
    iconName: 'ShieldCheck',
    subModules: [
      {
        id: 'trilha-auditoria',
        title: 'Trilha de Auditoria Geral',
        description: 'Log imutável de operações, alterações de dados cadastrais, ponto e folha',
        badge: 'Operacional',
        badgeColor: 'primary'
      },
      {
        id: 'auditoria-trabalhista',
        title: 'Auditoria Trabalhista & eSocial',
        description: 'Conferência de prazos de férias, ASOs periódicos, eventos eSocial e inconsistências',
        badge: 'Operacional',
        badgeColor: 'primary'
      },
      {
        id: 'auditoria-seguranca',
        title: 'Segurança da Informação & LGPD',
        description: 'Acessos a dados sensíveis, termos de consentimento e exportações de relatórios',
        badge: 'Operacional',
        badgeColor: 'primary'
      },
      {
        id: 'relatorios-evidencias',
        title: 'Dossiês & Evidências de Auditoria',
        description: 'Exportação oficial de relatórios analíticos, memória de cálculo e extratos fiscais',
        badge: 'Operacional',
        badgeColor: 'primary'
      }
    ]
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    shortDescription: 'Empresas, filiais, permissões RBAC, workflows e auditoria',
    iconName: 'Settings',
    subModules: [
      {
        id: 'empresas-filiais',
        title: 'Empresas & Filiais',
        description: 'Cadastro de CNPJs, unidades operacionais e parâmetros sindicais',
        badge: 'Operacional',
        badgeColor: 'primary'
      },
      {
        id: 'perfis-permissoes',
        title: 'Perfis & Permissões (RBAC)',
        description: 'Matriz de acessos, papéis de usuários e alçadas de aprovação',
        badge: 'Operacional',
        badgeColor: 'primary'
      },
      {
        id: 'workflows-aprovacao',
        title: 'Workflows & Alçadas',
        description: 'Fluxos de aprovação de férias, aumentos e admissões',
        badge: 'Em Breve',
        badgeColor: 'warning',
        isPlanned: true
      },
      {
        id: 'logs-auditoria',
        title: 'Trilha de Auditoria',
        description: 'Registro cronológico imutável de todas as ações de usuários no sistema',
        badge: 'Operacional',
        badgeColor: 'primary'
      }
    ]
  }
];

export const SYSTEM_PILLARS = [
  { id: '1', name: 'Gestão de Pessoas', status: 'Ativo', module: 'gestao-pessoas' },
  { id: '2', name: 'Quadro de Colaboradores (Directory)', status: 'Ativo', module: 'gestao-pessoas' },
  { id: '3', name: 'Prontuários & Documentos (Assinatura Digital)', status: 'Ativo', module: 'gestao-pessoas' },
  { id: '4', name: 'Gestão de Férias', status: 'Ativo', module: 'gestao-pessoas' },
  { id: '5', name: 'Controle de Ponto & Jornada', status: 'Ativo', module: 'departamento-pessoal' },
  { id: '6', name: 'Gestão de Benefícios (Caju Flex)', status: 'Ativo', module: 'departamento-pessoal' },
  { id: '7', name: 'RPA & Prestadores PJ', status: 'Ativo', module: 'departamento-pessoal' },
  { id: '8', name: 'Desligamento & Rescisão', status: 'Ativo', module: 'gestao-pessoas' },
  { id: '9', name: 'Preparação da Folha de Pagamento', status: 'Ativo', module: 'departamento-pessoal' },
  { id: '10', name: 'Divisor de Holerites PDF', status: 'Ativo', module: 'departamento-pessoal' },
  { id: '11', name: 'Integrações & eSocial Oficial', status: 'Ativo', module: 'departamento-pessoal' },
  { id: '12', name: 'Auditoria de Conformidade & eSocial', status: 'Ativo', module: 'auditorias' },
  { id: '13', name: 'Trilha de Auditoria Imutável (Audit Trail)', status: 'Ativo', module: 'auditorias' },
  { id: '14', name: 'Workflows & Governança', status: 'Ativo', module: 'configuracoes' }
];
