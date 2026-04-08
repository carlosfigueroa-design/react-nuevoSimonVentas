/**
 * Tarjeta de acción rápida con icono, título y descripción.
 * Usa sb-ui-card del Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

import type { LucideIcon } from 'lucide-react';

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  disabled = false,
}: QuickActionCardProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`sb-ui-card sb-ui-card--interactive sb-ui-card--outlined flex flex-col items-start gap-3 p-6 text-left transition-all ${
        disabled ? 'sb-ui-card--disabled' : ''
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#005931]/10">
        <Icon className="h-5 w-5 text-[#005931]" />
      </div>
      <div>
        <h3 className="sb-ui-text-label font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 sb-ui-text-caption text-gray-500">
          {disabled ? 'En desarrollo' : description}
        </p>
      </div>
    </button>
  );
}
