import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { AppLayout } from './components/layout/AppLayout';
import { GestaoPessoasModule } from './modules/gestao-pessoas/GestaoPessoasModule';
import { DepartamentoPessoalModule } from './modules/departamento-pessoal/DepartamentoPessoalModule';
import { AdmissaoDemissaoModule } from './modules/admissao-demissao/AdmissaoDemissaoModule';
import { LembretesModule } from './modules/lembretes/LembretesModule';
import { AuditoriasModule } from './modules/auditorias/AuditoriasModule';
import { ConfiguracoesModule } from './modules/configuracoes/ConfiguracoesModule';

const MainWorkspaceRouter: React.FC = () => {
  const { activeModuleId } = useNavigation();

  switch (activeModuleId) {
    case 'gestao-pessoas':
      return <GestaoPessoasModule />;
    case 'departamento-pessoal':
      return <DepartamentoPessoalModule />;
    case 'admissao-demissao':
      return <AdmissaoDemissaoModule />;
    case 'lembretes':
      return <LembretesModule />;
    case 'auditorias':
      return <AuditoriasModule />;
    case 'configuracoes':
      return <ConfiguracoesModule />;
    default:
      return <GestaoPessoasModule />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppLayout>
          <MainWorkspaceRouter />
        </AppLayout>
      </NavigationProvider>
    </AuthProvider>
  );
}
