/**
 * Tarjeta de acción rápida con icono, título y descripción.
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
      className={`flex flex-col items-start gap-3 rounded-xl bg-white p-6 shadow-sm text-left transition-all ${
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'hover:shadow-md hover:border-[#005931]/20 cursor-pointer'
      } border border-gray-100`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#005931]/10">
        <Icon className="h-5 w-5 text-[#005931]" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-xs text-gray-500">
          {disabled ? 'En desarrollo' : description}
        </p>
      </div>
    </button>
  );
}
