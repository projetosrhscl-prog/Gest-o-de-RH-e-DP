import React from 'react';
import { Layers, ArrowRight, ShieldCheck, Database, Calendar } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  plannedFeatures?: string[];
  schemaEntityPreview?: string[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  badge = 'Módulo em Fundação Técnica',
  icon,
  actionText,
  onAction,
  plannedFeatures,
  schemaEntityPreview
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-4xl mx-auto my-4 shadow-2xs">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-100 text-slate-700 rounded-lg shrink-0">
          {icon || <Layers className="w-6 h-6 text-indigo-600" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {badge}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{description}</p>

          {plannedFeatures && plannedFeatures.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Escopo Técnico & Regras Operacionais Previstas:
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
                {plannedFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {schemaEntityPreview && schemaEntityPreview.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                Contratos de Dados & Entidades Relacionais Preparadas:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {schemaEntityPreview.map((ent, idx) => (
                  <code key={idx} className="text-[11px] bg-slate-100 text-slate-800 font-mono px-2 py-0.5 rounded border border-slate-200">
                    {ent}
                  </code>
                ))}
              </div>
            </div>
          )}

          {actionText && onAction && (
            <div className="mt-6 flex items-center gap-3">
              <Button size="sm" variant="primary" onClick={onAction} icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                {actionText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
