/**
 * Paso 1: Datos del Riesgo — Captura de Tomador, Asegurado, Plan, Tipo Persona y Datos Financieros.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { useWizard, useValidation, useAgeValidation } from '../../hooks';
import { validateEmail } from '../../utils';
import { FormField, BentoCard } from '../ui';
import { PlanSelector } from './PlanSelector';
import { TipoPersonaToggle } from './TipoPersonaToggle';
import { DatosFinancieros } from './DatosFinancieros';
import type { PersonData, PlanVida, TipoPersonaNatJur, RepresentanteLegal } from '../../types';

const DOCUMENT_TYPE_OPTIONS = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' },
];

const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
];

const EMPTY_PERSON: PersonData = {
  nombres: '', apellidos: '', documentType: '', documentNumber: '',
  dateOfBirth: '', gender: '', email: '', phone: '', address: '',
};

/** Simula validación de clave de intermediario */
const MOCK_ADVISORS: Record<string, string> = {
  'AS-998877': 'Carlos Andrés Martínez',
  'AS-112233': 'María Fernanda López',
  'AS-445566': 'Juan Pablo Rodríguez',
};

function PersonFields({
  prefix,
  data,
  disabled,
  errors,
  onChange,
}: {
  prefix: string;
  data: PersonData;
  disabled: boolean;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}): React.JSX.Element {
  const handle = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange(e.target.name, e.target.value);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <FormField label="Nombres" name={`${prefix}_nombres`} value={data.nombres}
        onChange={handle} error={errors[`${prefix}_nombres`]} required disabled={disabled} />
      <FormField label="Apellidos" name={`${prefix}_apellidos`} value={data.apellidos}
        onChange={handle} error={errors[`${prefix}_apellidos`]} required disabled={disabled} />
      <FormField label="Tipo de documento" name={`${prefix}_documentType`}
        value={data.documentType} onChange={handle} options={DOCUMENT_TYPE_OPTIONS}
        error={errors[`${prefix}_documentType`]} required disabled={disabled} />
      <FormField label="Número de documento" name={`${prefix}_documentNumber`}
        value={data.documentNumber} onChange={handle}
        error={errors[`${prefix}_documentNumber`]} required disabled={disabled} />
      <FormField label="Fecha de nacimiento" name={`${prefix}_dateOfBirth`} type="date"
        value={data.dateOfBirth} onChange={handle}
        error={errors[`${prefix}_dateOfBirth`]} required disabled={disabled} />
      <FormField label="Género" name={`${prefix}_gender`} value={data.gender}
        onChange={handle} options={GENDER_OPTIONS}
        error={errors[`${prefix}_gender`]} required disabled={disabled} />
      <FormField label="Correo electrónico" name={`${prefix}_email`} type="email"
        value={data.email} onChange={handle}
        error={errors[`${prefix}_email`]} required disabled={disabled} />
      <FormField label="Teléfono" name={`${prefix}_phone`} value={data.phone}
        onChange={handle} error={errors[`${prefix}_phone`]} required disabled={disabled} />
      <FormField label="Dirección" name={`${prefix}_address`} value={data.address}
        onChange={handle} error={errors[`${prefix}_address`]} required disabled={disabled}
        placeholder="Dirección de residencia" />
    </div>
  );
}

export function DatosRiesgo(): React.JSX.Element {
  const { state, dispatch } = useWizard();
  const { errors, validateField } = useValidation();
  const dr = state.stepData.datosRiesgo;
  const { tomador, asegurado, isSameAsInsured } = dr;

  // Age validation for asegurado
  const aseguradoDob = isSameAsInsured ? tomador.dateOfBirth : asegurado.dateOfBirth;
  const { age, isValid: isAgeValid, errorMessage: ageError } = useAgeValidation(aseguradoDob);

  const updateDatosRiesgo = useCallback(
    (patch: Partial<typeof dr>) => {
      dispatch({
        type: 'SET_STEP_DATA',
        step: 1,
        data: { datosRiesgo: { ...dr, ...patch } },
      });
    },
    [dr, dispatch],
  );

  const updateField = useCallback(
    (role: 'tomador' | 'asegurado', field: string, value: string) => {
      const rawField = field.replace(/^(tomador|asegurado)_/, '');
      const updatedPerson = { ...dr[role], [rawField]: value };
      const patch: Record<string, unknown> = { [role]: updatedPerson };

      if (role === 'tomador' && isSameAsInsured) {
        patch.asegurado = { ...updatedPerson, tipo: 'asegurado' };
      }

      dispatch({
        type: 'SET_STEP_DATA',
        step: 1,
        data: { datosRiesgo: { ...dr, ...patch } as typeof dr },
      });

      if (rawField === 'email') {
        validateField(`${role}_email`, value, validateEmail);
      }
    },
    [dr, isSameAsInsured, dispatch, validateField],
  );

  const handleTomadorChange = useCallback(
    (field: string, value: string) => updateField('tomador', field, value),
    [updateField],
  );

  const handleAseguradoChange = useCallback(
    (field: string, value: string) => updateField('asegurado', field, value),
    [updateField],
  );

  const handleSameToggle = useCallback(() => {
    const next = !isSameAsInsured;
    const newAsegurado = next
      ? { ...tomador, tipo: 'asegurado' as const }
      : { ...EMPTY_PERSON, tipo: 'asegurado' as const } as typeof asegurado;

    updateDatosRiesgo({ isSameAsInsured: next, asegurado: newAsegurado });
  }, [isSameAsInsured, tomador, asegurado, updateDatosRiesgo]);

  const handlePlanChange = useCallback(
    (plan: PlanVida) => updateDatosRiesgo({ plan }),
    [updateDatosRiesgo],
  );

  const handleTipoPersonaChange = useCallback(
    (tipo: TipoPersonaNatJur) => updateDatosRiesgo({ tipoPersonaNatJur: tipo }),
    [updateDatosRiesgo],
  );

  const handleRepresentanteChange = useCallback(
    (data: Partial<RepresentanteLegal>) =>
      updateDatosRiesgo({ representanteLegal: { ...dr.representanteLegal, ...data } }),
    [dr.representanteLegal, updateDatosRiesgo],
  );

  /** Simula validación de clave de intermediario */
  const handleClaveIntermediarioChange = useCallback(
    (value: string) => {
      const nombre = MOCK_ADVISORS[value.toUpperCase()] ?? '';
      updateDatosRiesgo({ claveIntermediario: value, nombreAsesor: nombre });
    },
    [updateDatosRiesgo],
  );

  // Merge age error into errors for display
  const allErrors = { ...errors };
  if (ageError && aseguradoDob) {
    allErrors['asegurado_dateOfBirth'] = ageError;
  }

  return (
    <div className="space-y-6">
      {/* 1. Información del Asesor */}
      <BentoCard>
        <h2 className="mb-3 text-h5 font-semibold text-gray-800">Información del Asesor</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField
            label="Clave del Intermediario"
            name="claveIntermediario"
            value={dr.claveIntermediario}
            onChange={(e) => handleClaveIntermediarioChange(e.target.value)}
            required
            placeholder="Ej: AS-998877"
          />
          <FormField
            label="Nombre del Asesor"
            name="nombreAsesor"
            value={dr.nombreAsesor}
            onChange={() => {}}
            disabled
            placeholder="Se autocompleta al validar la clave"
          />
        </div>
      </BentoCard>

      {/* 2. Selección de Plan */}
      <BentoCard>
        <PlanSelector value={dr.plan} onChange={handlePlanChange} error={!dr.plan ? undefined : undefined} />
      </BentoCard>

      {/* Tipo Persona */}
      <BentoCard>
        <TipoPersonaToggle
          value={dr.tipoPersonaNatJur}
          onChange={handleTipoPersonaChange}
          representanteLegal={dr.representanteLegal}
          onRepresentanteChange={handleRepresentanteChange}
        />
      </BentoCard>

      {/* 3. Datos del Tomador */}
      <BentoCard>
        <h2 className="mb-3 text-h5 font-semibold text-gray-800">Datos del Tomador</h2>
        <PersonFields prefix="tomador" data={tomador} disabled={false}
          errors={allErrors} onChange={handleTomadorChange} />
      </BentoCard>

      {/* Checkbox Tomador = Asegurado */}
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={isSameAsInsured} onChange={handleSameToggle}
          className="h-4 w-4 rounded border-gray-300 accent-[#005931]" />
        Tomador es el mismo Asegurado
      </label>

      {/* 4. Datos del Asegurado */}
      <BentoCard>
        <h2 className="mb-3 text-h5 font-semibold text-gray-800">Datos del Asegurado</h2>

        {/* Campos de persona: se contraen si Tomador = Asegurado */}
        {!isSameAsInsured && (
          <PersonFields prefix="asegurado" data={asegurado} disabled={false}
            errors={allErrors} onChange={handleAseguradoChange} />
        )}

        {isSameAsInsured && (
          <p className="text-sm text-gray-500 italic">
            Los datos del tomador se usarán como datos del asegurado.
          </p>
        )}

        {age >= 0 && (
          <p className={`mt-2 text-xs ${isAgeValid ? 'text-[#005931]' : 'text-red-600'}`}>
            Edad del asegurado: {age} años {!isAgeValid && ageError ? `— ${ageError}` : ''}
          </p>
        )}

        {/* Datos Financieros y Biográficos (integrados) */}
        <div className="mt-4 border-t border-gray-100 pt-4">
          <DatosFinancieros
            ingresoMensual={dr.ingresoMensual}
            onIngresoChange={(value) => updateDatosRiesgo({ ingresoMensual: value })}
            ciudad={dr.ciudad}
            onCiudadChange={(v) => updateDatosRiesgo({ ciudad: v })}
            ocupacion={dr.ocupacion}
            onOcupacionChange={(v) => updateDatosRiesgo({ ocupacion: v })}
            actividadEconomica={dr.actividadEconomica}
            onActividadChange={(v) => updateDatosRiesgo({ actividadEconomica: v })}
            relacionLaboral={dr.relacionLaboral}
            onRelacionLaboralChange={(v) => updateDatosRiesgo({ relacionLaboral: v })}
          />
        </div>
      </BentoCard>

      {/* Checkbox de tratamiento de datos */}
      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={dr.aceptaTratamientoDatos}
          onChange={() => updateDatosRiesgo({ aceptaTratamientoDatos: !dr.aceptaTratamientoDatos })}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#005931]"
        />
        <span>
          Autorizo el tratamiento de mis datos personales de acuerdo con la política de
          privacidad de Seguros Bolívar.
        </span>
      </label>
    </div>
  );
}
