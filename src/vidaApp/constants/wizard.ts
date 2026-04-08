/**
 * Configuración del wizard: etiquetas de pasos y estados iniciales.
 * Ramo Vida Individual — Simón Ventas.
 */

import type {
  DatosRiesgoState,
  CoberturasState,
  DeclaracionState,
  ResumenState,
  WizardStep,
  PlanVida,
  Option,
} from '../types';
import { DEFAULT_COVERAGE_SELECTIONS } from './coverages';

/** Etiquetas de cada paso del wizard */
export const WIZARD_STEP_LABELS: Record<WizardStep, string> = {
  1: 'Datos del Riesgo',
  2: 'Coberturas',
  3: 'Declaración de Asegurabilidad',
  4: 'Resumen de Cotización',
} as const;

/** Opciones de plan de vida disponibles */
export const PLAN_OPTIONS: { value: PlanVida; label: string }[] = [
  { value: 'integral', label: 'Seguro de Vida Integral' },
  { value: 'tranquilidad', label: 'Portafolio Tranquilidad Hijos' },
  { value: 'activa', label: 'Vida Activa' },
  { value: 'adulto-mayor', label: 'Adulto Mayor' },
  { value: 'vida-inversion', label: 'Vida e Inversión' },
];

/** Opciones de periodicidad de pago */
export const PERIODICIDAD_OPTIONS: Option[] = [
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
  { value: 'anual', label: 'Anual' },
];

/** Opciones de tipo de documento extendidas (incluye NIT para persona jurídica) */
export const DOCUMENT_TYPE_OPTIONS_EXTENDED: Option[] = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' },
];

/** Estado inicial del paso 1: Datos del Riesgo */
export const INITIAL_DATOS_RIESGO: DatosRiesgoState = {
  tomador: {
    tipo: 'tomador',
    nombres: '',
    apellidos: '',
    documentType: '',
    documentNumber: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
  },
  asegurado: {
    tipo: 'asegurado',
    nombres: '',
    apellidos: '',
    documentType: '',
    documentNumber: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
  },
  isSameAsInsured: false,
  plan: '',
  tipoPersonaNatJur: 'natural',
  representanteLegal: {
    name: '',
    documentType: '',
    documentNumber: '',
    cargo: '',
  },
  ingresoMensual: 0,
  ciudad: '',
  ocupacion: '',
  actividadEconomica: '',
  relacionLaboral: '',
  claveIntermediario: '',
  nombreAsesor: '',
  aceptaTratamientoDatos: false,
};

/** Estado inicial del paso 2: Coberturas */
export const INITIAL_COBERTURAS: CoberturasState = {
  selections: DEFAULT_COVERAGE_SELECTIONS,
  periodicidad: 'mensual',
  primaBreakdown: [],
  totalPrima: 0,
};

/** Estado inicial del paso 3: Declaración de Asegurabilidad */
export const INITIAL_DECLARACION: DeclaracionState = {
  answers: {},
  weight: 0,
  height: 0,
  bmiResult: null,
  isConfirmed: false,
  extraprima: 0,
  extraprimaActive: false,
};

/** Estado inicial del paso 4: Resumen de Cotización */
export const INITIAL_RESUMEN: ResumenState = {
  summary: null,
  isSubmitting: false,
  isIssued: false,
  policyNumber: '',
  isProvisoria: false,
};

/** Clave de sessionStorage para persistencia del wizard */
export const WIZARD_STORAGE_KEY = 'vida-individual-wizard-state';
