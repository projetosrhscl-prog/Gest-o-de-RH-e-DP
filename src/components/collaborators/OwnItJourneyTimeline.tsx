import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  UserCheck, 
  ChevronRight,
  Info,
  Calendar,
  DollarSign,
  PlusCircle,
  X
} from 'lucide-react';
import { CollaboratorProfile, OwnItJourneyData, OwnItLevel, OwnItMilestone } from '../../types/collaborator';
import { 
  OWN_IT_LEVEL_DEFINITIONS, 
  ORDERED_OWN_IT_LETTERS, 
  getCollaboratorOwnItJourney, 
  OwnItLevelDefinition 
} from '../../utils/ownItHelper';
import { useAuth } from '../../context/AuthContext';
import { formatDateBR } from '../../utils/dateHelper';

interface OwnItJourneyTimelineProps {
  collaborator: CollaboratorProfile;
  onUpdateCollaborator?: (updated: CollaboratorProfile) => void;
  compact?: boolean;
}

export const OwnItJourneyTimeline: React.FC<OwnItJourneyTimelineProps> = ({
  collaborator,
  onUpdateCollaborator,
  compact = false
}) => {
  const { logAction } = useAuth();
  const [journeyData, setJourneyData] = useState<OwnItJourneyData>(() => 
    getCollaboratorOwnItJourney(collaborator)
  );

  const [selectedLetter, setSelectedLetter] = useState<OwnItLevel>(journeyData.currentLevel);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [promotionFeedback, setPromotionFeedback] = useState('');
  const [newSalary, setNewSalary] = useState<number>(Math.round(collaborator.salary * 1.15));
  const [newPosition, setNewPosition] = useState('');
  const [promotionDate, setPromotionDate] = useState(new Date().toISOString().slice(0, 10));

  const currentDef = OWN_IT_LEVEL_DEFINITIONS[journeyData.currentLevel];
  const selectedMilestone = journeyData.milestones.find(m => m.letter === selectedLetter) || journeyData.milestones[0];
  const selectedDef = OWN_IT_LEVEL_DEFINITIONS[selectedLetter];

  const currentLevelIndex = ORDERED_OWN_IT_LETTERS.indexOf(journeyData.currentLevel);
  const nextLetter = currentLevelIndex < 4 ? ORDERED_OWN_IT_LETTERS[currentLevelIndex + 1] : null;

  const handlePromote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nextLetter) return;

    const nextDef = OWN_IT_LEVEL_DEFINITIONS[nextLetter];
    const promotedPos = newPosition.trim() || nextDef.recommendedPositions[0] || collaborator.positionTitle;

    const updatedMilestones: OwnItMilestone[] = journeyData.milestones.map((m) => {
      if (m.letter === journeyData.currentLevel) {
        return {
          ...m,
          status: 'CONCLUIDO',
          currentProgressPercent: 100
        };
      }
      if (m.letter === nextLetter) {
        return {
          ...m,
          status: 'ATUAL',
          achievedDate: promotionDate,
          promotedPosition: promotedPos,
          salaryAtPromotion: newSalary,
          evaluatorName: collaborator.directSupervisor,
          feedback: promotionFeedback || `Promoção para a letra ${nextLetter} (${nextDef.name}) aprovada com louvor.`,
          currentProgressPercent: 50
        };
      }
      const mIdx = ORDERED_OWN_IT_LETTERS.indexOf(m.letter);
      const nextIdx = ORDERED_OWN_IT_LETTERS.indexOf(nextLetter);
      if (mIdx === nextIdx + 1) {
        return { ...m, status: 'PROXIMO' };
      }
      return m;
    });

    const newJourney: OwnItJourneyData = {
      ...journeyData,
      currentLevel: nextLetter,
      totalPromotions: journeyData.totalPromotions + 1,
      lastPromotionDate: promotionDate,
      milestones: updatedMilestones
    };

    setJourneyData(newJourney);
    setSelectedLetter(nextLetter);

    // Update career history
    const updatedCareerHistory = [
      ...(collaborator.careerHistory || []),
      {
        id: `ch-ownit-${Date.now()}`,
        positionTitle: promotedPos,
        departmentName: collaborator.departmentName,
        salary: newSalary,
        startDate: promotionDate,
        reason: 'PROMOCAO' as const,
        ownItLevel: nextLetter
      }
    ];

    const updatedColab: CollaboratorProfile = {
      ...collaborator,
      positionTitle: promotedPos,
      salary: newSalary,
      careerHistory: updatedCareerHistory,
      ownItJourney: newJourney
    };

    if (onUpdateCollaborator) {
      onUpdateCollaborator(updatedColab);
    }

    logAction(
      'UPDATE', 
      'Jornada OWN IT', 
      collaborator.id, 
      `Promoção do colaborador ${collaborator.fullName} para o Nível ${nextLetter} (${nextDef.name})`
    );

    setIsPromotionModalOpen(false);
    setPromotionFeedback('');
  };

  return (
    <div className="space-y-5">
      {/* Header Info Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <Award className="w-48 h-48 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-wider border border-blue-400/30 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-400" />
                Trilha de Promoções & Carreira
              </span>
              <span className="text-[11px] text-slate-300">
                Início: <strong className="text-white font-mono">{formatDateBR(journeyData.journeyStartDate)}</strong>
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Jornada OWN IT • SCL & Stone
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Cada letra representa um nível de maturidade e uma promoção formal na empresa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/15 text-center">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">Nível Atual</span>
              <div className="text-lg font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                <span>Letra {journeyData.currentLevel}</span>
              </div>
            </div>

            {nextLetter && (
              <button
                onClick={() => {
                  const nextDef = OWN_IT_LEVEL_DEFINITIONS[nextLetter];
                  setNewPosition(nextDef.recommendedPositions[0] || collaborator.positionTitle);
                  setIsPromotionModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>Promover para '{nextLetter}'</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* OWN IT Progress Steps Bar (O - W - N - I - T) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Trilha de Níveis OWN IT
            </h4>
            <p className="text-[11px] text-slate-500">
              Clique em qualquer letra para visualizar requisitos, histórico e critérios da promoção.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            {journeyData.totalPromotions} de 5 níveis conquistados
          </span>
        </div>

        {/* Stepper Grid */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 relative">
          {ORDERED_OWN_IT_LETTERS.map((letter, idx) => {
            const milestone = journeyData.milestones.find(m => m.letter === letter);
            const def = OWN_IT_LEVEL_DEFINITIONS[letter];
            const isSelected = selectedLetter === letter;
            const isCompleted = milestone?.status === 'CONCLUIDO';
            const isCurrent = milestone?.status === 'ATUAL';
            const isNext = milestone?.status === 'PROXIMO';

            return (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer relative text-left group ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20' 
                    : isCurrent
                    ? 'border-amber-400 bg-amber-50/20'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/10 hover:bg-slate-50'
                    : 'border-slate-200 bg-slate-50/40 opacity-70 hover:opacity-100 hover:bg-slate-100/50'
                }`}
              >
                {/* Status Dot / Badge */}
                <div className="w-full flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : isCurrent
                      ? 'bg-amber-100 text-amber-900 font-bold'
                      : isNext
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? 'Concluído' : isCurrent ? 'Atual' : isNext ? 'Próximo' : 'Bloqueado'}
                  </span>

                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  {isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </div>

                {/* Letter Big Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl shadow-xs transition-transform group-hover:scale-105 ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 ring-4 ring-amber-400/20'
                    : isNext
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {letter}
                </div>

                {/* Letter Subtitle */}
                <div className="mt-2 text-center w-full">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {def.name.split('&')[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {def.shortTag}
                  </span>
                </div>

                {/* Date or position indicator */}
                <div className="mt-1.5 text-[10px] font-mono text-center w-full">
                  {milestone?.achievedDate ? (
                    <span className="text-emerald-700 font-medium">{formatDateBR(milestone.achievedDate)}</span>
                  ) : isCurrent ? (
                    <span className="text-amber-700 font-medium">Em curso</span>
                  ) : (
                    <span className="text-slate-400">Pendente</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Letter Deep-Dive Detail Panel */}
      <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg text-white ${
              selectedMilestone.status === 'CONCLUIDO'
                ? 'bg-emerald-600'
                : selectedMilestone.status === 'ATUAL'
                ? 'bg-amber-500'
                : 'bg-blue-600'
            }`}>
              {selectedLetter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  Nível {selectedLetter}: {selectedDef.name}
                </h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  selectedMilestone.status === 'CONCLUIDO'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : selectedMilestone.status === 'ATUAL'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200'
                }`}>
                  {selectedMilestone.status === 'CONCLUIDO' ? 'Promoção Concluída' : selectedMilestone.status === 'ATUAL' ? 'Nível Atual em Desenvolvimento' : 'Próxima Etapa de Promoção'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {selectedDef.summary}
              </p>
            </div>
          </div>

          {selectedMilestone.achievedDate && (
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Data da Conquista</span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {formatDateBR(selectedMilestone.achievedDate)}
              </span>
            </div>
          )}
        </div>

        {/* Promotion Details / Records */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Box 1: Expectativa & Cargo */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Expectativa do Nível
            </span>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              "{selectedDef.coreExpectation}"
            </p>
            {selectedMilestone.promotedPosition && (
              <div className="pt-2 border-t border-slate-200/60 mt-2">
                <span className="text-[10px] text-slate-400 block">Cargo Promovido:</span>
                <span className="font-semibold text-slate-900 text-xs">{selectedMilestone.promotedPosition}</span>
              </div>
            )}
          </div>

          {/* Box 2: Competências Chave */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Competências Avaliadas
            </span>
            <ul className="space-y-1 text-xs text-slate-700">
              {selectedDef.keyCompetencies.map((comp, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[11px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 3: Critérios para a Promoção */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Critérios de Promoção
            </span>
            <ul className="space-y-1 text-xs text-slate-700">
              {selectedDef.promotionCriteria.map((crit, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px]">
                  <CheckCircle2 className={`w-3 h-3 mt-0.5 shrink-0 ${
                    selectedMilestone.status === 'CONCLUIDO' ? 'text-emerald-600' : 'text-slate-400'
                  }`} />
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Parecer / Feedback da Liderança */}
        {selectedMilestone.feedback && (
          <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                Parecer da Liderança & RH ({selectedMilestone.evaluatorName || collaborator.directSupervisor})
              </span>
              <p className="text-xs text-blue-950 mt-0.5">
                {selectedMilestone.feedback}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Historical Promotions Timeline List */}
      <div className="border border-slate-200/80 p-5 rounded-xl bg-white shadow-2xs">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-600" />
          Linha do Tempo das Promoções OWN IT
        </h4>

        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {journeyData.milestones
            .filter(m => m.status === 'CONCLUIDO' || m.status === 'ATUAL')
            .map((milestone) => {
              const def = OWN_IT_LEVEL_DEFINITIONS[milestone.letter];
              const isCurrent = milestone.status === 'ATUAL';

              return (
                <div key={milestone.letter} className="relative group">
                  {/* Dot */}
                  <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                    isCurrent ? 'bg-amber-500 ring-2 ring-amber-200' : 'bg-emerald-600'
                  }`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div className={`p-3 rounded-lg border transition-all ${
                    isCurrent ? 'bg-amber-50/20 border-amber-200' : 'bg-slate-50/50 border-slate-200/80'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-black text-xs ${
                          isCurrent ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                        }`}>
                          NÍVEL {milestone.letter}
                        </span>
                        <span className="font-bold text-slate-900 text-xs">
                          {def.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                            Nível Atual
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono">
                        {milestone.achievedDate && (
                          <span className="text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {formatDateBR(milestone.achievedDate)}
                          </span>
                        )}
                        {milestone.salaryAtPromotion && (
                          <span className="text-slate-700 font-bold">
                            R$ {milestone.salaryAtPromotion.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-slate-600 flex items-center gap-2">
                      <span className="font-semibold text-slate-800">Cargo: {milestone.promotedPosition || collaborator.positionTitle}</span>
                      <span>•</span>
                      <span>{def.shortTag}</span>
                    </div>

                    {milestone.feedback && (
                      <p className="text-[11px] text-slate-500 mt-1.5 italic">
                        "{milestone.feedback}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Promotion Action Modal */}
      {isPromotionModalOpen && nextLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in zoom-in-95">
            <button
              onClick={() => setIsPromotionModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-xs">
                {nextLetter}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Promover para Nível {nextLetter} ({OWN_IT_LEVEL_DEFINITIONS[nextLetter].name})
                </h3>
                <p className="text-xs text-slate-500">
                  Colaborador: <strong>{collaborator.fullName}</strong>
                </p>
              </div>
            </div>

            <form onSubmit={handlePromote} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Novo Cargo Promovido
                </label>
                <input
                  type="text"
                  required
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={OWN_IT_LEVEL_DEFINITIONS[nextLetter].recommendedPositions[0]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Novo Salário Base (R$)
                  </label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={newSalary}
                    onChange={(e) => setNewSalary(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Data da Promoção
                  </label>
                  <input
                    type="date"
                    required
                    value={promotionDate}
                    onChange={(e) => setPromotionDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Parecer do Líder & RH / Motivo da Promoção
                </label>
                <textarea
                  rows={3}
                  value={promotionFeedback}
                  onChange={(e) => setPromotionFeedback(e.target.value)}
                  placeholder={`Descreva os motivos da promoção para a letra ${nextLetter}, metas superadas e alinhamento com a cultura...`}
                  className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Esta promoção atualizará o cargo ativo, reajustará o salário e registrará um novo evento no histórico de evolução de carreira e auditoria.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPromotionModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Confirmar Promoção OWN IT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
