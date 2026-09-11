export type AdmissaoStage = 
  | 'CADASTRO_INICIAL'            // 1. Informações adicionadas na plataforma
  | 'SOLICITACAO_PREVIA_DOCS'     // 2. Solicitado ID, CPF e Comprovante de Residência (antes do dia 25)
  | 'ENVIO_INICIAL_CONTADOR'      // 3. Enviado dia 25 para contador com dias trabalhados no mês
  | 'AGUARDANDO_STONE_START'      // 4. Esperando Stone Start (sem nada programado)
  | 'STONE_START_APROVADO'        // 4b. Stone Start aprovado (pronto para disparar formulário)
  | 'FORMULARIO_DISPARADO'        // 5. Forms de admissão integrado enviado ao colaborador
  | 'FORMULARIO_PREENCHIDO'       // 5b. Forms respondido, dados e pasta no perfil atualizados
  | 'ENVIO_FINAL_CONTADOR'        // 6. Enviado no dia 25 ao contador com dados completos
  | 'ADMISSAO_CONCLUIDA';         // 7. Colaborador admitido com sucesso!

export interface DocumentoAnexoAdmissao {
  id: string;
  tipo: 
    | 'ID_RG_CNH' 
    | 'CPF' 
    | 'COMPROVANTE_RESIDENCIA' 
    | 'FOTO_3X4' 
    | 'CERTIDAO_NASC_CASAMENTO' 
    | 'CERTIDAO_FILHOS' 
    | 'COMPROVANTE_ESCOLARIDADE' 
    | 'ASO_ADMISSIONAL' 
    | 'COMPROVANTE_BANCARIO' 
    | 'TITULO_ELEITOR' 
    | 'RESERVISTA' 
    | 'OUTRO';
  nomeArquivo: string;
  tamanho: string;
  dataUpload: string;
  url: string;
  status: 'PENDENTE' | 'RECEBIDO' | 'VALIDADO' | 'REJEITADO';
  observacao?: string;
  fase: 'INICIAL_PRE_25' | 'FORMULARIO_COMPLETO';
}

export interface DependenteAdmissao {
  id: string;
  nome: string;
  parentesco: 'FILHO' | 'CONJUGE' | 'ENTEADO' | 'PAI_MAE' | 'OUTRO';
  cpf: string;
  dataNascimento: string;
  dependenteIRRF: boolean;
  salarioFamilia: boolean;
  certidaoNumero?: string;
}

export interface FormularioAdmissaoCompleto {
  // 1. Dados Pessoais
  nomeCompleto: string;
  nomeSocial?: string;
  genero: string;
  estadoCivil: string;
  racaCor: string;
  dataNascimento: string;
  nacionalidade: string;
  naturalidadeCidade: string;
  naturalidadeUF: string;
  nomeMae: string;
  nomePai?: string;
  grauInstrucao: string;

  // 2. Contato & Endereço
  email: string;
  telefoneCelular: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;

  // 3. Documentação
  cpf: string;
  rgNumero: string;
  rgOrgaoEmissor: string;
  rgUF: string;
  rgDataEmissao: string;
  pisPasep?: string;
  ctpsNumero?: string;
  ctpsSerie?: string;
  ctpsUF?: string;
  tituloEleitorNumero?: string;
  tituloZona?: string;
  tituloSecao?: string;
  tituloCidadeUF?: string;
  certificadoReservista?: string;
  cnhNumero?: string;
  cnhCategoria?: string;
  cnhValidade?: string;

  // 4. Dados Bancários
  bancoNome: string;
  bancoCodigo: string;
  agencia: string;
  contaNumero: string;
  tipoConta: 'CORRENTE' | 'POUPANCA';
  chavePix?: string;

  // 5. Dependentes
  possuiDependentes: boolean;
  dependentes: DependenteAdmissao[];

  // 6. Informações de Emergência & Benefícios
  contatoEmergenciaNome: string;
  contatoEmergenciaTelefone: string;
  contatoEmergenciaParentesco: string;
  opcaoValeTransporte: boolean;
  linhasTransporte?: string;
  tamanhoUniformeCamisa?: string;
  ePcd: boolean;
  detalhesPcd?: string;

  // Metadados de preenchimento
  preenchidoEm?: string;
  preenchidoPor?: 'COLABORADOR_LINK' | 'ANALISTA_RH';
  ipOrigem?: string;
}

export interface EnvioContadorRegistro {
  id: string;
  tipo: 'ENVIO_INICIAL_PREVIA' | 'ENVIO_FINAL_ADMISSAO';
  dataEnvio: string;
  destinatarioEmail: string;
  diasTrabalhadosNoMes: number;
  competenciaMesAno: string;
  documentosEnviados: string[];
  enviadoPor: string;
  protocolo: string;
  status: 'ENVIADO' | 'CONFIRMADO_CONTABILIDADE';
}

export type TipoDocumentoDisparo = 
  | 'CONTRATO_EXPERIENCIA' 
  | 'RENUNCIA_VALE_TRANSPORTE' 
  | 'MANUAL_CONDUTA' 
  | 'CONTRATO_TRABALHO_DEFINITIVO';

export interface DisparoDocumentoItem {
  id: string;
  tipo: TipoDocumentoDisparo;
  titulo: string;
  descricao: string;
  momento: 'PRIMEIRO_DIA_ONBOARDING' | 'FINAL_PERIODO_EXPERIENCIA';
  dataProgramada: string;
  dataDisparo?: string;
  status: 'AGENDADO' | 'DISPARADO' | 'ASSINADO' | 'VISUALIZADO';
  canalEnvio: 'WHATSAPP_EMAIL' | 'PLATAFORMA_PORTAL' | 'EMAIL';
  destinatario: string;
  protocolo?: string;
  assinadoEm?: string;
  assinadoPor?: string;
  hashAutenticacao?: string;
  urlDocumento?: string;
  opcaoVtRenuncia?: 'RENUNCIA' | 'OPCAO_VT';
}

export interface GestaoDisparosOnboarding {
  // Disparo 1: 1º Dia de Onboarding (Data informada no cadastro)
  primeiroDiaOnboarding: {
    dataOnboarding: string;
    status: 'AGENDADO' | 'DISPARADO_AUTOMATICO' | 'CONCLUIDO';
    disparadoEm?: string;
    documentos: DisparoDocumentoItem[];
  };
  // Disparo 2: Final do Período de Experiência (90 dias)
  finalPeriodoExperiencia: {
    dataTerminoExperiencia: string;
    diasExperiencia: number; // Padrão 90 dias (45+45)
    status: 'AGENDADO' | 'DISPARADO_AUTOMATICO' | 'CONCLUIDO';
    disparadoEm?: string;
    documentos: DisparoDocumentoItem[];
  };
}

export interface ProcessoAdmissaoCompleto {
  id: string;
  collaboratorId?: string; // ID quando vinculado ao quadro
  candidatoNome: string;
  cpf: string;
  cargo: string;
  poloId: string;
  poloNome: string;
  departamento: string;
  salarioPrevisto: number;
  dataInicioAtividades: string; // Data em que começou a trabalhar (1º Dia de Onboarding)
  dataPrevisaoAdmissaoContador: string; // Ex: dia 25 do mês vigente
  email: string;
  telefoneWhatsApp: string;
  
  // Controle de Etapa do Fluxo SCL
  etapaAtual: AdmissaoStage;
  
  // Apuração de dias trabalhados no 1º mês
  diasTrabalhadosPrimeiroMes: number;
  
  // Etapa 2: Documentos Iniciais (ID, CPF, Comprovante)
  docsIniciaisRecebidos: {
    idRg: boolean;
    cpf: boolean;
    comprovanteResidencia: boolean;
  };
  
  // Etapa 3: Histórico de Envios para a Contabilidade
  enviosContador: EnvioContadorRegistro[];
  
  // Etapa 4: Stone Start
  stoneStart: {
    status: 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'APROVADO' | 'REPROVADO';
    dataAprovacao?: string;
    aprovadoPor?: string;
    observacoes?: string;
  };

  // Etapa 5: Formulário Integrado de Admissão
  formularioToken: string; // Token único para acesso ao forms
  formularioLinkExpiracao?: string;
  formularioDisparadoEm?: string;
  formularioDisparadoPor?: string;
  formularioDados?: FormularioAdmissaoCompleto;
  
  // Disparos Automáticos de Onboarding & Fim de Experiência
  disparosOnboarding: GestaoDisparosOnboarding;

  // Documentos anexados
  documentos: DocumentoAnexoAdmissao[];
  
  // Histórico e Auditoria
  historicoEtapas: {
    etapa: AdmissaoStage;
    data: string;
    usuario: string;
    detalhes: string;
  }[];
  
  criadoEm: string;
  atualizadoEm: string;
}
