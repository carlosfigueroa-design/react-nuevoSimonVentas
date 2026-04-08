/**
 * Contenedor card usando Design System Seguros Bolívar.
 * Ramo Vida Individual — Simón Ventas.
 */

export interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoCard({ children, className = '' }: BentoCardProps): React.JSX.Element {
  return (
    <div className={`sb-ui-card sb-ui-card--outlined p-8 ${className}`}>
      <div className="sb-ui-card__body">
        {children}
      </div>
    </div>
  );
}
