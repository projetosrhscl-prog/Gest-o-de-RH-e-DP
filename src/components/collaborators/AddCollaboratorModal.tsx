import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Briefcase, 
  FileCheck, 
  Send, 
  Check, 
  Sparkles, 
  Building,
  Smartphone,
  Mail,
  Calendar,
  DollarSign,
  Camera,
  UploadCloud,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { CompanyBranch } from '../../types/auth';
import { Department, JobPosition } from '../../types/organization';
import { CollaboratorProfile, ContractType } from '../../types/collaborator';
import { 
  getStoredCollaborators, 
  normalizeCollaboratorName, 
  normalizeCollaboratorCpf 
} from '../../utils/collaboratorsStorage';

interface AddCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: CompanyBranch[];
  departments: Department[];
  positions: JobPosition[];
  onSave: (newColab: CollaboratorProfile) => void;
}

export const AddCollaboratorModal: React.FC<AddCollaboratorModalProps> = ({
  isOpen,
  onClose,
  branches,
  departments,
  positions,
  onSave
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('1995-05-10');

  // Step 2
  const [admissionDate, setAdmissionDate] = useState('2026-09-01');
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || 'op-patos');
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || 'dept-1');
  const [selectedPosId, setSelectedPosId] = useState(positions[0]?.id || 'pos-1');
  const [directSupervisor, setDirectSupervisor] = useState('Mariana Silveira');
  const [salary, setSalary] = useState(4850);
  const [contractType, setContractType] = useState<ContractType>('CLT');
  const [paymentMethod, setPaymentMethod] = useState<'TRANSFERENCIA_BANCARIA' | 'PIX'>('TRANSFERENCIA_BANCARIA');

  // Step 3
  const [deliveryChannel, setDeliveryChannel] = useState<'WHATSAPP' | 'EMAIL'>('WHATSAPP');
  const [generateContract, setGenerateContract] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      const allColabs = getStoredCollaborators();
      const nName = normalizeCollaboratorName(fullName);
      const nCpf = normalizeCollaboratorCpf(cpf);

      const existing = allColabs.find(c => 
        (nName && normalizeCollaboratorName(c.fullName) === nName) || 
        (nCpf && normalizeCollaboratorCpf(c.cpf) === nCpf)
      );

      if (existing) {
        setDuplicateWarning(`Já existe um colaborador cadastrado com o nome "${existing.fullName}" (Polo: ${existing.branchName}, Cargo: ${existing.positionTitle}). O sistema bloqueia duplicatas de nome.`);
        return;
      }

      setDuplicateWarning(null);
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    const branch = branches.find(b => b.id === selectedBranchId) || branches[0];
    const dept = departments.find(d => d.id === selectedDeptId) || departments[0];
    const pos = positions.find(p => p.id === selectedPosId) || positions[0];

    const newCollaborator: CollaboratorProfile = {
      id: `colab-${Date.now()}`,
      registrationNumber: `SCL-0${Math.floor(1000 + Math.random() * 9000)}`,
      cpf: cpf || '123.456.789-00',
      rg: '3.812.990',
      rgIssuer: 'SSP',
      fullName: fullName || 'Novo Colaborador',
      preferredName: fullName.split(' ')[0] || 'Colaborador',
      email: email || 'colaborador@scloperacoes.com.br',
      phone: phone || '(83) 98888-0000',
      avatarUrl: '',
      bio: 'Colaborador admitido no sistema SCL.',
      skills: ['Comunicação', 'Trabalho em Equipe'],
      branchId: branch.id,
      branchName: branch.name,
      departmentId: dept.id,
      departmentName: dept.name,
      costCenter: dept.costCenter,
      positionId: pos.id,
      positionTitle: pos.title,
      seniority: pos.level as any,
      directSupervisor: directSupervisor,
      admissionDate: admissionDate,
      contractType: contractType,
      status: 'EM_ATIVIDADE',
      salary: Number(salary),
      paymentMethod: paymentMethod,
      workSchedule: '44h semanais (08:00 às 17:48)',
      personalData: {
        birthDate: birthDate,
        gender: 'Não informado',
        maritalStatus: 'Solteiro(a)',
        nationality: 'Brasileira',
        address: {
          street: 'Avenida Principal',
          number: '100',
          neighborhood: 'Centro',
          city: branch.city,
          state: branch.state,
          zipCode: '58700-000'
        },
        emergencyContact: {
          name: 'Contato de Emergência',
          phone: phone,
          relationship: 'Familiar'
        }
      },
      bankAccount: {
        bankName: 'Banco do Brasil',
        bankCode: '001',
        agency: '1001',
        accountNumber: '12345-6',
        accountType: 'CORRENTE'
      },
      dependents: [],
      benefits: [
        { id: 'b-1', name: 'Vale Alimentação', type: 'VA', monthlyValue: 850, discountPercentage: 5, provider: 'Caju', status: 'ATIVO' },
        { id: 'b-2', name: 'Vale Transporte', type: 'VT', monthlyValue: 220, discountPercentage: 6, provider: 'Sindicato', status: 'ATIVO' }
      ],
      careerHistory: [
        { id: 'ch-1', positionTitle: pos.title, departmentName: dept.name, salary: Number(salary), startDate: admissionDate, reason: 'ADMISSAO' }
      ],
      vacationPeriods: [
        {
          id: 'vac-1',
          startDate: admissionDate,
          endDate: '2027-08-31',
          limitConcessionDate: '2027-07-31',
          totalDays: 30,
          takenDays: 0,
          plannedDays: 0,
          abonoDays: 0,
          remainingBalance: 30,
          status: 'ADQUIRINDO'
        }
      ],
      epis: [],
      disciplinaryActions: [],
      medicalExams: [
        { id: 'med-1', type: 'ADMISSIONAL', examDate: admissionDate, validUntil: '2027-09-01', clinicName: 'Clínica Credenciada', result: 'APTO', status: 'EM_DIA' }
      ],
      onboardingChecklist: [
        { task: 'Admissão cadastrada', completed: true, date: admissionDate },
        { task: 'Envio de convite digital para documentos', completed: true, date: admissionDate }
      ]
    };

    onSave(newCollaborator);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Adicionar Pessoa / Admissão Digital
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cadastre dados básicos e envie o link de onboarding para assinatura digital
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        {!isSuccess && (
          <div className="px-6 pt-4 pb-2 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  1
                </span>
                <span>Dados Pessoais</span>
              </div>
              <div className="h-0.5 w-12 bg-slate-200" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  2
                </span>
                <span>Profissional</span>
              </div>
              <div className="h-0.5 w-12 bg-slate-200" />
              <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  3
                </span>
                <span>Contratos & Opções</span>
              </div>
            </div>
          </div>
        )}

        {/* Form Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Colaborador Cadastrado com Sucesso!
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              O perfil 360° foi criado no sistema. O link para preenchimento de documentos e assinatura digital do contrato foi enviado via <strong>{deliveryChannel === 'WHATSAPP' ? 'WhatsApp' : 'E-mail'}</strong>.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Concluir e Ver no Diretório
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* STEP 1: PESSOAL */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-100">
                {duplicateWarning && (
                  <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-start gap-2.5 shadow-2xs animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1 leading-relaxed">
                      <strong className="block font-bold text-rose-950">Cadastro Duplicado Detectado</strong>
                      <span>{duplicateWarning}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (duplicateWarning) setDuplicateWarning(null);
                    }}
                    placeholder="Ex: João da Silva Santos"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      E-mail Principal *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="joao.silva@scloperacoes.com.br"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Telefone Celular (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(83) 98888-7777"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      required
                      value={cpf}
                      onChange={(e) => {
                        setCpf(e.target.value);
                        if (duplicateWarning) setDuplicateWarning(null);
                      }}
                      placeholder="123.456.789-00"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROFISSIONAL */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Operação / Polo SCL *
                    </label>
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Data de Admissão *
                    </label>
                    <input
                      type="date"
                      required
                      value={admissionDate}
                      onChange={(e) => setAdmissionDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Área / Departamento *
                    </label>
                    <select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Cargo *
                    </label>
                    <select
                      value={selectedPosId}
                      onChange={(e) => setSelectedPosId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {positions.map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.level})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Vínculo
                    </label>
                    <select
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="CLT">CLT</option>
                      <option value="RPA">RPA</option>
                      <option value="ESTAGIO">Estágio</option>
                      <option value="INTERMITENTE">Intermitente</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Salário Inicial (R$) *
                    </label>
                    <input
                      type="number"
                      required
                      value={salary}
                      onChange={(e) => setSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Líder Direto
                    </label>
                    <input
                      type="text"
                      value={directSupervisor}
                      onChange={(e) => setDirectSupervisor(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: CONTRATOS & OPÇÕES */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-100">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-950 space-y-2">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Automação de Admissão Digital
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ao confirmar, o sistema gera o contrato de trabalho correspondente e envia uma notificação instantânea para o colaborador preencher os dados complementares e assinar eletronicamente.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block font-semibold text-slate-800">
                    Canal de envio para assinatura eletrônica:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setDeliveryChannel('WHATSAPP')}
                      className={`p-3 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-all ${
                        deliveryChannel === 'WHATSAPP'
                          ? 'border-blue-600 bg-blue-50/40 font-semibold text-blue-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-xs block">WhatsApp</span>
                        <span className="text-[10px] text-slate-400 font-normal">Envio via link seguro</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setDeliveryChannel('EMAIL')}
                      className={`p-3 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-all ${
                        deliveryChannel === 'EMAIL'
                          ? 'border-blue-600 bg-blue-50/40 font-semibold text-blue-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-xs block">E-mail</span>
                        <span className="text-[10px] text-slate-400 font-normal">Envio com token criptografado</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generateContract}
                      onChange={(e) => setGenerateContract(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs">Gerar automaticamente termo de responsabilidade de EPI e Banco de Horas</span>
                  </label>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Voltar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {step < 3 ? 'Próximo' : 'Concluir Admissão & Disparar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
