import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Award, 
  AlertCircle, 
  Users, 
  CheckCircle2, 
  Clock, 
  Download, 
  ExternalLink, 
  Send, 
  Sparkles, 
  Stethoscope,
  Archive,
  TrendingUp,
  Camera,
  UploadCloud,
  Check,
  Edit3,
  Save,
  CheckCheck,
  Trash2
} from 'lucide-react';
import { CollaboratorProfile } from '../../types/collaborator';
import { INITIAL_ELECTRONIC_DOCUMENTS } from '../../data/mockData';
import { downloadCollaboratorDossierZip } from '../../utils/documentGenerator';
import { OwnItJourneyTimeline } from './OwnItJourneyTimeline';
import { getCollaboratorOwnItJourney, OWN_IT_LEVEL_DEFINITIONS, isOwnItEligible } from '../../utils/ownItHelper';
import { EditCollaboratorModal } from './EditCollaboratorModal';
import { sanitizeCollaboratorProfile } from '../../utils/collaboratorDefaults';
import { calculateTenureDays, isProbationPeriod } from '../../utils/tenureHelper';
import { formatDateBR } from '../../utils/dateHelper';

interface CollaboratorProfileDrawerProps {
  collaborator: CollaboratorProfile | null;
  onClose: () => void;
  onUpdateCollaborator?: (updated: CollaboratorProfile) => void;
  onDeleteCollaborator?: (id: string) => void;
}

export const CollaboratorProfileDrawer: React.FC<CollaboratorProfileDrawerProps> = ({
  collaborator,
  onClose,
  onUpdateCollaborator,
  onDeleteCollaborator
}) => {
  const [activeTab, setActiveTab] = useState<'resumo' | 'ownit' | 'pessoal' | 'profissional' | 'documentos' | 'adicionais'>('resumo');
  const [activeAdicionaisSubTab, setActiveAdicionaisSubTab] = useState<'onboarding' | 'disciplinares' | 'epis' | 'medicos'>('onboarding');
  const [localColab, setLocalColab] = useState<CollaboratorProfile | null>(() => {
    return collaborator ? sanitizeCollaboratorProfile(collaborator) : null;
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: ''
  });

  useEffect(() => {
    if (collaborator) {
      setLocalColab(sanitizeCollaboratorProfile(collaborator));
    } else {
      setLocalColab(null);
    }
  }, [collaborator]);

  if (!localColab) return null;

  const handleUpdate = (updated: CollaboratorProfile) => {
    const sanitized = sanitizeCollaboratorProfile(updated);
    setLocalColab(sanitized);
    if (onUpdateCollaborator) {
      onUpdateCollaborator(sanitized);
    }
    setSaveSuccessToast({
      show: true,
      message: 'Informações do colaborador salvas e sincronizadas com sucesso!'
    });
    setTimeout(() => {
      setSaveSuccessToast({ show: false, message: '' });
    }, 4000);
  };

  const ownItJourney = getCollaboratorOwnItJourney(localColab);
  const ownItDef = OWN_IT_LEVEL_DEFINITIONS[ownItJourney.currentLevel];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Profile Info Bar */}
        <div className="bg-slate-900 text-white px-8 py-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Fechar Prontuário"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-start justify-between gap-4 pr-10">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {localColab.fullName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {localColab.status === 'EM_ATIVIDADE' ? 'Em atividade' : localColab.status}
                </span>

                {/* OWN IT Badge */}
                {isOwnItEligible(localColab) && (
                  <span 
                    onClick={() => setActiveTab('ownit')}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-400 text-slate-950 shadow-2xs cursor-pointer hover:bg-amber-300 transition-colors"
                    title={`Jornada OWN IT: Nível ${ownItJourney.currentLevel} (${ownItDef.name})`}
                  >
                    <Award className="w-3.5 h-3.5 fill-slate-950" />
                    <span>OWN IT • Letra {ownItJourney.currentLevel}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-2">
                <span className="font-semibold text-white">{localColab.positionTitle}</span>
                <span>•</span>
                <span>{localColab.departmentName}</span>
                <span>•</span>
                <span className="text-blue-300 font-medium">{localColab.branchName}</span>
                <span>•</span>
                <span className="font-mono text-slate-300">CPF: {localColab.cpf}</span>
              </div>
              <div className="mt-2">
                {localColab.contractType === 'CLT' ? (
                  isProbationPeriod(localColab.admissionDate) ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-400 text-slate-950">
                      <Clock className="w-3.5 h-3.5" />
                      Em período de experiência há {calculateTenureDays(localColab.admissionDate)} dias ({90 - calculateTenureDays(localColab.admissionDate)}d restantes para efetivação)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Efetivo há {calculateTenureDays(localColab.admissionDate)} dias (Admitido em {formatDateBR(localColab.admissionDate)})
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Prestador {localColab.contractType === 'PJ' ? 'RPA' : localColab.contractType} há {calculateTenureDays(localColab.admissionDate)} dias
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                id="btn-edit-colab-profile"
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Editar Cadastro</span>
              </button>

              {onDeleteCollaborator && (
                <button
                  type="button"
                  id="btn-delete-colab-profile"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-600/50 border border-rose-500/30 rounded-lg shadow-sm transition-all cursor-pointer"
                  title="Excluir Colaborador"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                  <span>Excluir</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feedback de salvamento com sucesso */}
        {saveSuccessToast.show && (
          <div className="mx-8 mt-2 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1 bg-emerald-600 text-white rounded-md">
                <CheckCheck className="w-4 h-4" />
              </div>
              <span>{saveSuccessToast.message}</span>
            </div>
            <button
              onClick={() => setSaveSuccessToast({ show: false, message: '' })}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-8 border-b border-slate-200 flex items-center gap-5 text-xs font-semibold bg-slate-50/70 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('resumo')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'resumo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Resumo
          </button>

          {isOwnItEligible(localColab) && (
            <button
              onClick={() => setActiveTab('ownit')}
              className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'ownit'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold">Jornada OWN IT</span>
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded-full font-mono">
                {ownItJourney.currentLevel}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('pessoal')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'pessoal'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Pessoal
          </button>
          <button
            onClick={() => setActiveTab('profissional')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'profissional'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Profissional
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'documentos'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Documentos
          </button>
          <button
            onClick={() => setActiveTab('adicionais')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'adicionais'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Adicionais & Saúde
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-xs text-slate-700 bg-white">
          {/* TAB 1: RESUMO */}
          {activeTab === 'resumo' && (
            <div className="space-y-6">
              {/* Sobre mim */}
              <div className="bg-slate-50/60 p-5 rounded-xl border border-slate-200/80 relative group">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-xs">Sobre mim</h4>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Editar
                  </button>
                </div>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {localColab.bio || 'Colaborador integrante do quadro operacional da SCL.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Talentos / Habilidades */}
                <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Talentos & Competências
                    </h4>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Editar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {localColab.skills && localColab.skills.length > 0 ? (
                      localColab.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium text-[11px] border border-blue-100"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Nenhuma competência cadastrada.</span>
                    )}
                  </div>
                </div>

                {/* Contatos */}
                <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 text-xs">Contatos Principais</h4>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Editar
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{localColab.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{localColab.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{localColab.branchName} • {localColab.personalData?.address?.city || ''}/{localColab.personalData?.address?.state || ''}</span>
                  </div>
                </div>
              </div>

              {/* Evolução de Carreira - Jornada OWN IT */}
              {isOwnItEligible(localColab) && (
                <div className="border-t border-slate-200/80 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                        <span>Evolução de Carreira • Jornada OWN IT</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Linha do tempo de maturidade, conquistas e histórico de promoções por nível (O-W-N-I-T).
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('ownit')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                    >
                      Ver detalhes completos →
                    </button>
                  </div>

                  <OwnItJourneyTimeline 
                    collaborator={localColab}
                    onUpdateCollaborator={handleUpdate}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB DEDICADA: JORNADA OWN IT */}
          {activeTab === 'ownit' && (
            <div className="space-y-6">
              <OwnItJourneyTimeline 
                collaborator={localColab}
                onUpdateCollaborator={handleUpdate}
              />
            </div>
          )}

          {/* TAB 2: PESSOAL */}
          {activeTab === 'pessoal' && (
            <div className="space-y-6">
              {/* Documentos Pessoais Básicos */}
              <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-xs">Identificação Civil</h4>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Editar Dados
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">CPF</span>
                    <span className="font-mono font-medium text-slate-900">{localColab.cpf}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">RG / Órgão</span>
                    <span className="font-mono font-medium text-slate-900">{localColab.rg} - {localColab.rgIssuer}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Data Nasc.</span>
                    <span className="font-mono font-medium text-slate-900">{formatDateBR(localColab.personalData?.birthDate)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Estado Civil</span>
                    <span className="font-medium text-slate-900">{localColab.personalData?.maritalStatus || '-'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Tamanho da Camisa (Kit Polo)</span>
                    <span className="font-medium text-slate-900">{localColab.personalData?.shirtSize || 'M'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Bolo Favorito (Aniversários)</span>
                    <span className="font-medium text-slate-900">{localColab.personalData?.favoriteCake || 'Não informado'}</span>
                  </div>
                </div>
              </div>

              {/* Endereço & Contato de Emergência */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 text-xs">Endereço Residencial</h4>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Editar
                    </button>
                  </div>
                  <p className="text-slate-600">
                    {localColab.personalData?.address?.street || 'Rua Principal'}, {localColab.personalData?.address?.number || 'S/N'}<br />
                    {localColab.personalData?.address?.neighborhood || 'Centro'} - {localColab.personalData?.address?.city || 'Patos'}/{localColab.personalData?.address?.state || 'PB'}<br />
                    <span className="font-mono text-[11px] text-slate-500">CEP: {localColab.personalData?.address?.zipCode || '58700-000'}</span>
                  </p>
                </div>

                <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 text-xs">Contato de Emergência</h4>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Editar
                    </button>
                  </div>
                  <p className="text-slate-900 font-medium">{localColab.personalData?.emergencyContact?.name || 'Não cadastrado'}</p>
                  <p className="text-slate-500 text-[11px] font-mono mt-0.5">{localColab.personalData?.emergencyContact?.phone || '-'}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Parentesco: {localColab.personalData?.emergencyContact?.relationship || '-'}</p>
                </div>
              </div>

              {/* Dados Bancários */}
              <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    Conta para Depósito de Salário
                  </h4>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Editar Dados Bancários
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Banco</span>
                    <span className="font-medium text-slate-900">{localColab.bankAccount?.bankName || 'Banco'} ({localColab.bankAccount?.bankCode || '000'})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Agência</span>
                    <span className="font-mono font-medium text-slate-900">{localColab.bankAccount?.agency || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Conta Corrente</span>
                    <span className="font-mono font-medium text-slate-900">{localColab.bankAccount?.accountNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Chave PIX</span>
                    <span className="font-mono font-medium text-slate-900 truncate block">{localColab.bankAccount?.pixKey || 'Não cadastrada'}</span>
                  </div>
                </div>
              </div>

              {/* Dependentes */}
              <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 text-xs">Dependentes para IR & Benefícios</h4>
                </div>
                {localColab.dependents && localColab.dependents.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {localColab.dependents.map((dep) => (
                      <div key={dep.id} className="py-2 flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-slate-900 block">{dep.name}</span>
                          <span className="text-[10px] text-slate-400">Grau: {dep.relationship} • Nasc: {formatDateBR(dep.birthDate)}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          CPF: {dep.cpf}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-[11px]">Nenhum dependente cadastrado.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROFISSIONAL */}
          {activeTab === 'profissional' && (
            <div className="space-y-6">
              {/* Vínculo & Lotação */}
              <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-xs">Contrato & Lotação</h4>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Editar Contrato
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Vínculo</span>
                    <span className="font-semibold text-slate-900">{localColab.contractType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Data de Admissão</span>
                    <span className="font-mono font-semibold text-slate-900">{formatDateBR(localColab.admissionDate)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Centro de Custo</span>
                    <span className="font-mono font-medium text-slate-900">{localColab.costCenter}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Líder Direto</span>
                    <span className="font-medium text-slate-900">{localColab.directSupervisor}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Salário Base Mensal</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{formatCurrency(localColab.salary)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold mb-1">Jornada de Trabalho</span>
                    <span className="text-xs text-slate-700 font-medium">{localColab.workSchedule}</span>
                  </div>
                </div>
              </div>

              {/* Benefícios Ativos */}
              <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-xs">Benefícios Vinculados (Integração Caju / Planos)</h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Total: {formatCurrency((localColab.benefits || []).reduce((acc, b) => acc + (b.monthlyValue || 0), 0))} / mês
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {localColab.benefits && localColab.benefits.length > 0 ? (
                    localColab.benefits.map((b) => (
                      <div key={b.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-900 block">{b.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">Fornecedor: {b.provider} • Desconto em folha: {b.discountPercentage}%</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-slate-800">
                          {formatCurrency(b.monthlyValue)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">Nenhum benefício vinculado.</p>
                  )}
                </div>
              </div>

              {/* Férias & Períodos Aquisitivos (Controle Contábil) */}
              <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-xs">Períodos Aquisitivos & Saldo de Férias CLT</h4>
                  <span className="text-[10px] text-slate-500 font-medium">Controle Contábil & Limite de Dobra</span>
                </div>
                <div className="space-y-3">
                  {localColab.vacationPeriods && localColab.vacationPeriods.length > 0 ? (
                    localColab.vacationPeriods.map((v) => {
                      const isForming = (v.acquiredDays ?? v.totalDays) < 30 && v.takenDays === 0;
                      return (
                        <div key={v.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 font-mono text-xs">
                                {formatDateBR(v.startDate)} a {formatDateBR(v.endDate)}
                              </span>
                              {v.fractionAvos && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                                  {v.fractionAvos} avos
                                </span>
                              )}
                              {isForming && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                  Em Formação
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Limite p/ Gozo: {formatDateBR(v.limitConcessionDate)}
                            </span>
                          </div>

                          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-center">
                            <div className="bg-white p-1.5 rounded border border-slate-100">
                              <span className="text-[10px] text-slate-400 block">Dias Dir.</span>
                              <span className="text-xs font-bold text-slate-800 font-mono">{v.acquiredDays ?? v.totalDays}d</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-slate-100">
                              <span className="text-[10px] text-slate-400 block">Dias Goz.</span>
                              <span className="text-xs font-bold text-slate-600 font-mono">{v.takenDays}d</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-slate-100">
                              <span className="text-[10px] text-slate-400 block">Dias Rest.</span>
                              <span className="text-xs font-bold text-blue-700 font-mono">{v.remainingBalance}d</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-slate-100">
                              <span className="text-[10px] text-slate-400 block">Faltas / Afast.</span>
                              <span className="text-xs font-semibold text-slate-500 font-mono">
                                {(v.faultDays || 0) + (v.absenceDays || 0)}d
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-slate-400 italic text-[11px]">Nenhum período de férias registrado.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTOS */}
          {activeTab === 'documentos' && (
            <div className="space-y-6">
              {/* Dossiê em Massa Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Archive className="w-4 h-4 text-blue-600" />
                    Dossiê Funcional & Contratual Unificado (.ZIP)
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Baixe em um único pacote o prontuário completo, comprovantes e todos os contratos assinados digitalmente.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const related = INITIAL_ELECTRONIC_DOCUMENTS.filter(d => d.collaboratorId === localColab.id);
                    downloadCollaboratorDossierZip(localColab, related);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Dossiê Completo (.ZIP)</span>
                </button>
              </div>

              {/* PASTA DE DOCUMENTOS DE ADMISSÃO (ACESSO RESTRITO RBAC) */}
              <div className="border border-blue-200 p-5 rounded-xl bg-blue-50/20 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-xs">Pasta: Documentos de Admissão</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-amber-700" />
                          Acesso Restrito: Apenas Colaborador, Lideranças e Analistas
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Arquivos e dados cadastrais coletados via Formulário Integrado de Admissão e fluxo do dia 25
                      </p>
                    </div>
                  </div>

                  {localColab.admissionData?.stoneStartApprovedAt && (
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Stone Start Aprovado
                    </span>
                  )}
                </div>

                {/* Lista de Documentos de Admissão */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {(localColab.admissionData?.admissionDocuments && localColab.admissionData.admissionDocuments.length > 0) ? (
                    localColab.admissionData.admissionDocuments.map((doc) => (
                      <div key={doc.id} className="p-3 rounded-lg border border-blue-200/80 flex items-center justify-between bg-white hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-7 h-7 rounded bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                            PDF
                          </div>
                          <div className="truncate">
                            <span className="font-semibold text-slate-900 block text-xs truncate">{doc.name}</span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                              <span>{doc.fileSize || '1.2 MB'}</span>
                              <span>•</span>
                              <span className="text-emerald-600 font-medium">{doc.category}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = '#';
                            link.setAttribute('download', doc.name);
                            alert(`Download do arquivo ${doc.name} iniciado.`);
                          }}
                          className="text-slate-500 hover:text-blue-600 cursor-pointer p-1.5 rounded hover:bg-slate-100 shrink-0"
                          title="Baixar arquivo da pasta de admissão"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-semibold text-slate-900 block text-xs">RG_Frente_Verso_Oficial.pdf</span>
                            <span className="text-[10px] text-slate-400">1.2 MB • Validado na Admissão</span>
                          </div>
                        </div>
                        <button className="text-slate-500 hover:text-blue-600 cursor-pointer p-1">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-semibold text-slate-900 block text-xs">Comprovante_Residencia_Atualizado.pdf</span>
                            <span className="text-[10px] text-slate-400">840 KB • Validado na Admissão</span>
                          </div>
                        </div>
                        <button className="text-slate-500 hover:text-blue-600 cursor-pointer p-1">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-semibold text-slate-900 block text-xs">Formulario_Admissao_SCL.pdf</span>
                            <span className="text-[10px] text-slate-400">520 KB • Integrado ao Perfil</span>
                          </div>
                        </div>
                        <button className="text-slate-500 hover:text-blue-600 cursor-pointer p-1">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-semibold text-slate-900 block text-xs">ASO_Admissional_Apto.pdf</span>
                            <span className="text-[10px] text-slate-400">910 KB • Atestado Médico Ocupacional</span>
                          </div>
                        </div>
                        <button className="text-slate-500 hover:text-blue-600 cursor-pointer p-1">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-xs">Outros Documentos & Anexos Funcionais</h4>
                  <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">
                    + Upload novo anexo
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <div>
                        <span className="font-semibold text-slate-900 block text-xs">Certificado_Treinamento_NR10.pdf</span>
                        <span className="text-[10px] text-slate-400">1.8 MB • Válido</span>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-blue-600 cursor-pointer p-1">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <div>
                        <span className="font-semibold text-slate-900 block text-xs">Recibo_Entrega_EPI.pdf</span>
                        <span className="text-[10px] text-slate-400">620 KB • Assinado</span>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-blue-600 cursor-pointer p-1">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Termos & Contratos Assinados Eletronicamente */}
              <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs mb-3">Contratos & Termos com Assinatura Digital</h4>
                <div className="divide-y divide-slate-100">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block">Contrato Individual de Trabalho</span>
                      <span className="text-[10px] text-emerald-600 font-medium">Assinado eletronicamente com certificado digital</span>
                    </div>
                    <button 
                      onClick={() => {
                        const related = INITIAL_ELECTRONIC_DOCUMENTS.find(d => d.collaboratorId === localColab.id && d.category === 'CONTRATO_TRABALHO') || INITIAL_ELECTRONIC_DOCUMENTS[0];
                        downloadCollaboratorDossierZip(localColab, [related]);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Baixar Documento
                    </button>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block">Acordo de Banco de Horas e Prorrogação</span>
                      <span className="text-[10px] text-emerald-600 font-medium">Assinado eletronicamente com certificado digital</span>
                    </div>
                    <button 
                      onClick={() => {
                        const related = INITIAL_ELECTRONIC_DOCUMENTS.find(d => d.collaboratorId === localColab.id && d.category === 'BANCO_HORAS') || INITIAL_ELECTRONIC_DOCUMENTS[1];
                        downloadCollaboratorDossierZip(localColab, [related]);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Baixar Documento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ADICIONAIS & SAÚDE */}
          {activeTab === 'adicionais' && (
            <div className="space-y-4">
              {/* Sub-tabs pills */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveAdicionaisSubTab('onboarding')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeAdicionaisSubTab === 'onboarding'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Onboarding
                </button>
                <button
                  onClick={() => setActiveAdicionaisSubTab('disciplinares')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeAdicionaisSubTab === 'disciplinares'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Medidas Disciplinares
                </button>
                <button
                  onClick={() => setActiveAdicionaisSubTab('epis')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeAdicionaisSubTab === 'epis'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Controle de EPI
                </button>
                <button
                  onClick={() => setActiveAdicionaisSubTab('medicos')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeAdicionaisSubTab === 'medicos'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Exames Médicos / ASO
                </button>
              </div>

              {/* Subtab Content: Onboarding */}
              {activeAdicionaisSubTab === 'onboarding' && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-slate-900 text-xs">Jornada de Onboarding & Acolhimento</h4>
                  <div className="space-y-2">
                    {localColab.onboardingChecklist && localColab.onboardingChecklist.length > 0 ? (
                      localColab.onboardingChecklist.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-medium text-slate-800 flex-1">{item.task}</span>
                          {item.date && (
                            <span className="text-[10px] text-slate-400 font-mono">{formatDateBR(item.date)}</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic text-[11px]">Nenhuma etapa de onboarding registrada.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Subtab Content: Disciplinares */}
              {activeAdicionaisSubTab === 'disciplinares' && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs">Histórico Disciplinar</h4>
                    <button className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">
                      + Registrar advertência
                    </button>
                  </div>
                  {localColab.disciplinaryActions && localColab.disciplinaryActions.length > 0 ? (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg p-3">
                      {localColab.disciplinaryActions.map((act) => (
                        <div key={act.id} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 block">{act.type}</span>
                            <span className="text-[10px] text-slate-500">{act.reason}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{formatDateBR(act.date)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-500">
                      Nenhuma advertência ou medida disciplinar registrada. Colaborador exemplar.
                    </div>
                  )}
                </div>
              )}

              {/* Subtab Content: EPIs */}
              {activeAdicionaisSubTab === 'epis' && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs">Equipamentos de Proteção Individual (EPI)</h4>
                    <button className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">
                      + Nova Ficha de EPI
                    </button>
                  </div>
                  {localColab.epis && localColab.epis.length > 0 ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-2.5">Equipamento</th>
                            <th className="p-2.5">Nº C.A.</th>
                            <th className="p-2.5">Data Entrega</th>
                            <th className="p-2.5">Validade</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {localColab.epis.map((epi) => (
                            <tr key={epi.id} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-medium text-slate-900">{epi.name}</td>
                              <td className="p-2.5 font-mono text-slate-600">{epi.caNumber}</td>
                              <td className="p-2.5 font-mono text-slate-500">{formatDateBR(epi.deliveryDate)}</td>
                              <td className="p-2.5 font-mono text-slate-500">{formatDateBR(epi.expirationDate)}</td>
                              <td className="p-2.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  epi.status === 'VALIDO'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {epi.status === 'VALIDO' ? 'Válido' : 'A vencer'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-500">
                      Função sem exigência de EPI de campo obrigatório.
                    </div>
                  )}
                </div>
              )}

              {/* Subtab Content: Exames Médicos / ASO */}
              {activeAdicionaisSubTab === 'medicos' && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs">Atestados de Saúde Ocupacional (ASO)</h4>
                    <button className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">
                      + Agendar ASO
                    </button>
                  </div>
                  {localColab.medicalExams && localColab.medicalExams.length > 0 ? (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-2.5">Tipo de Exame</th>
                            <th className="p-2.5">Data Realização</th>
                            <th className="p-2.5">Validade</th>
                            <th className="p-2.5">Clínica Credenciada</th>
                            <th className="p-2.5">Resultado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {localColab.medicalExams.map((exam) => (
                            <tr key={exam.id} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-medium text-slate-900">{exam.type}</td>
                              <td className="p-2.5 font-mono text-slate-500">{formatDateBR(exam.examDate)}</td>
                              <td className="p-2.5 font-mono text-slate-500">{formatDateBR(exam.validUntil)}</td>
                              <td className="p-2.5 text-slate-600">{exam.clinicName}</td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  {exam.result}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-500">
                      Nenhum exame médico ocupacional registrado.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-8 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar Cadastro Completo
            </button>

            <button 
              onClick={() => {
                const phoneClean = localColab.phone.replace(/\D/g, '');
                window.open(`https://wa.me/55${phoneClean}`, '_blank');
              }}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Fechar Prontuário
          </button>
        </div>
      </div>

      {/* Modal de Edição de Dados do Colaborador */}
      <EditCollaboratorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        collaborator={localColab}
        onSave={handleUpdate}
      />

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              Excluir Cadastro do Colaborador?
            </h3>
            <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
              Tem certeza que deseja excluir o cadastro de <strong className="text-slate-900">{localColab.fullName}</strong> (CPF: {localColab.cpf})? 
              Essa ação removerá o colaborador do quadro e corrigirá duplicidades.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-confirm-delete-colab"
                onClick={() => {
                  if (onDeleteCollaborator) {
                    onDeleteCollaborator(localColab.id);
                  }
                  setIsDeleteModalOpen(false);
                  onClose();
                }}
                className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sim, Excluir Cadastro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
