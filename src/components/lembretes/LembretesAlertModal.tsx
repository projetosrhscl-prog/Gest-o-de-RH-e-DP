import React from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  CalendarDays,
  Sparkles,
  Building,
  User
} from 'lucide-react';
import { LembreteItem, LembretePriority } from '../../types/lembretes';
import { getDaysDifference, dismissPopupForToday } from '../../utils/lembretesStorage';
import { useNavigation } from '../../context/NavigationContext';

interface LembretesAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: LembreteItem[];
  onToggleStatus: (id: string) => void;
  onSnooze: (id: string, days?: number) => void;
  onNavigateToCalendar?: () => void;
}

export const LembretesAlertModal: React.FC<LembretesAlertModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onToggleStatus,
  onSnooze,
  onNavigateToCalendar
}) => {
  const { navigateTo } = useNavigation();

  if (!isOpen || alerts.length === 0) return null;

  const urgentCount = alerts.filter(a => a.priority === 'URGENTE' || getDaysDifference(a.date) <= 0).length;

  const handleDismissToday = () => {
    dismissPopupForToday();
    onClose();
  };

  const handleActionClick = (item: LembreteItem) => {
    if (item.actionModule) {
      navigateTo(item.actionModule);
      onClose();
    } else if (onNavigateToCalendar) {
      onNavigateToCalendar();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header with High-Impact Urgency styling */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-amber-900 via-slate-900 to-slate-950 text-white flex items-center justify-between shrink-0 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950">
                  {urgentCount > 0 ? `${urgentCount} Alertas Críticos` : 'Lembretes Iminentes'}
                </span>
                <span className="text-xs text-amber-300/80 font-medium">SCL Solar RH & DP</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                Vencimentos & Eventos Próximos
              </h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Sub-header */}
        <div className="bg-amber-50/80 px-6 py-2.5 border-b border-amber-200/70 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-[11px] font-medium">
              Você possui <strong>{alerts.length} eventos</strong> exigindo atenção ou providências nos próximos dias.
            </span>
          </div>
          <button
            onClick={() => {
              if (onNavigateToCalendar) {
                onNavigateToCalendar();
                onClose();
              } else {
                navigateTo('lembretes' as any);
                onClose();
              }
            }}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Abrir Calendário Completo</span>
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-slate-100">
          {alerts.map((item) => {
            const daysDiff = getDaysDifference(item.date);
            const isOverdue = daysDiff < 0;
            const isToday = daysDiff === 0;
            const isTomorrow = daysDiff === 1;

            let countdownBadge = '';
            let countdownStyle = '';

            if (isOverdue) {
              countdownBadge = `⚠️ Vencido há ${Math.abs(daysDiff)} dia${Math.abs(daysDiff) > 1 ? 's' : ''}`;
              countdownStyle = 'bg-red-100 text-red-900 border-red-300 font-bold animate-pulse';
            } else if (isToday) {
              countdownBadge = `🚨 Vence HOJE!`;
              countdownStyle = 'bg-amber-100 text-amber-950 border-amber-400 font-bold';
            } else if (isTomorrow) {
              countdownBadge = `⏰ Vence Amanhã`;
              countdownStyle = 'bg-amber-50 text-amber-900 border-amber-300 font-semibold';
            } else {
              countdownBadge = `🗓️ Em ${daysDiff} dias`;
              countdownStyle = 'bg-blue-50 text-blue-900 border-blue-200 font-medium';
            }

            const isUrgentPriority = item.priority === 'URGENTE';

            return (
              <div 
                key={item.id} 
                className={`pt-3.5 first:pt-0 rounded-xl p-3.5 transition-all ${
                  isOverdue ? 'bg-red-50/40 border border-red-200' : isToday ? 'bg-amber-50/40 border border-amber-200' : 'bg-slate-50/60 border border-slate-200/80 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${countdownStyle}`}>
                        {countdownBadge}
                      </span>
                      {isUrgentPriority && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                          CRÍTICO
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.date.split('-').reverse().join('/')} {item.time ? `às ${item.time}` : ''}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 pt-0.5">
                      {item.title}
                    </h3>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500">
                      {item.collaboratorName && (
                        <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium text-slate-700">
                          <User className="w-3 h-3 text-blue-600" />
                          {item.collaboratorName}
                        </span>
                      )}
                      {item.poloNome && (
                        <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium text-slate-700">
                          <Building className="w-3 h-3 text-slate-500" />
                          {item.poloNome}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for this item */}
                  <div className="flex items-center sm:flex-col gap-1.5 shrink-0 justify-end">
                    {item.actionLabel && (
                      <button
                        type="button"
                        onClick={() => handleActionClick(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs w-full justify-center"
                      >
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    <div className="flex items-center gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(item.id)}
                        className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors flex-1 justify-center"
                        title="Marcar como Concluído"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Concluir</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSnooze(item.id, 2)}
                        className="px-2 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Adiar por 2 dias"
                      >
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>+2d</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Session Control */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={handleDismissToday}
            className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer underline"
          >
            Não mostrar pop-up novamente hoje
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
            >
              Entendido / Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
