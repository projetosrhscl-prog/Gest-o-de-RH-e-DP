import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Calendar, 
  Building2, 
  MapPin, 
  DollarSign, 
  Mail, 
  Phone, 
  Clock, 
  Sparkles, 
  Check, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { INITIAL_BRANCHES, INITIAL_DEPARTMENTS, INITIAL_POSITIONS } from '../../data/mockData';
import { calcularDiasTrabalhadosNoMes } from '../../utils/admissaoStorage';
import { ProcessoAdmissaoCompleto } from '../../types/admissao';
import { calcularDataTerminoExperiencia, formatarDataBR } from '../../utils/documentosOnboardingHelper';

interface NovoColaboradorAdmissaoModalProps {
  onClose: () => void;
  onAddColaborador: (dados: Partial<ProcessoAdmissaoCompleto>) => void;
}

export const NovoColaboradorAdmissaoModal: React.FC<NovoColaboradorAdmissaoModalProps> = ({
  onClose,
  onAddColaborador
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargo, setCargo] = useState('Operador de Estação Solar');
  const [poloId, setPoloId] = useState(INITIAL_BRANCHES[0].id);
  const [departamento, setDepartamento] = useState('Operações de Campo');
  const [salario, setSalario] = useState(2200);
  const [dataInicio, setDataInicio] = useState(todayStr);
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [autoDispararPrevia, setAutoDispararPrevia] = useState(true);

  const apuracao = calcularDiasTrabalhadosNoMes(dataInicio);
  const dataFimExperiencia = calcularDataTerminoExperiencia(dataInicio, 90);

  const handleCpfChange = (val: string) => {
    let raw = val.replace(/\D/g, '').substring(0, 11);
    let formatted = raw;
    if (raw.length > 9) {
      formatted = raw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (raw.length > 6) {
      formatted = raw.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (raw.length > 3) {
      formatted = raw.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    setCpf(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const poloObj = INITIAL_BRANCHES.find(b => b.id === poloId) || INITIAL_BRANCHES[0];

    onAddColaborador({
      candidatoNome: nome.trim(),
      cpf: cpf.trim() || '000.000.000-00',
      cargo,
      poloId: poloObj.id,
      poloNome: poloObj.name,
      departamento,
      salarioPrevisto: Number(salario) || 2000,
      dataInicioAtividades: dataInicio,
      email: email.trim(),
      telefoneWhatsApp: telefone.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Adicionar Novo Colaborador (Etapa 1)</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Inicia o fluxo oficial de admissão SCL com agendamento automático de documentos
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Apuração Proporcional & Disparos Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-linear-to-r from-blue-50 to-indigo-50/60 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {apuracao.diasTrabalhados}d
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-950 block">
                    Dias no 1º Mês ({apuracao.mesAno})
                  </span>
                  <span className="text-[10px] text-blue-800">
                    Envio dia 25 ao contador da folha
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-linear-to-r from-amber-50 to-orange-50/60 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  90d
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-950 block">
                    Término da Experiência
                  </span>
                  <span className="text-[10px] text-amber-800">
                    {formatarDataBR(dataFimExperiencia)} (Contrato Definitivo)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dados Pessoais Básicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo do Colaborador *</label>
              <input
                type="text"
                required
                placeholder="Ex: João Pereira da Silva"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">CPF *</label>
              <input
                type="text"
                required
                placeholder="000.000.000-00"
                value={cpf}
                onChange={e => handleCpfChange(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
              />
            </div>
          </div>

          {/* Alocação e Cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Polo / Unidade *</label>
              <select
                value={poloId}
                onChange={e => setPoloId(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
              >
                {INITIAL_BRANCHES.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo Previsto *</label>
              <select
                value={cargo}
                onChange={e => setCargo(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
              >
                <option value="Operador de Estação Solar">Operador de Estação Solar</option>
                <option value="Técnica em Eletrotécnica">Técnica em Eletrotécnica</option>
                <option value="Assistente Administrativo">Assistente Administrativo</option>
                <option value="Especialista em O&M">Especialista em O&M</option>
                <option value="Supervisor de Operações">Supervisor de Operações</option>
                <option value="Consultor Comercial">Consultor Comercial</option>
                <option value="Analista de DP">Analista de DP</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">1º Dia de Onboarding (Início) *</label>
              <input
                type="date"
                required
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
              />
            </div>
          </div>

          {/* Salário e Contato */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Salário Base (R$) *</label>
              <input
                type="number"
                step="50"
                required
                value={salario}
                onChange={e => setSalario(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail do Candidato *</label>
              <input
                type="email"
                required
                placeholder="candidato@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
              <input
                type="text"
                required
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-blue-500"
              />
            </div>
          </div>

          {/* Automação de Disparo Programada */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Disparos Automáticos Programados pelo Sistema:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-amber-700 block">🚀 1º Dia de Onboarding ({formatarDataBR(dataInicio)}):</span>
                <p className="text-[10px] text-slate-500">
                  • Contrato de Experiência (45+45d CLT)<br/>
                  • Renúncia do Vale Transporte<br/>
                  • Manual de Conduta e Ética SCL
                </p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                <span className="font-bold text-blue-700 block">🎯 Fim da Experiência ({formatarDataBR(dataFimExperiencia)}):</span>
                <p className="text-[10px] text-slate-500">
                  • Contrato de Trabalho Definitivo (Efetivação por Prazo Indeterminado)
                </p>
              </div>
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Cadastrar & Programar Disparos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
