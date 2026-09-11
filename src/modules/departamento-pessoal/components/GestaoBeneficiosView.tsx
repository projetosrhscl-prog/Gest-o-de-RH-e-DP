import React, { useState } from 'react';
import { 
  CreditCard, 
  Heart, 
  Bus, 
  Utensils, 
  Plus, 
  Download, 
  CheckCircle2, 
  Search, 
  DollarSign, 
  Building,
  Sparkles,
  Shield,
  Fuel,
  Trophy,
  X
} from 'lucide-react';
import { INITIAL_BRANCHES } from '../../../data/mockData';
import { useAuth } from '../../../context/AuthContext';
import { useStoredCollaborators } from '../../../utils/collaboratorsStorage';

export const GestaoBeneficiosView: React.FC = () => {
  const { logAction } = useAuth();
  const { collaborators } = useStoredCollaborators();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleExportCajuSheet = () => {
    const headers = ['CPF', 'Nome Completo', 'Valor Recarga (R$)', 'Categoria Principal', 'Polo'];
    const rows = collaborators.map(c => [
      c.cpf,
      `"${c.fullName}"`,
      850.00,
      'Caju Flex (VR / VA / Mobilidade)',
      `"${c.branchName}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `recarga_caju_flex_polos_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAction('EXPORT', 'Benefícios', 'CAJU', 'Exportou planilha de recarga Caju Flex');
  };

  const filteredCollaborators = collaborators.filter(c => {
    const matchSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.positionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBranch = selectedBranch === 'ALL' || c.branchId === selectedBranch;
    return matchSearch && matchBranch;
  });

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Gestão de Benefícios & Políticas dos Polos</h2>
          <p className="text-xs text-slate-500">Caju Flex (VR/VA/Mobilidade), Unimed, Seguro de Vida Icatu e Campanhas</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">Todos os 8 Polos</option>
              {INITIAL_BRANCHES.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleExportCajuSheet}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Planilha Caju Flex</span>
          </button>
        </div>
      </div>

      {/* Cards de Benefícios Oficiais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cartão Caju Flex</span>
            <span className="text-base font-bold text-slate-900">VR, VA & Mobilidade</span>
            <span className="text-[10px] text-purple-700 font-semibold block">R$ 850,00 / mês</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Plano de Saúde</span>
            <span className="text-base font-bold text-slate-900">Unimed Nacional</span>
            <span className="text-[10px] text-emerald-700 font-semibold block">Coparticipação em folha</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Seguro de Vida</span>
            <span className="text-base font-bold text-slate-900">Icatu Seguros</span>
            <span className="text-[10px] text-blue-700 font-semibold block">100% Subsidiado</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Incentivos & Bônus</span>
            <span className="text-base font-bold text-slate-900">Campanhas Comerciais</span>
            <span className="text-[10px] text-amber-700 font-semibold block">Bônus Lucro Bruto</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Colaborador / Polo</th>
              <th className="py-3 px-3">Caju Flex (VR/VA/Combustível)</th>
              <th className="py-3 px-3">Plano de Saúde (Unimed)</th>
              <th className="py-3 px-3">Seguro de Vida (Icatu)</th>
              <th className="py-3 px-3">Campanhas & Premiações</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCollaborators.map((colab) => (
              <tr key={colab.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{colab.fullName}</div>
                  <div className="text-[11px] text-slate-500">{colab.positionTitle} • {colab.branchName}</div>
                </td>

                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    <CreditCard className="w-3 h-3 text-purple-600" />
                    R$ 850,00 / mês
                  </span>
                </td>

                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
                    Unimed Nacional
                  </span>
                </td>

                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold text-[11px] border border-blue-200">
                    Icatu Apólice Geral
                  </span>
                </td>

                <td className="py-3 px-3 font-mono text-slate-700">
                  {colab.departmentName === 'Comercial' ? (
                    <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                      Elegível Bônus Lucro Bruto
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Metas Operacionais</span>
                  )}
                </td>

                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    Ativo
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
