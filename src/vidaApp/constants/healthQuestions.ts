/**
 * Categorías y preguntas del cuestionario de salud (Declaración de Asegurabilidad).
 * Ramo Vida Individual — Simón Ventas.
 *
 * Organizado en 2 secciones principales:
 * - Salud General (estilo de vida, ocupación, legal) — 12 preguntas
 * - Información Médica (peso, estatura, patologías) — 12 preguntas
 */

import type { HealthCategory } from '../types';

/** IDs de preguntas críticas que activan extraprima (15% recargo) */
export const CRITICAL_HEALTH_QUESTIONS: string[] = [
  'sg-1',  // Hipertensión
  'sg-2',  // Diabetes
  'im-1',  // VIH
  'im-2',  // Cirugías recientes
];

/** Categorías de preguntas de salud con sus preguntas */
export const HEALTH_CATEGORIES: HealthCategory[] = [
  {
    id: 'salud-general',
    name: 'Salud General',
    questions: [
      {
        id: 'sg-1',
        categoryId: 'salud-general',
        text: '¿Ha sido diagnosticado con hipertensión arterial?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-2',
        categoryId: 'salud-general',
        text: '¿Ha sido diagnosticado con diabetes (tipo 1 o tipo 2)?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-3',
        categoryId: 'salud-general',
        text: '¿Ha sido diagnosticado con alguna enfermedad cardíaca?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-4',
        categoryId: 'salud-general',
        text: '¿Ha sido hospitalizado en los últimos 5 años?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-5',
        categoryId: 'salud-general',
        text: '¿Fuma o ha fumado en los últimos 12 meses?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-6',
        categoryId: 'salud-general',
        text: '¿Consume bebidas alcohólicas de forma regular?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-7',
        categoryId: 'salud-general',
        text: '¿Practica deportes extremos o actividades de alto riesgo?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-8',
        categoryId: 'salud-general',
        text: '¿Su ocupación implica exposición a sustancias peligrosas o riesgos físicos?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-9',
        categoryId: 'salud-general',
        text: '¿Ha tenido problemas legales o ha sido procesado judicialmente?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-10',
        categoryId: 'salud-general',
        text: '¿Viaja frecuentemente a zonas de conflicto o alto riesgo?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-11',
        categoryId: 'salud-general',
        text: '¿Consume o ha consumido sustancias psicoactivas?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'sg-12',
        categoryId: 'salud-general',
        text: 'Si respondió afirmativamente a alguna pregunta anterior, por favor detalle:',
        type: 'text',
        required: false,
      },
    ],
  },
  {
    id: 'informacion-medica',
    name: 'Información Médica',
    questions: [
      {
        id: 'im-1',
        categoryId: 'informacion-medica',
        text: '¿Ha sido diagnosticado con VIH/SIDA?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-2',
        categoryId: 'informacion-medica',
        text: '¿Ha sido sometido a alguna cirugía en los últimos 2 años?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-3',
        categoryId: 'informacion-medica',
        text: '¿Toma actualmente algún medicamento de forma regular?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-4',
        categoryId: 'informacion-medica',
        text: '¿Ha sido diagnosticado con cáncer o tumores?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-5',
        categoryId: 'informacion-medica',
        text: '¿Ha padecido enfermedades del sistema nervioso o cerebrovascular?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-6',
        categoryId: 'informacion-medica',
        text: '¿Ha padecido enfermedades respiratorias crónicas (asma, EPOC)?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-7',
        categoryId: 'informacion-medica',
        text: '¿Ha padecido enfermedades renales o hepáticas?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-8',
        categoryId: 'informacion-medica',
        text: '¿Ha padecido trastornos psiquiátricos o psicológicos?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-9',
        categoryId: 'informacion-medica',
        text: '¿Algún familiar directo (padres, hermanos) ha padecido cáncer?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-10',
        categoryId: 'informacion-medica',
        text: '¿Algún familiar directo ha padecido enfermedades cardíacas antes de los 60 años?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-11',
        categoryId: 'informacion-medica',
        text: '¿Algún familiar directo ha padecido diabetes?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'im-12',
        categoryId: 'informacion-medica',
        text: 'Si respondió afirmativamente a alguna pregunta anterior, por favor detalle:',
        type: 'text',
        required: false,
      },
    ],
  },
];

/** Todas las preguntas de salud en una lista plana */
export const ALL_HEALTH_QUESTIONS = HEALTH_CATEGORIES.flatMap((cat) => cat.questions);
