import React from 'react';
import { EmploymentStatus, ContractType } from '../../types/organization';

export const StatusPill: React.FC<{ status: EmploymentStatus | string }> = ({ status }) => {
  switch (status) {
    case 'ATIVO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Ativo
        </span>
      );
    case 'FERIAS':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Em Férias
        </span>
      );
    case 'AFASTADO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Afastado (INSS/Licença)
        </span>
      );
    case 'AVISO_PREVIO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          Aviso Prévio
        </span>
      );
    case 'DESLIGADO':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Desligado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700">
          {status}
        </span>
      );
  }
};

export const ContractPill: React.FC<{ type: ContractType }> = ({ type }) => {
  const styles: Record<ContractType, string> = {
    CLT: 'bg-blue-50 text-blue-700 border-blue-200',
    PJ: 'bg-violet-50 text-violet-700 border-violet-200',
    ESTAGIO: 'bg-teal-50 text-teal-700 border-teal-200',
    APRENDIZ: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    TEMPORARIO: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    RPA: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  return (
    <span className={`inline-flex font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${styles[type] || 'bg-slate-100 text-slate-700'}`}>
      {type}
    </span>
  );
};
