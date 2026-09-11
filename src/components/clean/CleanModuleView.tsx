import React, { useState } from 'react';
import { X, Building, Users, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_EMPLOYEES, INITIAL_DEPARTMENTS, INITIAL_POSITIONS } from '../../data/mockData';

export interface ModuleAreaCard {
  id: string;
  title: string;
  badge?: string;
  description: string;
  details?: React.ReactNode;
}

interface CleanModuleViewProps {
  title: string;
  subtitle: string;
  cards: ModuleAreaCard[];
}

export const CleanModuleView: React.FC<CleanModuleViewProps> = ({
  title,
  subtitle,
  cards
}) => {
  const { branchSelectionLabel, selectedBranchIds } = useAuth();
  const [selectedCard, setSelectedCard] = useState<ModuleAreaCard | null>(null);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      {/* Module Title & Subtitle */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-[26px] font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {subtitle}
        </p>
      </div>

      {/* Section Header */}
      <div className="mb-4">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          ÁREAS DO MÓDULO
        </span>
      </div>

      {/* 3-Column Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            id={`card-${card.id}`}
            onClick={() => setSelectedCard(card)}
            className="bg-white border border-slate-200/90 rounded-xl p-5 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  {card.title}
                </h3>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80 shrink-0">
                  {card.badge || 'Em breve'}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Status Card (Clean Dashed Container) */}
      <div className="border border-dashed border-slate-300/80 rounded-xl p-8 bg-slate-50/50 text-center mt-8">
        <h4 className="text-sm font-semibold text-slate-800 mb-1">
          Nenhuma funcionalidade habilitada neste módulo
        </h4>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          A estrutura do módulo está pronta. As funcionalidades serão liberadas conforme as próximas etapas de desenvolvimento.
        </p>
      </div>

      {/* Detail Slide-over Modal when a card is clicked */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedCard.title}
                  </h3>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {selectedCard.badge || 'Em breve'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Escopo ativo: <strong className="text-slate-800">{branchSelectionLabel}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900">
                <p className="font-semibold text-xs mb-1">Visão Operacional da Área</p>
                <p className="text-slate-600 leading-relaxed">
                  {selectedCard.description}
                </p>
              </div>

              {selectedCard.details ? (
                <div>{selectedCard.details}</div>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500">
                  <p className="font-medium text-slate-700 mb-1">Mapeamento Técnico SCL Configurado</p>
                  <p className="text-[11px]">
                    Entidade preparada para processamento multi-unidade ({branchSelectionLabel}).
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
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
