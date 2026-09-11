import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Building, Menu, CheckSquare, Square, Sparkles, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useStoredLembretes, getImminentAlerts } from '../../utils/lembretesStorage';
import { LembretesAlertModal } from '../lembretes/LembretesAlertModal';

const MODULE_NAMES: Record<string, string> = {
  'gestao-pessoas': 'Gestão de Pessoas',
  'departamento-pessoal': 'Departamento Pessoal',
  'admissao-demissao': 'Admissão e Demissão',
  'lembretes': 'Lembretes & Calendário',
  'auditorias': 'Auditorias',
  'configuracoes': 'Configurações'
};

export const Header: React.FC<{ 
  onToggleMobileMenu: () => void;
  onOpenSimulacao?: () => void;
}> = ({ onToggleMobileMenu, onOpenSimulacao }) => {
  const { 
    currentUser, 
    availableUsers, 
    switchUser, 
    branches,
    selectedBranchIds,
    selectedBranches,
    toggleBranch,
    selectAllBranches,
    selectSingleBranch,
    isAllBranchesSelected,
    branchSelectionLabel
  } = useAuth();
  
  const { activeModuleId, navigateTo } = useNavigation();
  const { lembretes, toggleLembreteStatus, snoozeLembrete } = useStoredLembretes();

  const imminentAlerts = useMemo(() => {
    return getImminentAlerts(7);
  }, [lembretes]);

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 px-6 lg:px-8 flex items-center justify-between shrink-0 z-30">
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1.5 rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-normal">Plataforma</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-semibold">
            {MODULE_NAMES[activeModuleId] || 'Gestão de Pessoas'}
          </span>
        </div>
      </div>

      {/* Right side: Operations Multi-Selector & User Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Visual Simulation Button */}
        {onOpenSimulacao && (
          <button
            onClick={onOpenSimulacao}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:border-blue-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Ver proposta de novo design limpo e organizado"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Simulação Visual</span>
          </button>
        )}

        {/* Operations Multi-Selector */}
        <div className="relative" ref={branchDropdownRef}>
          <button
            id="operations-selector-btn"
            onClick={() => {
              setIsBranchDropdownOpen(!isBranchDropdownOpen);
              setIsUserDropdownOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors text-left cursor-pointer ${
              selectedBranchIds.length > 1
                ? 'border-blue-300 bg-blue-50/40 text-blue-900'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-semibold">
              {branchSelectionLabel}
            </span>
            {selectedBranchIds.length > 1 && !isAllBranchesSelected && (
              <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                {selectedBranchIds.length}
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isBranchDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Header with Quick Actions */}
              <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Filtrar Operações
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {selectedBranchIds.length} de {branches.length} selecionadas
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAllBranchesSelected) {
                      selectSingleBranch(branches[0].id);
                    } else {
                      selectAllBranches();
                    }
                  }}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  {isAllBranchesSelected ? 'Limpar seleção' : 'Selecionar todas'}
                </button>
              </div>

              {/* Operations Checkbox List */}
              <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-50">
                {branches.map((b) => {
                  const isChecked = selectedBranchIds.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      onClick={() => toggleBranch(b.id)}
                      className={`group w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-xs ${
                        isChecked ? 'bg-blue-50/40 text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                          isChecked 
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="truncate">
                          <span className={`text-xs block truncate ${isChecked ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                            {b.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {b.code} • {b.city}/{b.state}
                          </span>
                        </div>
                      </div>

                      {/* Quick "Apenas esta" button on hover */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectSingleBranch(b.id);
                          setIsBranchDropdownOpen(false);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-500 hover:text-blue-600 hover:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-slate-200 font-medium transition-all shrink-0 cursor-pointer"
                        title="Visualizar apenas esta operação"
                      >
                        Apenas
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Presets */}
              <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 text-[10px]">
                  Multi-seleção ativa
                </span>
                <button
                  type="button"
                  onClick={() => setIsBranchDropdownOpen(false)}
                  className="px-2.5 py-1 bg-slate-900 text-white font-medium rounded-md text-[11px] hover:bg-slate-800 cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bell Notifications Icon for Imminent Alerts */}
        <button
          id="header-alerts-bell-btn"
          onClick={() => {
            if (imminentAlerts.length > 0) {
              setIsAlertModalOpen(true);
            } else {
              navigateTo('lembretes' as any);
            }
          }}
          className={`relative p-2 rounded-full border transition-all cursor-pointer ${
            imminentAlerts.length > 0
              ? 'border-amber-300 bg-amber-50/70 text-amber-900 hover:bg-amber-100'
              : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
          title={imminentAlerts.length > 0 ? `${imminentAlerts.length} lembretes com vencimento próximo` : 'Lembretes & Calendário'}
        >
          <Bell className={`w-4 h-4 ${imminentAlerts.length > 0 ? 'text-amber-600' : ''}`} />
          {imminentAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-600 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-xs animate-bounce">
              {imminentAlerts.length > 9 ? '9+' : imminentAlerts.length}
            </span>
          )}
        </button>

        {/* User Badge: AD | Administrador */}
        <div className="relative" ref={userDropdownRef}>
          <button
            id="user-profile-btn"
            onClick={() => {
              setIsUserDropdownOpen(!isUserDropdownOpen);
              setIsBranchDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
              AD
            </div>
            <span className="text-xs font-semibold text-slate-800">
              Administrador
            </span>
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                <div className="mt-1">
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {currentUser.roleTitle}
                  </span>
                </div>
              </div>

              <div className="px-3 py-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Simular Perfil:
                </span>
                <div className="space-y-1">
                  {availableUsers.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsUserDropdownOpen(false);
                        }}
                        className={`w-full px-2.5 py-1.5 text-left rounded-md text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-medium'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-xs">{u.name}</div>
                          <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {u.roleTitle}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Alerts Pop-up Modal triggered by Bell */}
      {isAlertModalOpen && (
        <LembretesAlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          alerts={imminentAlerts}
          onToggleStatus={(id) => toggleLembreteStatus(id)}
          onSnooze={(id, days) => snoozeLembrete(id, days || 2)}
          onNavigateToCalendar={() => navigateTo('lembretes' as any)}
        />
      )}
    </header>
  );
};
