import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Mail, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Paperclip, 
  Building2, 
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { ProcessoAdmissaoCompleto } from '../../types/admissao';
import { calcularDiasTrabalhadosNoMes } from '../../utils/admissaoStorage';

interface EnvioContadorModalProps {
  processo: ProcessoAdmissaoCompleto;
  tipoEnvio: 'ENVIO_INICIAL_PREVIA' | 'ENVIO_FINAL_ADMISSAO';
  onClose: () => void;
  onConfirmEnvio: (processId: string, emailContador: string, diasTrabalhados: number) => void;
}

export const EnvioContadorModal: React.FC<EnvioContadorModalProps> = ({
  processo,
  tipoEnvio,
  onClose,
  onConfirmEnvio
}) => {
  const [emailDestino, setEmailDestino] = useState('contabilidade@parceiroscl.com.br');
  const [diasTrabalhados, setDiasTrabalhados] = useState(processo.diasTrabalhadosPrimeiroMes || 22);
  const [observacoes, setObservacoes] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const apuracao = calcularDiasTrabalhadosNoMes(processo.dataInicioAtividades);
  const isInicial = tipoEnvio === 'ENVIO_INICIAL_PREVIA';

  const assuntoEmail = isInicial 
    ? `[SCL Admissão] Documentação Prévia & Dias Trabalhados (Dia 25) - ${processo.candidatoNome} - ${apuracao.mesAno}`
    : `[SCL Admissão] Dossiê Completo de Admissão Efetiva (Dia 25) - ${processo.candidatoNome} - Polo ${processo.poloNome}`;

  const listaDocumentos = isInicial
    ? ['ID_RG_ou_CNH.pdf', 'Comprovante_CPF.pdf', 'Comprovante_Residencia_Atualizado.pdf']
    : [
        'Formulario_Admissao_Completo_SCL.pdf',
        'Documentos_Pessoais_Validados.pdf',
        'Comprovante_Dados_Bancarios.pdf',
        'Certidoes_Dependentes_Filhos.pdf',
        'ASO_Admissional_Apto.pdf',
        'Certificado_Stone_Start_Concluido.pdf'
      ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      onConfirmEnvio(processo.id, emailDestino, diasTrabalhados);
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1400);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  {isInicial ? 'Envio Inicial no Dia 25 ao Contador' : 'Envio Final de Admissão ao Contador (Dia 25)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Fluxo Contábil Oficial
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Colaborador: <strong className="text-white">{processo.candidatoNome}</strong> ({processo.poloNome})
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
        <form onSubmit={handleSend} className="p-6 space-y-4">
          
          {/* Apuração de Dias Trabalhados */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                {diasTrabalhados}d
              </div>
              <div>
                <span className="text-xs font-bold text-blue-950 block">
                  Cálculo de Dias Trabalhados no 1º Mês ({apuracao.mesAno})
                </span>
                <span className="text-[11px] text-blue-800">
                  Início das atividades: <strong>{processo.dataInicioAtividades}</strong> até fechamento da folha.
                </span>
              </div>
            </div>
            <div className="w-28">
              <label className="block text-[10px] font-bold text-blue-900 mb-0.5">Ajustar Dias:</label>
              <input
                type="number"
                min={1}
                max={31}
                value={diasTrabalhados}
                onChange={e => setDiasTrabalhados(Number(e.target.value))}
                className="w-full text-xs font-bold font-mono px-2.5 py-1.5 bg-white border border-blue-300 rounded-lg text-blue-950 focus:outline-blue-600"
              />
            </div>
          </div>

          {/* Destinatário & Assunto */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail da Contabilidade Parceira *</label>
              <input
                type="email"
                required
                value={emailDestino}
                onChange={e => setEmailDestino(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assunto do E-mail</label>
              <input
                type="text"
                readOnly
                value={assuntoEmail}
                className="w-full text-xs px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-700 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {/* Pré-visualização do Corpo do E-mail */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-2 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-500">
              Corpo da Mensagem Transmitida:
            </span>
            <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-800 space-y-2">
              <p>Prezada equipe da Contabilidade,</p>
              {isInicial ? (
                <>
                  <p>Seguem as documentações prévias coletadas para a admissão do colaborador abaixo, conforme rotina do <strong>dia 25</strong>:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li><strong>Nome:</strong> {processo.candidatoNome}</li>
                    <li><strong>CPF:</strong> {processo.cpf}</li>
                    <li><strong>Cargo:</strong> {processo.cargo}</li>
                    <li><strong>Polo / Filial:</strong> {processo.poloNome}</li>
                    <li><strong>Início das Atividades:</strong> {processo.dataInicioAtividades}</li>
                    <li><strong>Dias Trabalhados no Mês:</strong> {diasTrabalhados} dias</li>
                  </ul>
                  <p className="text-slate-600"><em>O colaborador encontra-se em realização do Stone Start. O formulário completo e espelho cadastral serão enviados após aprovação final.</em></p>
                </>
              ) : (
                <>
                  <p>O colaborador concluiu o Stone Start e preencheu o <strong>Formulário Integrado de Admissão SCL</strong>. Segue pacote definitivo para formalização no eSocial:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li><strong>Nome:</strong> {processo.candidatoNome}</li>
                    <li><strong>CPF:</strong> {processo.cpf}</li>
                    <li><strong>Cargo:</strong> {processo.cargo}</li>
                    <li><strong>Salário:</strong> R$ {processo.salarioPrevisto?.toFixed(2)}</li>
                    <li><strong>Polo / Filial:</strong> {processo.poloNome}</li>
                    <li><strong>Status Stone Start:</strong> APROVADO</li>
                    <li><strong>Dados Bancários & Dependentes:</strong> Inclusos no espelho anexo</li>
                  </ul>
                </>
              )}
              <p>Atenciosamente,<br />Departamento Pessoal - SCL Solar</p>
            </div>
          </div>

          {/* Anexos Inclusos */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-blue-600" />
              Arquivos Anexados Automaticamente ({listaDocumentos.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {listaDocumentos.map((doc, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-800 truncate">{doc}</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Pronto</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
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
              disabled={isSending}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Transmitindo ao Contador...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmitir e-mail do Dia 25 com Protocolo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {sentSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>E-mail do dia 25 transmitido com sucesso à contabilidade!</span>
        </div>
      )}
    </div>
  );
};
