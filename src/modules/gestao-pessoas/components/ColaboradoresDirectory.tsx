import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  UploadCloud, 
  Download, 
  Building2, 
  Briefcase, 
  Eye, 
  Clock, 
  X,
  Users, 
  Archive, 
  ArrowUpDown, 
  ArrowUpAZ, 
  ArrowDownAZ, 
  RotateCcw, 
  MapPin,
  CheckCheck,
  Edit3,
  Sparkles,
  ShieldAlert,
  Award,
  CheckCircle2,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { CollaboratorProfile, EmploymentStatus, ContractType } from '../../../types/collaborator';
import { AddCollaboratorModal } from '../../../components/collaborators/AddCollaboratorModal';
import { CollaboratorProfileDrawer } from '../../../components/collaborators/CollaboratorProfileDrawer';
import { GoogleSheetsSyncModal } from '../../../components/google-sheets/GoogleSheetsSyncModal';
import { INITIAL_DEPARTMENTS, INITIAL_POSITIONS, INITIAL_ELECTRONIC_DOCUMENTS } from '../../../data/mockData';
import { downloadBulkDocumentsZip } from '../../../utils/documentGenerator';
import { getCollaboratorOwnItJourney, isOwnItEligible } from '../../../utils/ownItHelper';
import { EditCollaboratorModal } from '../../../components/collaborators/EditCollaboratorModal';
import { useStoredCollaborators } from '../../../utils/collaboratorsStorage';
import { getCollaboratorTenure, isProbationPeriod, calculateTenureDays } from '../../../utils/tenureHelper';
import { formatDateBR } from '../../../utils/dateHelper';

export type SortOrderOption = 
  | 'NAME_ASC' 
  | 'NAME_DESC' 
  | 'POLO_ASC' 
  | 'POLO_DESC' 
  | 'ADMISSION_DESC' 
  | 'ADMISSION_ASC' 
  | 'POSITION_ASC';

export type ExtendedStatusFilter = 
  | 'ALL' 
  | 'EFETIVOS' 
  | 'EXPERIENCIA' 
  | 'RPA' 
  | 'EM_ATIVIDADE' 
  | 'EM_FERIAS' 
  | 'EM_ADMISSAO' 
  | 'AFASTADO' 
  | 'DESLIGADO';

export const ColaboradoresDirectory: React.FC = () => {
  const { selectedBranchIds, branches, logAction } = useAuth();
  const { 
    collaborators, 
    updateCollaborator, 
    addCollaborator,
    removeCollaborator,
    purgeDuplicates
  } = useStoredCollaborators();

  const [selectedCollaborator, setSelectedCollaborator] = useState<CollaboratorProfile | null>(null);
  const [editingCollaborator, setEditingCollaborator] = useState<CollaboratorProfile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);
  const [directoryToast, setDirectoryToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: ''
  });

  const handleImportFromGoogleSheets = (imported: CollaboratorProfile[]) => {
    imported.forEach(c => addCollaborator(c));
    setDirectoryToast({
      show: true,
      message: `${imported.length} colaborador(es) importados do Google Planilhas com sucesso!`
    });
    setTimeout(() => setDirectoryToast({ show: false, message: '' }), 5000);
    logAction('IMPORT', 'GoogleSheets', 'BULK', `Importação de ${imported.length} colaboradores via Google Planilhas`);
  };

  // Expurgar colaboradores duplicados com o mesmo nome automaticamente
  useEffect(() => {
    const res = purgeDuplicates();
    if (res.removedCount > 0) {
      setDirectoryToast({
        show: true,
        message: `${res.removedCount} cadastro(s) duplicado(s) (${res.removedNames.join(', ')}) foram removidos para manter o quadro consistente.`
      });
      setTimeout(() => {
        setDirectoryToast({ show: false, message: '' });
      }, 5000);
    }
  }, [purgeDuplicates]);

  const handleUpdateCollaborator = (updated: CollaboratorProfile) => {
    const sanitized = updateCollaborator(updated);
    if (selectedCollaborator && selectedCollaborator.id === sanitized.id) {
      setSelectedCollaborator(sanitized);
    }
    setDirectoryToast({
      show: true,
      message: `Alterações de ${sanitized.fullName} salvas com sucesso!`
    });
    setTimeout(() => {
      setDirectoryToast({ show: false, message: '' });
    }, 4000);
  };

  const handleDeleteCollaborator = (id: string) => {
    const target = collaborators.find(c => c.id === id);
    if (!target) return;
    removeCollaborator(id);
    if (selectedCollaborator && selectedCollaborator.id === id) {
      setSelectedCollaborator(null);
    }
    setDirectoryToast({
      show: true,
      message: `Colaborador ${target.fullName} excluído com sucesso!`
    });
    setTimeout(() => {
      setDirectoryToast({ show: false, message: '' });
    }, 4000);
    logAction('DELETE', 'Colaborador', id, `Colaborador ${target.fullName} excluído do quadro`);
  };

  const handlePurgeDuplicates = () => {
    const result = purgeDuplicates();
    if (result.removedCount > 0) {
      setDirectoryToast({
        show: true,
        message: `${result.removedCount} cadastro(s) duplicado(s) (${result.removedNames.join(', ')}) excluído(s) com sucesso!`
      });
      logAction('DELETE', 'Colaborador', 'DUPLICATES', `Expurgo manual de ${result.removedCount} duplicatas com mesmo nome`);
    } else {
      setDirectoryToast({
        show: true,
        message: 'Nenhum colaborador duplicado encontrado. O quadro de colaboradores está 100% íntegro!'
      });
    }
    setTimeout(() => {
      setDirectoryToast({ show: false, message: '' });
    }, 5000);
  };

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoloFilter, setSelectedPoloFilter] = useState('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ExtendedStatusFilter>('ALL');
  const [selectedContractFilter, setSelectedContractFilter] = useState<'ALL' | ContractType>('ALL');
  const [sortBy, setSortBy] = useState<SortOrderOption>('NAME_ASC');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // List of distinct polos with counts
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

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedPoloFilter !== 'ALL') count++;
    if (selectedDeptFilter !== 'ALL') count++;
    if (selectedStatusFilter !== 'ALL') count++;
    if (selectedContractFilter !== 'ALL') count++;
    if (sortBy !== 'NAME_ASC') count++;
    return count;
  }, [selectedPoloFilter, selectedDeptFilter, selectedStatusFilter, selectedContractFilter, sortBy]);

  const hasActiveFilters = searchTerm !== '' || activeFiltersCount > 0;

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedPoloFilter('ALL');
    setSelectedDeptFilter('ALL');
    setSelectedStatusFilter('ALL');
    setSelectedContractFilter('ALL');
    setSortBy('NAME_ASC');
  };

  // Filtered & Sorted list
  const filteredList = useMemo(() => {
    const result = collaborators.filter((c) => {
      // Global header branch filter
      if (!selectedBranchIds.includes(c.branchId)) return false;

      // Specific Polo Filter
      if (selectedPoloFilter !== 'ALL' && c.branchId !== selectedPoloFilter) return false;

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = c.fullName.toLowerCase().includes(query) || c.preferredName.toLowerCase().includes(query);
        const matchesCpf = c.cpf.includes(query);
        const matchesEmail = c.email.toLowerCase().includes(query);
        const matchesPolo = c.branchName.toLowerCase().includes(query);
        const matchesPosition = c.positionTitle.toLowerCase().includes(query);
        if (!matchesName && !matchesCpf && !matchesEmail && !matchesPolo && !matchesPosition) return false;
      }

      // Dept filter
      if (selectedDeptFilter !== 'ALL' && c.departmentId !== selectedDeptFilter) return false;

      // Contract filter
      if (selectedContractFilter !== 'ALL') {
        if (selectedContractFilter === 'RPA') {
          if (c.contractType !== 'RPA' && c.contractType !== 'PJ') return false;
        } else if (c.contractType !== selectedContractFilter) {
          return false;
        }
      }

      // Status / Condition filter
      if (selectedStatusFilter !== 'ALL') {
        const tenureDays = calculateTenureDays(c.admissionDate);
        if (selectedStatusFilter === 'EFETIVOS') {
          if (c.contractType !== 'CLT' || tenureDays <= 90) return false;
        } else if (selectedStatusFilter === 'EXPERIENCIA') {
          if (c.contractType !== 'CLT' || tenureDays > 90) return false;
        } else if (selectedStatusFilter === 'RPA') {
          if (c.contractType !== 'RPA' && c.contractType !== 'PJ') return false;
        } else if (c.status !== selectedStatusFilter) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    return result.sort((a, b) => {
      if (sortBy === 'NAME_ASC') {
        return a.fullName.localeCompare(b.fullName, 'pt-BR', { sensitivity: 'base' });
      }
      if (sortBy === 'NAME_DESC') {
        return b.fullName.localeCompare(a.fullName, 'pt-BR', { sensitivity: 'base' });
      }
      if (sortBy === 'POLO_ASC') {
        const comp = a.branchName.localeCompare(b.branchName, 'pt-BR');
        return comp !== 0 ? comp : a.fullName.localeCompare(b.fullName, 'pt-BR');
      }
      if (sortBy === 'POLO_DESC') {
        const comp = b.branchName.localeCompare(a.branchName, 'pt-BR');
        return comp !== 0 ? comp : a.fullName.localeCompare(b.fullName, 'pt-BR');
      }
      if (sortBy === 'ADMISSION_DESC') {
        return new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime();
      }
      if (sortBy === 'ADMISSION_ASC') {
        return new Date(a.admissionDate).getTime() - new Date(b.admissionDate).getTime();
      }
      if (sortBy === 'POSITION_ASC') {
        const comp = a.positionTitle.localeCompare(b.positionTitle, 'pt-BR');
        return comp !== 0 ? comp : a.fullName.localeCompare(b.fullName, 'pt-BR');
      }
      return 0;
    });
  }, [collaborators, selectedBranchIds, selectedPoloFilter, searchTerm, selectedDeptFilter, selectedStatusFilter, selectedContractFilter, sortBy]);

  // Metric counts based on base list (filtered by selected branches and polo, but before condition filter)
  const baseListForMetrics = useMemo(() => {
    return collaborators.filter((c) => {
      if (!selectedBranchIds.includes(c.branchId)) return false;
      if (selectedPoloFilter !== 'ALL' && c.branchId !== selectedPoloFilter) return false;
      return true;
    });
  }, [collaborators, selectedBranchIds, selectedPoloFilter]);

  const effectiveCount = useMemo(() => {
    return baseListForMetrics.filter(c => c.contractType === 'CLT' && calculateTenureDays(c.admissionDate) > 90).length;
  }, [baseListForMetrics]);

  const probationCount = useMemo(() => {
    return baseListForMetrics.filter(c => c.contractType === 'CLT' && calculateTenureDays(c.admissionDate) <= 90).length;
  }, [baseListForMetrics]);

  const rpaCount = useMemo(() => {
    return baseListForMetrics.filter(c => c.contractType === 'RPA' || c.contractType === 'PJ').length;
  }, [baseListForMetrics]);

  const handleAddCollaborator = (newColab: CollaboratorProfile) => {
    addCollaborator(newColab);
    setIsAddModalOpen(false);
    logAction('CREATE', 'Colaborador', newColab.id, `Colaborador ${newColab.fullName} cadastrado no sistema`);
  };

  const handleExportCSV = () => {
    const headers = ['Nome Completo', 'Condição', 'Tempo de Empresa (Dias)', 'Data de Admissão', 'CPF', 'Email', 'Telefone', 'Operação / Polo', 'Departamento', 'Cargo', 'Vínculo', 'Status', 'Salário'];
    const rows = filteredList.map(c => {
      const tenure = getCollaboratorTenure(c);
      const condition = c.contractType === 'CLT' 
        ? (tenure.isProbation ? 'Período de Experiência' : 'Efetivo') 
        : (c.contractType === 'RPA' || c.contractType === 'PJ' ? 'RPA' : 'Estágio');

      return [
        `"${c.fullName}"`,
        `"${condition}"`,
        tenure.days,
        `"${formatDateBR(c.admissionDate)}"`,
        c.cpf,
        c.email,
        c.phone,
        `"${c.branchName}"`,
        `"${c.departmentName}"`,
        `"${c.positionTitle}"`,
        c.contractType === 'PJ' ? 'RPA' : c.contractType,
        c.status,
        c.salary
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quadro_colaboradores_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAction('EXPORT', 'Colaboradores', 'LIST', 'Exportação de quadro de colaboradores em CSV');
  };

  const [isExportingDocsZip, setIsExportingDocsZip] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportAllDocsZip = async () => {
    const activeFilteredIds = filteredList.map(c => c.id);
    const relatedDocs = INITIAL_ELECTRONIC_DOCUMENTS.filter(d => activeFilteredIds.includes(d.collaboratorId));
    
    if (relatedDocs.length === 0) {
      alert('Nenhum documento eletrônico registrado para os colaboradores do filtro atual.');
      return;
    }

    try {
      setIsExportingDocsZip(true);
      const count = await downloadBulkDocumentsZip(
        relatedDocs,
        filteredList,
        `documentos_filtrados_scl_${new Date().toISOString().slice(0, 10)}.zip`
      );
      logAction('EXPORT', 'Colaboradores', 'DOCS_ZIP', `Download em massa de ${count} documentos dos colaboradores filtrados`);
      setExportNotice(`Download de ${count} documentos concluído com sucesso em arquivo .ZIP!`);
      setTimeout(() => setExportNotice(null), 4500);
    } catch (err) {
      console.error(err);
      alert('Erro ao exportar documentos em massa.');
    } finally {
      setIsExportingDocsZip(false);
    }
  };

  // Helper status badge
  const renderStatusBadge = (colab: CollaboratorProfile) => {
    const tenure = getCollaboratorTenure(colab);

    if (colab.status === 'EM_FERIAS') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Em férias
        </span>
      );
    }

    if (colab.status === 'AFASTADO') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Afastado
        </span>
      );
    }

    if (colab.status === 'DESLIGADO') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/80">
          Desligado
        </span>
      );
    }

    if (colab.contractType === 'CLT') {
      if (tenure.isProbation) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            Experiência ({tenure.probationDaysRemaining}d rest.)
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Efetivo ({tenure.days}d)
        </span>
      );
    }

    if (colab.contractType === 'RPA' || colab.contractType === 'PJ') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Prestador RPA
        </span>
      );
    }

    if (colab.contractType === 'ESTAGIO') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          Estágio
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
        {colab.status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Action & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Left: Search Input + Unified Filter Toggle Button */}
          <div className="flex items-center gap-2 flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-collaborator-input"
                type="text"
                placeholder="Buscar por nome, CPF, e-mail, cargo ou polo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9.5 pr-8 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Single Unified Filter Button */}
            <button
              id="btn-toggle-filters"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer shrink-0 ${
                isFilterPanelOpen || activeFiltersCount > 0
                  ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100'
              }`}
              title="Abrir filtros e ordenação"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFilterPanelOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-colors cursor-pointer"
              title="Importar planilha de colaboradores"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Importar</span>
            </button>

            <button
              id="btn-google-sheets-sync"
              onClick={() => setIsGoogleSheetsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-900 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
              title="Conectar e sincronizar com o Google Planilhas (Google Sheets)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Planilhas</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-colors cursor-pointer"
              title="Exportar para Excel / CSV com tempo de efetivação"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Planilha CSV</span>
            </button>

            <button
              onClick={handleExportAllDocsZip}
              disabled={isExportingDocsZip || filteredList.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              title="Baixar todos os documentos dos colaboradores filtrados em arquivo .ZIP"
            >
              <Archive className="w-3.5 h-3.5 text-blue-600" />
              <span>{isExportingDocsZip ? 'Gerando ZIP...' : 'Documentos (.ZIP)'}</span>
            </button>

            <button
              id="btn-purge-duplicates"
              onClick={handlePurgeDuplicates}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer"
              title="Verificar e excluir colaboradores duplicados com o mesmo nome"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Deduplicar</span>
            </button>

            <button
              id="btn-add-collaborator"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Adicionar Pessoa</span>
            </button>
          </div>
        </div>

        {/* Unified Filter Collapsible Drawer / Popover Panel */}
        {isFilterPanelOpen && (
          <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  Filtros &amp; Critérios de Visualização
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ({filteredList.length} colaborador(es) localizado(s))
                </span>
              </div>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Limpar todos os filtros ({activeFiltersCount})</span>
                  </button>
                )}
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* 1. Polo */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                  Operação / Polo
                </label>
                <select
                  id="filter-polo-select"
                  value={selectedPoloFilter}
                  onChange={(e) => setSelectedPoloFilter(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="ALL">Todos os Polos ({collaborators.length})</option>
                  {availablePolos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Departamento */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                  Departamento
                </label>
                <select
                  id="filter-dept-select"
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="ALL">Todos os Departamentos</option>
                  {INITIAL_DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* 3. Condição & Status */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                  Condição &amp; Status
                </label>
                <select
                  id="filter-status-select"
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value as ExtendedStatusFilter)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="ALL">Todas as Condições &amp; Status</option>
                  <option value="EFETIVOS">✓ Efetivos (&gt; 90 dias)</option>
                  <option value="EXPERIENCIA">⏳ Período de Experiência (≤ 90 dias)</option>
                  <option value="RPA">🏢 RPA (Prestadores de Serviço)</option>
                  <option value="EM_ATIVIDADE">Em atividade regular</option>
                  <option value="EM_FERIAS">Em férias</option>
                  <option value="AFASTADO">Afastado</option>
                  <option value="DESLIGADO">Desligado</option>
                </select>
              </div>

              {/* 4. Vínculo */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                  Tipo de Vínculo
                </label>
                <select
                  id="filter-contract-select"
                  value={selectedContractFilter}
                  onChange={(e) => setSelectedContractFilter(e.target.value as any)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="ALL">Todos os Vínculos</option>
                  <option value="CLT">CLT</option>
                  <option value="RPA">RPA</option>
                  <option value="ESTAGIO">Estágio</option>
                </select>
              </div>

              {/* 5. Ordem */}
              <div>
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                  Ordenação
                </label>
                <select
                  id="sort-collaborators-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOrderOption)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="NAME_ASC">Ordem Alfabética (A → Z)</option>
                  <option value="NAME_DESC">Ordem Alfabética (Z → A)</option>
                  <option value="POLO_ASC">Polo (A → Z)</option>
                  <option value="POLO_DESC">Polo (Z → A)</option>
                  <option value="ADMISSION_DESC">Admissão (Mais Recente)</option>
                  <option value="ADMISSION_ASC">Admissão (Mais Antiga)</option>
                  <option value="POSITION_ASC">Cargo (A → Z)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Chips Bar (Only shown when any filter is active and panel is closed) */}
        {activeFiltersCount > 0 && !isFilterPanelOpen && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filtros ativos:
            </span>

            {selectedPoloFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200/80">
                <span>Polo: {availablePolos.find(p => p.id === selectedPoloFilter)?.name || selectedPoloFilter}</span>
                <button onClick={() => setSelectedPoloFilter('ALL')} className="hover:text-blue-950 cursor-pointer ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedDeptFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200/80">
                <span>Depto: {INITIAL_DEPARTMENTS.find(d => d.id === selectedDeptFilter)?.name || selectedDeptFilter}</span>
                <button onClick={() => setSelectedDeptFilter('ALL')} className="hover:text-blue-950 cursor-pointer ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedStatusFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200/80">
                <span>Status: {selectedStatusFilter}</span>
                <button onClick={() => setSelectedStatusFilter('ALL')} className="hover:text-blue-950 cursor-pointer ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedContractFilter !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200/80">
                <span>Vínculo: {selectedContractFilter}</span>
                <button onClick={() => setSelectedContractFilter('ALL')} className="hover:text-blue-950 cursor-pointer ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {sortBy !== 'NAME_ASC' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                <span>Ordem personalizada</span>
                <button onClick={() => setSortBy('NAME_ASC')} className="hover:text-slate-900 cursor-pointer ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 underline cursor-pointer ml-1"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {directoryToast.show && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1 bg-emerald-600 text-white rounded-md">
              <CheckCheck className="w-4 h-4" />
            </div>
            <span>{directoryToast.message}</span>
          </div>
          <button onClick={() => setDirectoryToast({ show: false, message: '' })} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button onClick={() => setExportNotice(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Metrics Bar: Total, Efetivos, Período de Experiência, RPA - Interactive Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Card 1: Total */}
        <button
          type="button"
          onClick={() => setSelectedStatusFilter('ALL')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
            selectedStatusFilter === 'ALL'
              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
          }`}
          title="Ver todos os colaboradores cadastrados"
        >
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Total Geral</span>
              {selectedStatusFilter === 'ALL' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">{baseListForMetrics.length}</span>
              {filteredList.length !== baseListForMetrics.length && (
                <span className="text-[10px] text-slate-400 font-medium">({filteredList.length} exibidos)</span>
              )}
            </div>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            selectedStatusFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
          }`}>
            <Users className="w-4 h-4" />
          </div>
        </button>

        {/* Card 2: Efetivos (>90d) */}
        <button
          type="button"
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'EFETIVOS' ? 'ALL' : 'EFETIVOS')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
            selectedStatusFilter === 'EFETIVOS'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-emerald-200 hover:bg-emerald-50/30 shadow-2xs'
          }`}
          title="Clique para filtrar apenas colaboradores Efetivos (> 90 dias)"
        >
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Efetivos (&gt;90d)</span>
              {selectedStatusFilter === 'EFETIVOS' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              )}
            </div>
            <span className="text-lg font-bold text-emerald-600">
              {effectiveCount}
            </span>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            selectedStatusFilter === 'EFETIVOS' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </button>

        {/* Card 3: Período Experiência (≤90d) */}
        <button
          type="button"
          id="btn-filter-probation"
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'EXPERIENCIA' ? 'ALL' : 'EXPERIENCIA')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${
            selectedStatusFilter === 'EXPERIENCIA'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/30 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-amber-300 hover:bg-amber-50/40 shadow-2xs'
          }`}
          title="Clique para filtrar e listar todas as pessoas em Período de Experiência (≤ 90 dias)"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">Período Experiência</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase transition-colors ${
                selectedStatusFilter === 'EXPERIENCIA' ? 'bg-amber-200 text-amber-950' : 'bg-amber-100 text-amber-800 group-hover:bg-amber-200'
              }`}>
                ≤ 90d
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-amber-700">
                {probationCount}
              </span>
              <span className="text-[10px] text-amber-600/80 font-medium">
                {selectedStatusFilter === 'EXPERIENCIA' ? '• Filtrado' : '• Clique p/ filtrar'}
              </span>
            </div>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            selectedStatusFilter === 'EXPERIENCIA' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-100'
          }`}>
            <Clock className="w-4 h-4" />
          </div>
        </button>

        {/* Card 4: RPA (Prestadores) */}
        <button
          type="button"
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'RPA' ? 'ALL' : 'RPA')}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
            selectedStatusFilter === 'RPA'
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20 shadow-xs'
              : 'bg-white border-slate-200/90 hover:border-purple-200 hover:bg-purple-50/30 shadow-2xs'
          }`}
          title="Clique para filtrar apenas prestadores de serviço RPA"
        >
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">RPA (Prestadores)</span>
              {selectedStatusFilter === 'RPA' && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
              )}
            </div>
            <span className="text-lg font-bold text-purple-600">
              {rpaCount}
            </span>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            selectedStatusFilter === 'RPA' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'
          }`}>
            <Briefcase className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                  onClick={() => setSortBy(sortBy === 'NAME_ASC' ? 'NAME_DESC' : 'NAME_ASC')}
                  title="Clique para ordenar por nome em ordem alfabética"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Colaborador</span>
                    {sortBy === 'NAME_ASC' && <ArrowUpAZ className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                    {sortBy === 'NAME_DESC' && <ArrowDownAZ className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                    {sortBy !== 'NAME_ASC' && sortBy !== 'NAME_DESC' && (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                  onClick={() => setSortBy(sortBy === 'POSITION_ASC' ? 'NAME_ASC' : 'POSITION_ASC')}
                  title="Clique para ordenar por cargo"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Cargo & Área</span>
                    {sortBy === 'POSITION_ASC' ? (
                      <ArrowUpAZ className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100/80 transition-colors select-none group"
                  onClick={() => setSortBy(sortBy === 'POLO_ASC' ? 'POLO_DESC' : 'POLO_ASC')}
                  title="Clique para ordenar por Polo em ordem alfabética"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Operação / Polo</span>
                    {sortBy === 'POLO_ASC' && <ArrowUpAZ className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                    {sortBy === 'POLO_DESC' && <ArrowDownAZ className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                    {sortBy !== 'POLO_ASC' && sortBy !== 'POLO_DESC' && (
                      <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-3">Vínculo</th>
                <th className="py-3 px-3">Condição & Status</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length > 0 ? (
                filteredList.map((colab) => {
                  const tenure = getCollaboratorTenure(colab);
                  const isProb = isProbationPeriod(colab.admissionDate);

                  return (
                    <tr
                      key={colab.id}
                      id={`colab-row-${colab.id}`}
                      onClick={() => setSelectedCollaborator(colab)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Colaborador Nome & Tempo Efetivo */}
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {colab.fullName}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
                            {/* Tenure / Efetivo Indicator */}
                            {colab.contractType === 'CLT' ? (
                              isProb ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStatusFilter(selectedStatusFilter === 'EXPERIENCIA' ? 'ALL' : 'EXPERIENCIA');
                                  }}
                                  className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition-colors cursor-pointer"
                                  title="Clique para filtrar e ver todos os colaboradores em período de experiência"
                                >
                                  <Clock className="w-3 h-3 text-amber-600" />
                                  Em experiência há {tenure.days} dias ({tenure.probationDaysRemaining}d restantes)
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStatusFilter(selectedStatusFilter === 'EFETIVOS' ? 'ALL' : 'EFETIVOS');
                                  }}
                                  className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200/70 transition-colors cursor-pointer"
                                  title="Clique para filtrar colaboradores efetivos (> 90 dias)"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Efetivo há {tenure.days} dias
                                </button>
                              )
                            ) : colab.contractType === 'RPA' || colab.contractType === 'PJ' ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStatusFilter(selectedStatusFilter === 'RPA' ? 'ALL' : 'RPA');
                                }}
                                className="inline-flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200/70 transition-colors cursor-pointer"
                                title="Clique para filtrar prestadores RPA"
                              >
                                Prestador RPA há {tenure.days} dias
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/70">
                                Estágio há {tenure.days} dias
                              </span>
                            )}

                            <span className="text-slate-400 font-mono text-[10px]">
                              CPF: {colab.cpf}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cargo & Área */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-800">{colab.positionTitle}</span>
                          {isOwnItEligible(colab) && (
                            <span 
                              className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200"
                              title={`Jornada OWN IT: Nível ${getCollaboratorOwnItJourney(colab).currentLevel}`}
                            >
                              {getCollaboratorOwnItJourney(colab).currentLevel}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{colab.departmentName}</div>
                      </td>

                      {/* Operação */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {colab.branchName}
                        </span>
                      </td>

                      {/* Vínculo */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${
                          colab.contractType === 'CLT' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : colab.contractType === 'RPA' || colab.contractType === 'PJ'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}>
                          {colab.contractType === 'PJ' ? 'RPA' : colab.contractType}
                        </span>
                      </td>

                      {/* Condição & Status */}
                      <td className="py-3 px-3">
                        {renderStatusBadge(colab)}
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCollaborator(colab);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar informações do colaborador"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Editar</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCollaborator(colab);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Ver prontuário 360 completo"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Prontuário</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Users className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="font-semibold text-slate-700 text-sm">Nenhum colaborador encontrado</p>
                      <p className="text-xs text-slate-500">
                        Tente ajustar os termos da pesquisa ou os filtros de polo, departamento ou condição.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Importar Planilha */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Importação de Colaboradores em Lote</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Você pode importar a relação de colaboradores da sua empresa via planilha Excel (.xlsx) ou CSV. Os campos de admissão, CPF, e-mail, cargo e dados bancários serão validados e o cálculo de efetivação/experiência será atualizado diariamente de forma automática.
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/20 transition-all cursor-pointer">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Arraste e solte o arquivo aqui ou clique para selecionar</p>
                <p className="text-[11px] text-slate-400 mt-1">Formatos suportados: .XLSX, .CSV (Max 15MB)</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-600">Baixar planilha modelo padrão SCL:</span>
                <button
                  onClick={handleExportCSV}
                  className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Modelo_Colaboradores.csv
                </button>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Planilha validada com sucesso!');
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Processar Importação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Colaborador */}
      <AddCollaboratorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        branches={branches}
        departments={INITIAL_DEPARTMENTS}
        positions={INITIAL_POSITIONS}
        onSave={handleAddCollaborator}
      />

      {/* Drawer Prontuário 360 */}
      <CollaboratorProfileDrawer
        collaborator={selectedCollaborator}
        onClose={() => setSelectedCollaborator(null)}
        onUpdateCollaborator={handleUpdateCollaborator}
        onDeleteCollaborator={handleDeleteCollaborator}
      />

      {/* Modal de Edição de Dados do Colaborador (Direto da Listagem) */}
      {editingCollaborator && (
        <EditCollaboratorModal
          isOpen={!!editingCollaborator}
          onClose={() => setEditingCollaborator(null)}
          collaborator={editingCollaborator}
          onSave={(updated) => {
            handleUpdateCollaborator(updated);
            logAction('UPDATE', 'Colaborador', updated.id, `Cadastro e dados atualizados para ${updated.fullName}`);
          }}
        />
      )}

      {/* Modal de Sincronização e Integração com Google Planilhas */}
      <GoogleSheetsSyncModal
        isOpen={isGoogleSheetsModalOpen}
        onClose={() => setIsGoogleSheetsModalOpen(false)}
        collaborators={collaborators}
        onImportCollaborators={handleImportFromGoogleSheets}
      />
    </div>
  );
};
