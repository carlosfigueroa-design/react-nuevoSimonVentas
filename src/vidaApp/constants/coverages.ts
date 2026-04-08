/**
 * Configuración de coberturas (amparos) para Vida Individual.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { CoverageConfig, CoverageSelection, SubCoverageConfig, AsistenciaGratuita } from '../types';

/** IDs de coberturas disponibles */
export const COVERAGE_IDS = {
  BASICO_VIDA: 'basico-vida',
  ITP_ENFERMEDAD: 'itp-enfermedad',
  ITP_ACCIDENTE: 'itp-accidente',
  ITP_ANTICIPO: 'itp-anticipo',
  ENFERMEDADES_GRAVES: 'enfermedades-graves',
  ENFERMEDADES_GRAVES_ANTICIPO: 'enfermedades-graves-anticipo',
  ACCIDENTES_PERSONALES: 'accidentes-personales',
  RENTA_INCAPACIDAD: 'renta-incapacidad',
} as const;

/** Definiciones de coberturas disponibles para Vida Individual */
export const COVERAGE_CONFIGS: CoverageConfig[] = [
  {
    id: COVERAGE_IDS.BASICO_VIDA,
    name: 'Amparo Básico (Vida)',
    description: 'Cobertura principal por fallecimiento del asegurado. Obligatoria para todas las pólizas de Vida Individual.',
    mandatory: true,
    dependencies: [],
    baseRate: 0.0035,
  },
  {
    id: COVERAGE_IDS.ITP_ENFERMEDAD,
    name: 'ITP Enfermedad',
    description: 'Incapacidad Total y Permanente por enfermedad. Protege al asegurado ante pérdida de capacidad laboral por enfermedad.',
    mandatory: false,
    dependencies: [COVERAGE_IDS.BASICO_VIDA],
    baseRate: 0.0012,
  },
  {
    id: COVERAGE_IDS.ITP_ACCIDENTE,
    name: 'ITP Accidente',
    description: 'Incapacidad Total y Permanente por accidente. Protege al asegurado ante pérdida de capacidad laboral por accidente.',
    mandatory: false,
    dependencies: [COVERAGE_IDS.BASICO_VIDA],
    baseRate: 0.0008,
  },
  {
    id: COVERAGE_IDS.ITP_ANTICIPO,
    name: 'ITP por Enfermedad o Accidente (Anticipo)',
    description: 'Adelanto del capital del Amparo Básico en caso de invalidez total y permanente por enfermedad o accidente.',
    mandatory: false,
    dependencies: [COVERAGE_IDS.BASICO_VIDA],
    baseRate: 0.0010,
  },
  {
    id: COVERAGE_IDS.ENFERMEDADES_GRAVES,
    name: 'Enfermedades Graves (Suma Adicional)',
    description: 'Pago de suma asegurada ante diagnóstico de enfermedades de alto costo como cáncer, infarto o ACV.',
    mandatory: false,
    dependencies: [COVERAGE_IDS.BASICO_VIDA],
    baseRate: 0.0018,
  },
  {
    id: COVERAGE_IDS.ENFERMEDADES_GRAVES_ANTICIPO,
    name: 'Enfermedades Graves e Invalidez (Anticipo 50%)',
    description: 'Adelanto de la mitad del capital principal ante diagnóstico de enfermedades graves o invalidez.',
    mandatory: false,
    dependencies: [COVERAGE_IDS.BASICO_VIDA],
    baseRate: 0.0014,
  },
  {
    id: COVERAGE_IDS.ACCIDENTES_PERSONALES,
    name: 'Accidentes Personales',
    description: 'Indemnización por muerte accidental o desmembración del asegurado.',
    mandatory: false,
    dependencies: [COVERAGE_IDS.BASICO_VIDA],
    baseRate: 0.0006,
  },
  {
    id: COVERAGE_IDS.RENTA_INCAPACIDAD,
    name: 'Renta Diaria por Incapacidad (Enfermedad)',
    description: 'Valor fijo de $100.000 diarios durante el período de incapacidad temporal del asegurado. Prima fija: $15.000.',
    mandatory: false,
    dependencies: [COVERAGE_IDS.BASICO_VIDA],
    baseRate: 0, // Prima fija, no proporcional
  },
];

/** Selecciones por defecto: solo el amparo básico activo */
export const DEFAULT_COVERAGE_SELECTIONS: CoverageSelection[] = COVERAGE_CONFIGS.map(
  (config): CoverageSelection => ({
    coverageId: config.id,
    selected: config.mandatory,
    insuredValue: 0,
  })
);

/** Reglas de dependencia: mapa de coverageId → IDs de los que depende */
export const COVERAGE_DEPENDENCY_MAP: Record<string, string[]> = Object.fromEntries(
  COVERAGE_CONFIGS.filter((c) => c.dependencies.length > 0).map((c) => [c.id, c.dependencies])
);

/** Asistencias gratuitas incluidas en la póliza */
export const ASISTENCIAS_GRATUITAS: AsistenciaGratuita[] = [
  {
    id: 'asistencia-funeraria',
    name: 'Asistencia Funeraria',
    description: 'Servicio de asistencia funeraria para el asegurado y su familia.',
  },
  {
    id: 'asistencia-medicamentos',
    name: 'Asistencia de Medicamentos',
    description: 'Descuentos y asistencia en la compra de medicamentos.',
  },
  {
    id: 'exoneracion-prima',
    name: 'Exoneración de Prima',
    description: 'Exoneración del pago de prima en caso de incapacidad total y permanente.',
  },
];

/** Sub-coberturas dentro de Accidentes Personales */
export const SUB_COBERTURAS_ACCIDENTES: SubCoverageConfig[] = [
  {
    id: 'muerte-accidental-transito',
    parentCoverageId: COVERAGE_IDS.ACCIDENTES_PERSONALES,
    name: 'Muerte Accidental (Tránsito terrestre)',
    description: 'Indemnización adicional por fallecimiento a causa de accidente de tránsito terrestre.',
  },
  {
    id: 'desmembracion',
    parentCoverageId: COVERAGE_IDS.ACCIDENTES_PERSONALES,
    name: 'Desmembración',
    description: 'Indemnización por pérdida de miembros o funciones corporales a causa de accidente.',
  },
  {
    id: 'gastos-medicos',
    parentCoverageId: COVERAGE_IDS.ACCIDENTES_PERSONALES,
    name: 'Gastos Médicos por Accidente',
    description: 'Cobertura de gastos médicos derivados de un accidente.',
  },
  {
    id: 'renta-incapacidad-accidente',
    parentCoverageId: COVERAGE_IDS.ACCIDENTES_PERSONALES,
    name: 'Renta Diaria por Incapacidad (Accidente)',
    description: 'Renta diaria durante el período de incapacidad temporal por accidente.',
  },
];
