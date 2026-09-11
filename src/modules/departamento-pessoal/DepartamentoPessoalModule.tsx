import React, { useState } from 'react';
import { 
  Calculator, 
  Clock, 
  CreditCard, 
  FileText, 
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FolhaPreparacaoView } from './components/FolhaPreparacaoView';
import { ControlePontoView } from './components/ControlePontoView';
import { GestaoBeneficiosView } from './components/GestaoBeneficiosView';
import { ContratosRPAView } from './components/ContratosRPAView';
import { ESocialObrigacoesView } from './components/ESocialObrigacoesView';

export const DepartamentoPessoalModule: React.FC = () => {
  const { branchSelectionLabel } = useAuth();
  const [activeTab, setActiveTab] = useState<'folha' | 'ponto' | 'beneficios' | 'rpa' | 'esocial'>('folha');

  const TABS = [
    { id: 'folha', label: 'Folha & Rubricas', icon: Calculator },
    { id: 'ponto', label: 'Controle de Ponto & Jornada', icon: Clock },
    { id: 'beneficios', label: 'Benefícios & Caju Flex', icon: CreditCard },
    { id: 'rpa', label: 'Contratos & RPA Terceiros', icon: FileText },
    { id: 'esocial', label: 'eSocial & Obrigações', icon: ShieldCheck }
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Module Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Departamento Pessoal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Preparação de folha, integração contábil Domínio, cartão Caju Flex, ponto e obrigações eSocial.
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
              id={`tab-dp-${tab.id}`}
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
        {activeTab === 'folha' && <FolhaPreparacaoView />}
        {activeTab === 'ponto' && <ControlePontoView />}
        {activeTab === 'beneficios' && <GestaoBeneficiosView />}
        {activeTab === 'rpa' && <ContratosRPAView />}
        {activeTab === 'esocial' && <ESocialObrigacoesView />}
      </div>
    </div>
  );
};

