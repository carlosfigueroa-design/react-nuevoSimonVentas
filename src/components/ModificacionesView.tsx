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
