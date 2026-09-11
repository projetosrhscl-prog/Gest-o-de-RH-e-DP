import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  UserMinus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ColaboradoresDirectory } from './components/ColaboradoresDirectory';
import { FeriasProcessosView } from './components/FeriasProcessosView';
import { DocumentosAssinaturaView } from './components/DocumentosAssinaturaView';
import { DesligamentosView } from './components/DesligamentosView';

export const GestaoPessoasModule: React.FC = () => {
  const { branchSelectionLabel } = useAuth();
  const [activeTab, setActiveTab] = useState<'colaboradores' | 'ferias' | 'documentos' | 'desligamentos'>('colaboradores');

  const TABS = [
    { id: 'colaboradores', label: 'Quadro de Colaboradores', icon: Users },
    { id: 'ferias', label: 'Férias & Processos', icon: Calendar },
    { id: 'documentos', label: 'Documentos & Assinatura Digital', icon: FileText },
    { id: 'desligamentos', label: 'Desligamentos', icon: UserMinus }
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Module Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Gestão de Pessoas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Prontuários completos, controle de quadro, férias, assinaturas digitais e desligamentos.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1 bg-white border border-slate-200/80 rounded-lg text-xs font-medium text-slate-600">
            Escopo: <span className="font-semibold text-slate-900">{branchSelectionLabel}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200/80 overflow-x-auto pb-px">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-gp-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Router */}
      <div className="min-h-[500px]">
        {activeTab === 'colaboradores' && <ColaboradoresDirectory />}
        {activeTab === 'ferias' && <FeriasProcessosView />}
        {activeTab === 'documentos' && <DocumentosAssinaturaView />}
        {activeTab === 'desligamentos' && <DesligamentosView />}
      </div>
    </div>
  );
};

