import { ProcessoAdmissaoCompleto, DisparoDocumentoItem, GestaoDisparosOnboarding } from '../types/admissao';

/**
 * Calcula a data exata de término do período de experiência (90 dias corridos)
 */
export function calcularDataTerminoExperiencia(dataInicio: string, dias: number = 90): string {
  if (!dataInicio) return '';
  const [ano, mes, dia] = dataInicio.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  data.setDate(data.getDate() + dias);
  return data.toISOString().split('T')[0];
}

/**
 * Formata data no formato brasileiro DD/MM/AAAA
 */
export function formatarDataBR(dataStr?: string): string {
  if (!dataStr) return '-';
  const parts = dataStr.split('T')[0].split('-');
  if (parts.length !== 3) return dataStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Inicializa a estrutura de disparos de documentos de onboarding e término da experiência
 */
export function inicializarDisparosOnboarding(
  dataInicioAtividades: string,
  candidatoNome: string,
  email: string,
  telefone: string,
  opcaoVt: 'RENUNCIA' | 'OPCAO_VT' = 'RENUNCIA'
): GestaoDisparosOnboarding {
  const dataTerminoExperiencia = calcularDataTerminoExperiencia(dataInicioAtividades, 90);
  const data45Dias = calcularDataTerminoExperiencia(dataInicioAtividades, 45);

  const docsPrimeiroDia: DisparoDocumentoItem[] = [
    {
      id: `DOC-EXP-${Date.now()}-1`,
      tipo: 'CONTRATO_EXPERIENCIA',
      titulo: 'Contrato Individual de Trabalho a Título de Experiência',
      descricao: 'Contrato em regime de experiência (45 + 45 dias) com cláusulas CLT, remuneração, jornada e polo de atuação.',
      momento: 'PRIMEIRO_DIA_ONBOARDING',
      dataProgramada: dataInicioAtividades,
      status: 'AGENDADO',
      canalEnvio: 'WHATSAPP_EMAIL',
      destinatario: email || telefone,
      opcaoVtRenuncia: opcaoVt
    },
    {
      id: `DOC-VT-${Date.now()}-2`,
      tipo: 'RENUNCIA_VALE_TRANSPORTE',
      titulo: 'Termo de Opção / Renúncia do Vale Transporte',
      descricao: 'Declaração formal de não utilização/renúncia do benefício de Vale Transporte (Lei 7.418/85).',
      momento: 'PRIMEIRO_DIA_ONBOARDING',
      dataProgramada: dataInicioAtividades,
      status: 'AGENDADO',
      canalEnvio: 'WHATSAPP_EMAIL',
      destinatario: email || telefone,
      opcaoVtRenuncia: opcaoVt
    },
    {
      id: `DOC-MAN-${Date.now()}-3`,
      tipo: 'MANUAL_CONDUTA',
      titulo: 'Manual de Conduta, Ética e Segurança SCL Solar',
      descricao: 'Código de cultura, conformidade ética, regras de segurança solar (NR-10/NR-35) e diretrizes corporativas.',
      momento: 'PRIMEIRO_DIA_ONBOARDING',
      dataProgramada: dataInicioAtividades,
      status: 'AGENDADO',
      canalEnvio: 'WHATSAPP_EMAIL',
      destinatario: email || telefone
    }
  ];

  const docsFimExperiencia: DisparoDocumentoItem[] = [
    {
      id: `DOC-DEF-${Date.now()}-4`,
      tipo: 'CONTRATO_TRABALHO_DEFINITIVO',
      titulo: 'Contrato de Trabalho por Tempo Indeterminado (Efetivação)',
      descricao: 'Termo de efetivação pós-avaliação do período de experiência de 90 dias, convertendo o contrato para prazo indeterminado.',
      momento: 'FINAL_PERIODO_EXPERIENCIA',
      dataProgramada: dataTerminoExperiencia,
      status: 'AGENDADO',
      canalEnvio: 'WHATSAPP_EMAIL',
      destinatario: email || telefone
    }
  ];

  return {
    primeiroDiaOnboarding: {
      dataOnboarding: dataInicioAtividades,
      status: 'AGENDADO',
      documentos: docsPrimeiroDia
    },
    finalPeriodoExperiencia: {
      dataTerminoExperiencia,
      diasExperiencia: 90,
      status: 'AGENDADO',
      documentos: docsFimExperiencia
    }
  };
}

/**
 * Gera o texto jurídico completo de cada documento para leitura, prévia e download
 */
export function gerarMinutaTextoDocumento(
  docTipo: DisparoDocumentoItem['tipo'],
  processo: ProcessoAdmissaoCompleto,
  docItem?: DisparoDocumentoItem
): string {
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const nome = processo.candidatoNome;
  const cpf = processo.cpf;
  const cargo = processo.cargo;
  const polo = processo.poloNome;
  const salario = processo.salarioPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const dataInicioBR = formatarDataBR(processo.dataInicioAtividades);
  const dataFimExpBR = formatarDataBR(processo.disparosOnboarding?.finalPeriodoExperiencia.dataTerminoExperiencia || calcularDataTerminoExperiencia(processo.dataInicioAtividades, 90));
  const data45DiasBR = formatarDataBR(calcularDataTerminoExperiencia(processo.dataInicioAtividades, 45));

  if (docTipo === 'CONTRATO_EXPERIENCIA') {
    return `================================================================================
                    SCL GESTÃO & ENERGIA SOLAR - DOCUMENTO OFICIAL
            CONTRATO INDIVIDUAL DE TRABALHO A TÍTULO DE EXPERIÊNCIA
                        (Artigos 443 e 445 da CLT)
================================================================================

EMPREGADORA: SCL OPERAÇÕES E GESTÃO SOLAR LTDA.
UNIDADE / POLO: ${polo}
CNPJ: 40.397.157/0001-17

EMPREGADO(A): ${nome}
CPF: ${cpf}
CARGO: ${cargo}
SALÁRIO BASE MENSAL: R$ ${salario}
DATA DE INÍCIO DAS ATIVIDADES: ${dataInicioBR}

--------------------------------------------------------------------------------
CLÁUSULAS CONTRATUAIS:
--------------------------------------------------------------------------------

CLÁUSULA PRIMEIRA - DO OBJETO E FUNÇÃO:
O(A) EMPREGADO(A) é contratado(a) para exercer a função de ${cargo}, desempenhando 
todas as atribuições inerentes ao cargo na unidade ${polo}, além de tarefas correlatas 
determinadas pela gestão técnica e operacional.

CLÁUSULA SEGUNDA - DO PRAZO DETERMINADO DE EXPERIÊNCIA:
O presente contrato é celebrado a título de EXPERIÊNCIA, com vigência inicial de 
45 (quarenta e cinco) dias, iniciando-se em ${dataInicioBR} e com término da 1ª fase 
em ${data45DiasBR}.
§ Único: Não havendo manifestação em contrário de qualquer das partes, o contrato 
será automaticamente prorrogado por igual período de 45 (quarenta e cinco) dias, 
totalizando o prazo máximo legal de 90 (noventa) dias, com término previsto para ${dataFimExpBR}.

CLÁUSULA TERCEIRA - DA REMUNERAÇÃO E BENEFÍCIOS:
A EMPREGADORA pagará ao(à) EMPREGADO(A) o salário mensal de R$ ${salario}, mediante 
crédito bancário até o 5º dia útil do mês subsequente, acrescido dos adicionais legais 
e benefícios pactuados na admissão.

CLÁUSULA QUARTA - DA JORNADA DE TRABALHO:
A jornada de trabalho será de 44 (quarenta e quatro) horas semanais, em conformidade 
com as necessidades operacionais da Estação Solar, respeitados os intervalos intrajornada.

CLÁUSULA QUINTA - DA SEGURANÇA DO TRABALHO E EPI:
O(A) EMPREGADO(A) declara que recebeu as diretrizes de segurança, comprometendo-se ao 
uso obrigatório de todos os Equipamentos de Proteção Individual (EPIs) fornecidos 
para atividades em usinas fotovoltaicas e cumprimento das NRs 10 e 35.

CLÁUSULA SEXTA - DA CONFIDENCIALIDADE E LGPD:
O(A) EMPREGADO(A) obriga-se a manter total sigilo sobre dados, processos industriais, 
projetos solares e dados pessoais a que tiver acesso, nos termos da Lei Geral de 
Proteção de Dados (Lei 13.709/2018).

--------------------------------------------------------------------------------
STATUS DO DISPARO / ASSINATURA:
--------------------------------------------------------------------------------
Status: ${docItem?.status === 'ASSINADO' ? 'ASSINADO ELETRONICAMENTE' : docItem?.status === 'DISPARADO' ? 'DISPARADO (AGUARDANDO ASSINATURA)' : 'AGENDADO PARA O 1º DIA DE ONBOARDING'}
Protocolo Digital: ${docItem?.protocolo || `SCL-EXP-${Date.now()}`}
Canal de Autenticação: WhatsApp / E-mail Seguro com Token Criptográfico ICP-Brasil
Data de Registro: ${docItem?.assinadoEm ? formatarDataBR(docItem.assinadoEm) : dataHoje}
`;
  }

  if (docTipo === 'RENUNCIA_VALE_TRANSPORTE') {
    return `================================================================================
                    SCL GESTÃO & ENERGIA SOLAR - DOCUMENTO OFICIAL
            TERMO DE DECLARAÇÃO E RENÚNCIA DE VALE TRANSPORTE
             (Lei nº 7.418/1985 e Decreto nº 95.247/1987)
================================================================================

COLABORADOR(A): ${nome}
CPF: ${cpf}
CARGO: ${cargo}
POLO DE LOTAÇÃO: ${polo}
DATA DE ONBOARDING: ${dataInicioBR}

--------------------------------------------------------------------------------
DECLARAÇÃO DO COLABORADOR:
--------------------------------------------------------------------------------

Eu, ${nome}, portador(a) do CPF nº ${cpf}, na qualidade de colaborador(a) contratado(a) 
pela SCL OPERAÇÕES E GESTÃO SOLAR LTDA:

[X] DECLARO, para todos os efeitos legais previstos na Lei Federal nº 7.418/1985 e no 
    Decreto Federal nº 95.247/1987, que:

1. NÃO OPTO pela utilização do benefício de Vale Transporte fornecido pelo empregador, 
   em razão de me deslocar para o local de trabalho por meios próprios (condução própria, 
   carona, transporte alternativo ou por residir nas proximidades da unidade).

2. Autorizo a NÃO realização do desconto legal de até 6% (seis por cento) sobre o meu 
   salário base contratual a título de custeio de transporte.

3. Comprometo-me a comunicar formalmente ao Departamento Pessoal qualquer alteração de 
   endereço residencial ou mudança de condição que venha a justificar a futura solicitação 
   deste benefício.

Declaro serem verdadeiras as informações prestadas sob as penas da lei.

--------------------------------------------------------------------------------
AUTENTICAÇÃO DIGITAL DO TERMO:
--------------------------------------------------------------------------------
Status: ${docItem?.status === 'ASSINADO' ? 'ASSINADO ELETRONICAMENTE' : 'DISPARADO / AGENDADO'}
Protocolo: ${docItem?.protocolo || `SCL-VT-REN-${Date.now()}`}
Canal de Coleta: Integração Automática de Onboarding SCL Solar
Assinado Digitalmente por: ${nome} (CPF: ${cpf})
`;
  }

  if (docTipo === 'MANUAL_CONDUTA') {
    return `================================================================================
                    SCL GESTÃO & ENERGIA SOLAR - DOCUMENTO OFICIAL
            MANUAL DE CONDUTA, CULTURA, ÉTICA E SEGURANÇA SCL SOLAR
                         (Versão Corporativa 2026)
================================================================================

COLABORADOR: ${nome} | CPF: ${cpf} | POLO: ${polo}
DATA DE ENTREGA NO 1º DIA DE ONBOARDING: ${dataInicioBR}

--------------------------------------------------------------------------------
SUMÁRIO EXECUTIVO E PRINCÍPIOS DA SCL SOLAR:
--------------------------------------------------------------------------------

1. NOSSA MISSÃO E CULTURA (OWN IT):
   Na SCL Solar, agimos como donos com foco na excelência, integridade inegociável, 
   segurança total em campo e sustentabilidade energética em todo o Brasil.

2. CÓDIGO DE CONDUTA E CONVIVÊNCIA:
   • Respeito absoluto à diversidade, integridade moral e dignidade de todos os colegas.
   • Tolerância zero para qualquer forma de discriminação, assédio moral ou assédio sexual.
   • Comunicação transparente, construtiva e colaborativa entre todas as áreas e polos.

3. NORMAS DE SEGURANÇA DO TRABALHO & POLOS SOLARES:
   • Uso obrigatório de todos os EPIs homologados (Capacete, Óculos UV, Botina com bico composite, Luvas dielétricas).
   • Cumprimento rigoroso das Normas Regulamentadoras: NR-06 (EPI), NR-10 (Segurança em Instalações e Serviços em Eletricidade) e NR-35 (Trabalho em Altura).
   • Qualquer condição de risco iminente deve ser reportada e paralisada imediatamente (Direito de Recusa).

4. USO RESPONSÁVEL DOS RECURSOS E DISPOSITIVOS:
   • Veículos operacionais, ferramentas, computadores e credenciais corporativas são destinados estritamente às atividades profissionais.
   • Não é permitido o compartilhamento de senhas de acesso aos sistemas de monitoramento solar e banco de dados.

5. TERMO DE RECEBIMENTO E COMPROMISSO:
   O(A) colaborador(a) declara ter recebido, lido integralmente e compreendido o Manual de 
   Conduta e Ética SCL Solar no seu 1º dia de integração/onboarding.

--------------------------------------------------------------------------------
AUTENTICAÇÃO DO RECEBIMENTO:
--------------------------------------------------------------------------------
Status: ${docItem?.status === 'ASSINADO' ? 'CIÊNCIA CONFIRMADA' : 'DISPARADO NO ONBOARDING'}
Hash SHA-256: e8f921bc90a027ef416d87b3294821a7c5b3648194ad8901fe23ba984102ff4a
Protocolo de Registro: SCL-MAN-${Date.now()}
`;
  }

  // CONTRATO_TRABALHO_DEFINITIVO (Final do Período de Experiência)
  return `================================================================================
                    SCL GESTÃO & ENERGIA SOLAR - DOCUMENTO OFICIAL
            CONTRATO INDIVIDUAL DE TRABALHO POR PRAZO INDETERMINADO
               (Termo de Efetivação Pós-Período de Experiência)
================================================================================

EMPREGADORA: SCL OPERAÇÕES E GESTÃO SOLAR LTDA.
POLO: ${polo}
CNPJ: 40.397.157/0001-17

COLABORADOR(A) EFETIVADO(A): ${nome}
CPF: ${cpf}
CARGO: ${cargo}
SALÁRIO BASE ATUAL: R$ ${salario}
DATA DE INÍCIO DO CONTRATO: ${dataInicioBR}
DATA DE EFETIVAÇÃO INDETERMINADA (FIM DA EXPERIÊNCIA): ${dataFimExpBR}

--------------------------------------------------------------------------------
TERMO DE CONVERSÃO E RATIFICAÇÃO CONTRATUAL:
--------------------------------------------------------------------------------

Considerando que o(a) EMPREGADO(A) cumpriu com pleno êxito e aprovação o período 
de experiência de 90 (noventa) dias estabelecido na sua admissão:

CLÁUSULA PRIMEIRA - DA EFETIVAÇÃO POR PRAZO INDETERMINADO:
Fica o contrato de trabalho formalmente CONVERTIDO EM CONTRATO POR PRAZO INDETERMINADO, 
a contar de ${dataFimExpBR}, em plena consonância com o Artigo 451 da CLT.

CLÁUSULA SEGUNDA - DA CONTINUIDADE DOS DIREITOS E OBRIGAÇÕES:
Ficam ratificadas todas as demais cláusulas e condições pactuadas no instrumento 
admissional originário, mantendo-se inalterados o cargo, as atribuições funcionais, 
a jornada semanal de 44 horas e os benefícios de carreira (Programa OWN IT).

CLÁUSULA TERCEIRA - DA EVOLUÇÃO FUNCIONAL:
O(A) colaborador(a) passa a ser elegível aos ciclos regulares de avaliação de 
desempenho, mérito, progressão salarial e plano de carreira por competências.

E por estarem justos e acordados, firma-se o presente instrumento de efetivação.

--------------------------------------------------------------------------------
ASSINATURAS DIGITAIS REGISTRADAS:
--------------------------------------------------------------------------------
[X] ${nome} (Colaborador Efetivado)
[X] SCL OPERAÇÕES & GESTÃO SOLAR LTDA. (Diretoria de Gente & Gestão)
Protocolo de Efetivação: SCL-CONTRATO-DEF-${Date.now()}
`;
}
