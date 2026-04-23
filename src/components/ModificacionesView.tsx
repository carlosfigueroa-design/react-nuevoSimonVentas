/**
 * Vista de Modificaciones de Pólizas — Autos
 * HU GD903-237: Realizar diferentes tipos de modificaciones sobre el riesgo.
 * Subproductos: 251, 263, 360, 374, 293, 311, 288, 274.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, FileText, Car, User, Shield, ChevronDown, ChevronUp,
  AlertCircle, CheckCircle, Settings, Upload, X, FileCheck
} from 'lucide-react';

// --- Types ---
interface TomadorData {
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  autorizaDatos: boolean;
}

interface VehiculoData {
  placa: string;
  codigoMarca: string;
  modelo: string;
  motor: string;
  chasis: string;
  color: string;
  valorComercial: string;
  valorAccesorios: string;
  usoVehiculo: string;
  esNuevo: boolean;
  cambiarVehiculo: boolean;
}

interface BeneficiarioData {
  esOneroso: boolean;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  razonSocial: string;
}

interface CoberturasData {
  alternativaCobertura: string;
  opcionAutos: string;
  pequenosAccesorios: boolean;
  movilidad360: boolean;
  asistencia: string;
}

interface ResponsabilidadCivilData {
  rcExtracontractual: string;
  deducibleRC: string;
  rcSuplementaria: string;
}

interface DeduciblesData {
  parcialDanos: string;
  coberturaHurto: string;
  totalDanos: string;
}

interface PolizaConsultada {
  provisorio: string;
  postergada: string;
  producto: string;
  poliza: string;
  tomador: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  subproducto: string;
}

// --- Mock Data ---
const MOCK_POLIZAS: Record<string, PolizaConsultada> = {
  '1100000189310': {
    provisorio: 'N', postergada: 'N', producto: '250 NUEVO PRODUCTO AUTOMOVILES',
    poliza: '1100000189310', tomador: 'CARLOS ALBERTO FIGUEROA MARTINEZ',
    fechaInicio: '06/04/2025', fechaFin: '06/04/2026', estado: 'Activo', subproducto: '251',
  },
};

const MOCK_TOMADORES: Record<string, { nombres: string; apellidos: string; correo: string; telefono: string }> = {
  '1129564302': { nombres: 'CARLOS ALBERTO', apellidos: 'FIGUEROA MARTINEZ', correo: 'carlos123@gmail.com', telefono: '6015632548' },
  '80725151': { nombres: 'ALEJO', apellidos: 'URIBE RUIZ', correo: 'uribealejo56@gmail.com', telefono: '3046381225' },
};

const SUBPRODUCTOS = [
  { value: '251', label: '251 - Vehículos Bolívar' },
  { value: '263', label: '263 - Vehículos Especiales' },
  { value: '360', label: '360 - Autos Premium' },
  { value: '374', label: '374 - Autos Integral' },
  { value: '293', label: '293 - Opciones Autos' },
  { value: '311', label: '311 - Oferta Verde' },
  { value: '288', label: '288 - Autos Ligeros' },
  { value: '274', label: '274 - Autos Clásica' },
];

const COMPANIAS = [
  { value: '3', label: '3 - SEGUROS COMERCIALES BOLIVAR' },
];

const SECCIONES = [
  { value: '1', label: '1 - AUTOMOVILES' },
];

const OPCIONES_AUTOS = [
  { value: '', label: 'Seleccionar...' },
  { value: '1', label: '1 - PREMIUM' },
  { value: '2', label: '2 - STANDARD' },
  { value: '4', label: '4 - CLÁSICA' },
  { value: '5', label: '5 - AUTOS LIGEROS' },
];

const ASISTENCIAS = [
  { value: '', label: 'Seleccionar...' },
  { value: 'familiar', label: 'ASISTENCIA FAMILIAR' },
  { value: 'familiar-basica', label: 'ASISTENCIA FAMILIAR BASICA' },
];

const RC_EXTRACONTRACTUAL = [
  { value: '', label: 'Seleccionar...' },
  { value: '2000', label: '2.000 Millones' },
  { value: '3000', label: '3.000 Millones' },
  { value: '4000', label: '4.000 Millones' },
];

const DEDUCIBLE_RC = [
  { value: '', label: 'Seleccionar...' },
  { value: '0', label: 'Sin Deducible' },
  { value: '0.8', label: '0% 0.8 SMMLV' },
  { value: '0-0', label: '0% 0 SMMLV' },
];

const DEDUCIBLES_OPTIONS = [
  { value: '', label: 'Seleccionar...' },
  { value: '10-1', label: '10% Min 1 SMMLV' },
  { value: '10-1.5', label: '10% Min 1.5 SMMLV' },
  { value: '10-2', label: '10% Min 2 SMMLV' },
  { value: '15-1.5', label: '15% Min 1.5 SMMLV' },
  { value: '15-2', label: '15% Min 2 SMMLV' },
  { value: '0-0', label: '0% 0 SMMLV' },
];

// --- Section Accordion ---
function SectionAccordion({ title, icon: Icon, children, defaultOpen = false }: {
  title: string; icon: React.FC<{ size?: number; className?: string }>; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-[#005931]/5 hover:bg-[#005931]/10 transition-colors">
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-[#005931]" />
          <h3 className="text-sm font-bold text-[#002B49] uppercase tracking-wider">{title}</h3>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="p-6 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Field Component ---
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        {required && <span className="text-red-500">* </span>}{label}
      </label>
      {children}
    </div>
  );
}


// ============================================================
// MAIN COMPONENT
// ============================================================
export function ModificacionesView() {
  // --- Phase control ---
  const [phase, setPhase] = useState<'consulta' | 'formulario'>('consulta');

  // --- Phase 1: Consulta state ---
  const [consultaTipoDoc, setConsultaTipoDoc] = useState('CC');
  const [consultaNumDoc, setConsultaNumDoc] = useState('');
  const [consultaNombres, setConsultaNombres] = useState('');
  const [consultaApellidos, setConsultaApellidos] = useState('');
  const [consultaCompania, setConsultaCompania] = useState('');
  const [consultaSeccion, setConsultaSeccion] = useState('');
  const [consultaProducto, setConsultaProducto] = useState('');
  const [consultaNumPoliza, setConsultaNumPoliza] = useState('');
  const [consultaLiderClave, setConsultaLiderClave] = useState('');
  const [consultaLiderNombres, setConsultaLiderNombres] = useState('');
  const [resultados, setResultados] = useState<PolizaConsultada[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);

  // --- Phase 2: Formulario state ---
  const [selectedPoliza, setSelectedPoliza] = useState<PolizaConsultada | null>(null);
  const [fechaVigenciaMod, setFechaVigenciaMod] = useState(() => new Date().toISOString().split('T')[0]);

  const [tomador, setTomador] = useState<TomadorData>({
    tipoDocumento: 'CC', numeroDocumento: '', nombres: '', apellidos: '',
    correo: '', telefono: '', autorizaDatos: false,
  });

  const [vehiculo, setVehiculo] = useState<VehiculoData>({
    placa: '', codigoMarca: '', modelo: '', motor: '', chasis: '', color: '',
    valorComercial: '', valorAccesorios: '', usoVehiculo: '', esNuevo: false, cambiarVehiculo: false,
  });

  const [beneficiario, setBeneficiario] = useState<BeneficiarioData>({
    esOneroso: false, tipoIdentificacion: 'CC', numeroIdentificacion: '', razonSocial: '',
  });

  const [coberturas, setCoberturas] = useState<CoberturasData>({
    alternativaCobertura: '', opcionAutos: '', pequenosAccesorios: false, movilidad360: false, asistencia: '',
  });

  const [responsabilidadCivil, setResponsabilidadCivil] = useState<ResponsabilidadCivilData>({
    rcExtracontractual: '', deducibleRC: '', rcSuplementaria: '',
  });

  const [deducibles, setDeducibles] = useState<DeduciblesData>({
    parcialDanos: '', coberturaHurto: '', totalDanos: '',
  });

  const [observaciones, setObservaciones] = useState('');
  const [aceptaDeclaracion, setAceptaDeclaracion] = useState(false);

  // Document uploads
  const [docSolicitud, setDocSolicitud] = useState<File | null>(null);
  const [docFacturaAccesorios, setDocFacturaAccesorios] = useState<File | null>(null);
  const [docFacturaBlindaje, setDocFacturaBlindaje] = useState<File | null>(null);
  const [docResolucionBlindaje, setDocResolucionBlindaje] = useState<File | null>(null);
  const [docOpcionales, setDocOpcionales] = useState<File | null>(null);

  // --- Handlers ---
  const handleConsultaDocBlur = useCallback(() => {
    const found = MOCK_TOMADORES[consultaNumDoc];
    if (found) {
      setConsultaNombres(found.nombres);
      setConsultaApellidos(found.apellidos);
    } else {
      setConsultaNombres('');
      setConsultaApellidos('');
    }
  }, [consultaNumDoc]);

  const handleTomadorDocBlur = useCallback(() => {
    const found = MOCK_TOMADORES[tomador.numeroDocumento];
    if (found) {
      setTomador(prev => ({
        ...prev,
        nombres: found.nombres,
        apellidos: found.apellidos,
        correo: found.correo,
        telefono: found.telefono,
      }));
    }
  }, [tomador.numeroDocumento]);

  const handleConsultar = useCallback(() => {
    setIsSearching(true);
    setNoResults(false);
    setResultados([]);

    setTimeout(() => {
      setIsSearching(false);
      const results: PolizaConsultada[] = [];

      // Search by poliza number
      if (consultaNumPoliza && MOCK_POLIZAS[consultaNumPoliza]) {
        results.push(MOCK_POLIZAS[consultaNumPoliza]);
      }

      // Search by tomador document
      if (results.length === 0 && consultaNumDoc) {
        Object.values(MOCK_POLIZAS).forEach(p => {
          const tomadorData = MOCK_TOMADORES[consultaNumDoc];
          if (tomadorData && p.tomador.toUpperCase().includes(tomadorData.nombres.toUpperCase())) {
            results.push(p);
          }
        });
      }

      // Fallback: return all if compania is selected
      if (results.length === 0 && consultaCompania) {
        results.push(...Object.values(MOCK_POLIZAS));
      }

      if (results.length > 0) {
        setResultados(results);
      } else {
        setNoResults(true);
      }
    }, 800);
  }, [consultaNumPoliza, consultaNumDoc, consultaCompania]);

  const handleLimpiar = useCallback(() => {
    setConsultaTipoDoc('CC');
    setConsultaNumDoc('');
    setConsultaNombres('');
    setConsultaApellidos('');
    setConsultaCompania('');
    setConsultaSeccion('');
    setConsultaProducto('');
    setConsultaNumPoliza('');
    setConsultaLiderClave('');
    setConsultaLiderNombres('');
    setResultados([]);
    setNoResults(false);
  }, []);

  const handleSelectPoliza = useCallback((poliza: PolizaConsultada) => {
    setSelectedPoliza(poliza);
    setPhase('formulario');
  }, []);

  const handleCancelar = useCallback(() => {
    setPhase('consulta');
    setSelectedPoliza(null);
    setFechaVigenciaMod('');
    setTomador({ tipoDocumento: 'CC', numeroDocumento: '', nombres: '', apellidos: '', correo: '', telefono: '', autorizaDatos: false });
    setVehiculo({ placa: '', codigoMarca: '', modelo: '', motor: '', chasis: '', color: '', valorComercial: '', valorAccesorios: '', usoVehiculo: '', esNuevo: false, cambiarVehiculo: false });
    setBeneficiario({ esOneroso: false, tipoIdentificacion: 'CC', numeroIdentificacion: '', razonSocial: '' });
    setCoberturas({ alternativaCobertura: '', opcionAutos: '', pequenosAccesorios: false, movilidad360: false, asistencia: '' });
    setResponsabilidadCivil({ rcExtracontractual: '', deducibleRC: '', rcSuplementaria: '' });
    setDeducibles({ parcialDanos: '', coberturaHurto: '', totalDanos: '' });
    setObservaciones('');
    setAceptaDeclaracion(false);
    setDocSolicitud(null);
    setDocFacturaAccesorios(null);
    setDocFacturaBlindaje(null);
    setDocResolucionBlindaje(null);
    setDocOpcionales(null);
  }, []);

  const canEmitir = aceptaDeclaracion && docSolicitud !== null;

  const handleFileSelect = (setter: (f: File | null) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0] ?? null;
      setter(file);
    };
    input.click();
  };

  // ============================================================
  // PHASE 1: CONSULTA DE PÓLIZA
  // ============================================================
  if (phase === 'consulta') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#005931]/10">
            <Settings className="h-7 w-7 text-[#005931]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#002B49]">Modificaciones y solicitudes de modificación de pólizas</h2>
            <p className="text-gray-500 font-medium text-sm">Consulte y gestione modificaciones sobre pólizas de autos vigentes.</p>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Datos del Tomador */}
          <div className="border-l-4 border-[#005931] pl-4 mb-6">
            <h3 className="text-lg font-bold text-[#002B49]">Datos del Tomador</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <Field label="Tipo documento" required>
              <select value={consultaTipoDoc} onChange={e => setConsultaTipoDoc(e.target.value)} className="sb-ui-select w-full">
                <option value="CC">CC - Cédula de Ciudadanía</option>
                <option value="CE">CE - Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PA">PA - Pasaporte</option>
              </select>
            </Field>
            <Field label="Número de documento" required>
              <input type="text" value={consultaNumDoc}
                onChange={e => setConsultaNumDoc(e.target.value)}
                onBlur={handleConsultaDocBlur}
                placeholder="Ej: 1129564302"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Nombre(s)">
              <input type="text" value={consultaNombres} readOnly className="sb-ui-input w-full bg-gray-50" />
            </Field>
            <Field label="Apellido(s)">
              <input type="text" value={consultaApellidos} readOnly className="sb-ui-input w-full bg-gray-50" />
            </Field>
          </div>

          {/* Consulta General */}
          <div className="border-l-4 border-[#FFD100] pl-4 mb-6">
            <h3 className="text-lg font-bold text-[#002B49]">Consulta General</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            <Field label="Compañía">
              <select value={consultaCompania} onChange={e => setConsultaCompania(e.target.value)} className="sb-ui-select w-full">
                <option value="">Seleccionar...</option>
                {COMPANIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Sección">
              <select value={consultaSeccion} onChange={e => setConsultaSeccion(e.target.value)} className="sb-ui-select w-full">
                <option value="">Seleccionar...</option>
                {SECCIONES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Producto">
              <select value={consultaProducto} onChange={e => setConsultaProducto(e.target.value)} className="sb-ui-select w-full">
                <option value="">Seleccionar...</option>
                {SUBPRODUCTOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Número de póliza">
              <input type="text" value={consultaNumPoliza}
                onChange={e => setConsultaNumPoliza(e.target.value)}
                placeholder="Ej: 1100000189310"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Líder clave">
              <input type="text" value={consultaLiderClave}
                onChange={e => setConsultaLiderClave(e.target.value)}
                placeholder="Código líder"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Nombre(s)">
              <input type="text" value={consultaLiderNombres} readOnly
                className="sb-ui-input w-full bg-gray-50" />
            </Field>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={handleLimpiar}
              className="sb-ui-button sb-ui-button--secondary">
              Limpiar
            </button>
            <button type="button" onClick={handleConsultar} disabled={isSearching}
              className={`sb-ui-button sb-ui-button--primary sb-ui-button--fill ${isSearching ? 'opacity-60 cursor-not-allowed' : ''}`}>
              {isSearching ? (
                <><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" /> Buscando...</>
              ) : (
                <><Search size={16} className="mr-2 inline" /> Consultar</>
              )}
            </button>
          </div>
        </div>

        {/* No results */}
        <AnimatePresence>
          {noResults && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow border border-gray-100 p-8 text-center">
              <AlertCircle size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No se encontraron pólizas con los criterios ingresados.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Table */}
        <AnimatePresence>
          {resultados.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                  <CheckCircle size={20} className="text-[#005931]" />
                  <h3 className="text-lg font-bold text-[#002B49]">{resultados.length} resultado(s) encontrado(s)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#002B49] text-white text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 text-left font-bold">Provisorio</th>
                        <th className="px-4 py-3 text-left font-bold">Postergada</th>
                        <th className="px-4 py-3 text-left font-bold">Producto</th>
                        <th className="px-4 py-3 text-left font-bold">Póliza</th>
                        <th className="px-4 py-3 text-left font-bold">Tomador</th>
                        <th className="px-4 py-3 text-left font-bold">Fecha Inicio</th>
                        <th className="px-4 py-3 text-left font-bold">Fecha Fin</th>
                        <th className="px-4 py-3 text-left font-bold">Estado</th>
                        <th className="px-4 py-3 text-center font-bold">Operación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultados.map((r, idx) => (
                        <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">{r.provisorio}</td>
                          <td className="px-4 py-3">{r.postergada}</td>
                          <td className="px-4 py-3 font-medium">{r.producto}</td>
                          <td className="px-4 py-3 font-mono font-bold text-[#005931]">{r.poliza}</td>
                          <td className="px-4 py-3">{r.tomador}</td>
                          <td className="px-4 py-3">{r.fechaInicio}</td>
                          <td className="px-4 py-3">{r.fechaFin}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                              <CheckCircle size={12} /> {r.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button type="button" onClick={() => handleSelectPoliza(r)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                              <Settings size={14} /> Proceso de modificación
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }


  // ============================================================
  // PHASE 2: FORMULARIO DE MODIFICACIÓN
  // ============================================================
  return (
    <div className="space-y-6">
      {/* Header with poliza info */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#005931]/10">
          <FileText className="h-7 w-7 text-[#005931]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#002B49]">Formulario de Modificación de Póliza</h2>
          <p className="text-gray-500 font-medium text-sm">Complete los datos para solicitar la modificación.</p>
        </div>
      </div>

      {/* Poliza summary banner */}
      {selectedPoliza && (
        <div className="bg-gradient-to-r from-[#002B49] to-[#005931] rounded-2xl p-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-bold">Póliza</p>
              <p className="text-sm font-bold mt-1">{selectedPoliza.poliza}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-bold">Fecha Inicio</p>
              <p className="text-sm font-bold mt-1">{selectedPoliza.fechaInicio}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-bold">Fecha Fin</p>
              <p className="text-sm font-bold mt-1">{selectedPoliza.fechaFin}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-bold">Clave Asesor</p>
              <p className="text-sm font-bold mt-1">ASE001</p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-bold">Subproducto</p>
              <p className="text-sm font-bold mt-1">{selectedPoliza.subproducto}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider font-bold">Asegurado</p>
              <p className="text-sm font-bold mt-1">{selectedPoliza.tomador}</p>
            </div>
          </div>
        </div>
      )}

      {/* Fecha vigencia modificación */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="max-w-xs">
          <Field label="Fecha vigencia modificación" required>
            <input type="date" value={fechaVigenciaMod}
              onChange={e => setFechaVigenciaMod(e.target.value)}
              className="sb-ui-input w-full" />
          </Field>
        </div>
      </div>

      {/* --- Accordion Sections --- */}
      <div className="space-y-4">

        {/* Datos del Tomador */}
        <SectionAccordion title="Datos del Tomador" icon={User} defaultOpen>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Tipo documento" required>
              <select value={tomador.tipoDocumento}
                onChange={e => setTomador(prev => ({ ...prev, tipoDocumento: e.target.value }))}
                className="sb-ui-select w-full">
                <option value="CC">CC - Cédula de Ciudadanía</option>
                <option value="CE">CE - Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PA">PA - Pasaporte</option>
              </select>
            </Field>
            <Field label="Número de documento" required>
              <input type="text" value={tomador.numeroDocumento}
                onChange={e => setTomador(prev => ({ ...prev, numeroDocumento: e.target.value }))}
                onBlur={handleTomadorDocBlur}
                placeholder="Ingrese número de documento"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Nombre(s)">
              <input type="text" value={tomador.nombres} readOnly className="sb-ui-input w-full bg-gray-50" />
            </Field>
            <Field label="Apellido(s)">
              <input type="text" value={tomador.apellidos} readOnly className="sb-ui-input w-full bg-gray-50" />
            </Field>
            <Field label="Correo electrónico">
              <input type="email" value={tomador.correo}
                onChange={e => setTomador(prev => ({ ...prev, correo: e.target.value }))}
                placeholder="correo@ejemplo.com"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Teléfono">
              <input type="text" value={tomador.telefono}
                onChange={e => setTomador(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="Ej: 3001234567"
                className="sb-ui-input w-full" />
            </Field>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={tomador.autorizaDatos}
                onChange={e => setTomador(prev => ({ ...prev, autorizaDatos: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-[#005931] focus:ring-[#005931]" />
              <span className="text-sm text-gray-600">Autoriza uso de datos personales</span>
            </label>
          </div>
        </SectionAccordion>

        {/* Datos del Vehículo */}
        <SectionAccordion title="Datos del Vehículo" icon={Car}>
          <div className="flex flex-wrap gap-6 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={vehiculo.esNuevo}
                onChange={e => setVehiculo(prev => ({ ...prev, esNuevo: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-[#005931] focus:ring-[#005931]" />
              <span className="text-sm font-medium text-gray-700">Nuevo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={vehiculo.cambiarVehiculo}
                onChange={e => setVehiculo(prev => ({ ...prev, cambiarVehiculo: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-[#005931] focus:ring-[#005931]" />
              <span className="text-sm font-medium text-gray-700">Cambiar vehículo</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Placa">
              <input type="text" value={vehiculo.placa}
                onChange={e => setVehiculo(prev => ({ ...prev, placa: e.target.value.toUpperCase() }))}
                placeholder="ABC123"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Código / Descripción marca">
              <input type="text" value={vehiculo.codigoMarca}
                onChange={e => setVehiculo(prev => ({ ...prev, codigoMarca: e.target.value }))}
                placeholder="Código Fasecolda"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Modelo">
              <input type="text" value={vehiculo.modelo}
                onChange={e => setVehiculo(prev => ({ ...prev, modelo: e.target.value }))}
                placeholder="Año modelo"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Motor">
              <input type="text" value={vehiculo.motor}
                onChange={e => setVehiculo(prev => ({ ...prev, motor: e.target.value }))}
                placeholder="Número de motor"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Chasis">
              <input type="text" value={vehiculo.chasis}
                onChange={e => setVehiculo(prev => ({ ...prev, chasis: e.target.value }))}
                placeholder="Número de chasis"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Color">
              <input type="text" value={vehiculo.color}
                onChange={e => setVehiculo(prev => ({ ...prev, color: e.target.value }))}
                placeholder="Color del vehículo"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Valor comercial">
              <input type="text" value={vehiculo.valorComercial}
                onChange={e => setVehiculo(prev => ({ ...prev, valorComercial: e.target.value }))}
                placeholder="$0"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Valor accesorios a tarifar">
              <input type="text" value={vehiculo.valorAccesorios}
                onChange={e => setVehiculo(prev => ({ ...prev, valorAccesorios: e.target.value }))}
                placeholder="$0"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Uso vehículo">
              <select value={vehiculo.usoVehiculo}
                onChange={e => setVehiculo(prev => ({ ...prev, usoVehiculo: e.target.value }))}
                className="sb-ui-select w-full">
                <option value="">Seleccionar...</option>
                <option value="particular">Particular</option>
                <option value="publico">Público</option>
                <option value="oficial">Oficial</option>
                <option value="diplomatico">Diplomático</option>
              </select>
            </Field>
          </div>
        </SectionAccordion>

        {/* Datos del Beneficiario */}
        <SectionAccordion title="Datos del Beneficiario" icon={User}>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={beneficiario.esOneroso}
                onChange={e => setBeneficiario(prev => ({ ...prev, esOneroso: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-[#005931] focus:ring-[#005931]" />
              <span className="text-sm font-medium text-gray-700">Es oneroso</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Tipo identificación">
              <select value={beneficiario.tipoIdentificacion}
                onChange={e => setBeneficiario(prev => ({ ...prev, tipoIdentificacion: e.target.value }))}
                className="sb-ui-select w-full">
                <option value="CC">CC - Cédula de Ciudadanía</option>
                <option value="CE">CE - Cédula de Extranjería</option>
                <option value="NIT">NIT</option>
                <option value="PA">PA - Pasaporte</option>
              </select>
            </Field>
            <Field label="Número identificación">
              <input type="text" value={beneficiario.numeroIdentificacion}
                onChange={e => setBeneficiario(prev => ({ ...prev, numeroIdentificacion: e.target.value }))}
                placeholder="Número de identificación"
                className="sb-ui-input w-full" />
            </Field>
            <Field label="Razón social">
              <input type="text" value={beneficiario.razonSocial}
                onChange={e => setBeneficiario(prev => ({ ...prev, razonSocial: e.target.value }))}
                placeholder="Razón social o nombre"
                className="sb-ui-input w-full" />
            </Field>
          </div>
        </SectionAccordion>

        {/* Coberturas */}
        <SectionAccordion title="Coberturas" icon={Shield}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Alternativa coberturas" required>
              <select value={coberturas.alternativaCobertura}
                onChange={e => setCoberturas(prev => ({ ...prev, alternativaCobertura: e.target.value }))}
                className="sb-ui-select w-full">
                <option value="">Seleccionar...</option>
                <option value="43">43 - Alternativa Completa</option>
                <option value="44">44 - Alternativa Básica</option>
                <option value="45">45 - Alternativa Intermedia</option>
              </select>
            </Field>
            <Field label="Opción Autos">
              <select value={coberturas.opcionAutos}
                onChange={e => setCoberturas(prev => ({ ...prev, opcionAutos: e.target.value }))}
                disabled={coberturas.alternativaCobertura !== '43'}
                className={`sb-ui-select w-full ${coberturas.alternativaCobertura !== '43' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {OPCIONES_AUTOS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex flex-wrap gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={coberturas.pequenosAccesorios}
                onChange={e => setCoberturas(prev => ({ ...prev, pequenosAccesorios: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-[#005931] focus:ring-[#005931]" />
              <span className="text-sm font-medium text-gray-700">Pequeños accesorios</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={coberturas.movilidad360}
                onChange={e => setCoberturas(prev => ({ ...prev, movilidad360: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-[#005931] focus:ring-[#005931]" />
              <span className="text-sm font-medium text-gray-700">Movilidad 360</span>
            </label>
          </div>
          <div className="mt-4 max-w-md">
            <Field label="Asistencia">
              <select value={coberturas.asistencia}
                onChange={e => setCoberturas(prev => ({ ...prev, asistencia: e.target.value }))}
                className="sb-ui-select w-full">
                {ASISTENCIAS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </Field>
          </div>
        </SectionAccordion>

        {/* Datos de Responsabilidad Civil */}
        <SectionAccordion title="Datos de Responsabilidad Civil" icon={Shield}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="RC Extracontractual">
              <select value={responsabilidadCivil.rcExtracontractual}
                onChange={e => setResponsabilidadCivil(prev => ({ ...prev, rcExtracontractual: e.target.value }))}
                className="sb-ui-select w-full">
                {RC_EXTRACONTRACTUAL.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </Field>
            <Field label="Deducible cobertura RC">
              <select value={responsabilidadCivil.deducibleRC}
                onChange={e => setResponsabilidadCivil(prev => ({ ...prev, deducibleRC: e.target.value }))}
                className="sb-ui-select w-full">
                {DEDUCIBLE_RC.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </Field>
            <Field label="RC Suplementaria">
              <select value={responsabilidadCivil.rcSuplementaria}
                onChange={e => setResponsabilidadCivil(prev => ({ ...prev, rcSuplementaria: e.target.value }))}
                className="sb-ui-select w-full">
                <option value="">Seleccionar...</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </Field>
          </div>
        </SectionAccordion>

        {/* Deducibles */}
        <SectionAccordion title="Deducibles" icon={Shield}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Deducible parcial daños">
              <select value={deducibles.parcialDanos}
                onChange={e => setDeducibles(prev => ({ ...prev, parcialDanos: e.target.value }))}
                className="sb-ui-select w-full">
                {DEDUCIBLES_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </Field>
            <Field label="Deducible cobertura hurto">
              <select value={deducibles.coberturaHurto}
                onChange={e => setDeducibles(prev => ({ ...prev, coberturaHurto: e.target.value }))}
                className="sb-ui-select w-full">
                {DEDUCIBLES_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </Field>
            <Field label="Deducible total daños">
              <select value={deducibles.totalDanos}
                onChange={e => setDeducibles(prev => ({ ...prev, totalDanos: e.target.value }))}
                className="sb-ui-select w-full">
                {DEDUCIBLES_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </Field>
          </div>
        </SectionAccordion>

        {/* Observaciones */}
        <SectionAccordion title="Observaciones" icon={FileText}>
          <textarea value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
            rows={4}
            placeholder="Ingrese observaciones adicionales sobre la modificación..."
            className="sb-ui-input w-full resize-none" />
        </SectionAccordion>

        {/* Documentos Adjuntos */}
        <SectionAccordion title="Documentos Adjuntos" icon={Upload}>
          <div className="space-y-4">
            {/* Solicitud modificación - obligatorio */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-300 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <FileCheck size={20} className={docSolicitud ? 'text-[#005931]' : 'text-gray-400'} />
                <div>
                  <p className="text-sm font-bold text-gray-700">Solicitud modificación <span className="text-red-500">(obligatorio)</span></p>
                  {docSolicitud && <p className="text-xs text-[#005931] font-medium mt-0.5">{docSolicitud.name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {docSolicitud && (
                  <button type="button" onClick={() => setDocSolicitud(null)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                )}
                <button type="button" onClick={() => handleFileSelect(setDocSolicitud)}
                  className="sb-ui-button sb-ui-button--primary sb-ui-button--fill text-xs px-4 py-2">
                  <Upload size={14} className="mr-1.5 inline" /> {docSolicitud ? 'Cambiar' : 'Adjuntar'}
                </button>
              </div>
            </div>

            {/* Factura accesorios */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <FileText size={20} className={docFacturaAccesorios ? 'text-[#005931]' : 'text-gray-400'} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Factura accesorios</p>
                  {docFacturaAccesorios && <p className="text-xs text-[#005931] font-medium mt-0.5">{docFacturaAccesorios.name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {docFacturaAccesorios && (
                  <button type="button" onClick={() => setDocFacturaAccesorios(null)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                )}
                <button type="button" onClick={() => handleFileSelect(setDocFacturaAccesorios)}
                  className="sb-ui-button sb-ui-button--secondary text-xs px-4 py-2">
                  <Upload size={14} className="mr-1.5 inline" /> {docFacturaAccesorios ? 'Cambiar' : 'Adjuntar'}
                </button>
              </div>
            </div>

            {/* Factura blindaje */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <FileText size={20} className={docFacturaBlindaje ? 'text-[#005931]' : 'text-gray-400'} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Factura blindaje</p>
                  {docFacturaBlindaje && <p className="text-xs text-[#005931] font-medium mt-0.5">{docFacturaBlindaje.name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {docFacturaBlindaje && (
                  <button type="button" onClick={() => setDocFacturaBlindaje(null)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                )}
                <button type="button" onClick={() => handleFileSelect(setDocFacturaBlindaje)}
                  className="sb-ui-button sb-ui-button--secondary text-xs px-4 py-2">
                  <Upload size={14} className="mr-1.5 inline" /> {docFacturaBlindaje ? 'Cambiar' : 'Adjuntar'}
                </button>
              </div>
            </div>

            {/* Resolución blindaje */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <FileText size={20} className={docResolucionBlindaje ? 'text-[#005931]' : 'text-gray-400'} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Resolución blindaje</p>
                  {docResolucionBlindaje && <p className="text-xs text-[#005931] font-medium mt-0.5">{docResolucionBlindaje.name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {docResolucionBlindaje && (
                  <button type="button" onClick={() => setDocResolucionBlindaje(null)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                )}
                <button type="button" onClick={() => handleFileSelect(setDocResolucionBlindaje)}
                  className="sb-ui-button sb-ui-button--secondary text-xs px-4 py-2">
                  <Upload size={14} className="mr-1.5 inline" /> {docResolucionBlindaje ? 'Cambiar' : 'Adjuntar'}
                </button>
              </div>
            </div>

            {/* Documentos opcionales */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <FileText size={20} className={docOpcionales ? 'text-[#005931]' : 'text-gray-400'} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Documentos opcionales</p>
                  {docOpcionales && <p className="text-xs text-[#005931] font-medium mt-0.5">{docOpcionales.name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {docOpcionales && (
                  <button type="button" onClick={() => setDocOpcionales(null)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                    <X size={16} />
                  </button>
                )}
                <button type="button" onClick={() => handleFileSelect(setDocOpcionales)}
                  className="sb-ui-button sb-ui-button--secondary text-xs px-4 py-2">
                  <Upload size={14} className="mr-1.5 inline" /> {docOpcionales ? 'Cambiar' : 'Adjuntar'}
                </button>
              </div>
            </div>
          </div>
        </SectionAccordion>
      </div>

      {/* Declaration checkbox */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={aceptaDeclaracion}
            onChange={e => setAceptaDeclaracion(e.target.checked)}
            className="h-5 w-5 mt-0.5 rounded border-gray-300 text-[#005931] focus:ring-[#005931]" />
          <span className="text-sm text-gray-600 leading-relaxed">
            Declaro que la información ingresada en este formulario de solicitud de modificación es veraz y completa.
            Autorizo a la compañía aseguradora para verificar los datos suministrados y acepto las condiciones
            establecidas en la póliza vigente para el procesamiento de esta solicitud de modificación.
          </span>
        </label>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <button type="button" onClick={handleCancelar}
          className="sb-ui-button sb-ui-button--error">
          Cancelar
        </button>
        <button type="button"
          className="sb-ui-button sb-ui-button--secondary">
          Liquidar Prima
        </button>
        <button type="button" disabled={!canEmitir}
          className={`sb-ui-button sb-ui-button--primary sb-ui-button--fill ${!canEmitir ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <CheckCircle size={16} className="mr-2 inline" /> Emitir
        </button>
      </div>
    </div>
  );
}
