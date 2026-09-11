import React, { useState } from 'react';
import { 
  DollarSign, 
  Send, 
  Lock, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  FileText, 
  Building, 
  ChevronRight, 
  Sparkles,
  CreditCard,
  X,
  Search
} from 'lucide-react';
import { PayrollMonthRecord, PayrollEventItem } from '../../../types/collaborator';
import { INITIAL_PAYROLL_MONTHS } from '../../../data/mockData';
import { useAuth } from '../../../context/AuthContext';

export const FolhaPreparacaoView: React.FC = () => {
  const { branchSelectionLabel, logAction } = useAuth();
  const [payrollMonths, setPayrollMonths] = useState<PayrollMonthRecord[]>(INITIAL_PAYROLL_MONTHS);
  const [selectedPayrollId, setSelectedPayrollId] = useState<string>(INITIAL_PAYROLL_MONTHS[0].id);

  const [isNewMonthModalOpen, setIsNewMonthModalOpen] = useState(false);
  const [isSendAccountingModalOpen, setIsSendAccountingModalOpen] = useState(false);
  const [isImportHoleritesModalOpen, setIsImportHoleritesModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New Month Form
  const [newMonthName, setNewMonthName] = useState('Setembro / 2026');
  const [newBusinessDays, setNewBusinessDays] = useState(22);
  const [newDsrDays, setNewDsrDays] = useState(4);

  const activePayroll = payrollMonths.find(p => p.id === selectedPayrollId) || payrollMonths[0];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleCreateMonth = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: PayrollMonthRecord = {
      id: `pay-${Date.now()}`,
      competencyMonth: newMonthName,
      month: 9,
      year: 2026,
      businessDays: newBusinessDays,
      dsrDays: newDsrDays,
      model: 'Geral - Todas as Operações',
      status: 'RASCUNHO',
      totalGross: 86500.00,
      totalNet: 70120.00,
      collaboratorsCount: 8,
      events: activePayroll.events // copy current events
    };

    setPayrollMonths([newRecord, ...payrollMonths]);
    setSelectedPayrollId(newRecord.id);
    setIsNewMonthModalOpen(false);
    logAction('CREATE', 'Folha', newRecord.id, `Abriu competência ${newRecord.competencyMonth}`);
  };

  const handleClosePayroll = () => {
    setPayrollMonths(payrollMonths.map(p => p.id === activePayroll.id ? { ...p, status: 'FECHADA' } : p));
    logAction('UPDATE', 'Folha', activePayroll.id, `Fechou folha de pagamento ${activePayroll.competencyMonth}`);
    alert(`Folha da competência ${activePayroll.competencyMonth} fechada com sucesso! Pronto para envio ao escritório contábil.`);
  };

  const handleSendToAccounting = () => {
    setPayrollMonths(payrollMonths.map(p => p.id === activePayroll.id ? { 
      ...p, 
      status: 'ENVIADA_CONTABILIDADE',
      sentToAccountingAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      accountingProviderName: 'Domínio Thomson Reuters / Escritório Parceiro'
    } : p));
    setIsSendAccountingModalOpen(false);
    logAction('DISPATCH', 'Folha', activePayroll.id, `Disparou folha para a contabilidade Domínio`);
    alert(`Folha e lançamentos contábeis transmitidos com sucesso para a Domínio Thomson Reuters!`);
  };

  return (
    <div className="space-y-4">
      {/* Top Action & Competency Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Competência da Folha:
            </label>
            <select
              value={selectedPayrollId}
              onChange={(e) => setSelectedPayrollId(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {payrollMonths.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.competencyMonth} ({p.status === 'ENVIADA_CONTABILIDADE' ? 'Enviada Contabilidade' : p.status === 'FECHADA' ? 'Fechada' : 'Rascunho'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 font-mono">
              Dias Úteis: <strong>{activePayroll.businessDays}</strong> | DSR: <strong>{activePayroll.dsrDays}</strong>
            </span>
            <span className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border ${
              activePayroll.status === 'ENVIADA_CONTABILIDADE'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : activePayroll.status === 'FECHADA'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {activePayroll.status === 'ENVIADA_CONTABILIDADE' ? '✓ Enviada à Contabilidade' : activePayroll.status === 'FECHADA' ? '🔒 Folha Fechada' : '⚡ Em Edição (Rascunho)'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsImportHoleritesModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Importar PDF consolidado da contabilidade e dividir automaticamente"
          >
            <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Importar Holerites em Massa</span>
          </button>

          {activePayroll.status === 'RASCUNHO' && (
            <button
              onClick={handleClosePayroll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Fechar Folha</span>
            </button>
          )}

          {activePayroll.status !== 'ENVIADA_CONTABILIDADE' && (
            <button
              onClick={() => setIsSendAccountingModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar para Contabilidade</span>
            </button>
          )}

          <button
            onClick={() => setIsNewMonthModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Competência</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Total Bruto da Folha</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{formatCurrency(activePayroll.totalGross)}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Total Líquido Estimado</span>
          <span className="text-xl font-bold text-emerald-600 mt-1 block">{formatCurrency(activePayroll.totalNet)}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Recargas Caju Flex</span>
          <span className="text-xl font-bold text-purple-600 mt-1 block">R$ 850,00</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Colaboradores no Espelho</span>
          <span className="text-xl font-bold text-blue-600 mt-1 block">{activePayroll.collaboratorsCount} colaboradores</span>
        </div>
      </div>

      {/* Main Table: Espelho de Folha Analítico */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Espelho Analítico de Rubricas & Adicionais</h3>
            <p className="text-xs text-slate-500">Conferência individual de proventos, periculosidade (30%), horas extras e descontos</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar no espelho..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Colaborador / Operação</th>
                <th className="py-3 px-3">Salário Base</th>
                <th className="py-3 px-3">Periculosidade (30%)</th>
                <th className="py-3 px-3">Horas Extras / Bônus</th>
                <th className="py-3 px-3">Total Bruto</th>
                <th className="py-3 px-3">INSS / IRRF</th>
                <th className="py-3 px-3">Desc. Benefícios</th>
                <th className="py-3 px-3">Salário Líquido</th>
                <th className="py-3 px-3">Caju Flex</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activePayroll.events
                .filter(e => e.collaboratorName.toLowerCase().includes(searchTerm.toLowerCase()) || e.registrationNumber.includes(searchTerm))
                .map((ev) => (
                  <tr key={ev.collaboratorId} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{ev.collaboratorName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Mat: {ev.registrationNumber} • {ev.branchName}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-slate-800">
                      {formatCurrency(ev.baseSalary)}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-700">
                      {ev.additionalHazardPay > 0 ? (
                        <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          +{formatCurrency(ev.additionalHazardPay)}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-700">
                      {ev.overtimePay + ev.bonusPay + ev.commissionPay > 0 ? (
                        <span className="text-blue-700 font-medium">
                          +{formatCurrency(ev.overtimePay + ev.bonusPay + ev.commissionPay)}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {formatCurrency(ev.grossTotal)}
                    </td>

                    <td className="py-3 px-3 font-mono text-rose-600">
                      -{formatCurrency(ev.inssDiscount + ev.irrfDiscount)}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-600">
                      -{formatCurrency(ev.benefitsDiscounts.vrVa + ev.benefitsDiscounts.vt + ev.benefitsDiscounts.healthPlan)}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-700 bg-emerald-50/40">
                      {formatCurrency(ev.netSalary)}
                    </td>

                    <td className="py-3 px-3 font-mono text-purple-700 font-medium">
                      {ev.cajuFlexMonthlyRecharge > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                          <CreditCard className="w-3 h-3 text-purple-600" />
                          {formatCurrency(ev.cajuFlexMonthlyRecharge)}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Conferido
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Competencia */}
      {isNewMonthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Abrir Nova Competência de Folha</h3>
              <button onClick={() => setIsNewMonthModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateMonth} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mês / Ano de Competência *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Setembro / 2026"
                  value={newMonthName}
                  onChange={(e) => setNewMonthName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dias Úteis</label>
                  <input
                    type="number"
                    value={newBusinessDays}
                    onChange={(e) => setNewBusinessDays(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dias DSR</label>
                  <input
                    type="number"
                    value={newDsrDays}
                    onChange={(e) => setNewDsrDays(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewMonthModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  Criar Competência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Enviar para Contabilidade */}
      {isSendAccountingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Transmissão de Folha para a Contabilidade</h3>
              </div>
              <button onClick={() => setIsSendAccountingModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Você está prestes a enviar as rubricas da competência <strong>{activePayroll.competencyMonth}</strong> para o sistema <strong>Domínio Thomson Reuters</strong> do escritório de contabilidade parceiro.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Destinatário:</span>
                  <strong className="text-slate-800">dp.contabil@parceiro.com.br</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sistema Contábil:</span>
                  <strong className="text-blue-700 font-mono">Domínio Thomson Reuters (Layout XML / TXT)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Proventos:</span>
                  <strong className="text-slate-900 font-mono">{formatCurrency(activePayroll.totalGross)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Colaboradores Processados:</span>
                  <strong className="text-slate-900 font-mono">{activePayroll.collaboratorsCount}</strong>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sincronização Automática com eSocial:</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Os eventos S-1200 (Remuneração) e S-1210 (Pagamentos) serão preparados pela contabilidade com os dados deste fechamento.
                </p>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsSendAccountingModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendToAccounting}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirmar Envio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Importar Holerites em Massa */}
      {isImportHoleritesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Leitor e Divisor Inteligente de Holerites</h3>
              </div>
              <button onClick={() => setIsImportHoleritesModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Faça o upload do arquivo PDF consolidado emitido pela contabilidade (Domínio Thomson Reuters). O KIIP irá identificar o CPF e matrícula de cada página e disponibilizar o holerite individualmente no perfil de cada colaborador.
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50/20 transition-all cursor-pointer">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Arraste o PDF consolidado dos holerites aqui</p>
                <p className="text-[11px] text-slate-400 mt-1">Exemplo: Holerites_Folha_082026.pdf (Max 50MB)</p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Distribuição Instantânea com Notificação:</span>
                </div>
                <p className="text-[11px] text-blue-700">
                  Os colaboradores serão notificados no WhatsApp / e-mail e poderão acessar o demonstrativo de pagamento assinado com 1 clique.
                </p>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsImportHoleritesModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('PDF processado com sucesso! 8 holerites individuais cortados e distribuídos aos colaboradores.');
                  setIsImportHoleritesModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
              >
                Processar & Distribuir Holerites
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
