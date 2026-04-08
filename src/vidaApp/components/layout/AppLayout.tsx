/**
 * Layout principal: Sidebar + área de contenido con scroll independiente.
 * Responsive: 1 columna en móvil, sidebar + contenido en escritorio.
 * Ramo Vida Individual — Simón Ventas.
 */

import { Sidebar } from './Sidebar';

export interface AppLayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export function AppLayout({ children, currentRoute, onNavigate }: AppLayoutProps): React.JSX.Element {
  const isVidaRoute = currentRoute === 'vida_individual';

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {!isVidaRoute && <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />}
      <main
        className={isVidaRoute
          ? 'mx-auto min-h-screen max-w-7xl px-4 py-6'
          : 'md:ml-[260px] min-h-screen overflow-y-auto'
        }
      >
        {children}
      </main>
    </div>
  );
}
