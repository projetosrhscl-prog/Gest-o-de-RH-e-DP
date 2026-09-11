import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  MapPin, 
  CreditCard, 
  Save, 
  Check, 
  Camera, 
  UploadCloud, 
  AlertCircle,
  Building,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  HeartHandshake,
  FileCheck
} from 'lucide-react';
import { 
  CollaboratorProfile, 
  EmploymentStatus, 
  ContractType 
} from '../../types/collaborator';
import { INITIAL_BRANCHES, INITIAL_DEPARTMENTS, INITIAL_POSITIONS } from '../../data/mockData';
import { sanitizeCollaboratorProfile } from '../../utils/collaboratorDefaults';

interface EditCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborator: CollaboratorProfile | null;
  onSave: (updated: CollaboratorProfile) => void;
}

export const EditCollaboratorModal: React.FC<EditCollaboratorModalProps> = ({
  isOpen,
  onClose,
  collaborator,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'pessoal' | 'endereco' | 'profissional' | 'bancario'>('pessoal');
  const [formData, setFormData] = useState<CollaboratorProfile | null>(null);
  const [skillsInput, setSkillsInput] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (collaborator) {
      const sanitized = sanitizeCollaboratorProfile(collaborator);
      setFormData(sanitized);
      setSkillsInput(sanitized.skills.join(', '));
    }
  }, [collaborator, isOpen]);

  if (!isOpen || !formData) return null;

  const handlePoloChange = (branchId: string) => {
    const branch = INITIAL_BRANCHES.find(b => b.id === branchId);
    if (branch) {
      setFormData((prev) => prev ? {
        ...prev,
        branchId: branch.id,
        branchName: branch.name
      } : null);
    }
  };

  const handleDepartmentChange = (deptId: string) => {
    const dept = INITIAL_DEPARTMENTS.find(d => d.id === deptId);
    if (dept) {
      setFormData((prev) => prev ? {
        ...prev,
        departmentId: dept.id,
        departmentName: dept.name,
        costCenter: dept.costCenter
      } : null);
    }
  };

  const handlePositionChange = (posId: string) => {
    const pos = INITIAL_POSITIONS.find(p => p.id === posId);
    if (pos) {
      setFormData((prev) => prev ? {
        ...prev,
        positionId: pos.id,
        positionTitle: pos.title
      } : null);
    }
  };

  const handleConfirmSave = () => {
    if (!formData) return;

    const parsedSkills = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const finalData = sanitizeCollaboratorProfile({
      ...formData,
      skills: parsedSkills.length > 0 ? parsedSkills : formData.skills
    });

    onSave(finalData);
    setShowConfirmDialog(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-2xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Editar Perfil do Colaborador</h3>
              <p className="text-[11px] text-slate-500">
                {formData.fullName} • Matrícula: <span className="font-mono font-semibold">{formData.registrationNumber}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-4 text-xs font-semibold bg-slate-50/40 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pessoal')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'pessoal'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            1. Dados Pessoais & Documentos
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('endereco')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'endereco'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            2. Contatos & Endereço
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profissional')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'profissional'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            3. Cargo & Contrato
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bancario')}
            className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'bancario'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            4. Dados Bancários
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {/* TAB 1: DADOS PESSOAIS & DOCUMENTOS */}
          {activeTab === 'pessoal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nome Social / Preferido</label>
                  <input
                    type="text"
                    value={formData.preferredName}
                    onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">RG</label>
                  <input
                    type="text"
                    value={formData.rg}
                    onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Órgão Emissor / UF</label>
                  <input
                    type="text"
                    value={formData.rgIssuer}
                    onChange={(e) => setFormData({ ...formData, rgIssuer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.personalData.birthDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalData: { ...formData.personalData, birthDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estado Civil</label>
                  <select
                    value={formData.personalData.maritalStatus}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalData: { ...formData.personalData, maritalStatus: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="União Estável">União Estável</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gênero</label>
                  <input
                    type="text"
                    value={formData.personalData.gender}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalData: { ...formData.personalData, gender: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tamanho da Camisa (Kit Polo)</label>
                  <select
                    value={formData.personalData.shirtSize || 'M'}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalData: { ...formData.personalData, shirtSize: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="PP">PP</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                    <option value="XGG">XGG</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bolo Favorito (Aniversários)</label>
                  <input
                    type="text"
                    value={formData.personalData.favoriteCake || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalData: { ...formData.personalData, favoriteCake: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ex: Chocolate com Morango, Red Velvet, Cenoura..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sobre mim (Biografia)</label>
                <textarea
                  rows={3}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Resumo da trajetória e perfil profissional..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Competências / Habilidades (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ex: Negociação, Gestão de Carteira, Excel, Liderança"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CONTATOS & ENDEREÇO */}
          {activeTab === 'endereco' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    E-mail Corporativo / Principal *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Endereço Residencial
                </h4>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Rua / Logradouro</label>
                    <input
                      type="text"
                      value={formData.personalData.address.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData,
                          address: { ...formData.personalData.address, street: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Número</label>
                    <input
                      type="text"
                      value={formData.personalData.address.number}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData,
                          address: { ...formData.personalData.address, number: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={formData.personalData.address.neighborhood}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData,
                          address: { ...formData.personalData.address, neighborhood: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={formData.personalData.address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData,
                          address: { ...formData.personalData.address, city: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">UF / Estado</label>
                    <input
                      type="text"
                      value={formData.personalData.address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData,
                          address: { ...formData.personalData.address, state: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block font-semibold text-slate-700 mb-1">CEP</label>
                  <input
                    type="text"
                    value={formData.personalData.address.zipCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      personalData: {
                        ...formData.personalData,
                        address: { ...formData.personalData.address, zipCode: e.target.value }
                      }
                    })}
                    className="w-full sm:w-1/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs mb-3 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  Contato de Emergência
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nome do Contato</label>
                    <input
                      type="text"
                      value={formData.personalData.emergencyContact.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData,
                          emergencyContact: { ...formData.personalData.emergencyContact, name: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      value={formData.personalData.emergencyContact.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData,
                          emergencyContact: { ...formData.personalData.emergencyContact, phone: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Parentesco</label>
                    <input
                      type="text"
                      value={formData.personalData.emergencyContact.relationship}
                      onChange={(e) => setFormData({
                        ...formData,
                        personalData: {
                          ...formData.personalData,
                          emergencyContact: { ...formData.personalData.emergencyContact, relationship: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARGO & CONTRATO */}
          {activeTab === 'profissional' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Matrícula *</label>
                  <input
                    type="text"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Funcional</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EmploymentStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="EM_ATIVIDADE">Em Atividade</option>
                    <option value="EM_ADMISSAO">Em Admissão</option>
                    <option value="EM_FERIAS">Em Férias</option>
                    <option value="AFASTADO">Afastado(a)</option>
                    <option value="DESLIGADO">Desligado(a)</option>
                    <option value="PENDENTE_ATUALIZACAO">Pendente Atualização</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Contrato</label>
                  <select
                    value={formData.contractType}
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value as ContractType })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="CLT">CLT (Consolidação das Leis do Trabalho)</option>
                    <option value="RPA">RPA (Recibo de Pagamento a Autônomo)</option>
                    <option value="ESTAGIO">Estágio Supervisionado</option>
                    <option value="APRENDIZ">Jovem Aprendiz</option>
                    <option value="INTERMITENTE">CLT Intermitente</option>
                    <option value="TEMPORARIO">Temporário</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Polo / Operação</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => handlePoloChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {INITIAL_BRANCHES.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Departamento</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {INITIAL_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cargo</label>
                  <select
                    value={formData.positionId}
                    onChange={(e) => handlePositionChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {INITIAL_POSITIONS.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data de Admissão</label>
                  <input
                    type="date"
                    value={formData.admissionDate}
                    onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salário Base Mensal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Líder Direto</label>
                  <input
                    type="text"
                    value={formData.directSupervisor}
                    onChange={(e) => setFormData({ ...formData, directSupervisor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Centro de Custo</label>
                  <input
                    type="text"
                    value={formData.costCenter}
                    onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jornada de Trabalho</label>
                  <input
                    type="text"
                    value={formData.workSchedule}
                    onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ex: 44h semanais (Segunda a Sexta 08:00 - 17:48)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DADOS BANCÁRIOS */}
          {activeTab === 'bancario' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nome do Banco</label>
                  <input
                    type="text"
                    value={formData.bankAccount.bankName}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount, bankName: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ex: Banco Santander, Nubank, Itaú, BB..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Código do Banco</label>
                  <input
                    type="text"
                    value={formData.bankAccount.bankCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount, bankCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Ex: 033, 260, 341..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agência</label>
                  <input
                    type="text"
                    value={formData.bankAccount.agency}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount, agency: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Número da Conta com Dígito</label>
                  <input
                    type="text"
                    value={formData.bankAccount.accountNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount, accountNumber: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Conta</label>
                  <select
                    value={formData.bankAccount.accountType}
                    onChange={(e) => setFormData({
                      ...formData,
                      bankAccount: { ...formData.bankAccount, accountType: e.target.value as any }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="CORRENTE">Conta Corrente</option>
                    <option value="POUPANCA">Conta Poupança</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chave PIX (Opcional para adiantamentos)</label>
                <input
                  type="text"
                  value={formData.bankAccount.pixKey || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    bankAccount: { ...formData.bankAccount, pixKey: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ex: CPF, E-mail, Celular ou Chave Aleatória"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmDialog(true)}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-2xs animate-in fade-in duration-100">
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-blue-600">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Confirmar Alterações do Perfil</h4>
                <p className="text-xs text-slate-500">Deseja gravar as alterações no cadastro?</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              Todas as alterações realizadas no perfil de <strong>{formData.fullName}</strong> serão sincronizadas no prontuário digital e refletirão em todos os relatórios do sistema.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Voltar e Revisar
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Sim, Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
