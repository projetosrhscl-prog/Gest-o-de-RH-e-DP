import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building, 
  User, 
  Sparkles, 
  CalendarDays, 
  List, 
  Check, 
  Trash2, 
  Edit3, 
  RefreshCw,
  Award,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { 
  LembreteItem, 
  LembreteCategory, 
  LembretePriority, 
  LembretesFilterState 
} from '../../types/lembretes';
import { 
  useStoredLembretes, 
  getDaysDifference, 
  getImminentAlerts 
} from '../../utils/lembretesStorage';
import { NovoLembreteModal } from '../../components/lembretes/NovoLembreteModal';
import { LembretesAlertModal } from '../../components/lembretes/LembretesAlertModal';
import { DetalhesDiaCalendarioModal } from '../../components/lembretes/DetalhesDiaCalendarioModal';

const CATEGORY_META: Record<LembreteCategory, { label: string; icon: string; bg: string; text: string; border: string; badgeClass: string }> = {
  EXPERIENCIA: {
    label: 'Contrato & Experiência CLT',
    icon: '📋',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  FOLHA_DP: {
    label: 'Rotina Folha / DP',
    icon: '💼',
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    border: 'border-blue-200',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  ASO_SST: {
    label: 'Saúde & Segurança (ASO / NR / EPI)',
    icon: '🩺',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  FERIAS: {
    label: 'Férias & Afastamentos',
    icon: '🏖️',
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300'
  },
  ANIVERSARIO: {
    label: 'Aniversários & Own It',
    icon: '🎂',
    bg: 'bg-pink-50',
    text: 'text-pink-900',
    border: 'border-pink-200',
    badgeClass: 'bg-pink-100 text-pink-900 border-pink-300'
  },
  CONTRATO: {
    label: 'Contratos Especiais / PJ',
    icon: '📑',
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-200',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  PERSONALIZADO: {
    label: 'Lembrete Personalizado',
    icon: '📝',
    bg: 'bg-slate-50',
    text: 'text-slate-900',
    border: 'border-slate-200',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300'
  }
};

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const LembretesModule: React.FC = () => {
  const { branchSelectionLabel, selectedBranchIds } = useAuth();
  const { navigateTo } = useNavigation();

  const {
    lembretes,
    refresh,
    addCustomLembrete,
    updateCustomLembrete,
    deleteCustomLembrete,
    toggleLembreteStatus,
    snoozeLembrete
  } = useStoredLembretes();

  // Navigation Month / Year
  const [currentDate, setCurrentDate] = useState(() => new Date());
  
  // View Modes: 'calendar' | 'timeline' | 'agenda'
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline' | 'agenda'>('calendar');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('PENDENTE');

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedDateForNew, setSelectedDateForNew] = useState<string | undefined>();
  const [editingItem, setEditingItem] = useState<LembreteItem | null>(null);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [dayDetailsModal, setDayDetailsModal] = useState<{ isOpen: boolean; dateStr: string; events: LembreteItem[] }>({
    isOpen: false,
    dateStr: '',
    events: []
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Handler for Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filtered lembretes
  const filteredLembretes = useMemo(() => {
    return lembretes.filter((item) => {
      // 1. Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesColab = item.collaboratorName?.toLowerCase().includes(query) || false;
        const matchesPolo = item.poloNome?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDesc && !matchesColab && !matchesPolo) {
          return false;
        }
      }

      // 2. Category filter
      if (filterCategory !== 'ALL' && item.category !== filterCategory) {
        return false;
      }

      // 3. Priority filter
      if (filterPriority !== 'ALL' && item.priority !== filterPriority) {
        return false;
      }

      // 4. Status filter
      if (filterStatus === 'PENDENTE' && item.status === 'CONCLUIDO') {
        return false;
      }
      if (filterStatus === 'CONCLUIDO' && item.status !== 'CONCLUIDO') {
        return false;
      }
      if (filterStatus === 'ATRASADO') {
        const diff = getDaysDifference(item.date);
        if (item.status === 'CONCLUIDO' || diff >= 0) return false;
      }

      // 5. Branch filter (if specific branch selected)
      if (selectedBranchIds.length > 0 && item.poloId) {
        if (!selectedBranchIds.includes(item.poloId)) {
          return false;
        }
      }

      return true;
    });
  }, [lembretes, searchTerm, filterCategory, filterPriority, filterStatus, selectedBranchIds]);

  // Imminent alerts count
  const imminentAlerts = useMemo(() => {
    return getImminentAlerts(7);
  }, [lembretes]);

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 to 6
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // 28 to 31
    const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: LembreteItem[];
    }[] = [];

    const todayStr = new Date().toISOString().split('T')[0];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDate - i;
      const prevM = currentMonth === 0 ? 12 : currentMonth;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${prevM.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
      
      const dayEvents = filteredLembretes.filter(l => l.date === dateStr);
      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        events: dayEvents
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const monthStr = (currentMonth + 1).toString().padStart(2, '0');
      const dayStr = d.toString().padStart(2, '0');
      const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

      const dayEvents = filteredLembretes.filter(l => l.date === dateStr);
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        events: dayEvents
      });
    }

    // Next month padding days to complete 35 or 42 grid cells
    const remainingCells = 42 - days.length;
    for (let d = 1; d <= (remainingCells >= 7 ? remainingCells - 7 : remainingCells); d++) {
      const nextM = currentMonth === 11 ? 1 : currentMonth + 2;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${nextM.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      
      const dayEvents = filteredLembretes.filter(l => l.date === dateStr);
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        events: dayEvents
      });
    }

    return days;
  }, [currentYear, currentMonth, filteredLembretes]);

  // Statistics KPIs
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const total = lembretes.length;
    const pendentes = lembretes.filter(l => l.status !== 'CONCLUIDO').length;
    const concluidos = lembretes.filter(l => l.status === 'CONCLUIDO').length;
    
    const atrasados = lembretes.filter(l => l.status !== 'CONCLUIDO' && getDaysDifference(l.date) < 0).length;
    const vencendo7Dias = lembretes.filter(l => {
      if (l.status === 'CONCLUIDO') return false;
      const diff = getDaysDifference(l.date);
      return diff >= 0 && diff <= 7;
    }).length;

    const experienciaCount = lembretes.filter(l => l.category === 'EXPERIENCIA' && l.status !== 'CONCLUIDO').length;
    const asoCount = lembretes.filter(l => l.category === 'ASO_SST' && l.status !== 'CONCLUIDO').length;
    const folhaCount = lembretes.filter(l => l.category === 'FOLHA_DP' && l.status !== 'CONCLUIDO').length;

    return {
      total,
      pendentes,
      concluidos,
      atrasados,
      vencendo7Dias,
      experienciaCount,
      asoCount,
      folhaCount
    };
  }, [lembretes]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Central de Lembretes & Calendário
            </span>
            <span className="text-xs text-slate-500">• {branchSelectionLabel}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Lembretes & Calendário de Eventos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeamento completo de vencimentos de experiência CLT, fechamento de folha, ASOs, NRs, férias e alertas programados.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {imminentAlerts.length > 0 && (
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer animate-pulse"
              title="Visualizar alertas iminentes com pop-up"
            >
              <Bell className="w-4 h-4 text-slate-950" />
              <span>Alertas Iminentes ({imminentAlerts.length})</span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedDateForNew(undefined);
              setEditingItem(null);
              setIsNewModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Lembrete</span>
          </button>

          <button
            onClick={() => {
              refresh();
              showToast('Eventos e dados do sistema sincronizados com sucesso!');
            }}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer transition-colors"
            title="Sincronizar eventos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        
        {/* Card 1: Próximos 7 dias */}
        <div 
          onClick={() => {
            setFilterStatus('PENDENTE');
            setViewMode('timeline');
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            stats.vencendo7Dias > 0 
              ? 'bg-amber-50/70 border-amber-300 shadow-2xs hover:bg-amber-100/70' 
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">
              Próximos 7 Dias
            </span>
            <Bell className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950 mt-1">
            {stats.vencendo7Dias}
          </div>
          <p className="text-[10px] text-amber-800 font-medium mt-0.5">
            Eventos em alerta iminente
          </p>
        </div>

        {/* Card 2: Atrasados */}
        <div 
          onClick={() => {
            setFilterStatus('ATRASADO');
            setViewMode('timeline');
          }}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            stats.atrasados > 0 
              ? 'bg-red-50/70 border-red-300 shadow-2xs hover:bg-red-100/70' 
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-950 uppercase tracking-wider">
              Vencidos / Atraso
            </span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-950 mt-1">
            {stats.atrasados}
          </div>
          <p className="text-[10px] text-red-800 font-medium mt-0.5">
            Exigem resolução imediata
          </p>
        </div>

        {/* Card 3: Experiência CLT */}
        <div 
          onClick={() => {
            setFilterCategory('EXPERIENCIA');
            setFilterStatus('PENDENTE');
          }}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Experiência CLT
            </span>
            <span className="text-base">📋</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {stats.experienciaCount}
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            45d e 90d probatórios
          </p>
        </div>

        {/* Card 4: ASOs & SST */}
        <div 
          onClick={() => {
            setFilterCategory('ASO_SST');
            setFilterStatus('PENDENTE');
          }}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              ASOs & SST
            </span>
            <span className="text-base">🩺</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {stats.asoCount}
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            Exames & EPIs a renovar
          </p>
        </div>

        {/* Card 5: Folha & DP */}
        <div 
          onClick={() => {
            setFilterCategory('FOLHA_DP');
            setFilterStatus('PENDENTE');
          }}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Folha & DP
            </span>
            <span className="text-base">💼</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {stats.folhaCount}
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            Rotinas mensais ativas
          </p>
        </div>

      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
            <span>Mês (Grade)</span>
          </button>

          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              viewMode === 'timeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5 text-blue-600" />
            <span>Timeline / Lista ({filteredLembretes.length})</span>
          </button>
        </div>

        {/* Center/Right: Category & Status Filters + Search */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar evento ou colaborador..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
            />
          </div>

          {/* Category dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">Todas as Categorias</option>
            <option value="EXPERIENCIA">📋 Experiência CLT</option>
            <option value="FOLHA_DP">💼 Folha & DP</option>
            <option value="ASO_SST">🩺 Saúde & Segurança (SST)</option>
            <option value="FERIAS">🏖️ Férias</option>
            <option value="ANIVERSARIO">🎂 Aniversários / Own It</option>
            <option value="PERSONALIZADO">📝 Personalizados</option>
          </select>

          {/* Status dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">Todos os Status</option>
            <option value="PENDENTE">Pendentes / Ativos</option>
            <option value="ATRASADO">⚠️ Apenas Atrasados</option>
            <option value="CONCLUIDO">✓ Concluídos</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: MONTH CALENDAR GRID */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          
          {/* Calendar Header with Month Navigation */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-slate-900">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={goToToday}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
              >
                Hoje
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
                title="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors"
                title="Próximo mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/70 text-center text-xs font-bold text-slate-600 py-2">
            {WEEK_DAYS.map((wd, idx) => (
              <div key={wd} className={idx === 0 || idx === 6 ? 'text-slate-400' : 'text-slate-700'}>
                {wd}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-100/30">
            {calendarDays.map((cell, idx) => {
              const hasEvents = cell.events.length > 0;
              const pendingEvents = cell.events.filter(e => e.status !== 'CONCLUIDO');
              const hasUrgent = pendingEvents.some(e => e.priority === 'URGENTE');

              return (
                <div
                  key={`${cell.dateStr}-${idx}`}
                  onClick={() => {
                    setDayDetailsModal({
                      isOpen: true,
                      dateStr: cell.dateStr,
                      events: cell.events
                    });
                  }}
                  className={`min-h-[105px] p-2 transition-all cursor-pointer flex flex-col justify-between ${
                    !cell.isCurrentMonth
                      ? 'bg-slate-50/50 text-slate-300'
                      : cell.isToday
                      ? 'bg-blue-50/40 font-semibold'
                      : 'bg-white hover:bg-slate-50/80 text-slate-800'
                  }`}
                >
                  {/* Cell Top Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                        cell.isToday
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : !cell.isCurrentMonth
                          ? 'text-slate-400'
                          : 'text-slate-700'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {hasUrgent && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" title="Possui evento crítico" />
                    )}
                  </div>

                  {/* Event Chips Preview (Max 3) */}
                  <div className="space-y-1 my-1 overflow-hidden">
                    {cell.events.slice(0, 2).map((ev) => {
                      const meta = CATEGORY_META[ev.category] || CATEGORY_META.PERSONALIZADO;
                      const isCompleted = ev.status === 'CONCLUIDO';

                      return (
                        <div
                          key={ev.id}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate flex items-center gap-1 border ${
                            isCompleted
                              ? 'bg-slate-100 text-slate-400 line-through border-slate-200'
                              : `${meta.bg} ${meta.text} ${meta.border}`
                          }`}
                          title={ev.title}
                        >
                          <span className="shrink-0">{meta.icon}</span>
                          <span className="truncate">{ev.title}</span>
                        </div>
                      );
                    })}

                    {cell.events.length > 2 && (
                      <div className="text-[9px] font-bold text-blue-700 px-1">
                        +{cell.events.length - 2} mais...
                      </div>
                    )}
                  </div>

                  {/* Bottom indicator */}
                  <div className="text-[10px] text-slate-400 text-right">
                    {hasEvents && (
                      <span className="text-[9px] font-semibold text-slate-500">
                        {cell.events.length} evento{cell.events.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: TIMELINE / LIST VIEW */}
      {viewMode === 'timeline' && (
        <div className="space-y-3">
          {filteredLembretes.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <CalendarIcon className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <h3 className="text-sm font-bold text-slate-800">Nenhum evento encontrado</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Não há lembretes correspondentes aos filtros selecionados.
              </p>
              <button
                onClick={() => {
                  setFilterCategory('ALL');
                  setFilterPriority('ALL');
                  setFilterStatus('ALL');
                  setSearchTerm('');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            filteredLembretes.map((item) => {
              const meta = CATEGORY_META[item.category] || CATEGORY_META.PERSONALIZADO;
              const daysDiff = getDaysDifference(item.date);
              const isOverdue = daysDiff < 0 && item.status !== 'CONCLUIDO';
              const isToday = daysDiff === 0 && item.status !== 'CONCLUIDO';
              const isCompleted = item.status === 'CONCLUIDO';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : isOverdue
                      ? 'bg-red-50/40 border-red-200 shadow-2xs'
                      : isToday
                      ? 'bg-amber-50/40 border-amber-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${meta.bg} ${meta.border}`}>
                      {meta.icon}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${meta.badgeClass}`}>
                          {meta.label}
                        </span>

                        {isOverdue && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">
                            Atrasado há {Math.abs(daysDiff)} dia{Math.abs(daysDiff) > 1 ? 's' : ''}
                          </span>
                        )}

                        {isToday && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                            Vence Hoje
                          </span>
                        )}

                        {daysDiff > 0 && !isCompleted && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            Em {daysDiff} dia{daysDiff > 1 ? 's' : ''}
                          </span>
                        )}

                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3 text-slate-400" />
                          {item.date.split('-').reverse().join('/')} {item.time ? `(${item.time})` : ''}
                        </span>
                      </div>

                      <h3 className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {item.title}
                      </h3>

                      <p className="text-[11px] text-slate-600 leading-relaxed max-w-3xl">
                        {item.description}
                      </p>

                      {/* Metadata tags */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500">
                        {item.collaboratorName && (
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                            <User className="w-3 h-3 text-blue-600" />
                            {item.collaboratorName} ({item.collaboratorRole || 'Colaborador'})
                          </span>
                        )}
                        {item.poloNome && (
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                            <Building className="w-3 h-3 text-slate-500" />
                            {item.poloNome}
                          </span>
                        )}
                        {item.isAutoGenerated && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                            Automação SCL
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 justify-end flex-wrap">
                    {item.actionModule && !isCompleted && (
                      <button
                        onClick={() => navigateTo(item.actionModule!)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <span>{item.actionLabel || 'Acessar Módulo'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        toggleLembreteStatus(item.id);
                        showToast(isCompleted ? 'Lembrete marcado como pendente.' : 'Lembrete concluído com sucesso!');
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                      title={isCompleted ? 'Desmarcar' : 'Concluir'}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Concluído' : 'Concluir'}</span>
                    </button>

                    {!isCompleted && (
                      <button
                        onClick={() => {
                          snoozeLembrete(item.id, 2);
                          showToast('Lembrete adiado por 2 dias!');
                        }}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Adiar lembrete por 2 dias"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Adiar (+2d)</span>
                      </button>
                    )}

                    {!item.isAutoGenerated && (
                      <>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsNewModalOpen(true);
                          }}
                          className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Deseja excluir este lembrete?')) {
                              deleteCustomLembrete(item.id);
                              showToast('Lembrete excluído com sucesso.');
                            }
                          }}
                          className="p-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-600 cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MODAL 1: NOVO / EDITAR LEMBRETE */}
      {isNewModalOpen && (
        <NovoLembreteModal
          isOpen={isNewModalOpen}
          onClose={() => {
            setIsNewModalOpen(false);
            setEditingItem(null);
          }}
          initialDate={selectedDateForNew}
          editingItem={editingItem}
          onSave={(data) => {
            if (editingItem) {
              updateCustomLembrete(editingItem.id, data);
              showToast('Lembrete atualizado com sucesso!');
            } else {
              addCustomLembrete(data);
              showToast('Novo lembrete agendado com sucesso!');
            }
          }}
        />
      )}

      {/* MODAL 2: POP-UP DE ALERTAS IMINENTES */}
      {isAlertModalOpen && (
        <LembretesAlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          alerts={imminentAlerts}
          onToggleStatus={(id) => {
            toggleLembreteStatus(id);
            showToast('Lembrete concluído!');
          }}
          onSnooze={(id, days) => {
            snoozeLembrete(id, days || 2);
            showToast(`Lembrete adiado por ${days || 2} dias.`);
          }}
          onNavigateToCalendar={() => {
            setViewMode('calendar');
          }}
        />
      )}

      {/* MODAL 3: DETALHES DO DIA SELECIONADO */}
      {dayDetailsModal.isOpen && (
        <DetalhesDiaCalendarioModal
          isOpen={dayDetailsModal.isOpen}
          onClose={() => setDayDetailsModal({ isOpen: false, dateStr: '', events: [] })}
          dateStr={dayDetailsModal.dateStr}
          events={dayDetailsModal.events}
          onAddNewEvent={(dateStr) => {
            setSelectedDateForNew(dateStr);
            setEditingItem(null);
            setIsNewModalOpen(true);
          }}
          onToggleStatus={(id) => {
            toggleLembreteStatus(id);
            showToast('Status do lembrete atualizado!');
            // Atualiza lista interna do modal
            setDayDetailsModal(prev => ({
              ...prev,
              events: prev.events.map(e => e.id === id ? { ...e, status: e.status === 'CONCLUIDO' ? 'PENDENTE' : 'CONCLUIDO' } : e)
            }));
          }}
          onSnooze={(id) => {
            snoozeLembrete(id, 2);
            showToast('Lembrete adiado por 2 dias.');
          }}
        />
      )}

    </div>
  );
};
