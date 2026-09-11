import React, { useState } from 'react';
import { 
  UserPlus, 
  UserMinus, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Send, 
  UploadCloud, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal, 
  Download, 
  Eye, 
  Play, 
  RotateCw, 
  ArrowRight,
  ExternalLink,
  Bot,
  Laptop,
  Mail,
  Calendar,
  Building2,
  X,
  Award,
  FileCheck,
  CheckCheck,
  FolderOpen,
  ArrowUpRight,
  PhoneCall,
  UserCheck,
  Paperclip,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  ProcessoAdmissaoCompleto, 
  AdmissaoStage, 
  FormularioAdmissaoCompleto,
  DocumentoAnexoAdmissao 
} from '../../types/admissao';
import { 
  useStoredAdmissoes,
  calcularDiasTrabalhadosNoMes
} from '../../utils/admissaoStorage';
import { FormularioAdmissaoModal } from '../../components/admissao/FormularioAdmissaoModal';
import { NovoColaboradorAdmissaoModal } from '../../components/admissao/NovoColaboradorAdmissaoModal';
import { EnvioContadorModal } from '../../components/admissao/EnvioContadorModal';
import { StoneStartModal } from '../../components/admissao/StoneStartModal';
import { DisparoDocumentosModal } from '../../components/admissao/DisparoDocumentosModal';
import { calcularDataTerminoExperiencia, formatarDataBR } from '../../utils/documentosOnboardingHelper';

interface ProcessoDemissao {
  id: string;
  colaboradorNome: string;
  matricula: string;
  cpf: string;
  cargo: string;
  polo: string;
  tipoRescisao: 'SEM_JUSTA_CAUSA_EMPREGADOR' | 'PEDIDO_DEMISSAO' | 'ACORDO_MUTUO' | 'TERMINO_CONTRATO_EXP';
  avisoPrevio: 'INDENIZADO' | 'TRABALHADO' | 'DISPENSADO';
  dataDesligamento: string;
  status: 'CALCULO_RESCISORIO' | 'ASO_DEMISSIONAL' | 'TRCT_ASSINATURA' | 'DEVOLUCAO_ATIVOS' | 'ESOCIAL_S2299' | 'CONCLUIDO';
  progressoPorcentagem: number;
  etapaAtual: string;
  valorEstimadoRescisao: number;
}

const INITIAL_DEMISSOES: ProcessoDemissao[] = [
  {
    id: 'DEM-2026-001',
    colaboradorNome: 'Fernando Henrique Alencar',
    matricula: 'CLB-0042',
    cpf: '612.449.102-08',
    cargo: 'Eletricista de Manutenção',
    polo: 'Polo Paracatu',
    tipoRescisao: 'SEM_JUSTA_CAUSA_EMPREGADOR',
    avisoPrevio: 'INDENIZADO',
    dataDesligamento: '2026-08-30',
    status: 'TRCT_ASSINATURA',
    progressoPorcentagem: 70,
    etapaAtual: 'TRCT gerado automaticamente. Aguardando assinatura e quitação',
    valorEstimadoRescisao: 8740.50
  },
  {
    id: 'DEM-2026-002',
    colaboradorNome: 'Camila Beatriz Nogueira',
    matricula: 'CLB-0089',
    cpf: '409.112.553-71',
    cargo: 'Assistente de Logística',
    polo: 'Polo Limoeiro do Norte',
    tipoRescisao: 'PEDIDO_DEMISSAO',
    avisoPrevio: 'DISPENSADO',
    dataDesligamento: '2026-09-02',
    status: 'ASO_DEMISSIONAL',
    progressoPorcentagem: 40,
    etapaAtual: 'Guia de Exame Clínico Demissional agendada na clínica credenciada',
    valorEstimadoRescisao: 3420.00
  }
];

const STAGE_META: Record<AdmissaoStage, { step: number; title: string; subtitle: string; progress: number; badgeColor: string }> = {
  CADASTRO_INICIAL: {
    step: 1,
    title: '1. Cadastro na Plataforma',
    subtitle: 'Dados básicos inseridos & apuração proporcional',
    progress: 15,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  SOLICITACAO_PREVIA_DOCS: {
    step: 2,
    title: '2. Coleta Prévia',
    subtitle: 'ID, CPF e Comprovante de Residência antes do dia 25',
    progress: 30,
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  ENVIO_INICIAL_CONTADOR: {
    step: 3,
    title: '3. Envio Inicial Dia 25',
    subtitle: 'Docs prévios + dias trabalhados transmitidos ao contador',
    progress: 45,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  AGUARDANDO_STONE_START: {
    step: 4,
    title: '4. Stone Start em Andamento',
    subtitle: 'Colaborador realizando trilha de treinamento',
    progress: 55,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  STONE_START_APROVADO: {
    step: 4,
    title: '4b. Stone Start Aprovado',
    subtitle: 'Treinamento concluído • Liberado comando do formulário',
    progress: 70,
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  FORMULARIO_DISPARADO: {
    step: 5,
    title: '5. Formulário Integrado Disparado',
    subtitle: 'Link único enviado ao colaborador (substitui Google Forms)',
    progress: 80,
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200'
  },
  FORMULARIO_PREENCHIDO: {
    step: 5,
    title: '5b. Formulário Preenchido & Sincronizado',
    subtitle: 'Pasta de admissão criada no perfil com acesso restrito',
    progress: 88,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  },
  ENVIO_FINAL_CONTADOR: {
    step: 6,
    title: '6. Envio Final Dia 25',
    subtitle: 'Pacote completo e espelho transmitidos à contabilidade',
    progress: 95,
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200'
  },
  ADMISSAO_CONCLUIDA: {
    step: 7,
    title: '7. Admissão Homologada',
    subtitle: 'Colaborador 100% admitido e ativo no Quadro Geral SCL',
    progress: 100,
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  }
};

export const AdmissaoDemissaoModule: React.FC = () => {
  const { branchSelectionLabel } = useAuth();
  const [activeTab, setActiveTab] = useState<'admissoes' | 'disparos_onboarding' | 'demissoes' | 'etapas_explicacao' | 'regras'>('admissoes');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('ALL');

  // Admissões Storage Hook
  const { 
    admissoes, 
    addProcesso, 
    solicitarDocs,
    enviarDocsIniciaisContador,
    aprovarStoneStart,
    dispararFormulario,
    submeterFormulario,
    enviarAdmissaoFinal,
    concluirAdmissao,
    dispararDocumentosPrimeiroDia,
    dispararContratoFinal,
    assinarDocumento
  } = useStoredAdmissoes();

  const [demissoesList] = useState<ProcessoDemissao[]>(INITIAL_DEMISSOES);

  // Modals state
  const [isNovoColaboradorModalOpen, setIsNovoColaboradorModalOpen] = useState(false);
  const [isNewDemissaoModalOpen, setIsNewDemissaoModalOpen] = useState(false);
  
  // Interactive Action Modals
  const [selectedProcessoParaForms, setSelectedProcessoParaForms] = useState<ProcessoAdmissaoCompleto | null>(null);
  const [selectedProcessoParaEnvio, setSelectedProcessoParaEnvio] = useState<{
    processo: ProcessoAdmissaoCompleto;
    tipo: 'ENVIO_INICIAL_PREVIA' | 'ENVIO_FINAL_ADMISSAO';
  } | null>(null);
  const [selectedProcessoParaStoneStart, setSelectedProcessoParaStoneStart] = useState<ProcessoAdmissaoCompleto | null>(null);
  const [selectedProcessoParaDisparos, setSelectedProcessoParaDisparos] = useState<ProcessoAdmissaoCompleto | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers for Admission Workflow
  const handleAddNovoColaborador = (dados: Partial<ProcessoAdmissaoCompleto>) => {
    const novo = addProcesso(dados);
    showToast(`Colaborador ${novo.candidatoNome} adicionado na plataforma! Solicitação de ID, CPF e Residência disparada.`);
  };

  const handleSubmeterFormulario = (
    processId: string, 
    dados: FormularioAdmissaoCompleto, 
    anexos: DocumentoAnexoAdmissao[]
  ) => {
    submeterFormulario(processId, dados, anexos, 'Analista de DP / Plataforma');
    setSelectedProcessoParaForms(null);
    showToast(`Formulário integrado de ${dados.nomeCompleto} salvo com sucesso e pasta de documentos sincronizada no perfil!`);
  };

  const handleConfirmEnvioContador = (processId: string, emailContador: string, diasTrabalhados: number) => {
    if (!selectedProcessoParaEnvio) return;
    if (selectedProcessoParaEnvio.tipo === 'ENVIO_INICIAL_PREVIA') {
      enviarDocsIniciaisContador(processId, emailContador, diasTrabalhados, 'Isabela Soares (Analista DP)');
      showToast(`Documentação prévia e cálculo de ${diasTrabalhados} dias enviados no dia 25 ao contador!`);
    } else {
      enviarAdmissaoFinal(processId, emailContador, 'Isabela Soares (Analista DP)');
      showToast(`Dossiê completo de admissão transmitido à contabilidade com protocolo do dia 25!`);
    }
    setSelectedProcessoParaEnvio(null);
  };

  const handleApproveStoneStart = (processId: string, aprovador: string, obs?: string) => {
    aprovarStoneStart(processId, aprovador, obs);
    setSelectedProcessoParaStoneStart(null);
    showToast(`Stone Start aprovado com sucesso! Formulário Integrado de Admissão liberado.`);
  };

  const handleConcluirAdmissaoEfetiva = (processId: string) => {
    concluirAdmissao(processId, 'Isabela Soares (Analista DP)');
    showToast(`Admissão concluída com sucesso! Colaborador ativo no quadro da SCL Solar.`);
  };

  const filteredAdmissoes = admissoes.filter(a => {
    const matchesSearch = 
      a.candidatoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.poloNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.cpf.includes(searchTerm);
    
    if (filterStage === 'ALL') return matchesSearch;
    return matchesSearch && a.etapaAtual === filterStage;
  });

  const filteredDemissoes = demissoesList.filter(d => 
    d.colaboradorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.polo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.matricula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 text-xs font-semibold animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Admissão e Demissão
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <Zap className="w-3 h-3 text-emerald-600 animate-pulse" />
              Fluxo Automático Integrado SCL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestão ponta a ponta dos 7 passos de admissão: cadastro, solicitação de ID/CPF/Residência, rotina do dia 25, Stone Start, formulário integrado ao perfil e homologação.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNovoColaboradorModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Adicionar Colaborador (Etapa 1)</span>
          </button>

          <button
            onClick={() => setIsNewDemissaoModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <UserMinus className="w-4 h-4" />
            <span>+ Iniciar Demissão</span>
          </button>
        </div>
      </div>

      {/* Workflow 7-Steps Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold tracking-wider uppercase text-blue-200">
              Fluxo Padrão SCL de Admissão (7 Etapas Obrigatórias)
            </h3>
          </div>
          <span className="text-[11px] text-slate-300 font-medium">
            Prazo Contábil: <strong>Todo dia 25 do mês</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-[11px]">
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-bold text-blue-400 block font-mono">1. Cadastro</span>
            <p className="text-slate-200 mt-0.5 leading-tight">Adicionar dados na plataforma</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-bold text-blue-400 block font-mono">2. Coleta Prévia</span>
            <p className="text-slate-200 mt-0.5 leading-tight">ID, CPF & Residência antes do dia 25</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-bold text-blue-400 block font-mono">3. Envio Dia 25</span>
            <p className="text-slate-200 mt-0.5 leading-tight">Ao contador com dias trabalhados</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-bold text-amber-400 block font-mono">4. Stone Start</span>
            <p className="text-slate-200 mt-0.5 leading-tight">Treinamento e aguardo de aprovação</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-bold text-emerald-400 block font-mono">5. Forms Integrado</span>
            <p className="text-slate-200 mt-0.5 leading-tight">Substitui Forms + Pasta restrita</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-bold text-blue-400 block font-mono">6. Envio Final</span>
            <p className="text-slate-200 mt-0.5 leading-tight">No dia 25 para a contabilidade</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-bold text-emerald-400 block font-mono">7. Admitido</span>
            <p className="text-slate-200 mt-0.5 leading-tight">Colaborador 100% formalizado</p>
          </div>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Processos em Aberto</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{admissoes.length}</span>
            <span className="text-xs text-blue-600 font-semibold">
              {admissoes.filter(a => a.etapaAtual === 'ADMISSAO_CONCLUIDA').length} admitidos
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Aguardando Dia 25</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">
              {admissoes.filter(a => a.etapaAtual === 'SOLICITACAO_PREVIA_DOCS' || a.etapaAtual === 'FORMULARIO_PREENCHIDO').length}
            </span>
            <span className="text-xs text-amber-700 font-medium">para envio ao contador</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">No Stone Start</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-700">
              {admissoes.filter(a => a.etapaAtual === 'AGUARDANDO_STONE_START').length}
            </span>
            <span className="text-xs text-purple-600 font-medium">em treinamento</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pastas Restritas Criadas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">
              {admissoes.filter(a => a.formularioDados !== undefined || a.etapaAtual === 'FORMULARIO_PREENCHIDO' || a.etapaAtual === 'ENVIO_FINAL_CONTADOR' || a.etapaAtual === 'ADMISSAO_CONCLUIDA').length}
            </span>
            <span className="text-xs text-slate-500 font-medium">no perfil</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-3 py-1.5 rounded-xl border flex-wrap">
        <button
          onClick={() => setActiveTab('admissoes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'admissoes'
              ? 'bg-blue-50 text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Processos de Admissão SCL ({admissoes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('disparos_onboarding')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'disparos_onboarding'
              ? 'bg-amber-50 text-amber-900 shadow-2xs border border-amber-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Disparos Onboarding (1º Dia & Experiência)</span>
        </button>

        <button
          onClick={() => setActiveTab('demissoes')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'demissoes'
              ? 'bg-blue-50 text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <UserMinus className="w-3.5 h-3.5" />
          <span>Processos de Demissão & Rescisão ({demissoesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('etapas_explicacao')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'etapas_explicacao'
              ? 'bg-blue-50 text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Formulário Integrado & Documentos</span>
        </button>

        <button
          onClick={() => setActiveTab('regras')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'regras'
              ? 'bg-blue-50 text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Regras do Dia 25 & Contabilidade</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por candidato, CPF, cargo ou polo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todas as Etapas</option>
            <option value="CADASTRO_INICIAL">1. Cadastro Inicial</option>
            <option value="SOLICITACAO_PREVIA_DOCS">2. Coleta Prévia (ID/CPF/Residência)</option>
            <option value="ENVIO_INICIAL_CONTADOR">3. Envio Inicial Dia 25</option>
            <option value="AGUARDANDO_STONE_START">4. No Stone Start</option>
            <option value="STONE_START_APROVADO">4b. Stone Start Aprovado</option>
            <option value="FORMULARIO_DISPARADO">5. Formulário Disparado</option>
            <option value="FORMULARIO_PREENCHIDO">5b. Formulário Preenchido</option>
            <option value="ENVIO_FINAL_CONTADOR">6. Envio Final Dia 25</option>
            <option value="ADMISSAO_CONCLUIDA">7. Admitido</option>
          </select>

          <span className="text-xs text-slate-500 hidden md:inline">
            Unidade: <strong className="text-slate-800">{branchSelectionLabel}</strong>
          </span>
        </div>
      </div>

      {/* TAB 1: ADMISSOES SCL */}
      {activeTab === 'admissoes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Controle da Esteira de Admissão (Fluxo SCL)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Gerencie o avanço de cada candidato com comandos de disparo do formulário integrado e envio contábil no dia 25
                </p>
              </div>
              <button 
                onClick={() => showToast('Esteira de admissões atualizada com sucesso.')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Atualizar</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredAdmissoes.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Nenhum processo de admissão encontrado para o filtro selecionado.
                </div>
              ) : (
                filteredAdmissoes.map((adm) => {
                  const apuracao = calcularDiasTrabalhadosNoMes(adm.dataInicioAtividades);
                  const stageInfo = STAGE_META[adm.etapaAtual] || STAGE_META.CADASTRO_INICIAL;
                  const envioInicial = adm.enviosContador.find(e => e.tipo === 'ENVIO_INICIAL_PREVIA');
                  const envioFinal = adm.enviosContador.find(e => e.tipo === 'ENVIO_FINAL_ADMISSAO');

                  return (
                    <div key={adm.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-4">
                      {/* Top Info Bar */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{adm.candidatoNome}</h4>
                            <span className="text-[11px] font-mono text-slate-400">({adm.cpf})</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {adm.id}
                            </span>
                            {(adm.formularioDados !== undefined || adm.etapaAtual === 'FORMULARIO_PREENCHIDO' || adm.etapaAtual === 'ENVIO_FINAL_CONTADOR' || adm.etapaAtual === 'ADMISSAO_CONCLUIDA') && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Pasta de Admissão Sincronizada no Perfil
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span><strong>Cargo:</strong> {adm.cargo}</span>
                            <span>•</span>
                            <span><strong>Polo:</strong> {adm.poloNome}</span>
                            <span>•</span>
                            <span><strong>Início Atividades:</strong> {adm.dataInicioAtividades}</span>
                            <span>•</span>
                            <span className="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                              {adm.diasTrabalhadosPrimeiroMes} dias trabalhados no 1º mês
                            </span>
                          </div>
                        </div>

                        {/* Interactive Context Actions based on Stage */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          
                          {/* ETAPA 1 ou 2: Solicitar Docs Iniciais */}
                          {(adm.etapaAtual === 'CADASTRO_INICIAL' || adm.etapaAtual === 'SOLICITACAO_PREVIA_DOCS') && (
                            <>
                              <button
                                onClick={() => {
                                  solicitarDocs(adm.id, 'WHATSAPP');
                                  showToast(`Link de solicitação de ID, CPF e Comprovante disparado para ${adm.candidatoNome}!`);
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                title="Solicitar ID, CPF e Comprovante antes do dia 25"
                              >
                                <Send className="w-3.5 h-3.5 text-blue-600" />
                                <span>Solicitar Docs Prévios</span>
                              </button>
                              <button
                                onClick={() => setSelectedProcessoParaEnvio({ processo: adm, tipo: 'ENVIO_INICIAL_PREVIA' })}
                                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Enviar ao Contador (Dia 25)</span>
                              </button>
                            </>
                          )}

                          {/* ETAPA 3: Envio Inicial Dia 25 */}
                          {adm.etapaAtual === 'ENVIO_INICIAL_CONTADOR' && (
                            <button
                              onClick={() => setSelectedProcessoParaEnvio({ processo: adm, tipo: 'ENVIO_INICIAL_PREVIA' })}
                              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Disparar E-mail do Dia 25 ao Contador</span>
                            </button>
                          )}

                          {/* ETAPA 4: Stone Start */}
                          {adm.etapaAtual === 'AGUARDANDO_STONE_START' && (
                            <button
                              onClick={() => setSelectedProcessoParaStoneStart(adm)}
                              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Registrar Aprovação Stone Start</span>
                            </button>
                          )}

                          {/* ETAPA 4b ou 5: Formulário Integrado SCL */}
                          {(adm.etapaAtual === 'STONE_START_APROVADO' || adm.etapaAtual === 'FORMULARIO_DISPARADO') && (
                            <>
                              <button
                                onClick={() => {
                                  dispararFormulario(adm.id, 'Isabela Soares (Analista DP)');
                                  showToast(`Comando executado! Link do Formulário Integrado de Admissão disparado via WhatsApp e E-mail para ${adm.candidatoNome}.`);
                                }}
                                className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Disparar Forms por Comando</span>
                              </button>
                              <button
                                onClick={() => setSelectedProcessoParaForms(adm)}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Preencher Formulário Integrado</span>
                              </button>
                            </>
                          )}

                          {/* ETAPA 5b: Formulário Preenchido -> Liberado para Envio Final Dia 25 */}
                          {adm.etapaAtual === 'FORMULARIO_PREENCHIDO' && (
                            <button
                              onClick={() => setSelectedProcessoParaEnvio({ processo: adm, tipo: 'ENVIO_FINAL_ADMISSAO' })}
                              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Enviar Dossiê Final Dia 25 ao Contador</span>
                            </button>
                          )}

                          {/* ETAPA 6: Envio Final Dia 25 */}
                          {adm.etapaAtual === 'ENVIO_FINAL_CONTADOR' && (
                            <button
                              onClick={() => handleConcluirAdmissaoEfetiva(adm.id)}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Homologar Admissão (Etapa 7)</span>
                            </button>
                          )}

                          {/* ETAPA 7: Concluir / Admitido */}
                          {adm.etapaAtual === 'ADMISSAO_CONCLUIDA' ? (
                            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Admissão Homologada
                            </span>
                          ) : (
                            <button
                              onClick={() => handleConcluirAdmissaoEfetiva(adm.id)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                              title="Forçar homologação imediata"
                            >
                              Homologar
                            </button>
                          )}

                          {/* Botão de Disparo de Documentos de Onboarding */}
                          <button
                            onClick={() => setSelectedProcessoParaDisparos(adm)}
                            className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Gerenciar disparos de documentos (1º Dia e Fim de Experiência)"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Docs Onboarding</span>
                            {adm.disparosOnboarding?.primeiroDiaOnboarding?.status === 'ASSINADO' && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500" title="1º Dia Assinado" />
                            )}
                          </button>

                          {/* Botão de abrir formulário a qualquer momento para revisão */}
                          <button
                            onClick={() => setSelectedProcessoParaForms(adm)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            title="Revisar questionário integrado"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>Ver Formulário</span>
                          </button>
                        </div>
                      </div>

                      {/* 7-Step Horizontal Stepper */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/90 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono text-[10px]">
                              {stageInfo.step}
                            </span>
                            {stageInfo.title}: <span className="text-slate-600 font-normal">{stageInfo.subtitle}</span>
                          </span>
                          <span className="font-mono font-bold text-blue-700">{stageInfo.progress}%</span>
                        </div>

                        {/* Progress Line */}
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${stageInfo.progress}%` }}
                          />
                        </div>

                        {/* Document, Protocol & Onboarding Dispatches badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-600">
                          <div className="flex flex-wrap items-center gap-2">
                            {envioInicial && (
                              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-mono">
                                Prot. Inicial (Dia 25): {envioInicial.protocolo}
                              </span>
                            )}
                            {adm.stoneStart.status === 'APROVADO' && (
                              <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                <Award className="w-3 h-3 text-purple-600" />
                                Stone Start Aprovado ({adm.stoneStart.aprovadoPor || 'Liderança'})
                              </span>
                            )}
                            {envioFinal && (
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                                Prot. Final (Dia 25): {envioFinal.protocolo}
                              </span>
                            )}
                          </div>

                          {/* Mini Onboarding status badge */}
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-slate-500 font-medium">Automações Onboarding:</span>
                            <span className={`px-2 py-0.5 rounded-full font-bold border ${
                              adm.disparosOnboarding?.primeiroDiaOnboarding?.status === 'ASSINADO'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : adm.disparosOnboarding?.primeiroDiaOnboarding?.status === 'DISPARADO'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              🚀 1º Dia: {adm.disparosOnboarding?.primeiroDiaOnboarding?.status || 'AGENDADO'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-bold border ${
                              adm.disparosOnboarding?.finalPeriodoExperiencia?.status === 'ASSINADO'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : adm.disparosOnboarding?.finalPeriodoExperiencia?.status === 'DISPARADO'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              🎯 90d Exp: {adm.disparosOnboarding?.finalPeriodoExperiencia?.status || 'AGENDADO'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: DISPAROS AUTOMÁTICOS DE ONBOARDING (1º DIA & EXPERIÊNCIA) */}
      {activeTab === 'disparos_onboarding' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Header Banner explaining the 2 Automated Triggers */}
          <div className="bg-linear-to-r from-amber-900 via-slate-900 to-blue-950 text-white p-6 rounded-2xl border border-amber-500/30 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold tracking-wider uppercase text-amber-200">
                    Disparo Automático de Documentos de Onboarding & Contratos
                  </h3>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Sistema de disparo programado nos dois momentos críticos da jornada: no <strong>1º dia de onboarding</strong> (informado no cadastro) e no <strong>término do período de experiência de 90 dias</strong> (CLT).
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Agendamento Inteligente CLT
                </span>
              </div>
            </div>

            {/* Two triggers comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t border-white/10 text-xs">
              <div className="bg-white/10 border border-white/15 p-4 rounded-xl backdrop-blur-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                    <Send className="w-4 h-4 text-amber-400" />
                    1º Disparo Automático: 1º Dia de Onboarding
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 font-mono text-[10px] font-bold">
                    3 Documentos
                  </span>
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Disparado automaticamente na data de início das atividades definida no cadastro do colaborador:
                </p>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>1. Contrato de Experiência:</strong> Período inicial de 45 dias prorrogável por mais 45 dias (Art. 445 CLT).</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>2. Termo de Renúncia do Vale Transporte:</strong> Declaração formal de não utilização de transporte coletivo.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>3. Manual de Conduta e Ética:</strong> Termo de recebimento, ciência e compromisso com os valores da SCL Solar.</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 border border-white/15 p-4 rounded-xl backdrop-blur-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-300 flex items-center gap-1.5 text-xs">
                    <Award className="w-4 h-4 text-blue-400" />
                    2º Disparo Automático: Final da Experiência (+90 dias)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-400/20 text-blue-200 font-mono text-[10px] font-bold">
                    1 Documento
                  </span>
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Disparado automaticamente após a conclusão e aprovação dos 90 dias do período probatório:
                </p>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span><strong>1. Contrato de Trabalho Definitivo:</strong> Instrumento de efetivação por prazo indeterminado, garantindo todos os direitos e prerrogativas integrais CLT.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table / List of all processes with document dispatch actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Painel de Disparos por Colaborador
                </h3>
                <p className="text-[11px] text-slate-500">
                  Monitore o status de agendamento, envio e assinatura dos pacotes de documentos
                </p>
              </div>
              <span className="text-xs text-slate-600 font-medium">
                Total de Colaboradores: <strong>{admissoes.length}</strong>
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {admissoes.map((adm) => {
                const p1 = adm.disparosOnboarding?.primeiroDiaOnboarding;
                const p2 = adm.disparosOnboarding?.finalPeriodoExperiencia;
                const dtFimExp = p2?.dataAgendada || calcularDataTerminoExperiencia(adm.dataInicioAtividades, 90);

                return (
                  <div key={adm.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{adm.candidatoNome}</h4>
                          <span className="text-[11px] font-mono text-slate-400">({adm.cpf})</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {adm.cargo}
                          </span>
                          <span className="text-xs text-slate-500">
                            Polo: <strong>{adm.poloNome}</strong>
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span>1º Dia de Onboarding: <strong>{formatarDataBR(adm.dataInicioAtividades)}</strong></span>
                          <span>•</span>
                          <span>Fim da Experiência (90d): <strong>{formatarDataBR(dtFimExp)}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedProcessoParaDisparos(adm)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Abrir Central de Disparos & Assinaturas</span>
                        </button>
                      </div>
                    </div>

                    {/* Status grid of both dispatches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      
                      {/* Box 1º Dia */}
                      <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5 text-amber-600" />
                            1º Dia ({formatarDataBR(p1?.dataAgendada || adm.dataInicioAtividades)})
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            p1?.status === 'ASSINADO'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : p1?.status === 'DISPARADO'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}>
                            {p1?.status === 'ASSINADO' ? '✓ Todos Assinados' : p1?.status === 'DISPARADO' ? 'Disparado (Aguardando Assinatura)' : 'Agendado'}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-[11px] text-slate-700">
                          {p1?.documentos?.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between bg-white p-1.5 rounded border border-amber-100">
                              <span className="truncate max-w-[280px]">{doc.titulo}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                doc.status === 'ASSINADO' 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : doc.status === 'DISPARADO' 
                                  ? 'bg-blue-50 text-blue-700' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {doc.status}
                              </span>
                            </div>
                          ))}
                        </div>

                        {p1?.status === 'AGENDADO' && (
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => {
                                dispararDocumentosPrimeiroDia(adm.id, 'WHATSAPP_EMAIL', 'Isabela Soares (Analista DP)');
                                showToast(`Disparo de documentos do 1º dia executado para ${adm.candidatoNome}!`);
                              }}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold cursor-pointer"
                            >
                              Disparar 3 Documentos Agora
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Box Fim de Experiência */}
                      <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-blue-600" />
                            Fim da Experiência ({formatarDataBR(dtFimExp)})
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            p2?.status === 'ASSINADO'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : p2?.status === 'DISPARADO'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}>
                            {p2?.status === 'ASSINADO' ? '✓ Contrato Assinado' : p2?.status === 'DISPARADO' ? 'Disparado' : 'Agendado (+90d)'}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px] text-slate-700">
                          {p2?.documentos?.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between bg-white p-1.5 rounded border border-blue-100">
                              <span className="truncate max-w-[280px]">{doc.titulo}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                doc.status === 'ASSINADO' 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : doc.status === 'DISPARADO' 
                                  ? 'bg-blue-50 text-blue-700' 
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {doc.status}
                              </span>
                            </div>
                          ))}
                        </div>

                        {p2?.status === 'AGENDADO' && (
                          <div className="pt-1 flex justify-end">
                            <button
                              onClick={() => {
                                dispararContratoFinal(adm.id, 'WHATSAPP_EMAIL', 'Isabela Soares (Analista DP)');
                                showToast(`Disparo do contrato definitivo de experiência executado para ${adm.candidatoNome}!`);
                              }}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold cursor-pointer"
                            >
                              Disparar Contrato Definitivo Agora
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DEMISSOES & RESCISOES */}
      {activeTab === 'demissoes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Esteira de Demissões &amp; Rescisões Automatizadas
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cálculo preliminar de verbas rescisórias, TRCT oficial, agendamento de ASO e evento S-2299
                </p>
              </div>
              <button 
                onClick={() => showToast('Atualizando cálculos rescisórios com a folha...')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Recalcular Verbas</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredDemissoes.map((dem) => (
                <div key={dem.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{dem.colaboradorNome}</h4>
                        <span className="text-[11px] font-mono text-slate-400">({dem.matricula})</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {dem.id}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span><strong>Tipo:</strong> {dem.tipoRescisao.replace(/_/g, ' ')}</span>
                        <span>•</span>
                        <span><strong>Aviso:</strong> {dem.avisoPrevio}</span>
                        <span>•</span>
                        <span><strong>Data Efetiva:</strong> {new Date(dem.dataDesligamento + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <span><strong>Valor Estimado:</strong> <strong className="text-emerald-700">R$ {dem.valorEstimadoRescisao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => showToast(`Baixando minuta de TRCT de ${dem.colaboradorNome}`)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Baixar minuta de TRCT"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Minuta TRCT</span>
                      </button>
                      <button
                        onClick={() => showToast(`Abrindo processo rescisório de ${dem.colaboradorNome}`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Gerenciar Rescisão</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar & Current Step */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-rose-600" />
                        {dem.etapaAtual}
                      </span>
                      <span className="font-mono font-bold text-rose-700">{dem.progressoPorcentagem}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-600 rounded-full transition-all duration-300"
                        style={{ width: `${dem.progressoPorcentagem}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FORMULARIO INTEGRADO E DOCUMENTOS EXPLICACAO */}
      {activeTab === 'etapas_explicacao' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Substituição do Google Forms pelo Formulário Nativo SCL
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Todas as respostas e arquivos são consolidados automaticamente no perfil do colaborador, na pasta de acesso restrito (apenas o próprio colaborador, lideranças e analistas de DP).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-xs">Abas do Formulário Integrado</h4>
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                <li><strong>1. Dados Pessoais & Documentos:</strong> Nome, RG, Órgão Emissor, Data Emissão, Estado Civil, Grau de Instrução, Nome dos Pais.</li>
                <li><strong>2. Endereço & Moradia:</strong> CEP com busca automática, Logradouro, Número, Bairro, Cidade, UF.</li>
                <li><strong>3. Dados Bancários:</strong> Banco, Tipo de Conta (Corrente/Salário), Agência, Conta e Chave PIX.</li>
                <li><strong>4. Dependentes & Filhos:</strong> Nome do dependente, CPF, Data de Nascimento, Grau de Parentesco e Anexo de Certidão.</li>
                <li><strong>5. Uploads de Anexos:</strong> RG/CNH frente e verso, Comprovante Residência, Foto 3x4, ASO Admissional.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-xs">Pasta de Documentos de Admissão no Perfil</h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Ao preencher e salvar o formulário, o sistema:
              </p>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                <li>Atualiza os campos cadastrais oficiais do colaborador na base de dados.</li>
                <li>Cria a <strong>Pasta: Documentos de Admissão</strong> dentro da aba Documentos do perfil.</li>
                <li>Aplica a tag de conformidade LGPD e trava de segurança: <em>Apenas Colaborador, Lideranças e Analistas de DP</em>.</li>
                <li>Gera o espelho cadastral PDF pronto para o envio contábil do dia 25.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REGRAS E CONFIGURACAO DO DIA 25 */}
      {activeTab === 'regras' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Premissas e Regras do Fluxo do Dia 25
            </h3>
            <p className="text-[11px] text-slate-500">
              Parametrização do fechamento com a contabilidade parceira da SCL Solar
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">1. Coleta Prévia Obrigatória antes do dia 25</h4>
                <p className="text-[11px] text-slate-500">
                  O sistema bloqueia admissões sem a tríade preliminar: ID (RG ou CNH), Cartão de CPF e Comprovante de Residência recente.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Ativo
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">2. Cálculo Automático dos Dias Trabalhados no 1º Mês</h4>
                <p className="text-[11px] text-slate-500">
                  Calcula a quantidade exata de dias entre o início das atividades e o fechamento do mês para apuração do salário proporcional na folha.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Ativo
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">3. Gatilho de Aprovação do Stone Start</h4>
                <p className="text-[11px] text-slate-500">
                  O Formulário Integrado de Admissão só é liberado para preenchimento definitivo após a validação da conclusão do Stone Start pela liderança.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Ativo
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: NOVO COLABORADOR (ETAPA 1) */}
      {isNovoColaboradorModalOpen && (
        <NovoColaboradorAdmissaoModal
          onClose={() => setIsNovoColaboradorModalOpen(false)}
          onAddColaborador={handleAddNovoColaborador}
        />
      )}

      {/* MODAL 2: FORMULÁRIO INTEGRADO DE ADMISSÃO (ETAPA 4/5) */}
      {selectedProcessoParaForms && (
        <FormularioAdmissaoModal
          processo={selectedProcessoParaForms}
          onClose={() => setSelectedProcessoParaForms(null)}
          onSubmitFormulario={handleSubmeterFormulario}
        />
      )}

      {/* MODAL 3: ENVIO AO CONTADOR DIA 25 (ETAPA 3 OU 6) */}
      {selectedProcessoParaEnvio && (
        <EnvioContadorModal
          processo={selectedProcessoParaEnvio.processo}
          tipoEnvio={selectedProcessoParaEnvio.tipo}
          onClose={() => setSelectedProcessoParaEnvio(null)}
          onConfirmEnvio={handleConfirmEnvioContador}
        />
      )}

      {/* MODAL 4: APROVAÇÃO STONE START (ETAPA 4) */}
      {selectedProcessoParaStoneStart && (
        <StoneStartModal
          processo={selectedProcessoParaStoneStart}
          onClose={() => setSelectedProcessoParaStoneStart(null)}
          onApprove={handleApproveStoneStart}
        />
      )}

      {/* MODAL 5: DEMISSAO */}
      {isNewDemissaoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserMinus className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-sm text-white">Iniciar Processo de Demissão / Rescisão</h3>
              </div>
              <button 
                onClick={() => setIsNewDemissaoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewDemissaoModalOpen(false);
                showToast('Processo de demissão iniciado! Cálculo preliminar gerado e ASO demissional agendado.');
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Colaborador(a)</label>
                <input required type="text" placeholder="Nome ou Matrícula do Colaborador" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tipo de Rescisão</label>
                  <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                    <option value="SEM_JUSTA_CAUSA_EMPREGADOR">Dispensa sem Justa Causa</option>
                    <option value="PEDIDO_DEMISSAO">Pedido de Demissão</option>
                    <option value="ACORDO_MUTUO">Acordo Mútuo (Art. 484-A)</option>
                    <option value="COM_JUSTA_CAUSA">Dispensa com Justa Causa</option>
                    <option value="TERMINO_EXPERIENCIA">Término de Contrato Experiência</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Aviso Prévio</label>
                  <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                    <option value="INDENIZADO">Indenizado</option>
                    <option value="TRABALHADO">Trabalhado</option>
                    <option value="DISPENSADO">Dispensado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Data Efetiva de Desligamento</label>
                <input required type="date" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800" />
              </div>

              <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 text-rose-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-rose-600" />
                  O que o robô executará automaticamente:
                </div>
                <p className="text-[11px] text-rose-800">
                  1. Calcula todas as verbas rescisórias e gera o Termo de Rescisão (TRCT).<br />
                  2. Agenda a emissão da guia do Exame Clínico Demissional.<br />
                  3. Cria o checklist de devolução de equipamentos e baixa de acessos.<br />
                  4. Gera o evento S-2299 para transmissão ao eSocial.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewDemissaoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Processar Desligamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: DISPARO AUTOMÁTICO DE DOCUMENTOS (1º DIA & EXPERIÊNCIA) */}
      {selectedProcessoParaDisparos && (
        <DisparoDocumentosModal
          processo={selectedProcessoParaDisparos}
          onClose={() => setSelectedProcessoParaDisparos(null)}
          onDispararPrimeiroDia={(processId, canal) => {
            dispararDocumentosPrimeiroDia(processId, canal, 'Isabela Soares (Analista DP)');
            showToast('Documentos do 1º Dia de Onboarding disparados com sucesso via WhatsApp/E-mail!');
          }}
          onDispararFinalExperiencia={(processId, canal) => {
            dispararContratoFinal(processId, canal, 'Isabela Soares (Analista DP)');
            showToast('Contrato de Trabalho Definitivo (Fim da Experiência) disparado com sucesso!');
          }}
          onAssinarDocumento={(processId, docId, assinadoPor) => {
            assinarDocumento(processId, docId, assinadoPor || 'Colaborador (Assinatura Eletrônica)');
            showToast('Documento assinado digitalmente e sincronizado na pasta de documentos!');
          }}
        />
      )}
    </div>
  );
};
