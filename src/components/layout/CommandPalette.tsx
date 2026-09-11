import React, { useState, useEffect } from 'react';
import { Search, X, Users, Building2, UserCheck, FileSpreadsheet, Settings, ArrowRight, Shield } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { SYSTEM_MODULES, SYSTEM_PILLARS } from '../../config/modules';
import { INITIAL_EMPLOYEES } from '../../data/mockData';
import { MainModuleId } from '../../types/navigation';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, navigateTo } = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredModules = SYSTEM_MODULES.flatMap(m => 
    m.subModules.map(sub => ({
      moduleId: m.id,
      moduleName: m.label,
      subModuleId: sub.id,
      title: sub.title,
      description: sub.description
    }))
  ).filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmployees = INITIAL_EMPLOYEES.filter(emp =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.positionTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs transition-opacity"
        onClick={() => setIsCommandPaletteOpen(false)}
      />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Search input header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Digite para buscar módulos, colaboradores, rotinas ou termos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Limpar
            </button>
          )}
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Sub-modules */}
          <div>
            <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Módulos & Funcionalidades
            </div>
            <div className="space-y-1 mt-1">
              {filteredModules.slice(0, 5).map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigateTo(m.moduleId as MainModuleId, m.subModuleId);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left rounded-lg hover:bg-slate-100 flex items-center justify-between transition-colors group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 flex items-center gap-2">
                      <span>{m.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">em {m.moduleName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{m.description}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Colaboradores */}
          {filteredEmployees.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Colaboradores (Quadro)
              </div>
              <div className="space-y-1 mt-1">
                {filteredEmployees.slice(0, 4).map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      navigateTo('gestao-pessoas', 'colaboradores');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left rounded-lg hover:bg-slate-100 flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {emp.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600">
                          {emp.fullName}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {emp.positionTitle} • {emp.departmentName} • <span className="font-mono">{emp.registrationNumber}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{emp.contractType}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Use as setas para navegar, Enter para selecionar</span>
          <span>Esc para fechar</span>
        </div>
      </div>
    </div>
  );
};
