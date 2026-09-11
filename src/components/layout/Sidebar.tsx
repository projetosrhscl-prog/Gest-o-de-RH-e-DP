import React, { useMemo } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import { MainModuleId } from '../../types/navigation';
import { useStoredLembretes, getImminentAlerts } from '../../utils/lembretesStorage';

interface NavItem {
  id: MainModuleId;
  label: string;
  badgeCount?: number;
}

export const Sidebar: React.FC<{ isOpen: boolean; onCloseMobile: () => void }> = ({ 
  isOpen, 
  onCloseMobile 
}) => {
  const { activeModuleId, navigateTo } = useNavigation();
  const { lembretes } = useStoredLembretes();

  const imminentAlertsCount = useMemo(() => {
    return getImminentAlerts(7).length;
  }, [lembretes]);

  const PRIMARY_NAV_ITEMS: NavItem[] = [
    { id: 'gestao-pessoas', label: 'Gestão de Pessoas' },
    { id: 'departamento-pessoal', label: 'Departamento Pessoal' },
    { id: 'admissao-demissao', label: 'Admissão e Demissão' },
    { id: 'lembretes', label: 'Lembretes', badgeCount: imminentAlertsCount },
    { id: 'auditorias', label: 'Auditorias' }
  ];

  const handleNavClick = (id: MainModuleId) => {
    navigateTo(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-2xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-40 w-60 bg-[#0A1020] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800/80 shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div>
          {/* Logo Header */}
          <div className="px-5 py-6 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] tracking-tight shrink-0 shadow-sm">
              GP
            </div>
            <span className="text-[13px] font-bold text-white tracking-wider uppercase">
              GESTÃO DE PESSOAS
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-1">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive = activeModuleId === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/60 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                        isActive ? 'bg-blue-500' : 'bg-transparent'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      {item.badgeCount}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Pinned Link: Configurações */}
        <div className="p-3 border-t border-slate-800/50">
          <button
            id="nav-configuracoes"
            onClick={() => handleNavClick('configuracoes')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all text-left cursor-pointer ${
              activeModuleId === 'configuracoes'
                ? 'bg-slate-800/60 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                activeModuleId === 'configuracoes' ? 'bg-blue-500' : 'bg-transparent'
              }`}
            />
            <span>Configurações</span>
          </button>
        </div>
      </aside>
    </>
  );
};
