/**
 * Contenedor bv-card con fondo blanco, border-radius 12px y sombra sutil.
 * Ramo Vida Individual — Simón Ventas.
 */

export interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoCard({ children, className = '' }: BentoCardProps): React.JSX.Element {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-8 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
