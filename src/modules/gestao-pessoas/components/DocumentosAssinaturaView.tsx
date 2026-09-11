import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Download, 
  ExternalLink, 
  Smartphone, 
  Mail, 
  Search,
  X,
  FileCheck,
  Archive,
  ArrowUpDown,
  ArrowUpAZ,
  ArrowDownAZ,
  MapPin
} from 'lucide-react';
import { ElectronicDocument, ElectronicDocCategory, DocumentTemplate } from '../../../types/collaborator';
import { INITIAL_ELECTRONIC_DOCUMENTS } from '../../../data/mockData';
import { useAuth } from '../../../context/AuthContext';
import { downloadSingleDocument, downloadBulkDocumentsZip } from '../../../utils/documentGenerator';
import { useStoredCollaborators } from '../../../utils/collaboratorsStorage';
import { formatDateBR } from '../../../utils/dateHelper';

export const DocumentosAssinaturaView: React.FC = () => {
  const { selectedBranchIds, logAction } = useAuth();
  const [activeTab, setActiveTab] = useState<'documentos' | 'modelos'>('documentos');

  const [documents, setDocuments] = useState<ElectronicDocument[]>(INITIAL_ELECTRONIC_DOCUMENTS);
  const { collaborators } = useStoredCollaborators();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPoloFilter, setSelectedPoloFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ASSINADO' | 'AGUARDANDO_ASSINATURA'>('ALL');
  const [sortBy, setSortBy] = useState<'NAME_ASC' | 'NAME_DESC' | 'DATE_DESC' | 'DATE_ASC'>('NAME_ASC');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);

  // Form State
  const [selectedModel, setSelectedModel] = useState('Contrato de Trabalho Padrão SCL');
  const [selectedCategory, setSelectedCategory] = useState<ElectronicDocCategory>('CONTRATO_TRABALHO');
  const [selectedColabId, setSelectedColabId] = useState(collaborators[0]?.id || 'colab-1');
  const [channel, setChannel] = useState<'WHATSAPP' | 'EMAIL'>('WHATSAPP');

  // List of distinct polos
  const availablePolos = useMemo(() => {
    const poloMap = new Map<string, { id: string; name: string; count: number }>();
    collaborators.forEach(c => {
      const existing = poloMap.get(c.branchId);
      if (existing) {
        existing.count += 1;
      } else {
        poloMap.set(c.branchId, { id: c.branchId, name: c.branchName, count: 1 });
      }
    });
    return Array.from(poloMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [collaborators]);

  const filteredDocs = useMemo(() => {
    const list = documents.filter(d => {
      const colab = collaborators.find(c => c.id === d.collaboratorId);
      if (colab) {
        if (!selectedBranchIds.includes(colab.branchId)) return false;
        if (selectedPoloFilter !== 'ALL' && colab.branchId !== selectedPoloFilter) return false;
      }

      const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            d.collaboratorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            d.templateName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return list.sort((a, b) => {
      if (sortBy === 'NAME_ASC') return a.collaboratorName.localeCompare(b.collaboratorName, 'pt-BR');
      if (sortBy === 'NAME_DESC') return b.collaboratorName.localeCompare(a.collaboratorName, 'pt-BR');
      if (sortBy === 'DATE_DESC') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'DATE_ASC') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return 0;
    });
  }, [documents, collaborators, selectedBranchIds, selectedPoloFilter, searchTerm, statusFilter, sortBy]);

  const handleToggleSelectDoc = (id: string) => {
    setSelectedDocIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === filteredDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(filteredDocs.map(d => d.id));
    }
  };

  const handleDownloadBulk = async () => {
    const targetDocs = selectedDocIds.length > 0
      ? documents.filter(d => selectedDocIds.includes(d.id))
      : filteredDocs;

    if (targetDocs.length === 0) {
      alert('Nenhum documento disponível para exportação.');
      return;
    }

    try {
      setIsDownloadingZip(true);
      const count = await downloadBulkDocumentsZip(
        targetDocs, 
        collaborators, 
        `documentos_digitais_lote_${new Date().toISOString().slice(0, 10)}.zip`
      );
      logAction('EXPORT', 'Documentos', 'BULK_ZIP', `Download em massa de ${count} documentos em arquivo ZIP`);
      setDownloadSuccessMsg(`Pacote ZIP com ${count} documentos gerado e baixado com sucesso!`);
      setTimeout(() => setDownloadSuccessMsg(null), 4500);
    } catch (err) {
      console.error('Erro ao gerar ZIP:', err);
      alert('Ocorreu um erro ao compactar os documentos.');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const TEMPLATES: DocumentTemplate[] = [
    {
      id: 'tpl-1',
      title: 'Contrato Individual de Trabalho CLT',
      category: 'CONTRATO_TRABALHO',
      description: 'Modelo oficial com cláusulas de sigilo, jornada de trabalho e termos de adesão.',
      placeholders: ['{{NOME_COMPLETO}}', '{{CPF}}', '{{CARGO}}', '{{SALARIO}}', '{{UNIDADE}}'],
      version: 'v2.4'
    },
    {
      id: 'tpl-2',
      title: 'Acordo Individual de Banco de Horas & Compensação',
      category: 'BANCO_HORAS',
      description: 'Acordo semestral para compensação de jornada suplementar conforme Art. 59 CLT.',
      placeholders: ['{{NOME_COMPLETO}}', '{{CPF}}', '{{JORNADA_SEMANAL}}'],
      version: 'v1.8'
    },
    {
      id: 'tpl-3',
      title: 'Termo de Responsabilidade e Uso de EPI',
      category: 'EPI',
      description: 'Comprovante digital de entrega de equipamentos de proteção individual com registro de CA.',
      placeholders: ['{{NOME_COMPLETO}}', '{{LISTA_EPIS}}', '{{NUMEROS_CA}}'],
      version: 'v3.0'
    },
    {
      id: 'tpl-4',
      title: 'Termo de Confidencialidade e Sigilo (NDA)',
      category: 'CONFIDENCIALIDADE',
      description: 'Proteção de segredos industriais, dados de usinas solares e informações confidenciais.',
      placeholders: ['{{NOME_COMPLETO}}', '{{CPF}}', '{{DATA_ADMISSAO}}'],
      version: 'v1.2'
    },
    {
      id: 'tpl-5',
      title: 'Aviso Prévio e Programação de Férias CLT',
      category: 'OUTRO',
      description: 'Comunicação oficial do período de gozo com antecedência legal de 30 dias.',
      placeholders: ['{{NOME_COMPLETO}}', '{{PERIODO_GOZO}}', '{{VALOR_ABONO}}'],
      version: 'v2.0'
    }
  ];

  const handleSendDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const colab = collaborators.find(c => c.id === selectedColabId) || collaborators[0];

    const newDoc: ElectronicDocument = {
      id: `doc-${Date.now()}`,
      title: selectedModel,
      collaboratorId: colab.id,
      collaboratorName: colab.fullName,
      collaboratorAvatar: colab.avatarUrl,
      category: selectedCategory,
      templateName: selectedModel,
      createdAt: new Date().toISOString().slice(0, 10),
      status: 'AGUARDANDO_ASSINATURA',
      signatureProvider: 'DIGITAL_SIGN',
      deliveryChannel: channel
    };

    setDocuments([newDoc, ...documents]);
    setIsNewDocModalOpen(false);
    logAction('CREATE', 'Documento', newDoc.id, `Disparou documento ${newDoc.title} para ${colab.fullName} via ${channel}`);
    alert(`Documento gerado e link de assinatura digital enviado com sucesso via ${channel === 'WHATSAPP' ? 'WhatsApp' : 'E-mail'}!`);
  };

  const renderStatus = (status: string) => {
    if (status === 'ASSINADO') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Assinado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        Aguardando Assinatura
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Top Switcher & Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('documentos')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'documentos'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gestão de Documentos Eletrônicos ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('modelos')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'modelos'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Modelos de Documento ({TEMPLATES.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Polo Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Polo:</span>
            <select
              value={selectedPoloFilter}
              onChange={(e) => setSelectedPoloFilter(e.target.value)}
              className="text-xs bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL">Todos os Polos ({collaborators.length})</option>
              {availablePolos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.count})
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Ordem:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="NAME_ASC">Nome (A → Z)</option>
              <option value="NAME_DESC">Nome (Z → A)</option>
              <option value="DATE_DESC">Data (Mais recente)</option>
              <option value="DATE_ASC">Data (Mais antiga)</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar documento ou pessoa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ASSINADO">Apenas Assinados</option>
            <option value="AGUARDANDO_ASSINATURA">Aguardando Assinatura</option>
          </select>

          {/* Bulk Download Button */}
          <button
            onClick={handleDownloadBulk}
            disabled={isDownloadingZip || filteredDocs.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            title="Baixar documentos filtrados ou selecionados em arquivo .ZIP"
          >
            <Archive className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isDownloadingZip
                ? 'Compactando...'
                : selectedDocIds.length > 0
                ? `Baixar Selecionados (${selectedDocIds.length}) em .ZIP`
                : `Baixar em Massa (${filteredDocs.length}) .ZIP`}
            </span>
          </button>

          <button
            onClick={() => setIsNewDocModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>+ Novo Disparo</span>
          </button>
        </div>
      </div>

      {downloadSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccessMsg}</span>
          </div>
          <button onClick={() => setDownloadSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main View Area */}
      {activeTab === 'documentos' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredDocs.length > 0 && selectedDocIds.length === filteredDocs.length}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    title="Selecionar todos os documentos exibidos"
                  />
                </th>
                <th className="py-3 px-4">Documento</th>
                <th 
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 select-none group"
                  onClick={() => setSortBy(sortBy === 'NAME_ASC' ? 'NAME_DESC' : 'NAME_ASC')}
                  title="Ordenar por nome do colaborador"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Colaborador</span>
                    {sortBy === 'NAME_ASC' && <ArrowUpAZ className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                    {sortBy === 'NAME_DESC' && <ArrowDownAZ className="w-3.5 h-3.5 text-blue-600 font-bold" />}
                  </div>
                </th>
                <th className="py-3 px-3">Canal de Envio</th>
                <th className="py-3 px-3">Data de Envio</th>
                <th className="py-3 px-3">Status da Assinatura</th>
                <th className="py-3 px-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map((doc) => {
                const isSelected = selectedDocIds.includes(doc.id);
                return (
                  <tr key={doc.id} className={`hover:bg-slate-50/50 ${isSelected ? 'bg-blue-50/30' : ''}`}>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectDoc(doc.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{doc.title}</div>
                          <div className="text-[11px] text-slate-500 font-mono">Modelo: {doc.templateName}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{doc.collaboratorName}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {doc.deliveryChannel === 'WHATSAPP' ? (
                          <>
                            <Smartphone className="w-3 h-3 text-emerald-600" />
                            WhatsApp
                          </>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 text-blue-600" />
                            E-mail
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-600">
                      {formatDateBR(doc.createdAt)}
                      {doc.signedAt && (
                        <span className="block text-[10px] text-emerald-600">Assinado: {formatDateBR(doc.signedAt)}</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {renderStatus(doc.status)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => alert(`Visualizando documento ${doc.title} assinado digitalmente com certificado ICP-Brasil.`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                          title="Visualizar documento"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const colab = collaborators.find(c => c.id === doc.collaboratorId);
                            downloadSingleDocument(doc, colab);
                            logAction('EXPORT', 'Documento', doc.id, `Download individual do documento ${doc.title}`);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                          title="Baixar documento avulso"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-slate-700 text-xs mb-1">Nenhum documento eletrônico registrado</p>
                      <p className="text-slate-400 text-[11px] mb-4">
                        Clique em <strong>+ Novo Disparo</strong> ou escolha um dos <strong>Modelos de Documento</strong> para gerar e enviar documentos para assinatura digital.
                      </p>
                      <button
                        onClick={() => setIsNewDocModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>+ Novo Disparo</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Modelos de Documentos */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((tpl) => (
            <div key={tpl.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {tpl.category}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 font-semibold">{tpl.version}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">{tpl.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{tpl.description}</p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tags Preenchidas:</span>
                  <div className="flex flex-wrap gap-1">
                    {tpl.placeholders.map(p => (
                      <span key={p} className="font-mono text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedModel(tpl.title);
                    setSelectedCategory(tpl.category);
                    setIsNewDocModalOpen(true);
                  }}
                  className="w-full py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Usar Modelo & Disparar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Disparar Documento */}
      {isNewDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Disparo de Assinatura Digital</h3>
              </div>
              <button onClick={() => setIsNewDocModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSendDocument} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Modelo de Documento *</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.title}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Colaborador Destinatário *</label>
                <select
                  value={selectedColabId}
                  onChange={(e) => setSelectedColabId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {collaborators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} - CPF: {c.cpf} ({c.branchName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Canal de Envio da Assinatura *</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setChannel('WHATSAPP')}
                    className={`p-3 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                      channel === 'WHATSAPP' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">WhatsApp</div>
                      <div className="text-[10px] text-slate-500">Link rápido com validação de token</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setChannel('EMAIL')}
                    className={`p-3 rounded-lg border flex items-center gap-2 cursor-pointer transition-all ${
                      channel === 'EMAIL' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">E-mail Corporativo</div>
                      <div className="text-[10px] text-slate-500">Notificação formal e assinatura</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Assinatura Eletrônica Válida (Lei 14.063/20):</div>
                <p className="text-[11px] text-slate-500">
                  O signatário receberá um link seguro criptografado com coleta de geolocalização, IP e carimbo do tempo.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewDocModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Disparar para Assinatura</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
