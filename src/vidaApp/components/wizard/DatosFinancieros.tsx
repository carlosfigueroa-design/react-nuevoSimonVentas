/**
 * Sección de datos financieros y biográficos con máscara de moneda.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useCurrencyMask } from '../../hooks';

export interface DatosFinancierosProps {
  ingresoMensual: number;
  onIngresoChange: (value: number) => void;
  ciudad: string;
  onCiudadChange: (value: string) => void;
  ocupacion: string;
  onOcupacionChange: (value: string) => void;
  actividadEconomica: string;
  onActividadChange: (value: string) => void;
  relacionLaboral: string;
  onRelacionLaboralChange: (value: string) => void;
}

export function DatosFinancieros({
  ingresoMensual,
  onIngresoChange,
  ciudad,
  onCiudadChange,
  ocupacion,
  onOcupacionChange,
  actividadEconomica,
  onActividadChange,
  relacionLaboral,
  onRelacionLaboralChange,
}: DatosFinancierosProps): React.JSX.Element {
  const { displayValue, handleChange } = useCurrencyMask(ingresoMensual);

  const handleIngresoInput = (val: string) => {
    handleChange(val);
    const numeric = Number(val.replace(/\./g, '')) || 0;
    onIngresoChange(numeric);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-h6 font-semibold text-gray-800">Datos Financieros y Biográficos</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Ingreso mensual */}
        <div className="flex flex-col gap-1">
          <label htmlFor="ingreso-mensual" className="text-sm font-medium text-gray-700">
            Ingreso mensual <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
            <input
              id="ingreso-mensual"
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={(e) => handleIngresoInput(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-7 pr-3 text-sm focus:border-[#005931] focus:outline-none focus:ring-2 focus:ring-[#005931]/15"
              placeholder="0"
            />
          </div>
        </div>

        {/* Ciudad */}
        <div className="flex flex-col gap-1">
          <label htmlFor="ciudad" className="text-sm font-medium text-gray-700">
            Ciudad <span className="text-red-500">*</span>
          </label>
          <input
            id="ciudad"
            type="text"
            value={ciudad}
            onChange={(e) => onCiudadChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#005931] focus:outline-none focus:ring-2 focus:ring-[#005931]/15"
            placeholder="Ej: Bogotá"
          />
        </div>

        {/* Ocupación */}
        <div className="flex flex-col gap-1">
          <label htmlFor="ocupacion" className="text-sm font-medium text-gray-700">
            Ocupación <span className="text-red-500">*</span>
          </label>
          <input
            id="ocupacion"
            type="text"
            value={ocupacion}
            onChange={(e) => onOcupacionChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#005931] focus:outline-none focus:ring-2 focus:ring-[#005931]/15"
            placeholder="Ej: Ingeniero"
          />
        </div>

        {/* Actividad económica */}
        <div className="flex flex-col gap-1">
          <label htmlFor="relacion-laboral" className="text-sm font-medium text-gray-700">
            Relación Laboral <span className="text-red-500">*</span>
          </label>
          <select
            id="relacion-laboral"
            value={relacionLaboral}
            onChange={(e) => onRelacionLaboralChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#005931] focus:outline-none focus:ring-2 focus:ring-[#005931]/15"
          >
            <option value="">Seleccione...</option>
            <option value="empleado">Empleado</option>
            <option value="independiente">Independiente</option>
            <option value="pensionado">Pensionado</option>
            <option value="desempleado">Desempleado</option>
            <option value="estudiante">Estudiante</option>
          </select>
        </div>

        {/* Actividad económica */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="actividad-economica" className="text-sm font-medium text-gray-700">
            Actividad económica <span className="text-red-500">*</span>
          </label>
          <input
            id="actividad-economica"
            type="text"
            value={actividadEconomica}
            onChange={(e) => onActividadChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#005931] focus:outline-none focus:ring-2 focus:ring-[#005931]/15"
            placeholder="Ej: Tecnología"
          />
        </div>
      </div>
    </div>
  );
}
