/**
 * Campo de formulario reutilizable con label, input, validación y estado de error.
 * Soporta máscara de moneda colombiana.
 * Inputs usan sb-ui-input / sb-ui-select del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { ChangeEvent } from 'react';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Activar máscara de moneda colombiana */
  mask?: 'currency';
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
  options,
  mask,
}: FormFieldProps): React.JSX.Element {
  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;

  const inputClasses = [
    'sb-ui-input w-full',
    error ? 'sb-ui-input--error' : '',
    disabled ? 'sb-ui-input--disabled' : '',
  ].filter(Boolean).join(' ');

  const selectClasses = [
    'sb-ui-select w-full',
    error ? 'sb-ui-select--error' : '',
    disabled ? 'sb-ui-select--disabled' : '',
  ].filter(Boolean).join(' ');

  const handleCurrencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '');
    const numeric = Number(raw) || 0;
    const formatted = numeric > 0
      ? numeric.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : '';
    const syntheticEvent = {
      ...e,
      target: { ...e.target, name, value: String(numeric) },
    } as ChangeEvent<HTMLInputElement>;
    e.target.value = formatted;
    onChange(syntheticEvent);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      {options ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={selectClasses}
        >
          <option value="">{placeholder ?? 'Seleccione...'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : mask === 'currency' ? (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
          <input
            id={inputId}
            name={name}
            type="text"
            inputMode="numeric"
            defaultValue={
              Number(value) > 0
                ? Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                : ''
            }
            onChange={handleCurrencyChange}
            disabled={disabled}
            placeholder={placeholder ?? '0'}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`${inputClasses} pl-7`}
          />
        </div>
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={inputClasses}
        />
      )}

      {error && (
        <p id={errorId} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
