import { CollaboratorProfile, ContractType, EmploymentStatus } from '../types/collaborator';
import { 
  normalizeCollaboratorName, 
  normalizeCollaboratorCpf,
  deduplicateCollaboratorsList
} from '../utils/collaboratorsStorage';
import { sanitizeCollaboratorProfile } from '../utils/collaboratorDefaults';

export interface GoogleSheetMetadata {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheets: Array<{
    sheetId: number;
    title: string;
    rowCount?: number;
    columnCount?: number;
  }>;
}

export interface SheetSyncResult {
  success: boolean;
  message: string;
  totalProcessed?: number;
  totalAddedOrUpdated?: number;
  duplicateCount?: number;
  spreadsheetUrl?: string;
}

/**
 * Extrai o ID da planilha a partir da URL completa ou do próprio ID.
 */
export function extractSpreadsheetId(urlOrId: string): string {
  const trimmed = urlOrId.trim();
  if (!trimmed) return '';

  // Ex: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // Se já for apenas o ID
  if (/^[a-zA-Z0-9-_]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

/**
 * Obtém os metadados de uma planilha no Google Sheets (título e abas).
 */
export async function getSpreadsheetInfo(
  spreadsheetId: string, 
  accessToken: string
): Promise<GoogleSheetMetadata> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  if (!cleanId) throw new Error('ID ou URL da planilha inválido.');

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}?fields=spreadsheetId,properties.title,sheets.properties`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const errMsg = errData.error?.message || `Erro HTTP ${res.status}: ${res.statusText}`;
    throw new Error(`Falha ao acessar o Google Sheets: ${errMsg}`);
  }

  const data = await res.json();
  const sheets = (data.sheets || []).map((s: any) => ({
    sheetId: s.properties.sheetId,
    title: s.properties.title,
    rowCount: s.properties.gridProperties?.rowCount,
    columnCount: s.properties.gridProperties?.columnCount
  }));

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Planilha Sem Título',
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
    sheets
  };
}

/**
 * Cabeçalhos padrão das colunas de RH e Gestão de Pessoas SCL
 */
export const SCL_SHEET_HEADERS = [
  'Matrícula',
  'Nome Completo',
  'CPF',
  'RG',
  'E-mail',
  'Telefone / WhatsApp',
  'Polo / Unidade',
  'Departamento',
  'Cargo',
  'Tipo de Contrato',
  'Data de Admissão (AAAA-MM-DD)',
  'Salário Base (R$)',
  'Status no Quadro',
  'Chave PIX'
];

/**
 * Converte um colaborador em linha de dados para o Google Sheets.
 */
function collaboratorToRow(colab: CollaboratorProfile): any[] {
  return [
    colab.registrationNumber || '',
    colab.fullName,
    colab.cpf || '',
    colab.rg || '',
    colab.email || '',
    colab.phone || '',
    colab.branchName || '',
    colab.departmentName || '',
    colab.positionTitle || '',
    colab.contractType || 'CLT',
    colab.admissionDate || '',
    colab.salary || 0,
    colab.status || 'EM_ATIVIDADE',
    colab.bankAccount?.pixKey || ''
  ];
}

/**
 * Cria uma nova planilha oficial no Google Drive do usuário com formatação pronta e os colaboradores.
 */
export async function createNewSCLSpreadsheet(
  title: string,
  collaborators: CollaboratorProfile[],
  accessToken: string
): Promise<GoogleSheetMetadata> {
  const rows = [
    SCL_SHEET_HEADERS,
    ...collaborators.map(collaboratorToRow)
  ];

  const payload = {
    properties: {
      title: title || `SCL Operações - Quadro de Colaboradores (${new Date().toLocaleDateString('pt-BR')})`
    },
    sheets: [
      {
        properties: {
          title: 'Colaboradores SCL',
          gridProperties: {
            frozenRowCount: 1
          }
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: rows.map(r => ({
              values: r.map(val => ({
                userEnteredValue: typeof val === 'number' 
                  ? { numberValue: val } 
                  : { stringValue: String(val ?? '') }
              }))
            }))
          }
        ]
      }
    ]
  };

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Falha ao criar nova planilha no Google Sheets');
  }

  const data = await res.json();
  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties.sheetId,
      title: s.properties.title
    }))
  };
}

/**
 * Exporta a lista atual de colaboradores para uma aba existente da planilha Google.
 */
export async function exportCollaboratorsToGoogleSheet(
  spreadsheetId: string,
  sheetName: string,
  collaborators: CollaboratorProfile[],
  accessToken: string
): Promise<SheetSyncResult> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const rows = [
    SCL_SHEET_HEADERS,
    ...collaborators.map(collaboratorToRow)
  ];

  // 1. Limpa o conteúdo anterior da aba para não deixar sobras
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(sheetName)}!A1:Z5000:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  ).catch(err => console.warn('Aviso ao limpar aba:', err));

  // 2. Grava os novos valores formatados
  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(sheetName)}!A1:N${rows.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: `${sheetName}!A1:N${rows.length}`,
        majorDimension: 'ROWS',
        values: rows
      })
    }
  );

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro ao gravar dados no Google Sheets');
  }

  return {
    success: true,
    message: `${collaborators.length} colaborador(es) exportado(s) com sucesso para a planilha Google.`,
    totalProcessed: collaborators.length,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${cleanId}/edit`
  };
}

/**
 * Lê os dados de uma aba da planilha Google e mapeia para CollaboratorProfile, aplicando proteção contra duplicidades.
 */
export async function importCollaboratorsFromGoogleSheet(
  spreadsheetId: string,
  sheetName: string,
  accessToken: string
): Promise<{
  importedCollaborators: CollaboratorProfile[];
  duplicatesRemoved: number;
  duplicateNames: string[];
}> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(sheetName)}!A1:Z2000`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erro ao ler dados da planilha Google');
  }

  const data = await res.json();
  const rawRows: string[][] = data.values || [];

  if (rawRows.length < 2) {
    throw new Error('A planilha está vazia ou contém apenas a linha de cabeçalho.');
  }

  const headerRow = rawRows[0].map(h => (h || '').toString().toLowerCase().trim());

  // Mapeador dinâmico de colunas tolerante a pequenas variações nos nomes dos cabeçalhos
  const findCol = (keywords: string[]): number => {
    return headerRow.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const colNome = findCol(['nome', 'colaborador', 'funcionário', 'funcionario']);
  const colCpf = findCol(['cpf']);
  const colRg = findCol(['rg', 'identidade']);
  const colEmail = findCol(['email', 'e-mail']);
  const colTelefone = findCol(['telefone', 'celular', 'whatsapp', 'contato']);
  const colPolo = findCol(['polo', 'unidade', 'filial', 'cidade', 'local']);
  const colDept = findCol(['departamento', 'setor', 'área', 'area']);
  const colCargo = findCol(['cargo', 'função', 'funcao', 'posicao', 'posição']);
  const colContrato = findCol(['contrato', 'tipo de contrato', 'regime', 'vínculo']);
  const colAdmissao = findCol(['admissão', 'admissao', 'data admissão', 'admissao (']);
  const colSalario = findCol(['salário', 'salario', 'remuneração', 'remuneracao']);
  const colStatus = findCol(['status', 'situação', 'situacao', 'quadro']);
  const colPix = findCol(['pix', 'chave pix']);

  if (colNome === -1) {
    throw new Error('Não foi encontrada uma coluna de "Nome Completo" ou "Nome" na planilha.');
  }

  const parsedList: CollaboratorProfile[] = [];

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length === 0) continue;

    const rawName = (row[colNome] || '').trim();
    if (!rawName || rawName.length < 2) continue;

    const rawCpf = colCpf !== -1 && row[colCpf] ? String(row[colCpf]).trim() : '';
    const rawRg = colRg !== -1 && row[colRg] ? String(row[colRg]).trim() : '3.123.456';
    const rawEmail = colEmail !== -1 && row[colEmail] 
      ? String(row[colEmail]).trim() 
      : `${rawName.toLowerCase().replace(/\s+/g, '.')}@scloperacoes.com.br`;
    const rawPhone = colTelefone !== -1 && row[colTelefone] 
      ? String(row[colTelefone]).trim() 
      : '(83) 98888-0000';
    const rawPolo = colPolo !== -1 && row[colPolo] ? String(row[colPolo]).trim() : 'Patos';
    const rawDept = colDept !== -1 && row[colDept] ? String(row[colDept]).trim() : 'Operações & Logística';
    const rawCargo = colCargo !== -1 && row[colCargo] ? String(row[colCargo]).trim() : 'Operador de Logística';
    
    // Contrato
    let contractType: ContractType = 'CLT';
    if (colContrato !== -1 && row[colContrato]) {
      const cUpper = String(row[colContrato]).toUpperCase();
      if (cUpper.includes('PJ')) contractType = 'PJ';
      else if (cUpper.includes('RPA')) contractType = 'RPA';
      else if (cUpper.includes('ESTÁGIO') || cUpper.includes('ESTAGIO')) contractType = 'ESTAGIO';
      else if (cUpper.includes('INTERMITENTE')) contractType = 'INTERMITENTE';
      else if (cUpper.includes('APRENDIZ')) contractType = 'APRENDIZ';
      else contractType = 'CLT';
    }

    // Salário
    let salary = 3200;
    if (colSalario !== -1 && row[colSalario]) {
      const cleanSalary = String(row[colSalario]).replace(/[R$\s.]/g, '').replace(',', '.');
      const parsedNum = parseFloat(cleanSalary);
      if (!isNaN(parsedNum) && parsedNum > 0) salary = parsedNum;
    }

    // Data de admissão
    let admissionDate = '2024-01-15';
    if (colAdmissao !== -1 && row[colAdmissao]) {
      const dateStr = String(row[colAdmissao]).trim();
      // Formato DD/MM/AAAA para AAAA-MM-DD
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const parts = dateStr.split('/');
        admissionDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        admissionDate = dateStr;
      }
    }

    // Status
    let status: EmploymentStatus = 'EM_ATIVIDADE';
    if (colStatus !== -1 && row[colStatus]) {
      const sUpper = String(row[colStatus]).toUpperCase();
      if (sUpper.includes('FÉRIAS') || sUpper.includes('FERIAS')) status = 'EM_FERIAS';
      else if (sUpper.includes('AFASTADO')) status = 'AFASTADO';
      else if (sUpper.includes('DESLIGADO')) status = 'DESLIGADO';
      else if (sUpper.includes('ADMISSÃO') || sUpper.includes('ADMISSAO')) status = 'EM_ADMISSAO';
      else status = 'EM_ATIVIDADE';
    }

    const pix = colPix !== -1 && row[colPix] ? String(row[colPix]).trim() : '';

    const newColab = sanitizeCollaboratorProfile({
      id: `colab-gsheet-${i}-${Date.now()}`,
      registrationNumber: `SCL-GS${String(100 + i).padStart(4, '0')}`,
      fullName: rawName,
      preferredName: rawName.split(' ')[0],
      cpf: rawCpf || `000.000.${String(i).padStart(3, '0')}-00`,
      rg: rawRg,
      rgIssuer: 'SSP',
      personalData: {
        birthDate: '1992-06-15',
        gender: 'PREFIRO_NAO_DIZER',
        maritalStatus: 'SOLTEIRO',
        nationality: 'Brasileira',
        address: {
          street: 'Logradouro Cadastrado',
          number: '100',
          neighborhood: 'Centro',
          city: rawPolo,
          state: 'PB',
          zipCode: '58700-000'
        },
        emergencyContact: {
          name: 'Contato de Emergência',
          phone: rawPhone,
          relationship: 'Familiar'
        }
      },
      email: rawEmail,
      phone: rawPhone,
      branchId: rawPolo.toLowerCase().includes('sousa') 
        ? 'op-sousa' 
        : rawPolo.toLowerCase().includes('cajazeiras') 
          ? 'op-cajazeiras' 
          : 'op-patos',
      branchName: rawPolo,
      departmentId: 'dept-1',
      departmentName: rawDept,
      positionId: 'pos-1',
      positionTitle: rawCargo,
      contractType,
      admissionDate,
      salary,
      directSupervisor: 'Coordenação Operacional SCL',
      status,
      bankAccount: {
        bankName: 'Banco do Brasil',
        bankCode: '001',
        agency: '0001',
        accountNumber: '12345-6',
        accountType: 'CORRENTE',
        pixKey: pix || rawCpf || 'Não informada'
      }
    });

    parsedList.push(newColab);
  }

  // Deduplicação estrita com preservação dos melhores campos
  const { deduped, duplicatesRemovedCount, duplicateNames } = deduplicateCollaboratorsList(parsedList);

  return {
    importedCollaborators: deduped,
    duplicatesRemoved: duplicatesRemovedCount,
    duplicateNames
  };
}
