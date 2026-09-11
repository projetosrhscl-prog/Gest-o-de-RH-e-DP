import React, { useState } from 'react';
import { 
  UserMinus, 
  AlertTriangle, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Building, 
  ShieldAlert, 
  Calculator,
  Plus,
  X,
  Search
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useStoredCollaborators } from '../../../utils/collaboratorsStorage';
import { formatDateBR } from '../../../utils/dateHelper';

interface OffboardingProcess {
  id: string;
  collaboratorId: string;
  collaboratorName: string;
  collaboratorPosition: string;
  branchName: string;
  reason: 'SEM_JUSTA_CAUSA' | 'PEDIDO_DEMISSAO' | 'ACORDO_MUTUO' | 'JUSTA_CAUSA' | 'TERMINO_CONTRATO';
  noticeType: 'TRABALHADO' | 'INDENIZADO' | 'DISPENSADO';
  departureDate: string;
  estimatedTotal: number;
  equipmentReturned: boolean;
  asoDemissionalDone: boolean;
  status: 'EM_CALCULO' | 'AGUARDANDO_ASO' | 'HOMOLOGADO';
}

export const DesligamentosView: React.FC = () => {
  const { logAction } = useAuth();
  const { collaborators } = useStoredCollaborators();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewOffboardingOpen, setIsNewOffboardingOpen] = useState(false);

  const [offboardingList, setOffboardingList] = useState<OffboardingProcess[]>([
    {
      id: 'off-01',
      collaboratorId: 'colab-1',
      collaboratorName: 'Lucas Ferreira Maia',
      collaboratorPosition: 'Operador de Usina Solar Jr',
      branchName: 'Paracatu - MG',
      reason: 'SEM_JUSTA_CAUSA',
      noticeType: 'INDENIZADO',
      departureDate: '2026-08-31',
      estimatedTotal: 14850.00,
      equipmentReturned: true,
      asoDemissionalDone: true,
      status: 'EM_CALCULO'
    }
  ]);

  // Form State
  const [selectedColabId, setSelectedColabId] = useState(collaborators[0]?.id || 'colab-1');
  const [reason, setReason] = useState<'SEM_JUSTA_CAUSA' | 'PEDIDO_DEMISSAO' | 'ACORDO_MUTUO' | 'JUSTA_CAUSA' | 'TERMINO_CONTRATO'>('SEM_JUSTA_CAUSA');
  const [noticeType, setNoticeType] = useState<'TRABALHADO' | 'INDENIZADO' | 'DISPENSADO'>('INDENIZADO');
  const [departureDate, setDepartureDate] = useState('2026-09-10');

  const handleCreateOffboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const colab = collaborators.find(c => c.id === selectedColabId) || collaborators[0];

    // Simple estimation calculation
    const baseSal = colab.salary || 4000;
    const est = baseSal * 1.8 + (reason === 'SEM_JUSTA_CAUSA' ? baseSal * 0.4 : 0);

    const newOff: OffboardingProcess = {
      id: `off-${Date.now()}`,
      collaboratorId: colab.id,
      collaboratorName: colab.fullName,
      collaboratorPosition: colab.positionTitle,
      branchName: colab.branchName,
      reason,
      noticeType,
      departureDate,
      estimatedTotal: est,
      equipmentReturned: false,
      asoDemissionalDone: false,
      status: 'EM_CALCULO'
    };

    setOffboardingList([newOff, ...offboardingList]);
    setIsNewOffboardingOpen(false);
    logAction('CREATE', 'Desligamento', newOff.id, `Iniciou processo rescisório para ${colab.fullName}`);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Gestão de Desligamentos & Rescisões CLT</h2>
          <p className="text-xs text-slate-500">Esteira de desligamento, simulação de verbas e checklist de devolução</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setIsNewOffboardingOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Iniciar Desligamento</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Colaborador</th>
              <th className="py-3 px-3">Motivo da Rescisão</th>
              <th className="py-3 px-3">Aviso Prévio</th>
              <th className="py-3 px-3">Data Desligamento</th>
              <th className="py-3 px-3">Checklist Devolução</th>
              <th className="py-3 px-3">Estimativa Rescisória</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {offboardingList
              .filter(o => o.collaboratorName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((off) => (
                <tr key={off.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{off.collaboratorName}</div>
                    <div className="text-[11px] text-slate-500">{off.collaboratorPosition} • {off.branchName}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      {off.reason === 'SEM_JUSTA_CAUSA' ? 'Dispensa s/ Justa Causa' : off.reason}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">
                    {off.noticeType === 'INDENIZADO' ? 'Aviso Indenizado' : 'Aviso Trabalhado'}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-800 font-medium">
                    {formatDateBR(off.departureDate)}
                  </td>
                  <td className="py-3 px-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className={`w-2 h-2 rounded-full ${off.equipmentReturned ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>EPIs & Ativos: {off.equipmentReturned ? 'Devolvidos' : 'Pendente'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className={`w-2 h-2 rounded-full ${off.asoDemissionalDone ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>ASO Demissional: {off.asoDemissionalDone ? 'Apto' : 'Agendado'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {formatCurrency(off.estimatedTotal)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {off.status === 'EM_CALCULO' ? 'Em Cálculo Rescisório' : off.status}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal Iniciar Desligamento */}
      {isNewOffboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UserMinus className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Iniciar Processo Rescisório CLT</h3>
              </div>
              <button onClick={() => setIsNewOffboardingOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateOffboarding} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Colaborador *</label>
                <select
                  value={selectedColabId}
                  onChange={(e) => setSelectedColabId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {collaborators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} - {c.positionTitle} (Salário: {formatCurrency(c.salary)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Motivo do Desligamento</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SEM_JUSTA_CAUSA">Dispensa sem justa causa</option>
                    <option value="PEDIDO_DEMISSAO">Pedido de demissão</option>
                    <option value="ACORDO_MUTUO">Acordo mútuo (Art. 484-A CLT)</option>
                    <option value="JUSTA_CAUSA">Demissão por justa causa</option>
                    <option value="TERMINO_CONTRATO">Término de contrato de experiência</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Aviso Prévio</label>
                  <select
                    value={noticeType}
                    onChange={(e) => setNoticeType(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INDENIZADO">Indenizado pela empresa</option>
                    <option value="TRABALHADO">Trabalhado (30 a 90 dias)</option>
                    <option value="DISPENSADO">Dispensado do cumprimento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data Efetiva do Desligamento</label>
                <input
                  type="date"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cálculo Prévio das Verbas Rescisórias:</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  O sistema irá provisionar saldo de salário, aviso prévio proporcional, 13º proporcional, férias vencidas/proporcionais + 1/3 e guia de recolhimento FGTS rescisório (GRRF).
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOffboardingOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-xs"
                >
                  Iniciar Desligamento & Simulação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
