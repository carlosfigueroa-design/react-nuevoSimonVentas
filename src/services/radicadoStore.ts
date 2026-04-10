/**
 * Servicio de almacenamiento de radicados.
 * Guarda y recupera datos completos de formularios por número de radicado.
 * Usa localStorage para persistencia entre sesiones.
 */

export interface RadicadoRecord {
  radicado: string;
  ramo: 'Autos' | 'Vida';
  fecha: string;
  identificacion: { tipo: string; numero: string };
  nombre: string;
  /** Datos completos del formulario (estructura varía por ramo) */
  formData: Record<string, unknown>;
  /** Número de cotización asociado */
  cotizacion?: string;
  /** Número de póliza asociado */
  poliza?: string;
}

const STORAGE_KEY = 'simon-ventas-radicados';

/** Obtener todos los radicados guardados */
export function getAllRadicados(): RadicadoRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/** Guardar un nuevo radicado */
export function saveRadicado(record: RadicadoRecord): void {
  try {
    const all = getAllRadicados();
    // Evitar duplicados
    const idx = all.findIndex(r => r.radicado === record.radicado);
    if (idx >= 0) {
      all[idx] = record;
    } else {
      all.push(record);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage full or unavailable
  }
}

/** Buscar radicado por número */
export function findByRadicado(radicado: string): RadicadoRecord | undefined {
  return getAllRadicados().find(r => r.radicado === radicado);
}

/** Buscar radicados por número de cotización */
export function findByCotizacion(cotizacion: string): RadicadoRecord | undefined {
  return getAllRadicados().find(r => r.cotizacion === cotizacion);
}

/** Buscar radicados por número de póliza */
export function findByPoliza(poliza: string): RadicadoRecord | undefined {
  return getAllRadicados().find(r => r.poliza === poliza);
}

/** Buscar radicados por identificación */
export function findByIdentificacion(numero: string): RadicadoRecord[] {
  return getAllRadicados().filter(r => r.identificacion.numero === numero);
}

/** Buscar con criterios combinados */
export function searchRadicados(criteria: {
  identificacion?: string;
  cotizacion?: string;
  poliza?: string;
  ramo?: string;
}): RadicadoRecord[] {
  let results = getAllRadicados();

  if (criteria.identificacion) {
    results = results.filter(r => r.identificacion.numero === criteria.identificacion);
  }
  if (criteria.cotizacion) {
    const q = criteria.cotizacion.replace('COT-', '');
    results = results.filter(r =>
      r.cotizacion?.includes(q) || r.radicado.includes(q)
    );
  }
  if (criteria.poliza) {
    results = results.filter(r =>
      r.poliza === criteria.poliza || r.radicado === criteria.poliza
    );
  }
  if (criteria.ramo) {
    results = results.filter(r => r.ramo === criteria.ramo);
  }

  return results;
}
