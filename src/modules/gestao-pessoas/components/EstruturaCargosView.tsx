import React, { useState, useMemo } from 'react';
import { 
  Building, 
  Briefcase, 
  Plus, 
  Users, 
  Search, 
  ChevronRight, 
  DollarSign, 
  ShieldCheck, 
  FileText,
  X,
  CheckCircle2,
  Crown,
  Award,
  Truck,
  Building2,
  UserCheck,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Department, JobPosition } from '../../../types/organization';
import { INITIAL_DEPARTMENTS, INITIAL_POSITIONS } from '../../../data/mockData';
import { useAuth } from '../../../context/AuthContext';
import { useStoredCollaborators } from '../../../utils/collaboratorsStorage';

export const EstruturaCargosView: React.FC = () => {
  const { logAction } = useAuth();
  const { collaborators } = useStoredCollaborators();
  const [activeTab, setActiveTab] = useState<'departamentos' | 'cargos'>('departamentos');

  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [positions, setPositions] = useState<JobPosition[]>(INITIAL_POSITIONS);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [isAddPosModalOpen, setIsAddPosModalOpen] = useState(false);

  // New Dept Form
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCostCenter, setNewDeptCostCenter] = useState('CC-');
  const [newDeptManager, setNewDeptManager] = useState('');

  // New Pos Form
  const [newPosTitle, setNewPosTitle] = useState('');
  const [newPosCbo, setNewPosCbo] = useState('');
  const [newPosLevel, setNewPosLevel] = useState<'Júnior' | 'Pleno' | 'Sênior' | 'Especialista' | 'Coordenação' | 'Gerência' | 'Diretoria' | 'Operacional'>('Pleno');
  const [newPosMin, setNewPosMin] = useState(4500);
  const [newPosMax, setNewPosMax] = useState(7500);

  // Leadership definitions
  const commercialSocios = [
    { name: 'Gilvan Dantas Junior', role: 'Sócio do Polo Apodi', polo: 'Polo Apodi', city: 'Apodi/RN' },
    { name: 'Ridon Dantas Borges Filho', role: 'Sócio do Polo João Câmara', polo: 'Polo João Câmara', city: 'João Câmara/RN' },
    { name: 'Carlos Eduardo Maciel de Souza', role: 'Sócio do Polo Limoeiro do Norte', polo: 'Polo Limoeiro do Norte', city: 'Limoeiro do Norte/CE' },
    { name: 'Sérgio Fernandes Mendonça Filho', role: 'Sócio do Polo Paracatu', polo: 'Polo Paracatu', city: 'Paracatu/MG' },
    { name: 'Paulo Campelo da Silva Neto', role: 'Sócio do Polo Parelhas', polo: 'Polo Parelhas', city: 'Parelhas/RN' },
    { name: 'Uderlan Rodrigues de França', role: 'Sócio do Polo Patos', polo: 'Polo Patos', city: 'Patos/PB' },
    { name: 'Fernanda Letícia de Vasconcelos Medeiros', role: 'Sócia do Polo Trairi', polo: 'Polo Trairi', city: 'Trairi/CE' }
  ];

  const commercialCoordinators = [
    { name: 'Mateus Cavalcante Ramos', role: 'Coordenador(a) Comercial do Polo Limoeiro do Norte', polo: 'Polo Limoeiro do Norte', city: 'Limoeiro do Norte/CE' },
    { name: 'Denyeivisson da Silva Freire', role: 'Coordenador(a) Comercial do Polo João Câmara', polo: 'Polo João Câmara', city: 'João Câmara/RN' },
    { name: 'Luciana Azevedo do Nascimento', role: 'Coordenadora Comercial do Polo Parelhas', polo: 'Polo Parelhas', city: 'Parelhas/RN' }
  ];

  const logisticLeaders = [
    { name: 'José Lenildo Barbosa Leite da Silva', role: 'Coordenador Logístico', polo: 'Geral / Polo Patos', city: 'Patos/PB' }
  ];

  const internalTeam = [
    { name: 'Aysla Candeia Mendes', role: 'Analista de Gestão & Pessoas', polo: 'Sede / Polo Patos', city: 'Patos/PB' },
    { name: 'Nallanda Lorena Silva de Araujo', role: 'Analista Adm-Financeiro', polo: 'Sede / Polo João Câmara', city: 'João Câmara/RN' }
  ];

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Department = {
      id: `dept-${Date.now()}`,
      code: '',
      name: newDeptName || 'Novo Departamento',
      costCenter: newDeptCostCenter || 'CC-1050',
      managerName: newDeptManager || 'Gestor Responsável',
      activeCount: 0
    };
    setDepartments([...departments, created]);
    setIsAddDeptModalOpen(false);
    setNewDeptName('');
    logAction('CREATE', 'Departamento', created.id, `Criou departamento ${created.name}`);
  };

  const handleCreatePos = (e: React.FormEvent) => {
    e.preventDefault();
    const created: JobPosition = {
      id: `pos-${Date.now()}`,
      code: `POS-${Math.floor(100 + Math.random() * 900)}`,
      title: newPosTitle || 'Novo Cargo',
      cboCode: newPosCbo || '4110-05',
      salaryRangeMin: Number(newPosMin),
      salaryRangeMax: Number(newPosMax),
      level: newPosLevel
    };
    setPositions([...positions, created]);
    setIsAddPosModalOpen(false);
    setNewPosTitle('');
    setNewPosCbo('');
    logAction('CREATE', 'Cargo', created.id, `Criou cargo ${created.title} (CBO: ${created.cboCode})`);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-5">
      {/* Sub Tab Switcher & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('departamentos')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'departamentos'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Estrutura Organizacional & Lideranças
          </button>
          <button
            onClick={() => setActiveTab('cargos')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'cargos'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cargos & Faixas Salariais ({positions.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'departamentos' ? "Buscar departamento ou líder..." : "Buscar cargo ou CBO..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/90 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {activeTab === 'departamentos' ? (
            <button
              onClick={() => setIsAddDeptModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Departamento</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddPosModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer shrink-0 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Novo Cargo</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'departamentos' ? (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Área Comercial</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-slate-900">
                    {collaborators.filter(c => c.departmentId === 'dept-comercial' || c.departmentName === 'Comercial').length} pessoas
                  </span>
                  <span className="text-xs text-blue-600 font-semibold">7 Sócios • 3 Coord.</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Área Logística</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-slate-900">
                    {collaborators.filter(c => c.departmentId === 'dept-logistica' || c.departmentName === 'Logística').length} pessoas
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold">1 Coord. • Green Angels</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Área Interno</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold text-slate-900">
                    {collaborators.filter(c => c.departmentId === 'dept-interno' || c.departmentName === 'Interno').length} pessoas
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Sem gestor da área</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* 1. DEPARTAMENTO COMERCIAL */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Comercial</h3>
                  <p className="text-xs text-slate-500">
                    Gestão de Polos, Prospecção e Relacionamento Comercial Stone
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  Centro de Custo: CC-3010
                </span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/80">
                  {collaborators.filter(c => c.departmentId === 'dept-comercial' || c.departmentName === 'Comercial').length} Colaboradores
                </span>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* Sócios Comerciais */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Sócios(as) dos Polos (7 lideranças)
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {commercialSocios.map((socio, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-lg border border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/60 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded">
                            Sócio(a)
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {socio.city}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs mt-1">
                          {socio.name}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                          {socio.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coordenadores Comerciais */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Coordenadores(as) Comerciais (3 lideranças)
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {commercialCoordinators.map((coord, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-lg border border-blue-200/80 bg-blue-50/30 hover:bg-blue-50/60 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                            Coordenação
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {coord.city}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-xs mt-1">
                          {coord.name}
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                          {coord.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipe Operacional Comercial */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Equipe Comercial de Campo
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Agentes Comerciais Externos alocados nos 8 polos operacionais
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. DEPARTAMENTO LOGÍSTICA */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Logística</h3>
                  <p className="text-xs text-slate-500">
                    Operações Técnicas, Instalação de POS, Green Angels e Logística Reversa
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  Centro de Custo: CC-2040
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                  {collaborators.filter(c => c.departmentId === 'dept-logistica' || c.departmentName === 'Logística').length} Colaboradores
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Coordenação Logística
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {logisticLeaders.map((lead, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-lg border border-emerald-200/80 bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Coordenação Logística
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {lead.city}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-1">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                        {lead.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Green Angels (Operadores Logísticos) & Estágio
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Green Angels alocados nos polos operacionais para atendimento Stone
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. DEPARTAMENTO INTERNO */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-xs">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Interno</h3>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Sem gestor da área
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Gestão & Pessoas, Administração, Financeiro e Backoffice
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  Centro de Custo: CC-1010
                </span>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200/80">
                  {collaborators.filter(c => c.departmentId === 'dept-interno' || c.departmentName === 'Interno').length} Colaboradores
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Equipe Interna de Apoio & Especialistas
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {internalTeam.map((member, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-lg border border-purple-200/80 bg-purple-50/30 hover:bg-purple-50/60 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">
                        Analista Pleno
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {member.city}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mt-1">
                      {member.name}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                      {member.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Cargo</th>
                <th className="py-3 px-3">CBO Oficial (MTE)</th>
                <th className="py-3 px-3">Senioridade / Nível</th>
                <th className="py-3 px-3">Faixa Salarial (Piso - Teto)</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {positions
                .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.cboCode.includes(searchTerm))
                .map((pos) => (
                  <tr key={pos.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{pos.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {pos.level === 'Diretoria' ? 'Governança & Sócios' : pos.level === 'Coordenação' ? 'Liderança Tática' : 'Quadro Regular'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold border border-slate-200">
                        <FileText className="w-3 h-3 text-slate-400" />
                        {pos.cboCode}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {pos.level}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono font-medium text-slate-800">
                        {formatCurrency(pos.salaryRangeMin)} - {formatCurrency(pos.salaryRangeMax)}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Homologado
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Add Departamento */}
      {isAddDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Criar Novo Departamento</h3>
              <button onClick={() => setIsAddDeptModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDept} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Departamento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Operações & Manutenção"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Centro de Custo</label>
                <input
                  type="text"
                  placeholder="Ex: CC-4010"
                  value={newDeptCostCenter}
                  onChange={(e) => setNewDeptCostCenter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gestor / Liderança Responsável</label>
                <input
                  type="text"
                  placeholder="Ex: Nome da liderança"
                  value={newDeptManager}
                  onChange={(e) => setNewDeptManager(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDeptModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Salvar Departamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Cargo */}
      {isAddPosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Cadastrar Novo Cargo</h3>
              <button onClick={() => setIsAddPosModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePos} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título do Cargo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Supervisor Comercial"
                  value={newPosTitle}
                  onChange={(e) => setNewPosTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CBO Oficial (MTE)</label>
                  <input
                    type="text"
                    placeholder="Ex: 3541-25"
                    value={newPosCbo}
                    onChange={(e) => setNewPosCbo(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Senioridade</label>
                  <select
                    value={newPosLevel}
                    onChange={(e) => setNewPosLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operacional">Operacional</option>
                    <option value="Júnior">Júnior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
                    <option value="Coordenação">Coordenação</option>
                    <option value="Gerência">Gerência</option>
                    <option value="Diretoria">Diretoria</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Piso Salarial (R$)</label>
                  <input
                    type="number"
                    value={newPosMin}
                    onChange={(e) => setNewPosMin(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teto Salarial (R$)</label>
                  <input
                    type="number"
                    value={newPosMax}
                    onChange={(e) => setNewPosMax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPosModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Salvar Cargo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
