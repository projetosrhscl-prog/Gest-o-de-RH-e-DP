import { useState, useEffect, useCallback } from 'react';
import { 
  ProcessoAdmissaoCompleto, 
  AdmissaoStage, 
  FormularioAdmissaoCompleto, 
  DocumentoAnexoAdmissao,
  EnvioContadorRegistro,
  DisparoDocumentoItem
} from '../types/admissao';
import { CollaboratorProfile } from '../types/collaborator';
import { getStoredCollaborators, addStoredCollaborator, updateStoredCollaborator } from './collaboratorsStorage';
import { inicializarDisparosOnboarding } from './documentosOnboardingHelper';

export const ADMISSOES_STORAGE_KEY = 'scl_processos_admissao_v2';
export const ADMISSOES_UPDATE_EVENT = 'scl_admissoes_updated';

/**
 * Calcula a quantidade de dias trabalhados no mês de início (do dia de início até o último dia do mês).
 */
export function calcularDiasTrabalhadosNoMes(dataInicioStr: string): { diasTrabalhados: number; totalDiasMes: number; mesAno: string } {
  try {
    const dataInicio = new Date(dataInicioStr + 'T12:00:00');
    if (isNaN(dataInicio.getTime())) {
      return { diasTrabalhados: 30, totalDiasMes: 30, mesAno: 'Mês Vigente' };
    }
    const ano = dataInicio.getFullYear();
    const mes = dataInicio.getMonth(); // 0 a 11
    const diaInicio = dataInicio.getDate();
    
    // Último dia do mês
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const diasTrabalhados = Math.max(1, ultimoDia - diaInicio + 1);
    
    const mesesNomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const mesAno = `${mesesNomes[mes]} / ${ano}`;

    return { diasTrabalhados, totalDiasMes: ultimoDia, mesAno };
  } catch {
    return { diasTrabalhados: 30, totalDiasMes: 30, mesAno: 'Mês Vigente' };
  }
}

const INITIAL_PROCESSOS: ProcessoAdmissaoCompleto[] = [
  {
    id: 'ADM-2026-0801',
    candidatoNome: 'Lucas Gabriel Silveira',
    cpf: '782.901.442-10',
    cargo: 'Operador de Estação Solar',
    poloId: 'op-trairi',
    poloNome: 'Polo Trairi',
    departamento: 'Operações de Campo',
    salarioPrevisto: 2450.00,
    dataInicioAtividades: '2026-08-10',
    dataPrevisaoAdmissaoContador: '2026-08-25',
    email: 'lucas.silveira.solar@gmail.com',
    telefoneWhatsApp: '(85) 98842-1190',
    etapaAtual: 'STONE_START_APROVADO',
    diasTrabalhadosPrimeiroMes: 22,
    docsIniciaisRecebidos: {
      idRg: true,
      cpf: true,
      comprovanteResidencia: true
    },
    enviosContador: [
      {
        id: 'ENV-001',
        tipo: 'ENVIO_INICIAL_PREVIA',
        dataEnvio: '2026-08-25 10:30',
        destinatarioEmail: 'contabilidade@parceiroscl.com.br',
        diasTrabalhadosNoMes: 22,
        competenciaMesAno: 'Agosto / 2026',
        documentosEnviados: ['RG_LucasSilveira.pdf', 'CPF_LucasSilveira.pdf', 'Comprovante_Residencia_Lucas.pdf'],
        enviadoPor: 'Isabela Soares (Analista DP)',
        protocolo: 'SCL-CONT-2026-08-8834',
        status: 'CONFIRMADO_CONTABILIDADE'
      }
    ],
    stoneStart: {
      status: 'APROVADO',
      dataAprovacao: '2026-08-27',
      aprovadoPor: 'Carlos Menezes (Liderança Operacional)',
      observacoes: 'Aprovado com 96% de aproveitamento nas trilhas de segurança e integração Stone Start.'
    },
    formularioToken: 'token_adm_lucas_8829',
    formularioDisparadoEm: '2026-08-28 09:15',
    formularioDisparadoPor: 'Isabela Soares',
    disparosOnboarding: inicializarDisparosOnboarding('2026-08-10', 'Lucas Gabriel Silveira', 'lucas.silveira.solar@gmail.com', '(85) 98842-1190', 'RENUNCIA'),
    documentos: [
      {
        id: 'doc-1',
        tipo: 'ID_RG_CNH',
        nomeArquivo: 'RG_LucasSilveira_FrenteVerso.pdf',
        tamanho: '1.4 MB',
        dataUpload: '2026-08-15',
        url: '#',
        status: 'VALIDADO',
        fase: 'INICIAL_PRE_25'
      },
      {
        id: 'doc-2',
        tipo: 'CPF',
        nomeArquivo: 'Comprovante_CPF.pdf',
        tamanho: '450 KB',
        dataUpload: '2026-08-15',
        url: '#',
        status: 'VALIDADO',
        fase: 'INICIAL_PRE_25'
      },
      {
        id: 'doc-3',
        tipo: 'COMPROVANTE_RESIDENCIA',
        nomeArquivo: 'Conta_Energia_Enel_Agosto.pdf',
        tamanho: '820 KB',
        dataUpload: '2026-08-15',
        url: '#',
        status: 'VALIDADO',
        fase: 'INICIAL_PRE_25'
      }
    ],
    historicoEtapas: [
      {
        etapa: 'CADASTRO_INICIAL',
        data: '2026-08-10 08:30',
        usuario: 'Sistema / DP',
        detalhes: 'Pré-cadastro realizado na plataforma com início em 10/08/2026.'
      },
      {
        etapa: 'SOLICITACAO_PREVIA_DOCS',
        data: '2026-08-10 09:00',
        usuario: 'Isabela Soares',
        detalhes: 'Link enviado ao candidato para envio de ID, CPF e Comprovante de Residência antes do dia 25.'
      },
      {
        etapa: 'ENVIO_INICIAL_CONTADOR',
        data: '2026-08-25 10:30',
        usuario: 'Isabela Soares',
        detalhes: 'Documentos iniciais e apuração de 22 dias trabalhados enviados à contabilidade.'
      },
      {
        etapa: 'AGUARDANDO_STONE_START',
        data: '2026-08-25 11:00',
        usuario: 'Sistema',
        detalhes: 'Aguardando realização do treinamento Stone Start.'
      },
      {
        etapa: 'STONE_START_APROVADO',
        data: '2026-08-27 16:40',
        usuario: 'Carlos Menezes',
        detalhes: 'Stone Start aprovado com sucesso. Liberado para disparo do formulário integrado.'
      }
    ],
    criadoEm: '2026-08-10',
    atualizadoEm: '2026-08-28'
  },
  {
    id: 'ADM-2026-0802',
    candidatoNome: 'Mariana Duarte Costa',
    cpf: '541.229.873-45',
    cargo: 'Técnica em Eletrotécnica',
    poloId: 'op-macau',
    poloNome: 'Polo Macau',
    departamento: 'Engenharia & Manutenção',
    salarioPrevisto: 3100.00,
    dataInicioAtividades: '2026-08-18',
    dataPrevisaoAdmissaoContador: '2026-08-25',
    email: 'mariana.costa.eng@outlook.com',
    telefoneWhatsApp: '(84) 99120-4355',
    etapaAtual: 'AGUARDANDO_STONE_START',
    diasTrabalhadosPrimeiroMes: 14,
    docsIniciaisRecebidos: {
      idRg: true,
      cpf: true,
      comprovanteResidencia: true
    },
    enviosContador: [
      {
        id: 'ENV-002',
        tipo: 'ENVIO_INICIAL_PREVIA',
        dataEnvio: '2026-08-25 11:15',
        destinatarioEmail: 'contabilidade@parceiroscl.com.br',
        diasTrabalhadosNoMes: 14,
        competenciaMesAno: 'Agosto / 2026',
        documentosEnviados: ['RG_MarianaDuarte.pdf', 'CPF_Mariana.pdf', 'Comprovante_Residencia.pdf'],
        enviadoPor: 'Isabela Soares (Analista DP)',
        protocolo: 'SCL-CONT-2026-08-8840',
        status: 'CONFIRMADO_CONTABILIDADE'
      }
    ],
    stoneStart: {
      status: 'EM_ANDAMENTO',
      observacoes: 'Em realização dos módulos práticos do Stone Start.'
    },
    formularioToken: 'token_adm_mariana_9941',
    disparosOnboarding: inicializarDisparosOnboarding('2026-08-18', 'Mariana Duarte Costa', 'mariana.costa.eng@outlook.com', '(84) 99120-4355', 'RENUNCIA'),
    documentos: [
      {
        id: 'doc-m1',
        tipo: 'ID_RG_CNH',
        nomeArquivo: 'CNH_Mariana_Duarte.pdf',
        tamanho: '1.1 MB',
        dataUpload: '2026-08-20',
        url: '#',
        status: 'VALIDADO',
        fase: 'INICIAL_PRE_25'
      },
      {
        id: 'doc-m2',
        tipo: 'CPF',
        nomeArquivo: 'Cartao_CPF.pdf',
        tamanho: '380 KB',
        dataUpload: '2026-08-20',
        url: '#',
        status: 'VALIDADO',
        fase: 'INICIAL_PRE_25'
      },
      {
        id: 'doc-m3',
        tipo: 'COMPROVANTE_RESIDENCIA',
        nomeArquivo: 'Comprovante_Residencia_Agosto.pdf',
        tamanho: '750 KB',
        dataUpload: '2026-08-20',
        url: '#',
        status: 'VALIDADO',
        fase: 'INICIAL_PRE_25'
      }
    ],
    historicoEtapas: [
      {
        etapa: 'CADASTRO_INICIAL',
        data: '2026-08-18 09:00',
        usuario: 'Sistema / DP',
        detalhes: 'Cadastro inicial realizado com previsão de início em 18/08/2026.'
      },
      {
        etapa: 'ENVIO_INICIAL_CONTADOR',
        data: '2026-08-25 11:15',
        usuario: 'Isabela Soares',
        detalhes: 'Envio no dia 25 à contabilidade com 14 dias trabalhados no mês.'
      },
      {
        etapa: 'AGUARDANDO_STONE_START',
        data: '2026-08-25 11:30',
        usuario: 'Sistema',
        detalhes: 'Aguardando conclusão do Stone Start pela colaboradora.'
      }
    ],
    criadoEm: '2026-08-18',
    atualizadoEm: '2026-08-25'
  },
  {
    id: 'ADM-2026-0803',
    candidatoNome: 'Rodrigo Medeiros Fontes',
    cpf: '331.876.104-92',
    cargo: 'Assistente Administrativo',
    poloId: 'op-patos',
    poloNome: 'Polo Patos',
    departamento: 'Administrativo & Finanças',
    salarioPrevisto: 2100.00,
    dataInicioAtividades: '2026-08-22',
    dataPrevisaoAdmissaoContador: '2026-08-25',
    email: 'rodrigo.medeiros.patos@gmail.com',
    telefoneWhatsApp: '(83) 98701-3329',
    etapaAtual: 'SOLICITACAO_PREVIA_DOCS',
    diasTrabalhadosPrimeiroMes: 10,
    docsIniciaisRecebidos: {
      idRg: true,
      cpf: true,
      comprovanteResidencia: false
    },
    enviosContador: [],
    stoneStart: {
      status: 'NAO_INICIADO'
    },
    formularioToken: 'token_adm_rodrigo_1245',
    disparosOnboarding: inicializarDisparosOnboarding('2026-08-22', 'Rodrigo Medeiros Fontes', 'rodrigo.medeiros.patos@gmail.com', '(83) 98701-3329', 'RENUNCIA'),
    documentos: [
      {
        id: 'doc-r1',
        tipo: 'ID_RG_CNH',
        nomeArquivo: 'RG_Rodrigo_Frente.pdf',
        tamanho: '980 KB',
        dataUpload: '2026-08-23',
        url: '#',
        status: 'VALIDADO',
        fase: 'INICIAL_PRE_25'
      },
      {
        id: 'doc-r2',
        tipo: 'CPF',
        nomeArquivo: 'Comprovante_CPF.pdf',
        tamanho: '310 KB',
        dataUpload: '2026-08-23',
        url: '#',
        status: 'VALIDADO',
        fase: 'INICIAL_PRE_25'
      }
    ],
    historicoEtapas: [
      {
        etapa: 'CADASTRO_INICIAL',
        data: '2026-08-22 14:00',
        usuario: 'Sistema / DP',
        detalhes: 'Adicionado na plataforma com início em 22/08/2026 (10 dias previstos no mês).'
      },
      {
        etapa: 'SOLICITACAO_PREVIA_DOCS',
        data: '2026-08-22 14:15',
        usuario: 'Sistema',
        detalhes: 'Aguardando comprovante de residência para fechamento do lote do dia 25.'
      }
    ],
    criadoEm: '2026-08-22',
    atualizadoEm: '2026-08-23'
  }
];

export function getStoredAdmissoes(): ProcessoAdmissaoCompleto[] {
  if (typeof window === 'undefined') return INITIAL_PROCESSOS;
  try {
    const raw = localStorage.getItem(ADMISSOES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADMISSOES_STORAGE_KEY, JSON.stringify(INITIAL_PROCESSOS));
      return INITIAL_PROCESSOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Garante sanitização de disparosOnboarding
      return parsed.map((item: ProcessoAdmissaoCompleto) => {
        if (!item.disparosOnboarding) {
          return {
            ...item,
            disparosOnboarding: inicializarDisparosOnboarding(
              item.dataInicioAtividades || new Date().toISOString().split('T')[0],
              item.candidatoNome,
              item.email,
              item.telefoneWhatsApp
            )
          };
        }
        return item;
      });
    }
    return INITIAL_PROCESSOS;
  } catch (err) {
    console.warn('Erro ao carregar processos de admissão:', err);
    return INITIAL_PROCESSOS;
  }
}

export function saveStoredAdmissoes(list: ProcessoAdmissaoCompleto[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMISSOES_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(
      new CustomEvent<ProcessoAdmissaoCompleto[]>(ADMISSOES_UPDATE_EVENT, {
        detail: list
      })
    );
  } catch (err) {
    console.warn('Erro ao salvar processos de admissão:', err);
  }
}

/**
 * Atualiza um processo de admissão existente
 */
export function updateAdmissaoProcess(updated: ProcessoAdmissaoCompleto): ProcessoAdmissaoCompleto {
  const current = getStoredAdmissoes();
  const index = current.findIndex(p => p.id === updated.id);
  let nextList: ProcessoAdmissaoCompleto[];
  if (index >= 0) {
    nextList = [...current];
    nextList[index] = { ...updated, atualizadoEm: new Date().toISOString().split('T')[0] };
  } else {
    nextList = [updated, ...current];
  }
  saveStoredAdmissoes(nextList);
  return updated;
}

/**
 * Adiciona um novo processo de admissão
 */
export function addAdmissaoProcess(newProcess: Partial<ProcessoAdmissaoCompleto>): ProcessoAdmissaoCompleto {
  const current = getStoredAdmissoes();
  const id = `ADM-2026-${String(current.length + 801).padStart(4, '0')}`;
  const now = new Date();
  const nowStr = now.toISOString().split('T')[0];
  const horaStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dataInicio = newProcess.dataInicioAtividades || nowStr;
  
  const { diasTrabalhados } = calcularDiasTrabalhadosNoMes(dataInicio);

  const disparos = inicializarDisparosOnboarding(
    dataInicio,
    newProcess.candidatoNome || 'Novo Colaborador',
    newProcess.email || '',
    newProcess.telefoneWhatsApp || ''
  );

  const fullProcess: ProcessoAdmissaoCompleto = {
    id,
    candidatoNome: newProcess.candidatoNome || 'Novo Candidato',
    cpf: newProcess.cpf || '',
    cargo: newProcess.cargo || 'Cargo a Definir',
    poloId: newProcess.poloId || 'op-patos',
    poloNome: newProcess.poloNome || 'Polo Patos',
    departamento: newProcess.departamento || 'Operacional',
    salarioPrevisto: newProcess.salarioPrevisto || 2000,
    dataInicioAtividades: dataInicio,
    dataPrevisaoAdmissaoContador: newProcess.dataPrevisaoAdmissaoContador || `${nowStr.substring(0, 7)}-25`,
    email: newProcess.email || '',
    telefoneWhatsApp: newProcess.telefoneWhatsApp || '',
    etapaAtual: 'CADASTRO_INICIAL',
    diasTrabalhadosPrimeiroMes: diasTrabalhados,
    docsIniciaisRecebidos: {
      idRg: false,
      cpf: false,
      comprovanteResidencia: false
    },
    enviosContador: [],
    stoneStart: {
      status: 'NAO_INICIADO'
    },
    formularioToken: `token_adm_${Math.random().toString(36).substring(2, 10)}`,
    disparosOnboarding: disparos,
    documentos: [],
    historicoEtapas: [
      {
        etapa: 'CADASTRO_INICIAL',
        data: `${nowStr} ${horaStr}`,
        usuario: 'Analista de DP / Liderança',
        detalhes: `Informações do colaborador adicionadas à plataforma. Início (1º Dia de Onboarding): ${dataInicio} (${diasTrabalhados} dias trabalhados no 1º mês). Disparos do 1º dia e do término da experiência agendados automaticamente.`
      }
    ],
    criadoEm: nowStr,
    atualizadoEm: nowStr
  };

  const nextList = [fullProcess, ...current];
  saveStoredAdmissoes(nextList);
  return fullProcess;
}

/**
 * Solicita os documentos iniciais (ID, CPF e Comprovante) antes do dia 25
 */
export function solicitarDocsIniciais(processId: string, canal: 'WHATSAPP' | 'EMAIL' = 'WHATSAPP'): ProcessoAdmissaoCompleto | null {
  const current = getStoredAdmissoes();
  const target = current.find(p => p.id === processId);
  if (!target) return null;

  const now = new Date();
  const dataHora = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const updated: ProcessoAdmissaoCompleto = {
    ...target,
    etapaAtual: 'SOLICITACAO_PREVIA_DOCS',
    historicoEtapas: [
      {
        etapa: 'SOLICITACAO_PREVIA_DOCS',
        data: dataHora,
        usuario: 'Analista de DP',
        detalhes: `Solicitação de ID, CPF e Comprovante de Residência disparada via ${canal} para envio antes do dia 25.`
      },
      ...target.historicoEtapas
    ]
  };

  return updateAdmissaoProcess(updated);
}

/**
 * Envia as documentações iniciais + cálculo de dias trabalhados ao contador no dia 25
 */
export function enviarDocsIniciaisContador(
  processId: string, 
  emailContador: string,
  diasTrabalhados: number,
  usuarioNome: string
): ProcessoAdmissaoCompleto | null {
  const current = getStoredAdmissoes();
  const target = current.find(p => p.id === processId);
  if (!target) return null;

  const now = new Date();
  const dataHora = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  const protocolo = `SCL-CONT-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const novoEnvio: EnvioContadorRegistro = {
    id: `ENV-${Date.now()}`,
    tipo: 'ENVIO_INICIAL_PREVIA',
    dataEnvio: dataHora,
    destinatarioEmail: emailContador,
    diasTrabalhadosNoMes: diasTrabalhados,
    competenciaMesAno: calcularDiasTrabalhadosNoMes(target.dataInicioAtividades).mesAno,
    documentosEnviados: target.documentos.filter(d => d.fase === 'INICIAL_PRE_25').map(d => d.nomeArquivo),
    enviadoPor: usuarioNome,
    protocolo,
    status: 'ENVIADO'
  };

  const updated: ProcessoAdmissaoCompleto = {
    ...target,
    diasTrabalhadosPrimeiroMes: diasTrabalhados,
    etapaAtual: 'AGUARDANDO_STONE_START',
    enviosContador: [novoEnvio, ...target.enviosContador],
    historicoEtapas: [
      {
        etapa: 'ENVIO_INICIAL_CONTADOR',
        data: dataHora,
        usuario: usuarioNome,
        detalhes: `Envio do dia 25 para ${emailContador}: ID, CPF, Comprovante e apuração de ${diasTrabalhados} dias trabalhados. Protocolo: ${protocolo}.`
      },
      {
        etapa: 'AGUARDANDO_STONE_START',
        data: dataHora,
        usuario: 'Sistema',
        detalhes: 'Colaborador entrou no período de realização do Stone Start.'
      },
      ...target.historicoEtapas
    ]
  };

  return updateAdmissaoProcess(updated);
}

/**
 * Registra a aprovação do Stone Start
 */
export function aprovarStoneStart(processId: string, aprovadorNome: string, observacoes?: string): ProcessoAdmissaoCompleto | null {
  const current = getStoredAdmissoes();
  const target = current.find(p => p.id === processId);
  if (!target) return null;

  const now = new Date();
  const dataHora = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const updated: ProcessoAdmissaoCompleto = {
    ...target,
    etapaAtual: 'STONE_START_APROVADO',
    stoneStart: {
      status: 'APROVADO',
      dataAprovacao: now.toISOString().split('T')[0],
      aprovadoPor: aprovadorNome,
      observacoes: observacoes || 'Stone Start concluído com êxito.'
    },
    historicoEtapas: [
      {
        etapa: 'STONE_START_APROVADO',
        data: dataHora,
        usuario: aprovadorNome,
        detalhes: `Stone Start aprovado com sucesso. Liberado comando para disparo do formulário de admissão integrado.`
      },
      ...target.historicoEtapas
    ]
  };

  return updateAdmissaoProcess(updated);
}

/**
 * Dispara o Formulário Integrado de Admissão da Plataforma
 */
export function dispararFormularioAdmissao(processId: string, usuarioNome: string): ProcessoAdmissaoCompleto | null {
  const current = getStoredAdmissoes();
  const target = current.find(p => p.id === processId);
  if (!target) return null;

  const now = new Date();
  const dataHora = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const updated: ProcessoAdmissaoCompleto = {
    ...target,
    etapaAtual: 'FORMULARIO_DISPARADO',
    formularioDisparadoEm: dataHora,
    formularioDisparadoPor: usuarioNome,
    historicoEtapas: [
      {
        etapa: 'FORMULARIO_DISPARADO',
        data: dataHora,
        usuario: usuarioNome,
        detalhes: `Formulário integrado de admissão disparado com link exclusivo ao colaborador via E-mail e WhatsApp.`
      },
      ...target.historicoEtapas
    ]
  };

  return updateAdmissaoProcess(updated);
}

/**
 * Salva as respostas do Formulário Integrado de Admissão e atualiza automaticamente o Perfil do Colaborador
 */
export function submeterFormularioAdmissao(
  processId: string, 
  dados: FormularioAdmissaoCompleto,
  anexos: DocumentoAnexoAdmissao[],
  usuarioNome: string = 'Colaborador (Auto-Preenchimento)'
): ProcessoAdmissaoCompleto | null {
  const current = getStoredAdmissoes();
  const target = current.find(p => p.id === processId);
  if (!target) return null;

  const now = new Date();
  const dataHora = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const updatedDocs = [...target.documentos, ...anexos.filter(a => !target.documentos.some(d => d.id === a.id))];

  const updatedProcess: ProcessoAdmissaoCompleto = {
    ...target,
    candidatoNome: dados.nomeCompleto || target.candidatoNome,
    cpf: dados.cpf || target.cpf,
    email: dados.email || target.email,
    telefoneWhatsApp: dados.telefoneCelular || target.telefoneWhatsApp,
    etapaAtual: 'FORMULARIO_PREENCHIDO',
    formularioDados: {
      ...dados,
      preenchidoEm: dataHora,
      preenchidoPor: usuarioNome.includes('Analista') ? 'ANALISTA_RH' : 'COLABORADOR_LINK'
    },
    documentos: updatedDocs,
    historicoEtapas: [
      {
        etapa: 'FORMULARIO_PREENCHIDO',
        data: dataHora,
        usuario: usuarioNome,
        detalhes: `Formulário respondido com sucesso. Todas as informações e documentos foram integrados automaticamente à pasta segura de Admissão do perfil.`
      },
      ...target.historicoEtapas
    ]
  };

  updateAdmissaoProcess(updatedProcess);

  // Sincroniza / Atualiza o Perfil do Colaborador no Quadro Geral com Pasta "Documentos de Admissão" restrita
  sincronizarPerfilComFormularioAdmissao(updatedProcess, dados, updatedDocs);

  return updatedProcess;
}

/**
 * Envia as informações finais de admissão para o contador no dia 25
 */
export function enviarAdmissaoFinalContador(
  processId: string, 
  emailContador: string,
  usuarioNome: string
): ProcessoAdmissaoCompleto | null {
  const current = getStoredAdmissoes();
  const target = current.find(p => p.id === processId);
  if (!target) return null;

  const now = new Date();
  const dataHora = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  const protocolo = `SCL-ADM-FINAL-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const novoEnvio: EnvioContadorRegistro = {
    id: `ENV-${Date.now()}`,
    tipo: 'ENVIO_FINAL_ADMISSAO',
    dataEnvio: dataHora,
    destinatarioEmail: emailContador,
    diasTrabalhadosNoMes: target.diasTrabalhadosPrimeiroMes,
    competenciaMesAno: calcularDiasTrabalhadosNoMes(target.dataInicioAtividades).mesAno,
    documentosEnviados: target.documentos.map(d => d.nomeArquivo),
    enviadoPor: usuarioNome,
    protocolo,
    status: 'ENVIADO'
  };

  const updated: ProcessoAdmissaoCompleto = {
    ...target,
    etapaAtual: 'ENVIO_FINAL_CONTADOR',
    enviosContador: [novoEnvio, ...target.enviosContador],
    historicoEtapas: [
      {
        etapa: 'ENVIO_FINAL_CONTADOR',
        data: dataHora,
        usuario: usuarioNome,
        detalhes: `Dossiê completo de admissão enviado no dia 25 para ${emailContador}. Protocolo: ${protocolo}.`
      },
      ...target.historicoEtapas
    ]
  };

  return updateAdmissaoProcess(updated);
}

/**
 * Dispara os Documentos do 1º Dia de Onboarding (Contrato de Experiência, Renúncia do VT, Manual de Conduta)
 */
export function dispararDocumentosPrimeiroDiaOnboarding(
  processId: string,
  canal: 'WHATSAPP_EMAIL' | 'PLATAFORMA_PORTAL' | 'EMAIL' = 'WHATSAPP_EMAIL',
  usuarioNome: string = 'Analista de Gente & Gestão'
): ProcessoAdmissaoCompleto | null {
  const current = getStoredAdmissoes();
  const target = current.find(p => p.id === processId);
  if (!target) return null;

  const now = new Date();
  const dataHora = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  
  const docsDisparados = target.disparosOnboarding.primeiroDiaOnboarding.documentos.map(doc => ({
    ...doc,
    status: 'DISPARADO' as const,
    dataDisparo: dataHora,
    canalEnvio: canal,
    protocolo: `SCL-ONB-D1-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`
  }));

  const updated: ProcessoAdmissaoCompleto = {
    ...target,
    disparosOnboarding: {
      ...target.disparosOnboarding,
      primeiroDiaOnboarding: {
        ...target.disparosOnboarding.primeiroDiaOnboarding,
        status: 'DISPARADO_AUTOMATICO',
        disparadoEm: dataHora,
        documentos: docsDisparados
      }
    },
    historicoEtapas: [
      {
        etapa: target.etapaAtual,
        data: dataHora,
        usuario: usuarioNome,
        detalhes: `Disparo automático do 1º dia de Onboarding realizado via ${canal}: Contrato de Experiência, Renúncia do VT e Manual de Conduta enviados para ${target.email || target.telefoneWhatsApp}.`
      },
      ...target.historicoEtapas
    ]
  };

  return updateAdmissaoProcess(updated);
}

/**
 * Dispara o Contrato de Trabalho Definitivo (Prazo Indeterminado) ao final dos 90 dias de experiência
 */
export function dispararContratoFinalExperiencia(
  processId: string,
  canal: 'WHATSAPP_EMAIL' | 'PLATAFORMA_PORTAL' | 'EMAIL' = 'WHATSAPP_EMAIL',
  usuarioNome: string = 'Analista de Gente & Gestão'
): ProcessoAdmissaoCompleto | null {
  const current = getStoredAdmissoes();
  const target = current.find(p => p.id === processId);
  if (!target) return null;

  const now = new Date();
  const dataHora = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const docsDisparados = target.disparosOnboarding.finalPeriodoExperiencia.documentos.map(doc => ({
    ...doc,
    status: 'DISPARADO' as const,
    dataDisparo: dataHora,
    canalEnvio: canal,
    protocolo: `SCL-CONT-DEF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`
  }));

  const updated: ProcessoAdmissaoCompleto = {
    ...target,
    disparosOnboarding: {
      ...target.disparosOnboarding,
      finalPeriodoExperiencia: {
        ...target.disparosOnboarding.finalPeriodoExperiencia,
        status: 'DISPARADO_AUTOMATICO',
        disparadoEm: dataHora,
        documentos: docsDisparados
      }
    },
    historicoEtapas: [
      {
        etapa: target.etapaAtual,
        data: dataHora,
        usuario: usuarioNome,
        detalhes: `Disparo do Contrato de Trabalho Definitivo (Efetivação de Experiência 90 dias) realizado com sucesso via ${canal}.`
      },
      ...target.historicoEtapas
    ]
  };

  return updateAdmissaoProcess(updated);
}

/**
 * Registra a assinatura digital de qualquer documento de onboarding ou experiência
 */
export function assinarDocumentoOnboarding(
  processId: string,
  docId: string,
  assinadoPor: string
): ProcessoAdmissaoCompleto | null {
  const current = getStoredAdmissoes();
  const target = current.find(p => p.id === processId);
  if (!target) return null;

  const now = new Date();
  const dataHora = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  const hash = `SHA256-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

  // Atualiza no 1º dia
  const docsD1 = target.disparosOnboarding.primeiroDiaOnboarding.documentos.map(doc => {
    if (doc.id === docId) {
      return {
        ...doc,
        status: 'ASSINADO' as const,
        assinadoEm: dataHora,
        assinadoPor,
        hashAutenticacao: hash
      };
    }
    return doc;
  });

  // Atualiza no final da experiência
  const docsFim = target.disparosOnboarding.finalPeriodoExperiencia.documentos.map(doc => {
    if (doc.id === docId) {
      return {
        ...doc,
        status: 'ASSINADO' as const,
        assinadoEm: dataHora,
        assinadoPor,
        hashAutenticacao: hash
      };
    }
    return doc;
  });

  const todosD1Assinados = docsD1.every(d => d.status === 'ASSINADO');
  const todosFimAssinados = docsFim.every(d => d.status === 'ASSINADO');

  const updated: ProcessoAdmissaoCompleto = {
    ...target,
    disparosOnboarding: {
      primeiroDiaOnboarding: {
        ...target.disparosOnboarding.primeiroDiaOnboarding,
        status: todosD1Assinados ? 'CONCLUIDO' : target.disparosOnboarding.primeiroDiaOnboarding.status,
        documentos: docsD1
      },
      finalPeriodoExperiencia: {
        ...target.disparosOnboarding.finalPeriodoExperiencia,
        status: todosFimAssinados ? 'CONCLUIDO' : target.disparosOnboarding.finalPeriodoExperiencia.status,
        documentos: docsFim
      }
    },
    historicoEtapas: [
      {
        etapa: target.etapaAtual,
        data: dataHora,
        usuario: assinadoPor,
        detalhes: `Assinatura digital registrada para o documento (ID: ${docId}) com hash de autenticidade ${hash.substring(0, 16)}...`
      },
      ...target.historicoEtapas
    ]
  };

  return updateAdmissaoProcess(updated);
}

/**
 * Conclui a Admissão e efetiva o colaborador no Quadro Geral
 */
export function concluirAdmissaoEfetivar(processId: string, usuarioNome: string): ProcessoAdmissaoCompleto | null {
  const current = getStoredAdmissoes();
  const target = current.find(p => p.id === processId);
  if (!target) return null;

  const now = new Date();
  const dataHora = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  const updated: ProcessoAdmissaoCompleto = {
    ...target,
    etapaAtual: 'ADMISSAO_CONCLUIDA',
    historicoEtapas: [
      {
        etapa: 'ADMISSAO_CONCLUIDA',
        data: dataHora,
        usuario: usuarioNome,
        detalhes: `Admissão concluída com 100% de conformidade! Colaborador registrado ativamente no Quadro Geral.`
      },
      ...target.historicoEtapas
    ]
  };

  updateAdmissaoProcess(updated);

  // Garante que o status no quadro esteja como EM_ATIVIDADE
  if (target.collaboratorId) {
    const existingList = getStoredCollaborators();
    const colab = existingList.find(c => c.id === target.collaboratorId);
    if (colab) {
      updateStoredCollaborator({
        ...colab,
        status: 'EM_ATIVIDADE'
      });
    }
  }

  return updated;
}

/**
 * Sincroniza os dados coletados com a pasta de Documentos de Admissão do perfil
 */
function sincronizarPerfilComFormularioAdmissao(
  processo: ProcessoAdmissaoCompleto, 
  dados: FormularioAdmissaoCompleto,
  documentos: DocumentoAnexoAdmissao[]
) {
  const existingList = getStoredCollaborators();
  
  // Procura por CPF ou por nome
  let colab = existingList.find(c => c.cpf.replace(/\D/g, '') === processo.cpf.replace(/\D/g, '') || c.id === processo.collaboratorId);

  const pastaDocumentosAdmissao = documentos.map(doc => ({
    id: doc.id,
    name: doc.nomeArquivo,
    category: doc.tipo.replace(/_/g, ' '),
    uploadedAt: doc.dataUpload,
    fileSize: doc.tamanho,
    url: doc.url,
    verified: doc.status === 'VALIDADO',
    accessRestricted: true, // APENAS COLABORADOR, LIDERANÇAS E ANALISTAS
    source: 'FORMULARIO_ADMISSAO' as const
  }));

  if (colab) {
    // Atualiza colaborador existente
    const updated: CollaboratorProfile = {
      ...colab,
      fullName: dados.nomeCompleto || colab.fullName,
      cpf: dados.cpf || colab.cpf,
      rg: dados.rgNumero || colab.rg,
      rgIssuer: dados.rgOrgaoEmissor ? `${dados.rgOrgaoEmissor}/${dados.rgUF}` : colab.rgIssuer,
      email: dados.email || colab.email,
      phone: dados.telefoneCelular || colab.phone,
      personalData: {
        ...colab.personalData,
        birthDate: dados.dataNascimento || colab.personalData.birthDate,
        gender: dados.genero || colab.personalData.gender,
        maritalStatus: dados.estadoCivil || colab.personalData.maritalStatus,
        nationality: dados.nacionalidade || colab.personalData.nationality,
        motherName: dados.nomeMae,
        fatherName: dados.nomePai,
        pisPasep: dados.pisPasep,
        ctpsNumber: dados.ctpsNumero,
        ctpsSeries: dados.ctpsSerie,
        militaryCertificate: dados.certificadoReservista,
        cnhNumber: dados.cnhNumero,
        cnhCategory: dados.cnhCategoria,
        educationLevel: dados.grauInstrucao,
        address: {
          street: dados.logradouro || colab.personalData.address.street,
          number: dados.numero || colab.personalData.address.number,
          neighborhood: dados.bairro || colab.personalData.address.neighborhood,
          city: dados.cidade || colab.personalData.address.city,
          state: dados.uf || colab.personalData.address.state,
          zipCode: dados.cep || colab.personalData.address.zipCode
        },
        emergencyContact: {
          name: dados.contatoEmergenciaNome || colab.personalData.emergencyContact.name,
          phone: dados.contatoEmergenciaTelefone || colab.personalData.emergencyContact.phone,
          relationship: dados.contatoEmergenciaParentesco || colab.personalData.emergencyContact.relationship
        },
        shirtSize: dados.tamanhoUniformeCamisa || colab.personalData.shirtSize
      },
      bankAccount: {
        bankName: dados.bancoNome || colab.bankAccount.bankName,
        bankCode: dados.bancoCodigo || colab.bankAccount.bankCode,
        agency: dados.agencia || colab.bankAccount.agency,
        accountNumber: dados.contaNumero || colab.bankAccount.accountNumber,
        accountType: dados.tipoConta || colab.bankAccount.accountType,
        pixKey: dados.chavePix || colab.bankAccount.pixKey
      },
      dependents: dados.possuiDependentes && dados.dependentes ? dados.dependentes.map(d => ({
        id: d.id,
        name: d.nome,
        relationship: d.parentesco === 'FILHO' ? 'FILHO' : d.parentesco === 'CONJUGE' ? 'CONJUGE' : 'OUTRO',
        birthDate: d.dataNascimento,
        cpf: d.cpf,
        isTaxDependent: d.dependenteIRRF
      })) : colab.dependents,
      admissionData: {
        processId: processo.id,
        completedAt: new Date().toISOString(),
        diasTrabalhadosPrimeiroMes: processo.diasTrabalhadosPrimeiroMes,
        stoneStartApprovedAt: processo.stoneStart.dataAprovacao,
        stoneStartApprovedBy: processo.stoneStart.aprovadoPor,
        admissionDocuments: pastaDocumentosAdmissao
      }
    };

    updateStoredCollaborator(updated);
  } else {
    // Cria novo registro no quadro de colaboradores com status EM_ADMISSAO
    const novoColab: CollaboratorProfile = {
      id: `colab-${Date.now()}`,
      registrationNumber: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: dados.nomeCompleto,
      preferredName: dados.nomeSocial || dados.nomeCompleto.split(' ')[0],
      cpf: dados.cpf,
      rg: dados.rgNumero,
      rgIssuer: `${dados.rgOrgaoEmissor}/${dados.rgUF}`,
      email: dados.email,
      phone: dados.telefoneCelular,
      branchId: processo.poloId,
      branchName: processo.poloNome,
      departmentId: 'dept-operacoes',
      departmentName: processo.departamento,
      costCenter: 'CC-SCL-101',
      positionId: 'pos-operador',
      positionTitle: processo.cargo,
      seniority: 'Operacional',
      directSupervisor: 'Coordenação Regional',
      admissionDate: processo.dataInicioAtividades,
      contractType: 'CLT',
      status: 'EM_ADMISSAO',
      salary: processo.salarioPrevisto,
      paymentMethod: 'TRANSFERENCIA_BANCARIA',
      workSchedule: '44h semanais (Escala 5x2)',
      skills: ['Onboarding SCL', 'Stone Start', 'Operações'],
      personalData: {
        birthDate: dados.dataNascimento,
        gender: dados.genero,
        maritalStatus: dados.estadoCivil,
        nationality: dados.nacionalidade || 'Brasileira',
        motherName: dados.nomeMae,
        fatherName: dados.nomePai,
        pisPasep: dados.pisPasep,
        ctpsNumber: dados.ctpsNumero,
        ctpsSeries: dados.ctpsSerie,
        militaryCertificate: dados.certificadoReservista,
        cnhNumber: dados.cnhNumero,
        cnhCategory: dados.cnhCategoria,
        educationLevel: dados.grauInstrucao,
        address: {
          street: dados.logradouro,
          number: dados.numero,
          neighborhood: dados.bairro,
          city: dados.cidade,
          state: dados.uf,
          zipCode: dados.cep
        },
        emergencyContact: {
          name: dados.contatoEmergenciaNome,
          phone: dados.contatoEmergenciaTelefone,
          relationship: dados.contatoEmergenciaParentesco
        },
        shirtSize: dados.tamanhoUniformeCamisa
      },
      bankAccount: {
        bankName: dados.bancoNome,
        bankCode: dados.bancoCodigo,
        agency: dados.agencia,
        accountNumber: dados.contaNumero,
        accountType: dados.tipoConta,
        pixKey: dados.chavePix
      },
      dependents: dados.possuiDependentes && dados.dependentes ? dados.dependentes.map(d => ({
        id: d.id,
        name: d.nome,
        relationship: d.parentesco === 'FILHO' ? 'FILHO' : d.parentesco === 'CONJUGE' ? 'CONJUGE' : 'OUTRO',
        birthDate: d.dataNascimento,
        cpf: d.cpf,
        isTaxDependent: d.dependenteIRRF
      })) : [],
      benefits: [
        {
          id: 'ben-vt',
          name: 'Vale Transporte (SCL Conectividade)',
          type: 'VT',
          monthlyValue: dados.opcaoValeTransporte ? 280 : 0,
          discountPercentage: 6,
          provider: 'Operadora Municipal',
          status: dados.opcaoValeTransporte ? 'ATIVO' : 'INATIVO'
        }
      ],
      careerHistory: [
        {
          id: `car-${Date.now()}`,
          positionTitle: processo.cargo,
          departmentName: processo.departamento,
          salary: processo.salarioPrevisto,
          startDate: processo.dataInicioAtividades,
          reason: 'ADMISSAO'
        }
      ],
      vacationPeriods: [],
      epis: [],
      disciplinaryActions: [],
      medicalExams: [
        {
          id: `med-${Date.now()}`,
          type: 'ADMISSIONAL',
          examDate: processo.dataInicioAtividades,
          validUntil: `${Number(processo.dataInicioAtividades.split('-')[0]) + 1}-${processo.dataInicioAtividades.substring(5)}`,
          clinicName: 'Medicina Ocupacional Credenciada',
          result: 'APTO',
          status: 'EM_DIA'
        }
      ],
      onboardingChecklist: [
        { task: 'Envio de documentação inicial', completed: true, date: processo.criadoEm },
        { task: 'Conclusão e Aprovação Stone Start', completed: true, date: processo.stoneStart.dataAprovacao },
        { task: 'Preenchimento do formulário integrado de admissão', completed: true, date: new Date().toISOString().split('T')[0] },
        { task: 'Recebimento de equipamentos e EPIs', completed: false }
      ],
      admissionData: {
        processId: processo.id,
        completedAt: new Date().toISOString(),
        diasTrabalhadosPrimeiroMes: processo.diasTrabalhadosPrimeiroMes,
        stoneStartApprovedAt: processo.stoneStart.dataAprovacao,
        stoneStartApprovedBy: processo.stoneStart.aprovadoPor,
        admissionDocuments: pastaDocumentosAdmissao
      }
    };

    addStoredCollaborator(novoColab);
  }
}

/**
 * Hook do React para sincronização de processos de admissão
 */
export function useStoredAdmissoes() {
  const [admissoes, setAdmissoes] = useState<ProcessoAdmissaoCompleto[]>(() => {
    return getStoredAdmissoes();
  });

  useEffect(() => {
    setAdmissoes(getStoredAdmissoes());

    const handleUpdate = (event: CustomEvent<ProcessoAdmissaoCompleto[]>) => {
      if (event.detail && Array.isArray(event.detail)) {
        setAdmissoes(event.detail);
      } else {
        setAdmissoes(getStoredAdmissoes());
      }
    };

    window.addEventListener(ADMISSOES_UPDATE_EVENT as unknown as string, handleUpdate as EventListener);
    return () => {
      window.removeEventListener(ADMISSOES_UPDATE_EVENT as unknown as string, handleUpdate as EventListener);
    };
  }, []);

  return {
    admissoes,
    addProcesso: addAdmissaoProcess,
    updateProcesso: updateAdmissaoProcess,
    solicitarDocs: solicitarDocsIniciais,
    enviarDocsIniciaisContador,
    aprovarStoneStart,
    dispararFormulario: dispararFormularioAdmissao,
    submeterFormulario: submeterFormularioAdmissao,
    enviarAdmissaoFinal: enviarAdmissaoFinalContador,
    concluirAdmissao: concluirAdmissaoEfetivar,
    dispararDocumentosPrimeiroDia: dispararDocumentosPrimeiroDiaOnboarding,
    dispararContratoFinal: dispararContratoFinalExperiencia,
    assinarDocumento: assinarDocumentoOnboarding
  };
}
