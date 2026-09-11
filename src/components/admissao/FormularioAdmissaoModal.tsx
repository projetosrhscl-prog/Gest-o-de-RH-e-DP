import React, { useState } from 'react';
import { 
  X, 
  User, 
  FileText, 
  MapPin, 
  CreditCard, 
  Users, 
  ShieldCheck, 
  UploadCloud, 
  Check, 
  Copy, 
  Send, 
  Sparkles, 
  AlertCircle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Lock,
  ExternalLink
} from 'lucide-react';
import { 
  ProcessoAdmissaoCompleto, 
  FormularioAdmissaoCompleto, 
  DependenteAdmissao, 
  DocumentoAnexoAdmissao 
} from '../../types/admissao';

interface FormularioAdmissaoModalProps {
  processo: ProcessoAdmissaoCompleto;
  onClose: () => void;
  onSubmitFormulario: (
    processId: string, 
    dados: FormularioAdmissaoCompleto, 
    anexos: DocumentoAnexoAdmissao[]
  ) => void;
}

export const FormularioAdmissaoModal: React.FC<FormularioAdmissaoModalProps> = ({
  processo,
  onClose,
  onSubmitFormulario
}) => {
  const [activeTab, setActiveTab] = useState<'pessoal' | 'documentos' | 'endereco' | 'banco' | 'dependentes' | 'beneficios' | 'anexos'>('pessoal');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Estado do formulário pré-preenchido com os dados que já existem
  const [formData, setFormData] = useState<FormularioAdmissaoCompleto>(() => {
    if (processo.formularioDados) {
      return processo.formularioDados;
    }
    return {
      nomeCompleto: processo.candidatoNome || '',
      nomeSocial: '',
      genero: 'MASCULINO',
      estadoCivil: 'SOLTEIRO',
      racaCor: 'PARDA',
      dataNascimento: '1998-05-14',
      nacionalidade: 'Brasileira',
      naturalidadeCidade: 'Patos',
      naturalidadeUF: 'PB',
      nomeMae: 'Maria de Fátima Silveira',
      nomePai: 'José Carlos Silveira',
      grauInstrucao: 'SUPERIOR_COMPLETO',
      email: processo.email || '',
      telefoneCelular: processo.telefoneWhatsApp || '',
      cep: '58700-000',
      logradouro: 'Rua Pedro Firmino',
      numero: '450',
      complemento: 'Apto 102',
      bairro: 'Centro',
      cidade: 'Patos',
      uf: 'PB',
      cpf: processo.cpf || '',
      rgNumero: '3.498.221',
      rgOrgaoEmissor: 'SSP',
      rgUF: 'PB',
      rgDataEmissao: '2016-08-12',
      pisPasep: '162.88901.44-2',
      ctpsNumero: '8839210',
      ctpsSerie: '0040',
      ctpsUF: 'PB',
      tituloEleitorNumero: '9840 2234 1029',
      tituloZona: '028',
      tituloSecao: '0144',
      tituloCidadeUF: 'Patos/PB',
      certificadoReservista: '04.882.391/16',
      cnhNumero: '05899214022',
      cnhCategoria: 'B',
      cnhValidade: '2029-05-14',
      bancoNome: 'Banco Inter S.A. (077)',
      bancoCodigo: '077',
      agencia: '0001',
      contaNumero: '1488920-4',
      tipoConta: 'CORRENTE',
      chavePix: processo.cpf || '',
      possuiDependentes: true,
      dependentes: [
        {
          id: 'dep-1',
          nome: 'Enzo Gabriel Silveira',
          parentesco: 'FILHO',
          cpf: '098.221.454-99',
          dataNascimento: '2021-04-10',
          dependenteIRRF: true,
          salarioFamilia: true,
          certidaoNumero: '992019.01.55.2021.1.00281.291.002910-44'
        }
      ],
      contatoEmergenciaNome: 'Maria de Fátima Silveira',
      contatoEmergenciaTelefone: '(83) 98822-1002',
      contatoEmergenciaParentesco: 'Mãe',
      opcaoValeTransporte: true,
      linhasTransporte: 'Linha 02 - Centro / Polo Operacional',
      tamanhoUniformeCamisa: 'M',
      ePcd: false,
      detalhesPcd: ''
    };
  });

  const [anexos, setAnexos] = useState<DocumentoAnexoAdmissao[]>(() => {
    if (processo.documentos && processo.documentos.length > 0) {
      return processo.documentos;
    }
    return [
      {
        id: 'doc-adm-1',
        tipo: 'ID_RG_CNH',
        nomeArquivo: 'RG_Frente_Verso_Oficial.pdf',
        tamanho: '1.2 MB',
        dataUpload: '2026-08-28',
        url: '#',
        status: 'VALIDADO',
        fase: 'FORMULARIO_COMPLETO'
      },
      {
        id: 'doc-adm-2',
        tipo: 'COMPROVANTE_RESIDENCIA',
        nomeArquivo: 'Comprovante_Residencia_Atualizado.pdf',
        tamanho: '780 KB',
        dataUpload: '2026-08-28',
        url: '#',
        status: 'VALIDADO',
        fase: 'FORMULARIO_COMPLETO'
      },
      {
        id: 'doc-adm-3',
        tipo: 'FOTO_3X4',
        nomeArquivo: 'Foto_3x4_Digital.jpg',
        tamanho: '450 KB',
        dataUpload: '2026-08-28',
        url: '#',
        status: 'VALIDADO',
        fase: 'FORMULARIO_COMPLETO'
      },
      {
        id: 'doc-adm-4',
        tipo: 'CERTIDAO_FILHOS',
        nomeArquivo: 'Certidao_Nasc_Enzo_Gabriel.pdf',
        tamanho: '1.1 MB',
        dataUpload: '2026-08-28',
        url: '#',
        status: 'VALIDADO',
        fase: 'FORMULARIO_COMPLETO'
      },
      {
        id: 'doc-adm-5',
        tipo: 'COMPROVANTE_BANCARIO',
        nomeArquivo: 'Comprovante_Conta_Inter.pdf',
        tamanho: '320 KB',
        dataUpload: '2026-08-28',
        url: '#',
        status: 'VALIDADO',
        fase: 'FORMULARIO_COMPLETO'
      },
      {
        id: 'doc-adm-6',
        tipo: 'ASO_ADMISSIONAL',
        nomeArquivo: 'ASO_Admissional_Apto.pdf',
        tamanho: '890 KB',
        dataUpload: '2026-08-28',
        url: '#',
        status: 'VALIDADO',
        fase: 'FORMULARIO_COMPLETO'
      }
    ];
  });

  const handleCopyLink = () => {
    const link = `${window.location.origin}/admissao/formulario?token=${processo.formularioToken}&id=${processo.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleAddDependente = () => {
    const novoDep: DependenteAdmissao = {
      id: `dep-${Date.now()}`,
      nome: '',
      parentesco: 'FILHO',
      cpf: '',
      dataNascimento: '',
      dependenteIRRF: true,
      salarioFamilia: true
    };
    setFormData(prev => ({
      ...prev,
      possuiDependentes: true,
      dependentes: [...prev.dependentes, novoDep]
    }));
  };

  const handleRemoveDependente = (id: string) => {
    setFormData(prev => ({
      ...prev,
      dependentes: prev.dependentes.filter(d => d.id !== id)
    }));
  };

  const handleUpdateDependente = (id: string, field: keyof DependenteAdmissao, value: any) => {
    setFormData(prev => ({
      ...prev,
      dependentes: prev.dependentes.map(d => d.id === id ? { ...d, [field]: value } : d)
    }));
  };

  const handleSimularUpload = (tipo: DocumentoAnexoAdmissao['tipo'], nomeBase: string) => {
    const novoDoc: DocumentoAnexoAdmissao = {
      id: `doc-${Date.now()}`,
      tipo,
      nomeArquivo: `${nomeBase}_${processo.candidatoNome.split(' ')[0]}.pdf`,
      tamanho: `${(Math.random() * 1.5 + 0.4).toFixed(1)} MB`,
      dataUpload: new Date().toISOString().split('T')[0],
      url: '#',
      status: 'VALIDADO',
      fase: 'FORMULARIO_COMPLETO'
    };
    setAnexos(prev => [novoDoc, ...prev]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitFormulario(processo.id, formData, anexos);
      setIsSubmitting(false);
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Formulário Integrado de Admissão SCL</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Substituto Google Forms
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Candidato: <strong className="text-white">{processo.candidatoNome}</strong> • {processo.cargo} ({processo.poloNome})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Copiar link para envio direto ao colaborador"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link do Forms'}</span>
            </button>

            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security & Access Restriction Callout */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Pasta Segura no Perfil:</strong> Ao submeter, as informações e arquivos são salvos automaticamente no prontuário do colaborador com acesso restrito (apenas ele, lideranças e analistas de DP).
            </span>
          </div>
          <span className="hidden md:inline-block text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
            Controle RBAC Ativo
          </span>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pessoal')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pessoal' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" /> 1. Dados Pessoais
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documentos')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'documentos' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> 2. Documentação & Fiscal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('endereco')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'endereco' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> 3. Endereço & Contato
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('banco')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'banco' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> 4. Dados Bancários
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dependentes')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dependentes' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> 5. Dependentes & Filhos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beneficios')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'beneficios' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> 6. Benefícios & Emergência
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('anexos')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'anexos' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" /> 7. Anexos ({anexos.length})
          </button>
        </div>

        {/* Tab Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: DADOS PESSOAIS */}
          {activeTab === 'pessoal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo (Conforme Certidão/RG) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomeCompleto}
                    onChange={e => setFormData({ ...formData, nomeCompleto: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Social / Nome Preferido</label>
                  <input
                    type="text"
                    placeholder="Como prefere ser chamado no dia a dia"
                    value={formData.nomeSocial || ''}
                    onChange={e => setFormData({ ...formData, nomeSocial: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data de Nascimento *</label>
                  <input
                    type="date"
                    required
                    value={formData.dataNascimento}
                    onChange={e => setFormData({ ...formData, dataNascimento: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gênero / Sexo *</label>
                  <select
                    value={formData.genero}
                    onChange={e => setFormData({ ...formData, genero: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  >
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                    <option value="NAO_BINARIO">Não-binário</option>
                    <option value="OUTRO">Outro</option>
                    <option value="PREFIRO_NAO_INFORMAR">Prefiro não informar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estado Civil *</label>
                  <select
                    value={formData.estadoCivil}
                    onChange={e => setFormData({ ...formData, estadoCivil: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  >
                    <option value="SOLTEIRO">Solteiro(a)</option>
                    <option value="CASADO">Casado(a)</option>
                    <option value="UNIAO_ESTAVEL">União Estável</option>
                    <option value="DIVORCIADO">Divorciado(a)</option>
                    <option value="VIUVO">Viúvo(a)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Raça / Cor (eSocial) *</label>
                  <select
                    value={formData.racaCor}
                    onChange={e => setFormData({ ...formData, racaCor: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  >
                    <option value="BRANCA">Branca</option>
                    <option value="PRETA">Preta</option>
                    <option value="PARDA">Parda</option>
                    <option value="AMARELA">Amarela</option>
                    <option value="INDIGENA">Indígena</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nacionalidade *</label>
                  <input
                    type="text"
                    value={formData.nacionalidade}
                    onChange={e => setFormData({ ...formData, nacionalidade: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Naturalidade (Cidade / UF) *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={formData.naturalidadeCidade}
                      onChange={e => setFormData({ ...formData, naturalidadeCidade: e.target.value })}
                      className="w-2/3 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="UF"
                      maxLength={2}
                      value={formData.naturalidadeUF}
                      onChange={e => setFormData({ ...formData, naturalidadeUF: e.target.value.toUpperCase() })}
                      className="w-1/3 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo da Mãe *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomeMae}
                    onChange={e => setFormData({ ...formData, nomeMae: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo do Pai</label>
                  <input
                    type="text"
                    value={formData.nomePai || ''}
                    onChange={e => setFormData({ ...formData, nomePai: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Grau de Instrução / Escolaridade *</label>
                <select
                  value={formData.grauInstrucao}
                  onChange={e => setFormData({ ...formData, grauInstrucao: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                >
                  <option value="ENSINO_FUNDAMENTAL">Ensino Fundamental</option>
                  <option value="ENSINO_MEDIO_INCOMPLETO">Ensino Médio Incompleto</option>
                  <option value="ENSINO_MEDIO_COMPLETO">Ensino Médio Completo</option>
                  <option value="TECNICO">Ensino Técnico</option>
                  <option value="SUPERIOR_INCOMPLETO">Superior Incompleto</option>
                  <option value="SUPERIOR_COMPLETO">Superior Completo</option>
                  <option value="POS_GRADUACAO">Pós-Graduação / Especialização</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTAÇÃO & FISCAL */}
          {activeTab === 'documentos' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">RG (Número) *</label>
                  <input
                    type="text"
                    required
                    value={formData.rgNumero}
                    onChange={e => setFormData({ ...formData, rgNumero: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Órgão / UF / Data Emissão</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Órgão"
                      value={formData.rgOrgaoEmissor}
                      onChange={e => setFormData({ ...formData, rgOrgaoEmissor: e.target.value })}
                      className="w-1/3 text-xs px-2 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="UF"
                      maxLength={2}
                      value={formData.rgUF}
                      onChange={e => setFormData({ ...formData, rgUF: e.target.value.toUpperCase() })}
                      className="w-1/3 text-xs px-2 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                    />
                    <input
                      type="date"
                      value={formData.rgDataEmissao}
                      onChange={e => setFormData({ ...formData, rgDataEmissao: e.target.value })}
                      className="w-1/3 text-xs px-1 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PIS / PASEP / NIT</label>
                  <input
                    type="text"
                    placeholder="Ex: 162.88901.44-2"
                    value={formData.pisPasep || ''}
                    onChange={e => setFormData({ ...formData, pisPasep: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Carteira de Trabalho Digital (CTPS)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Número"
                      value={formData.ctpsNumero || ''}
                      onChange={e => setFormData({ ...formData, ctpsNumero: e.target.value })}
                      className="w-1/2 text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Série"
                      value={formData.ctpsSerie || ''}
                      onChange={e => setFormData({ ...formData, ctpsSerie: e.target.value })}
                      className="w-1/4 text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="UF"
                      maxLength={2}
                      value={formData.ctpsUF || ''}
                      onChange={e => setFormData({ ...formData, ctpsUF: e.target.value.toUpperCase() })}
                      className="w-1/4 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título de Eleitor</label>
                  <input
                    type="text"
                    placeholder="Número do título"
                    value={formData.tituloEleitorNumero || ''}
                    onChange={e => setFormData({ ...formData, tituloEleitorNumero: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Zona / Seção</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Zona"
                      value={formData.tituloZona || ''}
                      onChange={e => setFormData({ ...formData, tituloZona: e.target.value })}
                      className="w-1/2 text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Seção"
                      value={formData.tituloSecao || ''}
                      onChange={e => setFormData({ ...formData, tituloSecao: e.target.value })}
                      className="w-1/2 text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Certificado de Reservista (Homens)</label>
                  <input
                    type="text"
                    placeholder="Número / RM"
                    value={formData.certificadoReservista || ''}
                    onChange={e => setFormData({ ...formData, certificadoReservista: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CNH (Número se possuir)</label>
                  <input
                    type="text"
                    placeholder="Registro CNH"
                    value={formData.cnhNumero || ''}
                    onChange={e => setFormData({ ...formData, cnhNumero: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria CNH</label>
                  <input
                    type="text"
                    placeholder="Ex: AB, B, D"
                    value={formData.cnhCategoria || ''}
                    onChange={e => setFormData({ ...formData, cnhCategoria: e.target.value.toUpperCase() })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Validade CNH</label>
                  <input
                    type="date"
                    value={formData.cnhValidade || ''}
                    onChange={e => setFormData({ ...formData, cnhValidade: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ENDEREÇO & CONTATO */}
          {activeTab === 'endereco' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail Pessoal de Contato *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone Celular / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.telefoneCelular}
                    onChange={e => setFormData({ ...formData, telefoneCelular: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CEP *</label>
                  <input
                    type="text"
                    required
                    value={formData.cep}
                    onChange={e => setFormData({ ...formData, cep: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Logradouro (Rua / Avenida) *</label>
                  <input
                    type="text"
                    required
                    value={formData.logradouro}
                    onChange={e => setFormData({ ...formData, logradouro: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={formData.numero}
                    onChange={e => setFormData({ ...formData, numero: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    placeholder="Apto, Bloco..."
                    value={formData.complemento || ''}
                    onChange={e => setFormData({ ...formData, complemento: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={formData.bairro}
                    onChange={e => setFormData({ ...formData, bairro: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade / UF *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={formData.cidade}
                      onChange={e => setFormData({ ...formData, cidade: e.target.value })}
                      className="w-2/3 text-xs px-2 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                    />
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={formData.uf}
                      onChange={e => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
                      className="w-1/3 text-xs px-2 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DADOS BANCÁRIOS */}
          {activeTab === 'banco' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-800 flex items-start gap-2">
                <CreditCard className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Atenção:</strong> A conta bancária deve ser de titularidade do próprio colaborador para fins de recebimento de salário e benefícios.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instituição Financeira / Banco *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Nubank (260), Inter (077), Bradesco (237)..."
                    value={formData.bancoNome}
                    onChange={e => setFormData({ ...formData, bancoNome: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Código do Banco</label>
                  <input
                    type="text"
                    placeholder="Ex: 077"
                    value={formData.bancoCodigo}
                    onChange={e => setFormData({ ...formData, bancoCodigo: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Agência (com dígito se houver) *</label>
                  <input
                    type="text"
                    required
                    value={formData.agencia}
                    onChange={e => setFormData({ ...formData, agencia: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Conta (com dígito verificador) *</label>
                  <input
                    type="text"
                    required
                    value={formData.contaNumero}
                    onChange={e => setFormData({ ...formData, contaNumero: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Conta *</label>
                  <select
                    value={formData.tipoConta}
                    onChange={e => setFormData({ ...formData, tipoConta: e.target.value as any })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
                  >
                    <option value="CORRENTE">Conta Corrente</option>
                    <option value="POUPANCA">Conta Poupança</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chave PIX Vinculada à Conta</label>
                <input
                  type="text"
                  placeholder="CPF, E-mail, Celular ou Chave Aleatória"
                  value={formData.chavePix || ''}
                  onChange={e => setFormData({ ...formData, chavePix: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
                />
              </div>
            </div>
          )}

          {/* TAB 5: DEPENDENTES */}
          {activeTab === 'dependentes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dependentes e Filhos</h4>
                  <p className="text-[11px] text-slate-500">Adicione para fins de dedução do IRRF e concessão de Salário Família.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddDependente}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Dependente
                </button>
              </div>

              {formData.dependentes.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Nenhum dependente cadastrado.</p>
                  <p className="text-[11px] text-slate-400">Se o candidato não possuir dependentes, pode avançar.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.dependentes.map((dep, index) => (
                    <div key={dep.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Dependente #{index + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDependente(dep.id)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nome Completo</label>
                          <input
                            type="text"
                            value={dep.nome}
                            onChange={e => handleUpdateDependente(dep.id, 'nome', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Grau de Parentesco</label>
                          <select
                            value={dep.parentesco}
                            onChange={e => handleUpdateDependente(dep.id, 'parentesco', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          >
                            <option value="FILHO">Filho(a)</option>
                            <option value="CONJUGE">Cônjuge / Companheiro(a)</option>
                            <option value="ENTEADO">Enteado(a)</option>
                            <option value="PAI_MAE">Pai / Mãe</option>
                            <option value="OUTRO">Outro</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">CPF do Dependente</label>
                          <input
                            type="text"
                            value={dep.cpf}
                            onChange={e => handleUpdateDependente(dep.id, 'cpf', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-2 border-t border-slate-200">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Data de Nascimento</label>
                          <input
                            type="date"
                            value={dep.dataNascimento}
                            onChange={e => handleUpdateDependente(dep.id, 'dataNascimento', e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <input
                            type="checkbox"
                            id={`irrf-${dep.id}`}
                            checked={dep.dependenteIRRF}
                            onChange={e => handleUpdateDependente(dep.id, 'dependenteIRRF', e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`irrf-${dep.id}`} className="text-xs text-slate-700 font-medium cursor-pointer">
                            Dependente IRRF
                          </label>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <input
                            type="checkbox"
                            id={`salFam-${dep.id}`}
                            checked={dep.salarioFamilia}
                            onChange={e => handleUpdateDependente(dep.id, 'salarioFamilia', e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`salFam-${dep.id}`} className="text-xs text-slate-700 font-medium cursor-pointer">
                            Salário Família
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: BENEFÍCIOS & EMERGÊNCIA */}
          {activeTab === 'beneficios' && (
            <div className="space-y-4">
              <div className="border border-slate-200 p-4 rounded-xl space-y-3 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-900">Contato de Emergência</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nome do Contato *</label>
                    <input
                      type="text"
                      required
                      value={formData.contatoEmergenciaNome}
                      onChange={e => setFormData({ ...formData, contatoEmergenciaNome: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Telefone / Celular *</label>
                    <input
                      type="text"
                      required
                      value={formData.contatoEmergenciaTelefone}
                      onChange={e => setFormData({ ...formData, contatoEmergenciaTelefone: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Grau de Parentesco *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mãe, Esposa, Irmão"
                      value={formData.contatoEmergenciaParentesco}
                      onChange={e => setFormData({ ...formData, contatoEmergenciaParentesco: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 p-4 rounded-xl space-y-2 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900">Opção de Vale Transporte</label>
                    <input
                      type="checkbox"
                      checked={formData.opcaoValeTransporte}
                      onChange={e => setFormData({ ...formData, opcaoValeTransporte: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Desconto padrão em folha de até 6% do salário base.</p>
                  {formData.opcaoValeTransporte && (
                    <input
                      type="text"
                      placeholder="Linhas e itinerário utilizado"
                      value={formData.linhasTransporte || ''}
                      onChange={e => setFormData({ ...formData, linhasTransporte: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white mt-2"
                    />
                  )}
                </div>

                <div className="border border-slate-200 p-4 rounded-xl space-y-2 bg-slate-50/50">
                  <label className="text-xs font-bold text-slate-900 block">Tamanho de Uniforme / Camisa</label>
                  <select
                    value={formData.tamanhoUniformeCamisa || 'M'}
                    onChange={e => setFormData({ ...formData, tamanhoUniformeCamisa: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                    <option value="XGG">XGG</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ANEXOS & ARQUIVOS */}
          {activeTab === 'anexos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Documentos Comprobatórios Anexados</h4>
                  <p className="text-[11px] text-slate-500">Estes arquivos serão salvos diretamente na pasta de Admissão no perfil do colaborador.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimularUpload('OUTRO', 'Documento_Complementar')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold border border-blue-200 transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Adicionar Arquivo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {anexos.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-semibold text-slate-800 block truncate">{doc.nomeArquivo}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{doc.tamanho}</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> {doc.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                      {doc.tipo.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Campos marcados com <strong>*</strong> são obrigatórios para a contabilidade e eSocial.
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Salvando e Integrando ao Perfil...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Concluir Preenchimento & Salvar no Perfil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>Formulário salvo! Dados integrados à pasta restrita de Admissão do perfil.</span>
        </div>
      )}
    </div>
  );
};
