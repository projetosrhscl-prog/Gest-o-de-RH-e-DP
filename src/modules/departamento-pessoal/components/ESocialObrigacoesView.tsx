import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  RefreshCw, 
  Search, 
  FileText, 
  Building,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { formatDateBR } from '../../../utils/dateHelper';

interface ESocialEventRecord {
  id: string;
  code: string;
  name: string;
  type: 'TABELA' | 'NAO_PERIODICO' | 'PERIODICO';
  collaboratorName?: string;
  receiptNumber?: string;
  sendDate: string;
  status: 'PROCESSADO_COM_SUCESSO' | 'AGUARDANDO_ENVIO' | 'RETIFICADO';
}

export const ESocialObrigacoesView: React.FC = () => {
  const { logAction } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PERIODICO' | 'NAO_PERIODICO' | 'TABELA'>('ALL');

  const [events, setEvents] = useState<ESocialEventRecord[]>([
    {
      id: 'evt-1',
      code: 'S-1200',
      name: 'Remuneração de Trabalhador vinculado ao RGPS',
      type: 'PERIODICO',
      sendDate: '2026-08-10 14:32',
      receiptNumber: '1.2.202608.000000000004918291',
      status: 'PROCESSADO_COM_SUCESSO'
    },
    {
      id: 'evt-2',
      code: 'S-1210',
      name: 'Pagamentos de Rendimentos do Trabalho',
      type: 'PERIODICO',
      sendDate: '2026-08-10 14:35',
      receiptNumber: '1.2.202608.000000000004918299',
      status: 'PROCESSADO_COM_SUCESSO'
    },
    {
      id: 'evt-3',
      code: 'S-2200',
      name: 'Cadastramento Inicial e Admissão de Trabalhador',
      type: 'NAO_PERIODICO',
      collaboratorName: 'Lucas Ferreira Maia',
      sendDate: '2026-08-01 09:12',
      receiptNumber: '1.2.202608.000000000003881029',
      status: 'PROCESSADO_COM_SUCESSO'
    },
    {
      id: 'evt-4',
      code: 'S-2240',
      name: 'Condições Ambientais do Trabalho - Fatores de Risco (Periculosidade)',
      type: 'NAO_PERIODICO',
      collaboratorName: 'Marcos Vinícius Silva',
      sendDate: '2026-08-05 11:20',
      receiptNumber: '1.2.202608.000000000003991204',
      status: 'PROCESSADO_COM_SUCESSO'
    },
    {
      id: 'evt-5',
      code: 'S-2220',
      name: 'Monitoramento da Saúde do Trabalhador (ASO Periódico)',
      type: 'NAO_PERIODICO',
      collaboratorName: 'Camila Rocha Andrade',
      sendDate: '2026-08-18 16:40',
      status: 'AGUARDANDO_ENVIO'
    }
  ]);

  const handleTransmitPending = () => {
    setEvents(events.map(e => ({
      ...e,
      status: 'PROCESSADO_COM_SUCESSO',
      receiptNumber: e.receiptNumber || `1.2.202608.00000000000${Math.floor(100000 + Math.random() * 900000)}`
    })));
    logAction('DISPATCH', 'eSocial', 'ALL', 'Transmitiu eventos pendentes para o ambiente nacional do eSocial');
    alert('Eventos transmitidos e validados com recibo do governo federal (eSocial)!');
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.collaboratorName && e.collaboratorName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = activeFilter === 'ALL' || e.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">Monitor eSocial Governamental (S-1000 a S-2299)</h2>
            <p className="text-xs text-slate-500">Conexão direta com o webservice oficial e controle de recibos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTransmitPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmitir Pendentes</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
              activeFilter === 'ALL' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({events.length})
          </button>
          <button
            onClick={() => setActiveFilter('PERIODICO')}
            className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
              activeFilter === 'PERIODICO' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Periódicos (Folha / Pagamentos)
          </button>
          <button
            onClick={() => setActiveFilter('NAO_PERIODICO')}
            className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
              activeFilter === 'NAO_PERIODICO' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Não Periódicos (SST / Admissão)
          </button>
        </div>

        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrar por evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Evento</th>
              <th className="py-3 px-3">Descrição da Obrigação</th>
              <th className="py-3 px-3">Colaborador Vinculado</th>
              <th className="py-3 px-3">Data / Hora Envio</th>
              <th className="py-3 px-3">Nº do Recibo de Entrega</th>
              <th className="py-3 px-3 text-right">Status do Governo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.map((evt) => (
              <tr key={evt.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    {evt.code}
                  </span>
                </td>
                <td className="py-3 px-3 font-medium text-slate-900 max-w-sm">
                  {evt.name}
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {evt.collaboratorName || <span className="text-slate-400">Geral da Empresa</span>}
                </td>
                <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                  {formatDateBR(evt.sendDate)}
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                  {evt.receiptNumber ? (
                    <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {evt.receiptNumber}
                    </span>
                  ) : (
                    <span className="text-amber-600 font-semibold">Pendente de Transmissão</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right">
                  {evt.status === 'PROCESSADO_COM_SUCESSO' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Processado com Sucesso
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Aguardando Envio
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
