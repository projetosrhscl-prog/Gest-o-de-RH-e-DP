import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  User, 
  Building, 
  FileText, 
  DollarSign,
  X,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUpAZ,
  ArrowDownAZ,
  MapPin,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sparkles,
  CalendarCheck,
  CalendarRange
} from 'lucide-react';
import { VacationRequest, VacationStatus, CollaboratorProfile } from '../../../types/collaborator';
import { INITIAL_VACATION_REQUESTS } from '../../../data/mockData';
import { useAuth } from '../../../context/AuthContext';
import { useStoredCollaborators } from '../../../utils/collaboratorsStorage';
import { formatDateBR } from '../../../utils/dateHelper';
import { 
  getAllCalculatedVacationPeriods, 
  calculateVacationDashboardMetrics,
  VacationCalculatedPeriod 
} from '../../../utils/vacationHelper';

export const FeriasProcessosView: React.FC = () => {
  const { selectedBranchIds, logAction } = useAuth();
  const [activeTab, setActiveTab] = useState<'saldo' | 'kanban'>('saldo');

  const [requests, setRequests] = useState<VacationRequest[]>(INITIAL_VACATION_REQUESTS);
  const { collaborators, purgeDuplicates } = useStoredCollaborators();

  useEffect(() => {
    try {
      purgeDuplicates();
    } catch (e) {
      console.warn('Erro ao purgar duplicados em Férias:', e);
    }
  }, [purgeDuplicates]);

  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [selectedPeriodForSchedule, setSelectedPeriodForSchedule] = useState<VacationCalculatedPeriod | null>(null);
  const [selectedColabDetails, setSelectedColabDetails] = useState<CollaboratorProfile | null>(null);
  const [showPremiseBanner, setShowPremiseBanner] = useState(true);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoloFilter, setSelectedPoloFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICO' | 'ATENCAO' | 'TRANQUILO' | 'DISPONIVEL' | 'EM_FORMACAO'>('ALL');
  const [sortBy, setSortBy] = useState<'URGENCY_ASC' | 'NAME_ASC' | 'NAME_DESC' | 'BALANCE_DESC' | 'ACQUIRED_DESC'>('URGENCY_ASC');

  // Form State
  const [selectedColabId, setSelectedColabId] = useState(collaborators[0]?.id || 'colab-1');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-30');
  const [daysCount, setDaysCount] = useState(15);
  const [abonoDays, setAbonoDays] = useState(0);
  const [advance13th, setAdvance13th] = useState(false);
  const [observations, setObservations] = useState('');

  // Available Polos list
  const availablePolos = useMemo(() => {
    const poloMap = new Map<string, { id: string; name: string; count: number }>();
    collaborators.forEach(c => {
      const existing = poloMap.get(c.branchId);
      if (existing) {
        existing.count += 1;
      } else {
        poloMap.set(c.branchId, { id: c.branchId, name: c.branchName, count: 1 });
      }
    });
    return Array.from(poloMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [collaborators]);

  // All calculated vacation periods
  const allCalculatedPeriods = useMemo(() => {
    return getAllCalculatedVacationPeriods(collaborators, '2026-09-08');
  }, [collaborators]);

  // Executive Metrics
  const dashboardMetrics = useMemo(() => {
    return calculateVacationDashboardMetrics(allCalculatedPeriods, collaborators);
  }, [allCalculatedPeriods, collaborators]);

  // Filtered & Sorted Periods for the Table
  const filteredPeriods = useMemo(() => {
    return allCalculatedPeriods.filter((p) => {
      // Permission filter
      if (!selectedBranchIds.includes(p.branchId)) return false;

      // Polo filter
      if (selectedPoloFilter !== 'ALL' && p.branchId !== selectedPoloFilter) return false;

      // Status / Urgency filter
      if (statusFilter === 'CRITICO' && p.urgencyLevel !== 'CRITICO') return false;
      if (statusFilter === 'ATENCAO' && p.urgencyLevel !== 'ATENCAO') return false;
      if (statusFilter === 'TRANQUILO' && p.urgencyLevel !== 'NORMAL') return false;
      if (statusFilter === 'EM_FORMACAO' && !p.isForming) return false;
      if (statusFilter === 'DISPONIVEL' && (p.isForming || p.remainingBalance <= 0)) return false;

      // Search term
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          p.collaboratorName.toLowerCase().includes(q) ||
          p.branchName.toLowerCase().includes(q) ||
          p.departmentName.toLowerCase().includes(q) ||
          p.positionTitle.toLowerCase().includes(q) ||
          p.registrationNumber.toLowerCase().includes(q)
        );
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'URGENCY_ASC') {
        // Críticos e Atenção primeiro, depois menor dias para o limite
        return a.daysToDeadline - b.daysToDeadline;
      }
      if (sortBy === 'NAME_ASC') {
        return a.collaboratorName.localeCompare(b.collaboratorName, 'pt-BR');
      }
      if (sortBy === 'NAME_DESC') {
        return b.collaboratorName.localeCompare(a.collaboratorName, 'pt-BR');
      }
      if (sortBy === 'BALANCE_DESC') {
        return b.remainingBalance - a.remainingBalance;
      }
      if (sortBy === 'ACQUIRED_DESC') {
        return (b.acquiredDays || 0) - (a.acquiredDays || 0);
      }
      return 0;
    });
  }, [allCalculatedPeriods, selectedBranchIds, selectedPoloFilter, statusFilter, searchTerm, sortBy]);

  const KANBAN_COLUMNS: { id: VacationStatus; title: string; color: string }[] = [
    { id: 'APROVACAO_LIDER', title: '1. Aprovação do Líder', color: 'border-amber-400 bg-amber-50/30' },
    { id: 'APROVACAO_RH', title: '2. Aprovação do RH', color: 'border-blue-400 bg-blue-50/30' },
    { id: 'DOCUMENTACAO', title: '3. Documentação & Assinatura Digital', color: 'border-purple-400 bg-purple-50/30' },
    { id: 'APROVADO', title: '4. Aprovado / Programado', color: 'border-emerald-400 bg-emerald-50/30' },
    { id: 'EM_FERIAS', title: '5. Em Gozo de Férias', color: 'border-indigo-400 bg-indigo-50/30' }
  ];

  const handleAdvanceStatus = (reqId: string, currentStatus: VacationStatus) => {
    let nextStatus: VacationStatus = currentStatus;
    if (currentStatus === 'APROVACAO_LIDER') nextStatus = 'APROVACAO_RH';
    else if (currentStatus === 'APROVACAO_RH') nextStatus = 'DOCUMENTACAO';
    else if (currentStatus === 'DOCUMENTACAO') nextStatus = 'APROVADO';
    else if (currentStatus === 'APROVADO') nextStatus = 'EM_FERIAS';

    setRequests(requests.map(r => r.id === reqId ? { ...r, status: nextStatus } : r));
    logAction('UPDATE', 'Férias', reqId, `Avançou solicitação de férias para ${nextStatus}`);
  };

  const handleOpenScheduleForPeriod = (period: VacationCalculatedPeriod) => {
    setSelectedColabId(period.collaboratorId);
    setSelectedPeriodForSchedule(period);
    setDaysCount(Math.min(period.remainingBalance, 15) || 15);
    setIsNewRequestModalOpen(true);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const colab = collaborators.find(c => c.id === selectedColabId) || collaborators[0];

    const newReq: VacationRequest = {
      id: `vr-${Date.now()}`,
      collaboratorId: colab.id,
      collaboratorName: colab.fullName,
      collaboratorAvatar: colab.avatarUrl,
      collaboratorPosition: colab.positionTitle,
      branchName: colab.branchName,
      startDate: startDate,
      endDate: endDate,
      daysCount: Number(daysCount),
      abonoDays: Number(abonoDays),
      advance13th: advance13th,
      status: 'APROVACAO_LIDER',
      requestDate: new Date().toISOString().slice(0, 10),
      observations: observations || 'Programação de férias CLT vinculada ao controle de saldo contábil.'
    };

    setRequests([newReq, ...requests]);
    setIsNewRequestModalOpen(false);
    setSelectedPeriodForSchedule(null);
    logAction('CREATE', 'Férias', newReq.id, `Nova programação de férias para ${colab.fullName} (${daysCount} dias)`);
  };

  const handleExportCSV = () => {
    const headers = [
      'Nome da Operacao',
      'Nome do Colaborador',
      'Cargo',
      'Inicio Periodo',
      'Fim Periodo',
      'Avos',
      'Dias Dir (Saldo Acumulado)',
      'Dias Goz (Utilizados)',
      'Dias Rest (Saldo Atual)',
      'Limite p/ Gozo',
      'Dias ate Limite',
      'Situacao / Alerta'
    ];

    const rows = filteredPeriods.map(p => [
      `"${p.branchName}"`,
      `"${p.collaboratorName}"`,
      `"${p.positionTitle}"`,
      `"${formatDateBR(p.startDate)}"`,
      `"${formatDateBR(p.endDate)}"`,
      `"${p.fractionAvos || '-'}"`,
      p.acquiredDays ?? p.totalDays,
      p.takenDays,
      p.remainingBalance,
      `"${formatDateBR(p.limitConcessionDate)}"`,
      p.daysToDeadline,
      `"${p.urgencyLabel}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Gestao_Saldo_Ferias_CLT_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Switcher & Action Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('saldo')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'saldo'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            <span>Gestão de Saldo Contábil</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-md text-[10px] bg-blue-50 text-blue-800 font-mono font-bold border border-blue-200/60">
              {allCalculatedPeriods.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'kanban'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarRange className="w-4 h-4 text-slate-500" />
            <span>Solicitações & Fluxo (Kanban)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-md text-[10px] bg-slate-200/80 text-slate-700 font-mono font-bold">
              {requests.length}
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter by Polo */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Operação:</span>
            <select
              value={selectedPoloFilter}
              onChange={(e) => setSelectedPoloFilter(e.target.value)}
              className="text-xs bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL">Todas as Operações ({collaborators.length})</option>
              {availablePolos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.count})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Ordem:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="URGENCY_ASC">Limite p/ Gozo (Mais Urgente)</option>
              <option value="NAME_ASC">Nome (A → Z)</option>
              <option value="NAME_DESC">Nome (Z → A)</option>
              <option value="BALANCE_DESC">Maior Saldo Restante</option>
              <option value="ACQUIRED_DESC">Mais Dias de Direito</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar colaborador / polo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/90 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
            />
          </div>

          {/* Export CSV Button */}
          {activeTab === 'saldo' && (
            <button
              onClick={handleExportCSV}
              title="Exportar dados da programação de férias para CSV/Excel"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar CSV</span>
            </button>
          )}

          {/* New Request Button */}
          <button
            onClick={() => {
              setSelectedPeriodForSchedule(null);
              setIsNewRequestModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer shrink-0 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Programar Férias</span>
          </button>
        </div>
      </div>

      {/* KPI Cards / Executive Vacation Dashboard */}
      {activeTab === 'saldo' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Colaboradores CLT */}
          <div 
            onClick={() => setStatusFilter('ALL')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
              statusFilter === 'ALL'
                ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-medium uppercase tracking-wider mb-1">
              <span>Colaboradores</span>
              <Building className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {dashboardMetrics.totalMonitoredPeriods}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Pessoas únicas CLT monitoradas
            </div>
          </div>

          {/* Card 2: Crítico (<= 6 meses) */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'CRITICO' ? 'ALL' : 'CRITICO')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
              statusFilter === 'CRITICO'
                ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20'
                : dashboardMetrics.criticalDobraRiskCount > 0
                  ? 'bg-rose-50/30 border-rose-200 hover:border-rose-300'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-rose-700 text-[11px] font-medium uppercase tracking-wider mb-1">
              <span>Crítico (≤ 6 meses)</span>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-bold text-rose-700 font-mono">
              {dashboardMetrics.criticalDobraRiskCount}
            </div>
            <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
              ≤ 180 dias • Ação imediata
            </div>
          </div>

          {/* Card 3: Atenção (6 a 8 meses) */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'ATENCAO' ? 'ALL' : 'ATENCAO')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
              statusFilter === 'ATENCAO'
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-amber-700 text-[11px] font-medium uppercase tracking-wider mb-1">
              <span>Atenção (6 a 8 meses)</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold text-amber-700 font-mono">
              {dashboardMetrics.warningDobraRiskCount}
            </div>
            <div className="text-[10px] text-amber-600 mt-0.5">
              181 a 240 dias • Programar
            </div>
          </div>

          {/* Card 4: Tranquilo (> 8 meses) */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'TRANQUILO' ? 'ALL' : 'TRANQUILO')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
              statusFilter === 'TRANQUILO'
                ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-emerald-700 text-[11px] font-medium uppercase tracking-wider mb-1">
              <span>Tranquilo (&gt; 8 meses)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-emerald-700 font-mono">
              {dashboardMetrics.tranquilCount}
            </div>
            <div className="text-[10px] text-emerald-600 mt-0.5">
              &gt; 240 dias • Prazo seguro
            </div>
          </div>

          {/* Card 5: Em Aquisição Proporcional */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'EM_FORMACAO' ? 'ALL' : 'EM_FORMACAO')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
              statusFilter === 'EM_FORMACAO'
                ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20'
                : 'bg-white border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-indigo-700 text-[11px] font-medium uppercase tracking-wider mb-1">
              <span>Em Formação</span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold text-indigo-700 font-mono">
              {dashboardMetrics.formingPeriodsCount}
            </div>
            <div className="text-[10px] text-indigo-600 mt-0.5">
              Adquirindo 2,5d/mês trabalhado
            </div>
          </div>
        </div>
      )}

      {/* Premise & Rules Explainer Card (Collapsible) */}
      {activeTab === 'saldo' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
          <div 
            onClick={() => setShowPremiseBanner(!showPremiseBanner)}
            className="p-4 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Premissas e Regras de Gestão de Saldo
                </h4>
                <p className="text-[11px] text-slate-500">
                  Entenda o funcionamento do período de férias dos colaboradores
                </p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              {showPremiseBanner ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showPremiseBanner && (
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/80">
                <span className="font-bold text-rose-900 block mb-1 text-[11px] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  Crítico (≤ 6 meses restantes)
                </span>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  Colaboradores com <strong>até 180 dias</strong> para vencer a concessão. Exige prioridade imediata de programação sob risco de pagamento em dobro (Art. 137 CLT).
                </p>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                <span className="font-bold text-amber-900 block mb-1 text-[11px] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Atenção (6 a 8 meses)
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Colaboradores com <strong>181 a 240 dias</strong> para o limite. Janela preventiva ideal para alinhamento com a gestão e escala operacional.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                <span className="font-bold text-emerald-900 block mb-1 text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Tranquilo (&gt; 8 meses)
                </span>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Colaboradores com <strong>mais de 240 dias</strong> para o limite. Saldo regular e seguro para planejamento sem risco iminente de dobra.
                </p>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60">
                <span className="font-bold text-blue-900 block mb-1 text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Sem Duplicidade de Pessoas
                </span>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  Cada colaborador aparece <strong>uma única vez</strong> na listagem com o período prioritário de fruição e consolidação do saldo restante.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {activeTab === 'saldo' ? (
        /* Gestão de Saldo Aquisitivo CLT */
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
          <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-800">
                Relatório Contábil Consolidado por Operação &amp; Colaborador
              </span>
              <span className="text-[11px] font-mono text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                {filteredPeriods.length} colaborador(es) exibido(s)
              </span>
            </div>

            {statusFilter !== 'ALL' && (
              <button
                onClick={() => setStatusFilter('ALL')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-200/60"
              >
                <span>Limpar filtro de status ({statusFilter})</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Nome da Operação</th>
                  <th 
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none"
                    onClick={() => setSortBy(sortBy === 'NAME_ASC' ? 'NAME_DESC' : 'NAME_ASC')}
                    title="Clique para ordenar por nome"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Nome do Colaborador</span>
                      {sortBy === 'NAME_ASC' && <ArrowUpAZ className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                      {sortBy === 'NAME_DESC' && <ArrowDownAZ className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                    </div>
                  </th>
                  <th className="py-3.5 px-3">Período Aquisitivo</th>
                  <th className="py-3.5 px-2.5 text-center" title="Fração em avos adquirida">Avos</th>
                  <th className="py-3.5 px-3 text-center" title="Saldo crescente e acumulativo do colaborador">Dias Dir.</th>
                  <th className="py-3.5 px-3 text-center" title="Dias que o colaborador já utilizou">Dias Goz.</th>
                  <th className="py-3.5 px-3 text-center" title="Saldo atual restante após desconto do gozo">Dias Rest.</th>
                  <th 
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100 select-none"
                    onClick={() => setSortBy(sortBy === 'URGENCY_ASC' ? 'NAME_ASC' : 'URGENCY_ASC')}
                    title="Data fatal para fruição sem dobra"
                  >
                    <div className="flex items-center gap-1">
                      <span>Limite p/ Gozo</span>
                      {sortBy === 'URGENCY_ASC' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                    </div>
                  </th>
                  <th className="py-3.5 px-3">Situação / Alerta</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPeriods.map((period) => {
                  const isCritico = period.urgencyLevel === 'CRITICO';
                  const isAtencao = period.urgencyLevel === 'ATENCAO';
                  const isTranquilo = period.urgencyLevel === 'NORMAL';
                  const isForming = period.isForming;

                  return (
                    <tr 
                      key={period.collaboratorId || period.id} 
                      className={`transition-colors hover:bg-slate-50/80 ${
                        isCritico ? 'bg-rose-50/20' : isAtencao ? 'bg-amber-50/15' : ''
                      }`}
                    >
                      {/* 1. Nome da Operação */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{period.branchName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {period.departmentName}
                        </span>
                      </td>

                      {/* 2. Nome do Colaborador */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{period.collaboratorName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {period.positionTitle}
                        </div>
                        {period.hasAdditionalPeriods && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                              +{period.totalPeriodsCount! - 1} período adicional
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 3. Período Aquisitivo */}
                      <td className="py-3.5 px-3 font-mono text-slate-700">
                        <div className="font-medium text-[11px]">
                          {formatDateBR(period.startDate)} a {formatDateBR(period.endDate)}
                        </div>
                        {(period.faultDays || period.absenceDays) ? (
                          <span className="text-[10px] text-slate-500 block">
                            {period.faultDays ? `Faltas: ${period.faultDays}d ` : ''}
                            {period.absenceDays ? `Afast: ${period.absenceDays}d` : ''}
                          </span>
                        ) : null}
                      </td>

                      {/* 4. Avos */}
                      <td className="py-3.5 px-2.5 text-center">
                        <span className="px-1.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {period.fractionAvos || '12/12'}
                        </span>
                      </td>

                      {/* 5. Dias Dir. (Saldo Acumulativo) */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {(period.acquiredDays ?? period.totalDays).toLocaleString('pt-BR')}d
                          </span>
                          {isForming && (
                            <span className="text-[9px] text-blue-600 font-semibold mt-0.5">
                              adquirindo
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6. Dias Goz. */}
                      <td className="py-3.5 px-3 text-center font-mono">
                        {period.takenDays > 0 ? (
                          <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs">
                            {period.takenDays}d
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">0d</span>
                        )}
                      </td>

                      {/* 7. Dias Rest. (Saldo Atual) */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md border ${
                          period.remainingBalance > 0
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {period.remainingBalance}d
                        </span>
                      </td>

                      {/* 8. Limite p/ Gozo */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          {isCritico ? (
                            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                          ) : isAtencao ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          ) : (
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className={`font-bold text-[11px] ${
                            isCritico 
                              ? 'text-rose-700' 
                              : isAtencao 
                                ? 'text-amber-700' 
                                : 'text-slate-700'
                          }`}>
                            {formatDateBR(period.limitConcessionDate)}
                          </span>
                        </div>
                        <span className="text-[10px] block mt-0.5">
                          {period.daysToDeadline > 0 ? (
                            isCritico ? (
                              <span className="text-rose-600 font-bold">{period.daysToDeadline}d restantes (≤ 6 meses)</span>
                            ) : isAtencao ? (
                              <span className="text-amber-600 font-bold">{period.daysToDeadline}d restantes (6 a 8 meses)</span>
                            ) : (
                              <span className="text-emerald-700 font-medium">{period.daysToDeadline}d restantes (&gt; 8 meses)</span>
                            )
                          ) : (
                            <span className="text-rose-700 font-bold">Prazo expirado</span>
                          )}
                        </span>
                      </td>

                      {/* 9. Situação / Alerta */}
                      <td className="py-3.5 px-3">
                        {isCritico ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            Crítico (≤ 6 meses)
                          </span>
                        ) : isAtencao ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            Atenção (6 a 8 meses)
                          </span>
                        ) : isTranquilo ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Tranquilo (&gt; 8 meses)
                          </span>
                        ) : isForming ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            Em Formação
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                            Concluído
                          </span>
                        )}
                      </td>

                      {/* 10. Ações */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenScheduleForPeriod(period)}
                          className="px-3 py-1.5 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Programar</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredPeriods.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                      Nenhum período de férias encontrado com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban View (Fluxo de Solicitações) */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {KANBAN_COLUMNS.map((col) => {
            const colRequests = requests.filter(r => {
              if (r.status !== col.id) return false;
              if (searchTerm) {
                const q = searchTerm.toLowerCase();
                return r.collaboratorName.toLowerCase().includes(q) || r.branchName.toLowerCase().includes(q);
              }
              return true;
            });

            return (
              <div key={col.id} className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 flex flex-col h-[640px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                  <span className="font-bold text-xs text-slate-800">{col.title}</span>
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center justify-center shadow-2xs">
                    {colRequests.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                  {colRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2.5"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{req.collaboratorName}</h4>
                        <span className="text-[10px] text-slate-500 block">{req.collaboratorPosition} • {req.branchName}</span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] space-y-1">
                        <div className="flex items-center justify-between font-medium text-slate-700">
                          <span>Duração:</span>
                          <span className="font-semibold text-blue-700 font-mono">{req.daysCount} dias</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {formatDateBR(req.startDate)} até {formatDateBR(req.endDate)}
                        </div>
                        {req.abonoDays > 0 && (
                          <div className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                            + Abono pecuniário ({req.abonoDays} dias)
                          </div>
                        )}
                        {req.advance13th && (
                          <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            + Adiantamento 1ª parc. 13º
                          </div>
                        )}
                      </div>

                      {/* Advance Action Button */}
                      {col.id !== 'EM_FERIAS' && (
                        <button
                          onClick={() => handleAdvanceStatus(req.id, req.status)}
                          className="w-full mt-1 py-1.5 px-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Avançar Etapa</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {colRequests.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                      Nenhuma solicitação nesta etapa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Programar / Nova Solicitação de Férias */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Programação de Férias CLT</h3>
                <p className="text-[11px] text-slate-500">Agende o período de fruição de acordo com o saldo contábil.</p>
              </div>
              <button 
                onClick={() => {
                  setIsNewRequestModalOpen(false);
                  setSelectedPeriodForSchedule(null);
                }} 
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6 space-y-4">
              {/* Selected Period Info Banner if triggered from table */}
              {selectedPeriodForSchedule && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-xs">
                  <div className="font-bold text-blue-900 flex items-center justify-between">
                    <span>{selectedPeriodForSchedule.collaboratorName}</span>
                    <span className="font-mono text-blue-700 font-semibold">{selectedPeriodForSchedule.branchName}</span>
                  </div>
                  <div className="text-[11px] text-blue-800 flex items-center justify-between font-mono">
                    <span>Saldo Restante: <strong>{selectedPeriodForSchedule.remainingBalance} dias</strong></span>
                    <span>Limite p/ Gozo: <strong>{formatDateBR(selectedPeriodForSchedule.limitConcessionDate)}</strong></span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Colaborador *</label>
                <select
                  value={selectedColabId}
                  onChange={(e) => setSelectedColabId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {collaborators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} - {c.positionTitle} ({c.branchName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data Início do Gozo *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data Fim do Gozo *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantidade de Dias *</label>
                  <input
                    type="number"
                    min={5}
                    max={30}
                    value={daysCount}
                    onChange={(e) => setDaysCount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">Mínimo 5 dias por fração CLT</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Abono Pecuniário (Venda de Dias)</label>
                  <select
                    value={abonoDays}
                    onChange={(e) => setAbonoDays(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Sem abono (0 dias)</option>
                    <option value={10}>Vender 10 dias (Máximo CLT)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <input
                  type="checkbox"
                  id="advance13th"
                  checked={advance13th}
                  onChange={(e) => setAdvance13th(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="advance13th" className="text-xs text-slate-700 cursor-pointer select-none">
                  Solicitar adiantamento da <strong>1ª parcela do 13º salário</strong> junto às férias
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observações Contábeis / Justificativa</label>
                <textarea
                  rows={2}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Ex: Férias divididas em 2 períodos de 15 dias conforme alinhamento com a coordenação..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewRequestModalOpen(false);
                    setSelectedPeriodForSchedule(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Salvar Programação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
