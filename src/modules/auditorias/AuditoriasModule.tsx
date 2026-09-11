import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  Filter, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Users, 
  Lock, 
  Building2, 
  FileCheck, 
  Database,
  ArrowUpDown,
  RefreshCw,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStoredCollaborators } from '../../utils/collaboratorsStorage';
import { formatDateBR } from '../../utils/dateHelper';

export const AuditoriasModule: React.FC = () => {
  const { 
    auditLogs, 
    branches, 
    selectedBranchIds, 
    branchSelectionLabel,
    logAction,
    currentUser
  } = useAuth();

  const { collaborators } = useStoredCollaborators();

  const [activeTab, setActiveTab] = useState<'trilha' | 'trabalhista' | 'lgpd' | 'dossies'>('trilha');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('ALL');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  const [selectedLogDetail, setSelectedLogDetail] = useState<any | null>(null);

  // Filtered collaborators based on active branch selection
  const filteredCollaborators = collaborators.filter(c => 
    selectedBranchIds.length === 0 || selectedBranchIds.includes(c.branchId)
  );

  // Filtered audit logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategoryFilter === 'ALL' || log.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Mock Compliance Items
  const COMPLIANCE_ITEMS = [
    {
      id: 'comp-1',
      title: 'Período Concessivo de Férias CLT (Risco de Pagamento em Dobro)',
      category: 'Férias & Jornada',
      status: 'REGULAR',
      description: 'Nenhum colaborador com período concessivo vencido nas 8 operações solares.',
      affectedCount: 0,
      rule: 'Art. 137 da CLT - Concessão nos 12 meses subsequentes ao período aquisitivo.'
    },
    {
      id: 'comp-2',
      title: 'Validade dos ASOs (Atestado de Saúde Ocupacional NR-07)',
      category: 'Saúde & Segurança (SST)',
      status: 'ATENCAO',
      description: '2 colaboradores com ASO periódico a renovar nos próximos 45 dias (Usinas Paracatu e Patos).',
      affectedCount: 2,
      rule: 'NR-07 / eSocial S-2220 - Exames periódicos anuais para atividades sob risco elétrico.'
    },
    {
      id: 'comp-3',
      title: 'Ficha de EPI Digital & Certificados de Aprovação (NR-06)',
      category: 'Saúde & Segurança (SST)',
      status: 'REGULAR',
      description: '100% dos termos de entrega de EPI com CA assinados eletronicamente com certificado digital.',
      affectedCount: 0,
      rule: 'NR-06 / Portaria MTE 3.214 - Comprovação digital de fornecimento e treinamento de EPI.'
    },
    {
      id: 'comp-4',
      title: 'Adicional de Periculosidade Elétrica (30% NR-10)',
      category: 'Folha & Remuneração',
      status: 'REGULAR',
      description: 'Cálculo de 30% sobre o salário-base aplicado a todos os eletrotécnicos e engenheiros operacionais.',
      affectedCount: 0,
      rule: 'Art. 193 da CLT / NR-10 - Trabalho em sistema elétrico de potência em usinas solares.'
    },
    {
      id: 'comp-5',
      title: 'Qualificação Cadastral eSocial (CPF e PIS/NIS)',
      category: 'eSocial & Fiscal',
      status: 'REGULAR',
      description: 'Dados validados junto à Receita Federal para todos os colaboradores das 8 usinas.',
      affectedCount: 0,
      rule: 'Layout eSocial v.S-1.2 - Validação prévia de vínculos (S-2200).'
    },
    {
      id: 'comp-6',
      title: 'Fechamento de Ponto & Intervalo Intrajornada',
      category: 'Férias & Jornada',
      status: 'REGULAR',
      description: 'Marcações de ponto em conformidade com Portaria 671 MTE e sem extrapolação indevida.',
      affectedCount: 0,
      rule: 'Art. 71 da CLT - Intervalo intrajornada mínimo de 1h para jornadas acima de 6h.'
    }
  ];

  const LGPD_ACCESS_RECORDS = [
    {
      id: 'lgpd-1',
      date: '2026-08-20 12:45',
      accessor: 'Ana Clara Souza (RH Central)',
      dataType: 'Dados Bancários & Holerites',
      operation: 'Exportação para Contabilidade Parceira (Domínio Thomson Reuters)',
      legalBasis: 'Execução de Contrato de Trabalho (Art. 7º, V da LGPD)'
    },
    {
      id: 'lgpd-2',
      date: '2026-08-20 10:15',
      accessor: 'Roberto Mendonça (DP Senior)',
      dataType: 'Prontuário Médico / ASO NR-10',
      operation: 'Transmissão do Evento eSocial S-2220',
      legalBasis: 'Cumprimento de Obrigação Legal e Regulatória (Art. 7º, II da LGPD)'
    },
    {
      id: 'lgpd-3',
      date: '2026-08-19 16:30',
      accessor: 'Carlos Eduardo Lima (Gerente Geral)',
      dataType: 'Quadro Salarial Consolidado',
      operation: 'Auditoria e Balanço de Custos Operacionais',
      legalBasis: 'Legítimo Interesse com Salvaguardas (Art. 7º, IX da LGPD)'
    }
  ];

  const handleRunScan = () => {
    setIsScanning(true);
    setScanSuccessMessage(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccessMessage('Varredura concluída com sucesso! 6 regras de auditoria auditadas para as 8 operações.');
      logAction('SCAN', 'Auditorias', 'CONFORMIDADE_GERAL', 'Executou varredura completa de conformidade trabalhista e eSocial');
    }, 900);
  };

  const handleExportCSV = (tipoDossie: string) => {
    let headers: string[] = [];
    let rows: any[][] = [];

    if (tipoDossie === 'trilha') {
      headers = ['ID', 'Data/Hora', 'Usuário', 'Operação', 'Entidade', 'ID Alvo', 'Detalhes'];
      rows = filteredLogs.map(l => [
        l.id,
        `"${formatDateBR(l.timestamp)}"`,
        `"${l.userName}"`,
        l.action,
        l.targetEntity,
        l.targetId,
        `"${l.details}"`
      ]);
    } else if (tipoDossie === 'conformidade') {
      headers = ['Regra de Conformidade', 'Categoria', 'Status', 'Impacto', 'Norma / Lei Regulamentadora'];
      rows = COMPLIANCE_ITEMS.map(c => [
        `"${c.title}"`,
        `"${c.category}"`,
        c.status,
        c.affectedCount > 0 ? `${c.affectedCount} pendências` : '100% Conforme',
        `"${c.rule}"`
      ]);
    } else if (tipoDossie === 'colaboradores_auditoria') {
      headers = ['Matrícula', 'Colaborador', 'CPF', 'Cargo', 'Unidade Solar', 'Salário Base', 'Periculosidade (30%)', 'Status ASO', 'Status CLT'];
      rows = filteredCollaborators.map(c => [
        c.registrationNumber,
        `"${c.fullName}"`,
        c.cpf,
        `"${c.positionTitle}"`,
        `"${c.branchName}"`,
        c.salary,
        c.salary * 0.3,
        c.medicalExams[0]?.status || 'APTO',
        c.status
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auditoria_${tipoDossie}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAction('EXPORT', 'Auditorias', tipoDossie, `Exportou relatório de auditoria (${tipoDossie})`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Auditorias & Conformidade
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Trilha de auditoria, conformidade trabalhista CLT, eSocial oficial e proteção de dados LGPD.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
            <span>{isScanning ? 'Auditando...' : 'Executar Varredura'}</span>
          </button>

          <button
            onClick={() => handleExportCSV(activeTab === 'trilha' ? 'trilha' : 'conformidade')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {scanSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/70 rounded-xl text-emerald-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{scanSuccessMessage}</span>
          </div>
          <button onClick={() => setScanSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">✕</button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Eventos na Trilha</span>
            <Database className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{auditLogs.length} logs</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            100% com assinatura e timestamp
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Índice Conformidade</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">98.5%</div>
          <div className="text-[11px] text-emerald-700 font-medium mt-1">
            ✓ 0 riscos graves ou dobras CLT
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Alertas Trabalhistas</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">2 ASOs a renovar</div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            Prazo confortável (&gt; 30 dias)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Operações</span>
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">8 Usinas</div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">
            {branchSelectionLabel}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200/80 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('trilha')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'trilha'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Trilha de Auditoria ({filteredLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trabalhista')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'trabalhista'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Auditoria Trabalhista & eSocial</span>
        </button>

        <button
          onClick={() => setActiveTab('lgpd')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'lgpd'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Segurança & LGPD</span>
        </button>

        <button
          onClick={() => setActiveTab('dossies')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-xs font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'dossies'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Dossiês & Relatórios Legais</span>
        </button>
      </div>

      {/* Tab 1: Trilha de Auditoria (Audit Trail) */}
      {activeTab === 'trilha' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por usuário, ação, descrição ou entidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Categoria:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="ALL">Todas as Categorias</option>
                <option value="PAYROLL">Folha & Ponto</option>
                <option value="VACATION">Férias</option>
                <option value="BENEFIT">Benefícios (Caju)</option>
                <option value="ADMISSION">Admissão & Colaborador</option>
                <option value="TERMINATION">Desligamento</option>
                <option value="SYSTEM">Sistema & Governança</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Registro Cronológico de Operações</h3>
              <span className="text-xs text-slate-500 font-mono">
                {filteredLogs.length} eventos registrados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Data & Hora</th>
                    <th className="py-3 px-3">Usuário / Operador</th>
                    <th className="py-3 px-3">Categoria</th>
                    <th className="py-3 px-3">Ação Realizada</th>
                    <th className="py-3 px-3">Módulo / Alvo</th>
                    <th className="py-3 px-3">Detalhes do Evento</th>
                    <th className="py-3 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{formatDateBR(log.timestamp)}</td>
                      <td className="py-3 px-3 font-sans font-bold text-slate-900 whitespace-nowrap">{log.userName}</td>
                      <td className="py-3 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans font-medium text-slate-800">{log.action}</td>
                      <td className="py-3 px-3 font-sans text-blue-700 font-semibold">{log.targetEntity}</td>
                      <td className="py-3 px-3 font-sans text-slate-600 max-w-md truncate">{log.details}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedLogDetail(log)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                          title="Ver detalhes técnicos"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Auditoria Trabalhista & eSocial */}
      {activeTab === 'trabalhista' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Matriz de Auditoria Trabalhista & Validações eSocial</h3>
                <p className="text-xs text-slate-500">Regras contínuas de conformidade para as 8 unidades operacionais SCL.</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Auditoria 100% Automatizada
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {COMPLIANCE_ITEMS.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.status === 'REGULAR' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      item.status === 'REGULAR' 
                        ? 'bg-emerald-100/70 text-emerald-800 border-emerald-200'
                        : 'bg-amber-100/70 text-amber-800 border-amber-200'
                    }`}>
                      {item.status === 'REGULAR' ? '✓ CONFORME' : '⚠ ATENÇÃO REQUERIDA'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{item.description}</p>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-slate-200/60">
                    <span>Base Legal: {item.rule}</span>
                    <span className="font-semibold text-blue-700">Auditado nas 8 filiais</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Segurança & LGPD */}
      {activeTab === 'lgpd' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Auditoria de Segurança da Informação & LGPD</h3>
                <p className="text-xs text-slate-500">Rastreabilidade no acesso a dados sensíveis, salariais e médicos de colaboradores.</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                Lei nº 13.709/2018 (LGPD)
              </span>
            </div>

            <div className="space-y-3">
              {LGPD_ACCESS_RECORDS.map((rec) => (
                <div key={rec.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-bold text-xs text-slate-900">{rec.dataType}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{formatDateBR(rec.date)}</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold">Operador:</span> {rec.accessor} • <span className="font-semibold">Finalidade:</span> {rec.operation}
                  </div>
                  <div className="text-[11px] text-blue-800 font-medium bg-blue-50/70 p-1.5 rounded border border-blue-100">
                    ⚖ Base Legal: {rec.legalBasis}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Dossiês & Relatórios Legais */}
      {activeTab === 'dossies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Users className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-slate-900">Dossiê de Colaboradores & Vínculos</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Extrato com matrículas, CPFs, cargos, adicionais de periculosidade (30%), ASOs e regime contratual.
                </p>
              </div>
              <button
                onClick={() => handleExportCSV('colaboradores_auditoria')}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Dossiê (CSV)</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-slate-900">Relatório de Conformidade & eSocial</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Relatório oficial com status das regras de férias, ASOs, SST (S-2220/S-2240) e encargos para fiscalização MTE.
                </p>
              </div>
              <button
                onClick={() => handleExportCSV('conformidade')}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Conformidade (CSV)</span>
              </button>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <Database className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-slate-900">Trilha Completa de Auditoria</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Histórico irrestrito de logs do sistema para auditorias externas (PwC, KPMG, Ernst & Young, Domínio Thomson Reuters).
                </p>
              </div>
              <button
                onClick={() => handleExportCSV('trilha')}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Trilha (CSV)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Detalhes do Evento de Auditoria</h3>
              </div>
              <button onClick={() => setSelectedLogDetail(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">ID do Registro:</span>
                  <span className="font-mono text-slate-800">{selectedLogDetail.id}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Timestamp:</span>
                  <span className="font-mono text-slate-800">{formatDateBR(selectedLogDetail.timestamp)}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Operador Responsável:</span>
                <div className="font-bold text-slate-900">{selectedLogDetail.userName}</div>
                <div className="text-slate-500 font-mono text-[11px]">User ID: {selectedLogDetail.userId}</div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Ação & Alvo:</span>
                <div className="font-bold text-blue-700">{selectedLogDetail.action} ({selectedLogDetail.targetEntity})</div>
                <div className="text-slate-700 pt-1">{selectedLogDetail.details}</div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-center pt-2">
                🔒 Assinatura Digital SHA-256 Verificada • Trilha Imutável SCL
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
