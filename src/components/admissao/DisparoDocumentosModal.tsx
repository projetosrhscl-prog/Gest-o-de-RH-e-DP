import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  Download, 
  Calendar, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle,
  FileCheck2,
  ExternalLink,
  Lock,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { ProcessoAdmissaoCompleto, DisparoDocumentoItem } from '../../types/admissao';
import { 
  gerarMinutaTextoDocumento, 
  formatarDataBR, 
  calcularDataTerminoExperiencia 
} from '../../utils/documentosOnboardingHelper';

interface DisparoDocumentosModalProps {
  isOpen?: boolean;
  onClose: () => void;
  processo: ProcessoAdmissaoCompleto;
  onDispararPrimeiroDia: (processId: string, canal: 'WHATSAPP_EMAIL' | 'PLATAFORMA_PORTAL' | 'EMAIL') => void;
  onDispararFinalExperiencia: (processId: string, canal: 'WHATSAPP_EMAIL' | 'PLATAFORMA_PORTAL' | 'EMAIL') => void;
  onAssinarDocumento: (processId: string, docId: string, assinadoPor: string) => void;
}

export const DisparoDocumentosModal: React.FC<DisparoDocumentosModalProps> = ({
  isOpen = true,
  onClose,
  processo,
  onDispararPrimeiroDia,
  onDispararFinalExperiencia,
  onAssinarDocumento
}) => {
  const [activeTab, setActiveTab] = useState<'PRIMEIRO_DIA' | 'FINAL_EXPERIENCIA'>('PRIMEIRO_DIA');
  const [selectedDoc, setSelectedDoc] = useState<DisparoDocumentoItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [canalEnvio, setCanalEnvio] = useState<'WHATSAPP_EMAIL' | 'PLATAFORMA_PORTAL' | 'EMAIL'>('WHATSAPP_EMAIL');
  const [isSending, setIsSending] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ tipo: 'success' | 'info'; texto: string } | null>(null);

  if (!isOpen || !processo) return null;

  const disparos = processo.disparosOnboarding;
  const docsD1 = disparos?.primeiroDiaOnboarding.documentos || [];
  const docsFim = disparos?.finalPeriodoExperiencia.documentos || [];

  const dataFimExp = disparos?.finalPeriodoExperiencia.dataTerminoExperiencia || calcularDataTerminoExperiencia(processo.dataInicioAtividades, 90);

  // Calcula dias restantes para onboarding ou término de experiência
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataOnb = new Date(processo.dataInicioAtividades + 'T00:00:00');
  const diffOnb = Math.ceil((dataOnb.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

  const dataExp = new Date(dataFimExp + 'T00:00:00');
  const diffExp = Math.ceil((dataExp.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

  const currentDocs = activeTab === 'PRIMEIRO_DIA' ? docsD1 : docsFim;
  const currentStatus = activeTab === 'PRIMEIRO_DIA' ? disparos?.primeiroDiaOnboarding.status : disparos?.finalPeriodoExperiencia.status;

  const handleDispararLote = () => {
    setIsSending(true);
    setFeedbackMsg(null);
    setTimeout(() => {
      if (activeTab === 'PRIMEIRO_DIA') {
        onDispararPrimeiroDia(processo.id, canalEnvio);
        setFeedbackMsg({
          tipo: 'success',
          texto: `Disparo automático do 1º Dia de Onboarding realizado com sucesso via ${canalEnvio === 'WHATSAPP_EMAIL' ? 'WhatsApp & E-mail' : canalEnvio}! Contrato de experiência, renúncia de VT e manual de conduta enviados.`
        });
      } else {
        onDispararFinalExperiencia(processo.id, canalEnvio);
        setFeedbackMsg({
          tipo: 'success',
          texto: `Contrato de Trabalho Definitivo (Prazo Indeterminado) disparado com sucesso para ${processo.candidatoNome}!`
        });
      }
      setIsSending(false);
    }, 600);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDoc = (doc: DisparoDocumentoItem) => {
    const text = gerarMinutaTextoDocumento(doc.tipo, processo, doc);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.tipo}_${processo.candidatoNome.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSimularAssinatura = (doc: DisparoDocumentoItem) => {
    onAssinarDocumento(processo.id, doc.id, `${processo.candidatoNome} (Autenticação Gov.br / WhatsApp)`);
    setFeedbackMsg({
      tipo: 'success',
      texto: `Documento "${doc.titulo}" assinado digitalmente com sucesso!`
    });
    if (selectedDoc?.id === doc.id) {
      setSelectedDoc({
        ...doc,
        status: 'ASSINADO',
        assinadoEm: new Date().toISOString()
      });
    }
  };

  return (
    <div id="modal-disparo-docs-onboarding" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-linear-to-r from-slate-900 via-slate-850 to-amber-950 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Motor de Disparos SCL Solar
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-300 font-mono">ID: {processo.id}</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Disparos Automáticos de Onboarding & Contratos
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-4 flex-wrap pt-1">
              <span className="flex items-center gap-1 text-white font-medium">
                <User className="w-3.5 h-3.5 text-amber-400" /> {processo.candidatoNome}
              </span>
              <span className="text-slate-400">CPF: {processo.cpf}</span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-amber-400" /> {processo.cargo} ({processo.poloNome})
              </span>
            </p>
          </div>
          
          <button
            id="btn-fechar-disparo-modal"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
          <button
            id="tab-disparo-d1"
            onClick={() => { setActiveTab('PRIMEIRO_DIA'); setSelectedDoc(null); }}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'PRIMEIRO_DIA'
                ? 'border-amber-500 text-amber-600 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            1. 1º Dia de Onboarding
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              disparos?.primeiroDiaOnboarding.status === 'CONCLUIDO' 
                ? 'bg-emerald-100 text-emerald-700'
                : disparos?.primeiroDiaOnboarding.status === 'DISPARADO_AUTOMATICO'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {disparos?.primeiroDiaOnboarding.status === 'CONCLUIDO' ? 'Concluído' : disparos?.primeiroDiaOnboarding.status === 'DISPARADO_AUTOMATICO' ? 'Disparado' : 'Agendado'}
            </span>
          </button>

          <button
            id="tab-disparo-exp"
            onClick={() => { setActiveTab('FINAL_EXPERIENCIA'); setSelectedDoc(null); }}
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'FINAL_EXPERIENCIA'
                ? 'border-amber-500 text-amber-600 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            2. Final do Período de Experiência (90 Dias)
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              disparos?.finalPeriodoExperiencia.status === 'CONCLUIDO' 
                ? 'bg-emerald-100 text-emerald-700'
                : disparos?.finalPeriodoExperiencia.status === 'DISPARADO_AUTOMATICO'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-200 text-slate-700'
            }`}>
              {disparos?.finalPeriodoExperiencia.status === 'CONCLUIDO' ? 'Concluído' : disparos?.finalPeriodoExperiencia.status === 'DISPARADO_AUTOMATICO' ? 'Disparado' : 'Agendado'}
            </span>
          </button>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMsg.texto}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-emerald-600 hover:text-emerald-900 text-xs font-semibold">
              Fechar
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Phase Summary Banner */}
          {activeTab === 'PRIMEIRO_DIA' ? (
            <div className="bg-linear-to-r from-amber-50 via-orange-50 to-amber-100/50 border border-amber-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-500 text-white rounded text-xs font-bold uppercase">
                    Disparo 1º Dia
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">
                    Documentação de Integração & Boas-Vindas
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  Data programada: <strong className="text-slate-800">{formatarDataBR(processo.dataInicioAtividades)}</strong>
                  {diffOnb > 0 && <span className="ml-2 text-amber-700 font-medium">(em {diffOnb} dias)</span>}
                  {diffOnb === 0 && <span className="ml-2 text-emerald-700 font-bold">🎉 É HOJE!</span>}
                  {diffOnb < 0 && <span className="ml-2 text-slate-500">(iniciado há {Math.abs(diffOnb)} dias)</span>}
                </p>
                <p className="text-xs text-slate-500">
                  Documentos incluídos no pacote: <strong>Contrato de Experiência</strong>, <strong>Termo de Renúncia do Vale Transporte</strong> e <strong>Manual de Conduta</strong>.
                </p>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
                <select
                  value={canalEnvio}
                  onChange={(e) => setCanalEnvio(e.target.value as any)}
                  className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-700 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="WHATSAPP_EMAIL">WhatsApp + E-mail</option>
                  <option value="PLATAFORMA_PORTAL">Portal do Colaborador</option>
                  <option value="EMAIL">Apenas E-mail</option>
                </select>

                <button
                  id="btn-disparar-d1-lote"
                  onClick={handleDispararLote}
                  disabled={isSending}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSending ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {disparos?.primeiroDiaOnboarding.status === 'AGENDADO' ? 'Disparar Pacote do 1º Dia' : 'Reenviar Pacote do 1º Dia'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-linear-to-r from-blue-50 via-indigo-50 to-blue-100/50 border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-bold uppercase">
                    Disparo Fim da Experiência
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base">
                    Contrato de Trabalho Definitivo (Prazo Indeterminado)
                  </h3>
                </div>
                <p className="text-xs text-slate-600">
                  Data de término da experiência (90 dias): <strong className="text-slate-800">{formatarDataBR(dataFimExp)}</strong>
                  {diffExp > 0 && <span className="ml-2 text-blue-700 font-medium">(faltam {diffExp} dias de experiência)</span>}
                  {diffExp === 0 && <span className="ml-2 text-emerald-700 font-bold">🎯 Período de 90 dias concluído hoje!</span>}
                  {diffExp < 0 && <span className="ml-2 text-slate-500">(concluído há {Math.abs(diffExp)} dias)</span>}
                </p>
                <p className="text-xs text-slate-500">
                  Documento incluído: <strong>Contrato Individual de Trabalho por Prazo Indeterminado (Efetivação SCL Solar)</strong>.
                </p>
              </div>

              {/* Action Trigger */}
              <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
                <button
                  id="btn-disparar-fim-exp"
                  onClick={handleDispararLote}
                  disabled={isSending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSending ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {disparos?.finalPeriodoExperiencia.status === 'AGENDADO' ? 'Disparar Contrato Definitivo' : 'Reenviar Contrato Definitivo'}
                </button>
              </div>
            </div>
          )}

          {/* Documents Grid / List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Documentos do Lote ({currentDocs.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentDocs.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    id={`card-doc-${doc.id}`}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400/20' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                          doc.status === 'ASSINADO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'DISPARADO'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {doc.status === 'ASSINADO' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {doc.status === 'DISPARADO' && <Clock className="w-3 h-3 text-blue-600" />}
                          {doc.status === 'AGENDADO' && <Calendar className="w-3 h-3 text-slate-500" />}
                          {doc.status === 'ASSINADO' ? 'Assinado' : doc.status === 'DISPARADO' ? 'Disparado' : 'Agendado'}
                        </span>
                      </div>

                      <div>
                        <h5 className="font-bold text-slate-800 text-xs line-clamp-2">
                          {doc.titulo}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {doc.descricao}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Data: {formatarDataBR(doc.dataProgramada)}</span>
                      <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                        Ver Minuta <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Minuta Viewer Drawer / Section */}
          {selectedDoc ? (
            <div id="preview-minuta-box" className="mt-6 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{selectedDoc.titulo}</h4>
                    <p className="text-[11px] text-slate-400">
                      Protocolo: {selectedDoc.protocolo || 'Pendente de Disparo'} | Status: {selectedDoc.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(gerarMinutaTextoDocumento(selectedDoc.tipo, processo, selectedDoc))}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copiado!' : 'Copiar Texto'}
                  </button>

                  <button
                    onClick={() => handleDownloadDoc(selectedDoc)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar Documento
                  </button>

                  {selectedDoc.status !== 'ASSINADO' && (
                    <button
                      onClick={() => handleSimularAssinatura(selectedDoc)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Registrar Assinatura Digital
                    </button>
                  )}
                </div>
              </div>

              {/* Document Text Body */}
              <div className="p-6 bg-slate-50 font-mono text-xs text-slate-800 overflow-x-auto max-h-96 whitespace-pre-wrap leading-relaxed border-b border-slate-200">
                {gerarMinutaTextoDocumento(selectedDoc.tipo, processo, selectedDoc)}
              </div>

              {/* Signature Metadata Footer */}
              <div className="p-4 bg-white flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>
                    Autenticação Digital: <strong>ICP-Brasil / Token SHA-256</strong> (Armazenado na pasta restrita do perfil)
                  </span>
                </div>
                {selectedDoc.assinadoEm && (
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Assinado em: {selectedDoc.assinadoEm} por {selectedDoc.assinadoPor || processo.candidatoNome}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50 space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                Selecione um documento acima para visualizar a minuta jurídica completa
              </h5>
              <p className="text-xs text-slate-400">
                Você pode revisar as cláusulas, efetuar o download e registrar a assinatura eletrônica do colaborador.
              </p>
            </div>
          )}

          {/* Quick FAQ / Guidelines */}
          <div className="p-4 bg-slate-100/70 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Regras do Fluxo Automático de Documentos SCL Solar
            </h5>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li><strong>1º Dia de Onboarding:</strong> Disparo dos 3 documentos obrigatórios para formalização inicial (Contrato de Experiência 45+45 dias, Declaração de Renúncia do VT e Manual de Conduta).</li>
              <li><strong>Término do Período de Experiência:</strong> Ao completar 90 dias ({formatarDataBR(dataFimExp)}), o sistema agenda o disparo do Contrato de Trabalho Definitivo por Prazo Indeterminado.</li>
              <li><strong>Armazenamento Seguro:</strong> Todos os comprovantes assinados e protocolos são vinculados automaticamente ao perfil do colaborador no sistema.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> {processo.email || 'Email não informado'}
            <span className="text-slate-300">•</span>
            <Phone className="w-3.5 h-3.5 text-slate-400" /> {processo.telefoneWhatsApp || 'WhatsApp não informado'}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 text-xs transition-colors"
          >
            Fechar Janela
          </button>
        </div>

      </div>
    </div>
  );
};
