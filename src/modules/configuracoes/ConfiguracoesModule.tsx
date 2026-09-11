import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  GitBranch, 
  FileText, 
  CheckCircle2, 
  Lock, 
  UserCheck, 
  Plus, 
  Clock, 
  Search,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ConfiguracoesModule: React.FC = () => {
  const { 
    branches, 
    selectedBranchIds, 
    toggleBranch, 
    selectAllBranches, 
    selectSingleBranch, 
    isAllBranchesSelected,
    auditLogs,
    logAction
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'filiais' | 'rbac' | 'workflows' | 'auditoria'>('filiais');

  const ROLES = [
    {
      id: 'admin-geral',
      name: 'Super Administrador (RH/DP Central)',
      description: 'Acesso total a todas as 8 operações, fechamento de folha, admissão, rescisão e eSocial.',
      usersCount: 3,
      permissions: ['Folha Completa', 'Controle Total eSocial', 'Assinatura Digital', 'Aprovação de Férias', 'Gestão de Usuários']
    },
    {
      id: 'lider-operacional',
      name: 'Líder Operacional de Usina Solar',
      description: 'Acesso restrito à sua respectiva usina solar para aprovação de férias e apontamento de horas.',
      usersCount: 8,
      permissions: ['1ª Aprovação de Férias', 'Visualização de Ponto', 'Requisição de Vagas']
    },
    {
      id: 'contabilidade-parceira',
      name: 'Contabilidade Parceira (Domínio Thomson Reuters)',
      description: 'Acesso exclusivo de leitura e exportação dos fechamentos mensais de folha e eventos.',
      usersCount: 2,
      permissions: ['Download Relatório Contábil', 'Espelhos de Rubricas', 'Conferência eSocial']
    },
    {
      id: 'colaborador-portal',
      name: 'Colaborador (Autoatendimento / Portal)',
      description: 'Acesso individual aos próprios holerites, informe de rendimentos, solicitação de férias e cartão Caju.',
      usersCount: 8,
      permissions: ['Visualizar Holerites', 'Solicitar Férias', 'Assinar Documentos Digitais', 'Saldo Caju Flex']
    }
  ];

  const WORKFLOWS = [
    {
      id: 'wf-ferias',
      name: 'Fluxo Padrão de Concessão de Férias CLT',
      steps: [
        { order: 1, role: 'Líder Operacional da Usina', action: 'Validação da escala de operação no parque solar' },
        { order: 2, role: 'RH Central SCL', action: 'Conferência de saldo aquisitivo e prazo de dobra CLT' },
        { order: 3, role: 'Assinatura Digital', action: 'Disparo do aviso de férias para assinatura digital do colaborador' },
        { order: 4, role: 'DP / Folha', action: 'Lançamento do adiantamento de férias e 1/3 constitucional' }
      ]
    },
    {
      id: 'wf-admissao',
      name: 'Esteira Digital de Admissão & Integração',
      steps: [
        { order: 1, role: 'Candidato / Novo Colaborador', action: 'Envio de fotos de documentos (RG, CNH, CPF, Título, Cartão Vacina)' },
        { order: 2, role: 'RH Central', action: 'Validação de dados e qualificação cadastral no eSocial' },
        { order: 3, role: 'SST / Clínica Médica', action: 'Emissão do ASO Admissional com riscos NR-10/NR-35' },
        { order: 4, role: 'Assinatura Digital', action: 'Assinatura digital do Contrato CLT e Termo de EPI' },
        { order: 5, role: 'DP Central', action: 'Transmissão do evento S-2200 ao eSocial e carga Caju Flex' }
      ]
    }
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Module Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Configurações do Sistema
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Administração Central SCL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestão das 8 unidades operacionais, matriz de permissões RBAC, esteiras de aprovação e auditoria.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('filiais')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'filiais'
              ? 'border-blue-600 text-blue-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Operações & Filiais (8 Polos)</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'rbac'
              ? 'border-blue-600 text-blue-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Perfis & Permissões (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('workflows')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'workflows'
              ? 'border-blue-600 text-blue-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Workflows & Alçadas</span>
        </button>

        <button
          onClick={() => setActiveTab('auditoria')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'auditoria'
              ? 'border-blue-600 text-blue-600 bg-white shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Trilha de Auditoria ({auditLogs.length})</span>
        </button>
      </div>

      {/* Main Content */}
      {activeTab === 'filiais' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Polos Operacionais de Usinas Solares SCL</h3>
              <p className="text-xs text-slate-500">
                Ative ou desative filiais para consolidar o painel multi-unidade em tempo real.
              </p>
            </div>

            <button
              onClick={() => {
                if (isAllBranchesSelected) {
                  selectSingleBranch(branches[0].id);
                } else {
                  selectAllBranches();
                }
              }}
              className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer transition-colors"
            >
              {isAllBranchesSelected ? 'Desmarcar Outras' : 'Selecionar Todas as 8 Unidades'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {branches.map((b) => {
              const isSelected = selectedBranchIds.includes(b.id);
              return (
                <div
                  key={b.id}
                  onClick={() => toggleBranch(b.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/40 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                      <span className="font-bold text-slate-900 text-xs">
                        {b.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                      {b.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono">
                    CNPJ: {b.cnpj}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {b.city} - {b.state} • Polo Fotovoltaico
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'rbac' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ROLES.map((role) => (
            <div key={role.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">{role.name}</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {role.usersCount} usuários
                </span>
              </div>
              <p className="text-xs text-slate-500">{role.description}</p>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Permissões Habilitadas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((perm) => (
                    <span key={perm} className="text-[11px] font-medium bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                      ✓ {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'workflows' && (
        <div className="space-y-4">
          {WORKFLOWS.map((wf) => (
            <div key={wf.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">{wf.name}</h3>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Ativo & Automatizado
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {wf.steps.map((step) => (
                  <div key={step.order} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                        {step.order}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{step.role}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pt-1">{step.action}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'auditoria' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Trilha de Auditoria Imutável (Audit Trail)</h3>
            <span className="text-xs text-slate-500 font-mono">Conformidade LGPD & Governança</span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Data & Hora</th>
                <th className="py-3 px-3">Usuário / Operador</th>
                <th className="py-3 px-3">Módulo</th>
                <th className="py-3 px-3">Tipo de Operação</th>
                <th className="py-3 px-3">Descrição do Evento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-500 font-mono">{log.timestamp}</td>
                  <td className="py-3 px-3 font-sans font-bold text-slate-900">{log.userName}</td>
                  <td className="py-3 px-3 font-sans text-blue-700 font-semibold">{log.targetEntity}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-700">{log.action}: {log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
