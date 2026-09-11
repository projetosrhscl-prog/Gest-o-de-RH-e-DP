import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  Download, 
  Plus, 
  CheckCircle2, 
  Printer, 
  Search, 
  Building, 
  Calculator,
  X
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface RPARecord {
  id: string;
  contractorName: string;
  cpfCnpj: string;
  serviceDescription: string;
  branchName: string;
  issueDate: string;
  grossValue: number;
  inssRetained: number; // 11%
  irrfRetained: number;
  issRetained: number; // 5%
  netValue: number;
  status: 'EMITIDO' | 'PAGO';
}

export const ContratosRPAView: React.FC = () => {
  const { logAction } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewRPAModalOpen, setIsNewRPAModalOpen] = useState(false);

  const [rpaList, setRpaList] = useState<RPARecord[]>([
    {
      id: 'rpa-001',
      contractorName: 'Dr. Marcos Aurélio Santana (Médico do Trabalho)',
      cpfCnpj: '412.981.002-99',
      serviceDescription: 'Coordenação e Emissão do PCMSO e ASOs Periódicos',
      branchName: 'Patos - PB',
      issueDate: '2026-08-15',
      grossValue: 4500.00,
      inssRetained: 495.00,
      irrfRetained: 280.50,
      issRetained: 225.00,
      netValue: 3499.50,
      status: 'PAGO'
    },
    {
      id: 'rpa-002',
      contractorName: 'Eng. Renato Siqueira (Engenheiro de Segurança)',
      cpfCnpj: '519.821.332-11',
      serviceDescription: 'Laudo Técnico de Condições Ambientais (LTCAT NR-15/16)',
      branchName: 'Paracatu - MG',
      issueDate: '2026-08-18',
      grossValue: 6200.00,
      inssRetained: 682.00,
      irrfRetained: 610.20,
      issRetained: 310.00,
      netValue: 4597.80,
      status: 'EMITIDO'
    }
  ]);

  // Form State
  const [contractorName, setContractorName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [grossValue, setGrossValue] = useState(5000);
  const [branchName, setBranchName] = useState('Patos - PB');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleCreateRPA = (e: React.FormEvent) => {
    e.preventDefault();
    const gross = Number(grossValue);
    const inss = gross * 0.11;
    const irrf = gross * 0.075;
    const iss = gross * 0.05;
    const net = gross - inss - irrf - iss;

    const newRPA: RPARecord = {
      id: `rpa-${Date.now()}`,
      contractorName: contractorName || 'Prestador Autônomo',
      cpfCnpj: cpfCnpj || '000.000.000-00',
      serviceDescription: serviceDescription || 'Serviços Técnicos Especializados',
      branchName: branchName,
      issueDate: new Date().toISOString().slice(0, 10),
      grossValue: gross,
      inssRetained: inss,
      irrfRetained: irrf,
      issRetained: iss,
      netValue: net,
      status: 'EMITIDO'
    };

    setRpaList([newRPA, ...rpaList]);
    setIsNewRPAModalOpen(false);
    logAction('CREATE', 'RPA', newRPA.id, `Emitiu RPA para ${newRPA.contractorName} valor ${formatCurrency(gross)}`);
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Emissão de RPA (Recibo de Pagamento a Autônomo)</h2>
          <p className="text-xs text-slate-500">Gestão de prestadores avulsos com cálculo de retenções tributárias</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar prestador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setIsNewRPAModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Emitir Novo RPA</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Prestador Autônomo</th>
              <th className="py-3 px-3">Serviço Prestado</th>
              <th className="py-3 px-3">Unidade</th>
              <th className="py-3 px-3">Valor Bruto</th>
              <th className="py-3 px-3">Retenções (INSS / IRRF / ISS)</th>
              <th className="py-3 px-3">Valor Líquido</th>
              <th className="py-3 px-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rpaList
              .filter(r => r.contractorName.toLowerCase().includes(searchTerm.toLowerCase()) || r.cpfCnpj.includes(searchTerm))
              .map((rpa) => (
                <tr key={rpa.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{rpa.contractorName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">CPF/CNPJ: {rpa.cpfCnpj}</div>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-700 max-w-xs">
                    {rpa.serviceDescription}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">
                    {rpa.branchName}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    {formatCurrency(rpa.grossValue)}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-rose-600">
                    -{formatCurrency(rpa.inssRetained + rpa.irrfRetained + rpa.issRetained)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-700 bg-emerald-50/40">
                    {formatCurrency(rpa.netValue)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => alert(`Imprimindo RPA nº ${rpa.id} para ${rpa.contractorName}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir</span>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal Emitir RPA */}
      {isNewRPAModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Emitir Recibo de Pagamento a Autônomo (RPA)</h3>
              <button onClick={() => setIsNewRPAModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateRPA} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Prestador *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Roberto Alencar"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CPF do Prestador</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Valor Bruto (R$)</label>
                  <input
                    type="number"
                    value={grossValue}
                    onChange={(e) => setGrossValue(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição do Serviço</label>
                <textarea
                  rows={2}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Ex: Consultoria técnica em usinas fotovoltaicas..."
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Retenções Tributárias Automáticas:</div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>INSS (11%): -{formatCurrency(grossValue * 0.11)}</span>
                  <span>IRRF (7.5%): -{formatCurrency(grossValue * 0.075)}</span>
                  <span>ISS (5%): -{formatCurrency(grossValue * 0.05)}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRPAModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
                >
                  Emitir e Gerar Recibo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
