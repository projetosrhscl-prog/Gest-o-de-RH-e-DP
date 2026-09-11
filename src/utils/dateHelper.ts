/**
 * Utilitário de formatação de datas no padrão brasileiro (DD/MM/AAAA).
 */

/**
 * Converte qualquer string de data ISO/SQL (ex: '2024-06-24' ou '2026-08-10 14:32')
 * para o formato brasileiro 'DD/MM/AAAA' (ou 'DD/MM/AAAA HH:mm' se houver horário).
 */
export function formatDateBR(dateStr?: string | null, fallback: string = '-'): string {
  if (!dateStr || typeof dateStr !== 'string') return fallback;
  const trimmed = dateStr.trim();
  if (!trimmed) return fallback;

  // Se já estiver no formato DD/MM/AAAA
  if (/^\d{2}\/\d{2}\/\d{4}/.test(trimmed)) {
    return trimmed;
  }

  // Se contém data e hora: "YYYY-MM-DD HH:mm" ou "YYYY-MM-DDTHH:mm"
  if (trimmed.includes(' ') || trimmed.includes('T')) {
    const separator = trimmed.includes('T') ? 'T' : ' ';
    const [datePart, timePart] = trimmed.split(separator);
    const dateFormatted = formatDatePart(datePart);
    if (dateFormatted && timePart) {
      const timeClean = timePart.slice(0, 5); // pega HH:mm
      return `${dateFormatted} às ${timeClean}`;
    }
    if (dateFormatted) return dateFormatted;
  }

  // Padrão "YYYY-MM-DD"
  const dateFormatted = formatDatePart(trimmed);
  if (dateFormatted) return dateFormatted;

  return trimmed;
}

function formatDatePart(datePart: string): string | null {
  const parts = datePart.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    if (year.length === 4) {
      return `${day}/${month}/${year}`;
    }
  }
  return null;
}

/**
 * Alias simplificado para formatação rápida de datas.
 */
export const formatDate = formatDateBR;
