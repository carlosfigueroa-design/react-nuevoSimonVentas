/**
 * Tipos de dominio para coberturas (amparos) y cálculo de prima.
 * Ramo Vida Individual — Simón Ventas.
 */

/** Periodicidad de pago de la prima */
export type Periodicidad = 'mensual' | 'trimestral' | 'semestral' | 'anual';

/** Configuración de un amparo disponible */
export interface CoverageConfig {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  dependencies: string[];
  baseRate: number;
}

/** Configuración de una sub-cobertura dentro de un amparo */
export interface SubCoverageConfig {
  id: string;
  parentCoverageId: string;
  name: string;
  description: string;
}

/** Asistencia gratuita incluida en la póliza */
export interface AsistenciaGratuita {
  id: string;
  name: string;
  description: string;
}

/** Selección de cobertura por el usuario */
export interface CoverageSelection {
  coverageId: string;
  selected: boolean;
  insuredValue: number;
}

/** Desglose de prima por amparo */
export interface PrimaBreakdown {
  coverageId: string;
  coverageName: string;
  basePremium: number;
  tax: number;
  total: number;
}

/** Estado del paso 2: Coberturas */
export interface CoberturasState {
  selections: CoverageSelection[];
  periodicidad: Periodicidad;
  primaBreakdown: PrimaBreakdown[];
  totalPrima: number;
}

/** Configuración de la sección Rentas */
export interface RentasConfig {
  monthlyIncome: number;
  projectionYears: number;
  interestRate: number;
}

/** Configuración de la sección Necesidades */
export interface NecesidadesConfig {
  educationCost: number;
  debtBalance: number;
  monthlyExpenses: number;
  dependents: number;
}

/** Punto de datos para gráficos de proyección */
export interface ProjectionDataPoint {
  year: number;
  value: number;
  label: string;
}
