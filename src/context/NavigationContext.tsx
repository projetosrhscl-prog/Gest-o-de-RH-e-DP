import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MainModuleId } from '../types/navigation';
import { SYSTEM_MODULES } from '../config/modules';

interface NavigationContextType {
  activeModuleId: MainModuleId;
  activeSubModuleId: string;
  setActiveModuleId: (id: MainModuleId) => void;
  setActiveSubModuleId: (id: string) => void;
  navigateTo: (moduleId: MainModuleId, subModuleId?: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  searchFilter: string;
  setSearchFilter: (query: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModuleId, setActiveModuleId] = useState<MainModuleId>('gestao-pessoas');
  const [activeSubModuleId, setActiveSubModuleId] = useState<string>('colaboradores');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const navigateTo = (moduleId: MainModuleId, subModuleId?: string) => {
    setActiveModuleId(moduleId);
    if (subModuleId) {
      setActiveSubModuleId(subModuleId);
    } else {
      const targetModule = SYSTEM_MODULES.find(m => m.id === moduleId);
      if (targetModule && targetModule.subModules.length > 0) {
        setActiveSubModuleId(targetModule.subModules[0].id);
      }
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        activeModuleId,
        activeSubModuleId,
        setActiveModuleId,
        setActiveSubModuleId,
        navigateTo,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        searchFilter,
        setSearchFilter
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
