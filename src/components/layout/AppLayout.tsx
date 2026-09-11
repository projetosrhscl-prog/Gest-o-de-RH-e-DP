import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { useStoredLembretes, getImminentAlerts, isPopupDismissedForToday } from '../../utils/lembretesStorage';
import { LembretesAlertModal } from '../lembretes/LembretesAlertModal';
import { useNavigation } from '../../context/NavigationContext';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lembretes, toggleLembreteStatus, snoozeLembrete } = useStoredLembretes();
  const { navigateTo } = useNavigation();

  const imminentAlerts = useMemo(() => {
    return getImminentAlerts(7);
  }, [lembretes]);

  const [isAutoAlertOpen, setIsAutoAlertOpen] = useState(false);

  // Check on mount if should display pop-up alert
  useEffect(() => {
    const isDismissed = isPopupDismissedForToday();
    const urgentOrImminent = getImminentAlerts(7);
    if (!isDismissed && urgentOrImminent.length > 0) {
      // Delay slightly for smooth UI entrance
      const timer = setTimeout(() => {
        setIsAutoAlertOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header 
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 relative focus:outline-none">
          {children}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Auto-popup Alert for imminent events */}
      {isAutoAlertOpen && (
        <LembretesAlertModal
          isOpen={isAutoAlertOpen}
          onClose={() => setIsAutoAlertOpen(false)}
          alerts={imminentAlerts}
          onToggleStatus={(id) => toggleLembreteStatus(id)}
          onSnooze={(id, days) => snoozeLembrete(id, days || 2)}
          onNavigateToCalendar={() => navigateTo('lembretes' as any)}
        />
      )}
    </div>
  );
};

