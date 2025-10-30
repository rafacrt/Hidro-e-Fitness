// Mapeamento de recorrência para meses
export const RECURRENCE_MONTHS_MAP: Record<string, number> = {
  'mensal': 1,
  'bimestral': 2,
  'trimestral': 3,
  'semestral': 6,
  'anual': 12,
};

/**
 * Gera texto amigável para o tipo de recorrência
 */
export function getRecurrenceLabel(recurrence: string): string {
  const labels: Record<string, string> = {
    'mensal': 'Mensalidade',
    'bimestral': 'Bimestralidade',
    'trimestral': 'Trimestralidade',
    'semestral': 'Semestralidade',
    'anual': 'Anuidade',
  };
  return labels[recurrence] || recurrence;
}

/**
 * Calcula o número máximo de parcelas recomendado baseado na recorrência
 */
export function getMaxRecommendedInstallments(recurrence: string): number {
  const recommendations: Record<string, number> = {
    'mensal': 12,      // 12 meses
    'bimestral': 6,    // 12 meses
    'trimestral': 4,   // 12 meses
    'semestral': 2,    // 12 meses
    'anual': 2,        // 24 meses
  };
  return recommendations[recurrence] || 6;
}
