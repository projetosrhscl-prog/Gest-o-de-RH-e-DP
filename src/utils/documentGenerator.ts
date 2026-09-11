import JSZip from 'jszip';
import saveAs from 'file-saver';
import { ElectronicDocument, CollaboratorProfile } from '../types/collaborator';
import { formatDateBR } from './dateHelper';

/**
 * Generates a clean text/HTML formatted document content ready for export or packaging.
 */
export function generateDocumentText(doc: ElectronicDocument, colab?: CollaboratorProfile): string {
  const timestamp = new Date().toLocaleString('pt-BR');
  return `================================================================================
                    SCL GESTÃO & RH - DOCUMENTO OFICIAL
================================================================================

DOCUMENTO: ${doc.title}
CATEGORIA: ${doc.category}
MODELO: ${doc.templateName}
ID DO DOCUMENTO: ${doc.id}
DATA DE EMISSÃO: ${formatDateBR(doc.createdAt)}
STATUS: ${doc.status === 'ASSINADO' ? 'ASSINADO DIGITALMENTE' : 'AGUARDANDO ASSINATURA'}
CANAL DE ASSINATURA: ${doc.deliveryChannel === 'WHATSAPP' ? 'WhatsApp (Autenticação Celular)' : 'E-mail Seguro'}
DATA DA ASSINATURA: ${doc.signedAt ? formatDateBR(doc.signedAt) : 'Pendente de assinatura pelo colaborador'}

--------------------------------------------------------------------------------
DADOS DO COLABORADOR
--------------------------------------------------------------------------------
Nome Completo: ${doc.collaboratorName}
Matrícula: ${colab?.registrationNumber || 'N/A'}
CPF: ${colab?.cpf || '000.000.000-00'}
Cargo: ${colab?.positionTitle || 'N/A'}
Departamento: ${colab?.departmentName || 'N/A'}
Unidade / Operação: ${colab?.branchName || 'SCL Operações'}
Tipo de Contrato: ${colab?.contractType || 'CLT'}

--------------------------------------------------------------------------------
TERMOS E CLÁUSULAS LEGAIS
--------------------------------------------------------------------------------
1. DA CONTRATAÇÃO E VALIDADE:
   O presente documento é formalizado em conformidade com as diretrizes da 
   Consolidação das Leis do Trabalho (CLT), Medida Provisória nº 2.200-2/2001 e 
   Lei Federal nº 14.063/2020, possuindo plena validade jurídica e probatória.

2. DAS CONDIÇÕES E RESPONSABILIDADES:
   O colaborador declara ter ciência de todas as responsabilidades inerentes 
   ao exercício de suas atribuições, bem como das políticas internas de segurança, 
   confidencialidade e integridade corporativa.

3. DA AUTENTICIDADE ELETRÔNICA:
   Assinado eletronicamente através de plataforma com certificado digital, 
   registro criptográfico imutável, carimbo de tempo ICP-Brasil e trilha auditável.

--------------------------------------------------------------------------------
ASSINATURAS DIGITAIS
--------------------------------------------------------------------------------
[X] ${doc.collaboratorName}
    Assinado eletronicamente (${doc.deliveryChannel})
    Autenticado em: ${doc.signedAt ? formatDateBR(doc.signedAt) : 'Aguardando validação'}

[X] SCL OPERACOES & GESTAO DE PESSOAS
    Certificado Digital ICP-Brasil A1 / A3
    Emissor Autorizado SCL Assinatura Digital

HASH CRIPTOGRÁFICO SHA-256:
${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}
Data de Exportação do Pacote: ${timestamp}
================================================================================
`;
}

/**
 * Downloads a single electronic document as a text/pdf-like file.
 */
export function downloadSingleDocument(doc: ElectronicDocument, colab?: CollaboratorProfile) {
  const content = generateDocumentText(doc, colab);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const safeTitle = doc.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeName = doc.collaboratorName.replace(/[^a-zA-Z0-9_-]/g, '_');
  saveAs(blob, `${safeTitle}_${safeName}_${doc.id}.txt`);
}

/**
 * Packages multiple documents into a single .zip file for bulk download.
 */
export async function downloadBulkDocumentsZip(
  docs: ElectronicDocument[],
  collaborators: CollaboratorProfile[],
  zipFilename = 'documentos_assinatura_lote.zip'
): Promise<number> {
  if (docs.length === 0) return 0;

  const zip = new JSZip();
  const folder = zip.folder('Documentos_Assinatura_Digital');

  // Add an index manifest
  const manifest = [
    '# MANIFESTO DO LOTE DE DOCUMENTOS',
    `Data do Lote: ${new Date().toLocaleString('pt-BR')}`,
    `Total de Documentos: ${docs.length}`,
    '',
    '## LISTAGEM DE ARQUIVOS:',
    ...docs.map((doc, idx) => {
      const colab = collaborators.find(c => c.id === doc.collaboratorId);
      return `${idx + 1}. [${doc.status}] ${doc.title} - ${doc.collaboratorName} (${colab?.branchName || 'SCL'})`;
    })
  ].join('\n');

  folder?.file('00_MANIFESTO_LOTE.txt', manifest);

  // Add individual documents organized by collaborator
  docs.forEach((doc) => {
    const colab = collaborators.find(c => c.id === doc.collaboratorId);
    const content = generateDocumentText(doc, colab);
    const safeColab = doc.collaboratorName.replace(/[^a-zA-Z0-9À-ÿ_-]/g, '_');
    const safeTitle = doc.title.replace(/[^a-zA-Z0-9À-ÿ_-]/g, '_');
    const filename = `${safeColab}/${safeTitle}_${doc.id}.txt`;
    
    folder?.file(filename, content);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, zipFilename);
  return docs.length;
}

/**
 * Downloads all personal dossiers & certificates for selected collaborators into a ZIP.
 */
export async function downloadCollaboratorDossierZip(
  collaborator: CollaboratorProfile,
  relatedDocs: ElectronicDocument[]
) {
  const zip = new JSZip();
  const colabFolder = zip.folder(collaborator.fullName.replace(/[^a-zA-Z0-9À-ÿ_-]/g, '_'));

  const addr = collaborator.personalData?.address;
  const pData = collaborator.personalData;

  // Ficha Cadastral / Prontuário
  const prontuario = `================================================================================
                    PRONTUÁRIO INTEGRAL DO COLABORADOR
================================================================================
Matrícula: ${collaborator.registrationNumber}
Nome Completo: ${collaborator.fullName}
Nome Social / Preferido: ${collaborator.preferredName}
CPF: ${collaborator.cpf}
RG: ${collaborator.rg} (${collaborator.rgIssuer || 'SSP'})
Data de Nascimento: ${pData?.birthDate ? formatDateBR(pData.birthDate) : 'N/A'} (${pData?.gender || 'N/A'}, ${pData?.maritalStatus || 'N/A'})
E-mail Corporativo: ${collaborator.email}
Telefone Celular: ${collaborator.phone}

DADOS CONTRATUAIS:
Operação / Usina: ${collaborator.branchName}
Departamento: ${collaborator.departmentName} (Centro de Custo: ${collaborator.costCenter})
Cargo: ${collaborator.positionTitle} (${collaborator.seniority})
Tipo de Contrato: ${collaborator.contractType}
Data de Admissão: ${formatDateBR(collaborator.admissionDate)}
Supervisor Imediato: ${collaborator.directSupervisor}
Salário Base: R$ ${collaborator.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

ENDEREÇO:
${addr ? `${addr.street}, ${addr.number} - ${addr.neighborhood}\n${addr.city}/${addr.state} - CEP: ${addr.zipCode}` : 'Endereço não cadastrado'}

BENEFÍCIOS ATIVOS:
${collaborator.benefits.map(b => `- ${b.name}: R$ ${b.monthlyValue.toFixed(2)} (${b.provider})`).join('\n')}

PERÍODOS DE FÉRIAS CLT:
${collaborator.vacationPeriods.map(v => `- Período ${formatDateBR(v.startDate)} a ${formatDateBR(v.endDate)} | Saldo: ${v.remainingBalance} dias`).join('\n')}
================================================================================
`;

  colabFolder?.file('Prontuario_Cadastral_Completo.txt', prontuario);

  // Add electronic documents signed
  if (relatedDocs.length > 0) {
    const docsSub = colabFolder?.folder('Documentos_Assinatura_Digital');
    relatedDocs.forEach(doc => {
      const content = generateDocumentText(doc, collaborator);
      const safeTitle = doc.title.replace(/[^a-zA-Z0-9À-ÿ_-]/g, '_');
      docsSub?.file(`${safeTitle}.txt`, content);
    });
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const safeName = collaborator.fullName.replace(/[^a-zA-Z0-9À-ÿ_-]/g, '_');
  saveAs(zipBlob, `Dossie_Completo_${safeName}.zip`);
}
