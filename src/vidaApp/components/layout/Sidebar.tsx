/**
 * Sidebar con estructura jerárquica, dropdowns colapsables y hamburger en móvil.
 * Ramo Vida Individual — Simón Ventas.
 */

import { useState } from 'react';
import {
  Home,
  FileText,
  ChevronDown,
  Briefcase,
  DollarSign,
  Users,
  Percent,
  Menu,
  X,
} from 'lucide-react';

export interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  children?: { id: string; label: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Inicio', icon: Home },
  {
    id: 'gestion_polizas',
    label: 'Gestión de Pólizas',
    icon: FileText,
    children: [
      { id: 'vida_individual', label: 'Cotizar y emitir' },
      { id: 'modificar', label: 'Modificar' },
      { id: 'incluir_riesgos', label: 'Incluir riesgos' },
      { id: 'precobros', label: 'Precobros' },
      { id: 'crear_consecutivo', label: 'Crear consecutivo' },
    ],
  },
  { id: 'servicios_reportes', label: 'Servicios y reportes', icon: Briefcase },
  { id: 'pagos', label: 'Pagos', icon: DollarSign },
  { id: 'mis_clientes', label: 'Mis clientes', icon: Users },
  { id: 'comisiones', label: 'Comisiones', icon: Percent },
];

export function Sidebar({ currentRoute, onNavigate }: SidebarProps): React.JSX.Element {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['gestion_polizas']));
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleNavigate = (route: string) => {
    onNavigate(route);
    setMobileOpen(false);
  };

  const isActive = (id: string) => currentRoute === id;
  const isChildActive = (item: NavItem) =>
    item.children?.some((c) => currentRoute === c.id) ?? false;

  const navContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-100">
        <div className="h-8 w-8 rounded-lg bg-[#005931] flex items-center justify-center">
          <span className="text-white text-xs font-bold">SB</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">Seguros Bolívar</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedSections.has(item.id);
          const parentActive = isActive(item.id) || isChildActive(item);

          return (
            <div key={item.id}>
              <button
                type="button"
                onClick={() => hasChildren ? toggleSection(item.id) : handleNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  parentActive
                    ? 'bg-[#00a335]/10 text-[#00a335]'
                    : 'text-[#4B5563] hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span className="flex-1 text-left">{item.label}</span>
                {hasChildren && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {/* Subopciones */}
              {hasChildren && isExpanded && (
                <div className="ml-9 mt-0.5 space-y-0.5">
                  {item.children!.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => handleNavigate(child.id)}
                      className={`flex w-full rounded-md px-3 py-2 text-sm transition-colors ${
                        isActive(child.id)
                          ? 'bg-[#00a335]/10 font-medium text-[#00a335]'
                          : 'text-[#4B5563] hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md md:hidden"
        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {mobileOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar — desktop: fixed, mobile: slide-in */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-white border-r border-gray-200 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {navContent}
      </aside>
    </>
  );
}
