/**
 * Tipos de dominio para personas: Tomador y Asegurado.
 * Ramo Vida Individual — Simón Ventas.
 */

/** Tipos de documento válidos en Colombia */
export type TipoDocumento = 'CC' | 'CE' | 'TI' | 'PA' | 'NIT';

/** Género del asegurado/tomador */
export type Genero = 'M' | 'F';

/** Rol de la persona en la póliza */
export type TipoPersona = 'tomador' | 'asegurado';

/** Plan de seguro de vida disponible */
export type PlanVida = 'integral' | 'tranquilidad' | 'activa' | 'adulto-mayor' | 'vida-inversion';

/** Tipo de persona: Natural o Jurídica */
export type TipoPersonaNatJur = 'natural' | 'juridica';

/** Datos del Representante Legal (para persona jurídica) */
export interface RepresentanteLegal {
  name: string;
  documentType: TipoDocumento | '';
  documentNumber: string;
  cargo: string;
}

/** Datos base de una persona (compartidos entre Tomador y Asegurado) */
export interface PersonData {
  nombres: string;
  apellidos: string;
  documentType: TipoDocumento | '';
  documentNumber: string;
  dateOfBirth: string;
  gender: Genero | '';
  email: string;
  phone: string;
  address: string;
}

/** Datos específicos del Tomador (policyholder) */
export interface TomadorData extends PersonData {
  tipo: 'tomador';
}

/** Datos específicos del Asegurado (insured) */
export interface AseguradoData extends PersonData {
  tipo: 'asegurado';
}

/** Estado del paso 1: Datos del Riesgo */
export interface DatosRiesgoState {
  tomador: TomadorData;
  asegurado: AseguradoData;
  isSameAsInsured: boolean;
  plan: PlanVida | '';
  tipoPersonaNatJur: TipoPersonaNatJur;
  representanteLegal: RepresentanteLegal;
  ingresoMensual: number;
  ciudad: string;
  ocupacion: string;
  actividadEconomica: string;
  relacionLaboral: string;
  /** Clave del intermediario/asesor */
  claveIntermediario: string;
  /** Nombre del asesor (autocompletado tras validación) */
  nombreAsesor: string;
  /** Aceptación de tratamiento de datos personales */
  aceptaTratamientoDatos: boolean;
}
