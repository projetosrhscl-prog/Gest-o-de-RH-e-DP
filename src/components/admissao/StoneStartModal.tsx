import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Send, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { ProcessoAdmissaoCompleto } from '../../types/admissao';

interface StoneStartModalProps {
  processo: ProcessoAdmissaoCompleto;
  onClose: () => void;
  onApprove: (processId: string, aprovador: string, observacoes?: string) => void;
}

export const StoneStartModal: React.FC<StoneStartModalProps> = ({
  processo,
  onClose,
  onApprove
}) => {
  const [aprovador, setAprovador] = useState('Carlos Menezes (Liderança Operacional)');
  const [observacoes, setObservacoes] = useState('Colaborador aprovado com 100% de aproveitamento nos módulos práticos e teóricos do Stone Start.');
  const [dispararFormsImediato, setDispararFormsImediato] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApprove(processo.id, aprovador, observacoes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Registrar Aprovação do Stone Start</h3>
              <p className="text-xs text-emerald-200 mt-0.5">
                Libera o comando para disparo do Formulário Integrado de Admissão
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Candidato: {processo.candidatoNome}
            </div>
            <p className="text-[11px] text-emerald-800">
              Cargo: {processo.cargo} • Polo: {processo.poloNome}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Aprovado Por (Liderança / Responsável) *</label>
            <input
              type="text"
              required
              value={aprovador}
              onChange={e => setAprovador(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Parecer / Observações do Treinamento</label>
            <textarea
              rows={3}
              value={observacoes}
              onChange={e => setObservacoes(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-500"
              placeholder="Descreva observações sobre o desempenho no Stone Start..."
            />
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-blue-950 block">Disparar Formulário Integrado de Admissão</span>
                <span className="text-[11px] text-blue-700">Gera link e notificação imediata para coleta dos dados cadastrais completos.</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={dispararFormsImediato}
              onChange={e => setDispararFormsImediato(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar Aprovação Stone Start</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
