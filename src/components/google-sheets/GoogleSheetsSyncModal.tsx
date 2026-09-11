import React, { useState, useEffect } from 'react';
import { 
  X, 
  Table, 
  ExternalLink, 
  RefreshCw, 
  UploadCloud, 
  DownloadCloud, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Link2, 
  FileSpreadsheet,
  LogOut,
  Sparkles
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken, 
  getCurrentUser, 
  initAuth 
} from '../../services/googleAuth';
import { 
  extractSpreadsheetId, 
  getSpreadsheetInfo, 
  createNewSCLSpreadsheet, 
  exportCollaboratorsToGoogleSheet, 
  importCollaboratorsFromGoogleSheet, 
  GoogleSheetMetadata 
} from '../../services/googleSheetsService';
import { CollaboratorProfile } from '../../types/collaborator';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: CollaboratorProfile[];
  onImportCollaborators: (imported: CollaboratorProfile[]) => void;
}

const STORAGE_LAST_SHEET_KEY = 'scl_last_google_sheet_config';

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  collaborators,
  onImportCollaborators
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState<'NEW_SHEET' | 'EXISTING_SHEET'>('NEW_SHEET');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form states
  const [newSheetTitle, setNewSheetTitle] = useState('SCL Operações - Quadro Oficial de Colaboradores');
  const [sheetUrlInput, setSheetUrlInput] = useState('');
  const [sheetMeta, setSheetMeta] = useState<GoogleSheetMetadata | null>(null);
  const [selectedSheetName, setSelectedSheetName] = useState<string>('Colaboradores SCL');

  // Status & Feedback
  const [statusMessage, setStatusMessage] = useState<{
    type: 'SUCCESS' | 'ERROR' | 'INFO';
    text: string;
    details?: string;
  } | null>(null);

  // Carrega configuração anterior do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_LAST_SHEET_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.spreadsheetId) {
            setSheetUrlInput(`https://docs.google.com/spreadsheets/d/${parsed.spreadsheetId}/edit`);
            if (parsed.title) {
              setSheetMeta(parsed);
              if (parsed.sheets?.[0]?.title) {
                setSelectedSheetName(parsed.sheets[0].title);
              }
            }
          }
        }
      } catch (err) {
        console.warn('Erro ao ler configuração salva do Google Sheets:', err);
      }
    }
  }, []);

  // Monitora autenticação
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        setAuthError(null);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      setCurrentUser(res.user);
      setStatusMessage({
        type: 'SUCCESS',
        text: `Conectado com sucesso como ${res.user.displayName || res.user.email}!`
      });
    } catch (err: any) {
      console.error('Falha de autenticação Google:', err);
      setAuthError(err.message || 'Falha ao autenticar com a Conta Google.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      setCurrentUser(null);
      setStatusMessage(null);
    } catch (err) {
      console.error('Erro ao desconectar:', err);
    }
  };

  // Carregar metadados da planilha vinculada
  const handleLoadSheetInfo = async () => {
    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({
        type: 'ERROR',
        text: 'Você precisa entrar com sua conta Google antes de carregar a planilha.'
      });
      return;
    }

    const sheetId = extractSpreadsheetId(sheetUrlInput);
    if (!sheetId) {
      setStatusMessage({
        type: 'ERROR',
        text: 'Por favor, insira um link válido do Google Planilhas (Google Sheets) ou ID.'
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const meta = await getSpreadsheetInfo(sheetId, token);
      setSheetMeta(meta);
      if (meta.sheets.length > 0) {
        setSelectedSheetName(meta.sheets[0].title);
      }

      // Salva no localStorage para próximas sessões
      localStorage.setItem(STORAGE_LAST_SHEET_KEY, JSON.stringify(meta));

      setStatusMessage({
        type: 'SUCCESS',
        text: `Planilha "${meta.title}" conectada com sucesso! ${meta.sheets.length} aba(s) encontrada(s).`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'ERROR',
        text: err.message || 'Erro ao carregar dados da planilha Google.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Criar nova planilha
  const handleCreateNewSheet = async () => {
    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({
        type: 'ERROR',
        text: 'Entre com a sua Conta Google para criar a planilha no seu Google Drive.'
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const created = await createNewSCLSpreadsheet(newSheetTitle, collaborators, token);
      setSheetMeta(created);
      setSheetUrlInput(created.spreadsheetUrl);
      setSelectedSheetName('Colaboradores SCL');
      localStorage.setItem(STORAGE_LAST_SHEET_KEY, JSON.stringify(created));

      setStatusMessage({
        type: 'SUCCESS',
        text: `Nova planilha "${created.title}" criada no Google Drive com ${collaborators.length} colaborador(es) sincronizados!`,
        details: created.spreadsheetUrl
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'ERROR',
        text: err.message || 'Não foi possível criar a planilha no Google Sheets.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Exportar para a planilha vinculada
  const handleExportToSheet = async () => {
    const token = await getAccessToken();
    if (!token || !sheetMeta) {
      setStatusMessage({
        type: 'ERROR',
        text: 'Selecione e conecte uma planilha antes de exportar.'
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await exportCollaboratorsToGoogleSheet(
        sheetMeta.spreadsheetId,
        selectedSheetName,
        collaborators,
        token
      );
      setStatusMessage({
        type: 'SUCCESS',
        text: res.message,
        details: res.spreadsheetUrl
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'ERROR',
        text: err.message || 'Falha ao exportar dados para a planilha Google.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Importar da planilha vinculada (com deduplicação automática)
  const handleImportFromSheet = async () => {
    const token = await getAccessToken();
    if (!token || !sheetMeta) {
      setStatusMessage({
        type: 'ERROR',
        text: 'Selecione e conecte uma planilha antes de importar.'
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await importCollaboratorsFromGoogleSheet(
        sheetMeta.spreadsheetId,
        selectedSheetName,
        token
      );

      if (res.importedCollaborators.length === 0) {
        setStatusMessage({
          type: 'INFO',
          text: 'Nenhum colaborador válido foi identificado na aba selecionada.'
        });
        return;
      }

      onImportCollaborators(res.importedCollaborators);

      const dupMsg = res.duplicatesRemoved > 0 
        ? ` (${res.duplicatesRemoved} registro(s) duplicados com mesmo nome foram limpos automaticamente).` 
        : '.';

      setStatusMessage({
        type: 'SUCCESS',
        text: `${res.importedCollaborators.length} colaborador(es) importados e integrados com sucesso ao sistema${dupMsg}`,
        details: sheetMeta.spreadsheetUrl
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'ERROR',
        text: err.message || 'Falha ao ler dados da planilha Google.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Integração Google Planilhas (Google Sheets)
              </h3>
              <p className="text-xs text-slate-500">
                Sincronize o quadro de colaboradores diretamente com o Google Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Sessão da Conta Google */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                Conta Google Conectada
              </div>
              {currentUser ? (
                <div className="flex items-center gap-2.5">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="" 
                      className="w-8 h-8 rounded-full border border-slate-300" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                      {(currentUser.displayName || currentUser.email || 'G')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      {currentUser.displayName || 'Usuário Google'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600">
                  Faça login com a sua Conta Google para acessar suas planilhas e o Google Drive.
                </p>
              )}
            </div>

            <div>
              {currentUser ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Desconectar Conta</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-google-sign-in"
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isAuthenticating ? 'Conectando...' : 'Conectar com Google'}</span>
                </button>
              )}
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Abas de Modo de Operação */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('NEW_SHEET')}
              className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'NEW_SHEET'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Criar Nova Planilha no Google Drive</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('EXISTING_SHEET')}
              className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'EXISTING_SHEET'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Link2 className="w-4 h-4" />
              <span>Vincular Planilha Existente</span>
            </button>
          </div>

          {/* TAB 1: CRIAR NOVA PLANILHA */}
          {activeTab === 'NEW_SHEET' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <p className="text-slate-600 leading-relaxed">
                Crie automaticamente uma planilha oficial no seu Google Drive com todas as colunas de RH (Nome, CPF, Cargo, Polo, Salário, Data de Admissão, Regime e Status) preenchidas com os <strong>{collaborators.length} colaboradores</strong> atuais.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Título da Planilha no Google Drive
                </label>
                <input
                  type="text"
                  value={newSheetTitle}
                  onChange={(e) => setNewSheetTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Ex: SCL Operações - Quadro Oficial de Colaboradores"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{collaborators.length} colaboradores prontos para exportação</span>
                </div>
                <button
                  type="button"
                  id="btn-create-google-sheet"
                  onClick={handleCreateNewSheet}
                  disabled={isLoading || !currentUser}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Criando no Drive...' : 'Criar e Exportar Planilha'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: VINCULAR PLANILHA EXISTENTE */}
          {activeTab === 'EXISTING_SHEET' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Link da Planilha Google (ou ID)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sheetUrlInput}
                    onChange={(e) => setSheetUrlInput(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    id="btn-connect-sheet"
                    onClick={handleLoadSheetInfo}
                    disabled={isLoading || !currentUser || !sheetUrlInput.trim()}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Conectar</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Cole o link completo da barra de endereços do Google Sheets.
                </p>
              </div>

              {/* Informações da Planilha Conectada */}
              {sheetMeta && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Table className="w-4 h-4 text-emerald-600" />
                        <span>{sheetMeta.title}</span>
                      </div>
                      <a
                        href={sheetMeta.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        Abrir no Google Planilhas
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Seletor de Aba */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-600">Aba:</span>
                      <select
                        value={selectedSheetName}
                        onChange={(e) => setSelectedSheetName(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                      >
                        {sheetMeta.sheets.map((s) => (
                          <option key={s.sheetId} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Ações Bidirecionais */}
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      id="btn-import-from-sheet"
                      onClick={handleImportFromSheet}
                      disabled={isLoading}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Lê os dados da planilha Google e atualiza o sistema sem gerar duplicatas"
                    >
                      <DownloadCloud className="w-3.5 h-3.5 text-blue-600" />
                      <span>Puxar da Planilha (Importar)</span>
                    </button>

                    <button
                      type="button"
                      id="btn-export-to-sheet"
                      onClick={handleExportToSheet}
                      disabled={isLoading}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      title="Grava todos os colaboradores atuais na aba selecionada do Google Sheets"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Enviar para a Planilha (Exportar)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feedback de Status */}
          {statusMessage && (
            <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 shadow-2xs animate-in fade-in ${
              statusMessage.type === 'SUCCESS' 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : statusMessage.type === 'ERROR'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}>
              {statusMessage.type === 'SUCCESS' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed">
                <p className="font-semibold text-xs">{statusMessage.text}</p>
                {statusMessage.details && (
                  <a
                    href={statusMessage.details}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline mt-1"
                  >
                    Acessar Planilha no Google Planilhas
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google Sheets API v4 Ativa &amp; Proteção Anti-Duplicidade</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
