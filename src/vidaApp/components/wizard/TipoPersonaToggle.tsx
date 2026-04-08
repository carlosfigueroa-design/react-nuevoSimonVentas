/**
 * Selector Natural/Jurídica con campos condicionales de Representante Legal.
 * Usa sb-ui-button, sb-ui-card del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { TipoPersonaNatJur, RepresentanteLegal } from '../../types';
import { FormField } from '../ui/FormField';
import { DOCUMENT_TYPE_OPTIONS_EXTENDED } from '../../constants';

export interface TipoPersonaToggleProps {
  value: TipoPersonaNatJur;
  onChange: (tipo: TipoPersonaNatJur) => void;
  representanteLegal: RepresentanteLegal;
  onRepresentanteChange: (data: Partial<RepresentanteLegal>) => void;
}

export function TipoPersonaToggle({
  value,
  onChange,
  representanteLegal,
  onRepresentanteChange,
}: TipoPersonaToggleProps): React.JSX.Element {
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="sb-ui-input-label">Tipo de Persona</legend>
        <div className="mt-2 flex gap-2">
          {(['natural', 'juridica'] as const).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => onChange(tipo)}
              className={`sb-ui-button ${
                value === tipo
                  ? 'sb-ui-button--primary sb-ui-button--fill'
                  : 'sb-ui-button--secondary'
              }`}
            >
              {tipo === 'natural' ? 'Natural' : 'Jurídica'}
            </button>
          ))}
        </div>
      </fieldset>

      {value === 'juridica' && (
        <div className="sb-ui-card sb-ui-card--outlined p-4 space-y-3 bg-gray-50">
          <h3 className="sb-ui-heading-h6 font-semibold text-gray-800">Representante Legal</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              label="Nombre completo"
              name="rep-legal-name"
              value={representanteLegal.name}
              onChange={(e) => onRepresentanteChange({ name: e.target.value })}
              required
            />
            <FormField
              label="Tipo de documento"
              name="rep-legal-doc-type"
              value={representanteLegal.documentType}
              onChange={(e) => onRepresentanteChange({ documentType: e.target.value as RepresentanteLegal['documentType'] })}
              options={DOCUMENT_TYPE_OPTIONS_EXTENDED}
              required
            />
            <FormField
              label="Número de documento"
              name="rep-legal-doc-number"
              value={representanteLegal.documentNumber}
              onChange={(e) => onRepresentanteChange({ documentNumber: e.target.value })}
              required
            />
            <FormField
              label="Cargo"
              name="rep-legal-cargo"
              value={representanteLegal.cargo}
              onChange={(e) => onRepresentanteChange({ cargo: e.target.value })}
              required
            />
          </div>
        </div>
      )}
    </div>
  );
}
