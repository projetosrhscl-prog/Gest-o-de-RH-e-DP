import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Download, 
  Send, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Building,
  FileCheck,
  Info,
  CalendarCheck,
  RotateCcw
} from 'lucide-react';
import { INITIAL_BRANCHES } from '../../../data/mockData';
import { useAuth } from '../../../context/AuthContext';
import { useStoredCollaborators } from '../../../utils/collaboratorsStorage';

export const ControlePontoView: React.FC = () => {
  const { logAction } = useAuth();
  const { collaborators } = useStoredCollaborators();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('08/2026');
  const [showScheduleInfo, setShowScheduleInfo] = useState(true);

  // Simulated Time Tracking Records with flexible Saturday logic
  const timeRecords = collaborators.map((c, idx) => {
    const isCommercial = c.departmentName === 'Comercial';
    const isLogistics = c.departmentName === 'Logística';
    const hasSaturdayActiveThisWeek = idx % 2 === 0;

    return {
      collaboratorId: c.id,
      collaboratorName: c.fullName,
      registrationNumber: c.registrationNumber,
      branchId: c.branchId,
      branchName: c.branchName,
      departmentName: c.departmentName,
      positionTitle: c.positionTitle,
      workSchedule: c.workSchedule,
      scheduleType: hasSaturdayActiveThisWeek ? 'Sábado Ativo (Rota / Inventário 4h)' : 'Compensação Semanal (4d 9h + 1d 8h)',
      regularHours: 176,
      overtime50: idx % 2 === 0 ? 6.5 : 0,
      overtime100: idx === 1 ? 4.0 : 0,
      nightHours: 0,
      unexcusedAbsences: idx === 4 ? 1 : 0,
      bankHoursBalance: idx % 2 === 0 ? '+10h 30m' : idx === 4 ? '-04h 00m' : '+06h 15m',
      mirrorStatus: idx % 2 === 0 ? 'ASSINADO' : 'PENDENTE_ASSINATURA'
    };
  });

  const filteredRecords = timeRecords.filter(t => {
    const matchSearch = t.collaboratorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.registrationNumber.includes(searchTerm) || 
      t.positionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBranch = selectedBranch === 'ALL' || t.branchId === selectedBranch;
    return matchSearch && matchBranch;
  });

  return (
    <div className="space-y-4">
      {/* Schedule Banner: Explaining 44h flexible scale with Saturday compensation */}
      {showScheduleInfo && (
        <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200 rounded-xl p-4 relative shadow-2xs">
          <button 
            onClick={() => setShowScheduleInfo(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 text-xs"
            title="Fechar aviso"
          >
            ✕
          </button>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Regra Operacional: Escala 44h Semanais com Sábado Flexível
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  Padrão Polos Stone
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-4xl">
                A jornada semanal de 44 horas é flexível e adaptada à operação de cada polo:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="bg-white/80 border border-blue-100 rounded-lg p-2.5 text-xs">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Semana com Sábado Ativo (Rota / Pré-Inventário / Inventário)
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Segunda a Sexta: <strong>8h/dia</strong> com 2h de intervalo para almoço + Sábado: <strong>4h</strong> presenciais (Total: 44h).
                  </p>
                </div>
                <div className="bg-white/80 border border-indigo-100 rounded-lg p-2.5 text-xs">
                  <div className="font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    Semana sem Sábado Ativo (Compensação em Dias Úteis)
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Segunda a Quinta: <strong>9h/dia</strong> + Sexta: <strong>8h</strong> (com 2h de almoço) compensando o sábado livre (Total: 44h).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Período de Apuração:
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="08/2026">Agosto / 2026 (Fechamento dia 20)</option>
              <option value="07/2026">Julho / 2026 (Consolidado)</option>
              <option value="06/2026">Junho / 2026 (Consolidado)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Filtrar por Polo:
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Todos os 8 Polos</option>
              {INITIAL_BRANCHES.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.city} - {b.state})</option>
              ))}
            </select>
          </div>
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
            onClick={() => {
              alert('Espelhos de ponto enviados para assinatura digital via WhatsApp e E-mail (Kiip Sign).');
              logAction('DISPATCH', 'Ponto', 'ALL', 'Disparo de espelho de ponto para assinatura');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Disparar Espelhos Kiip Sign</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Total Horas Normais</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">1.408 horas</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Base 44h semanais</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Horas Extras (50% / 100%)</span>
          <span className="text-xl font-bold text-blue-600 mt-1 block">30,5 horas</span>
          <span className="text-[10px] text-blue-600 mt-0.5 block">Rotas e inventários extras</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Saldo Banco de Horas</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">+52h 45m</span>
          <span className="text-[10px] text-emerald-700 mt-0.5 block">Compensação ativa</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Espelhos Assinados</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">6 de 8 (75%)</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Assinatura Digital</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Colaborador / Polo</th>
              <th className="py-3 px-3">Regime de Compensação</th>
              <th className="py-3 px-3">Horas Normais</th>
              <th className="py-3 px-3">Horas Extras</th>
              <th className="py-3 px-3">Faltas / Atrasos</th>
              <th className="py-3 px-3">Banco de Horas</th>
              <th className="py-3 px-3 text-right">Espelho Digital</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((rec) => (
              <tr key={rec.collaboratorId} className="hover:bg-slate-50/50">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{rec.collaboratorName}</div>
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{rec.positionTitle}</span> • {rec.branchName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Mat: {rec.registrationNumber} • {rec.departmentName}
                  </div>
                </td>

                <td className="py-3 px-3">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {rec.scheduleType}
                  </span>
                </td>

                <td className="py-3 px-3 font-mono font-medium text-slate-800">
                  {rec.regularHours}h
                </td>

                <td className="py-3 px-3 font-mono text-slate-700">
                  {rec.overtime50 + rec.overtime100 > 0 ? (
                    <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      +{rec.overtime50 + rec.overtime100}h
                    </span>
                  ) : (
                    <span className="text-slate-400">0h</span>
                  )}
                </td>

                <td className="py-3 px-3 font-mono">
                  {rec.unexcusedAbsences > 0 ? (
                    <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      {rec.unexcusedAbsences} falta (Desc. CLT)
                    </span>
                  ) : (
                    <span className="text-slate-400">0</span>
                  )}
                </td>

                <td className="py-3 px-3 font-mono font-bold">
                  <span className={rec.bankHoursBalance.startsWith('+') ? 'text-emerald-700' : 'text-rose-600'}>
                    {rec.bankHoursBalance}
                  </span>
                </td>

                <td className="py-3 px-3 text-right">
                  {rec.mirrorStatus === 'ASSINADO' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Assinado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Aguardando
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
