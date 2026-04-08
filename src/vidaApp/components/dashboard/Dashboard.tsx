/**
 * Dashboard principal de Simón Ventas.
 * Bienvenida personalizada, acciones rápidas y panel de actividad.
 * Ramo Vida Individual — Simón Ventas.
 */

import { FileText, Car, FolderSearch } from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { QuickActionCard } from '../ui/QuickActionCard';

export interface DashboardProps {
  onNavigate: (route: string) => void;
}

const ADVISOR = { name: 'Carlos Martínez', key: 'ADV-001', agency: 'Agencia Bogotá Centro' };

const RECENT_ACTIVITY = [
  { id: 1, text: 'Cotización COT-A1B2C3D4 generada', date: 'Hoy, 10:30 AM' },
  { id: 2, text: 'Póliza 1234567890123 emitida', date: 'Ayer, 3:15 PM' },
  { id: 3, text: 'Cotización COT-E5F6G7H8 enviada por email', date: 'Hace 2 días' },
];

export function Dashboard({ onNavigate }: DashboardProps): React.JSX.Element {
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
          DASHBOARD PRINCIPAL
        </p>
        <h1 className="mt-1 text-h4 font-bold text-gray-900">
          Bienvenido, {ADVISOR.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Clave: {ADVISOR.key} · {ADVISOR.agency}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="Nueva Cotización Vida"
          description="Iniciar cotización de Vida Individual"
          icon={FileText}
          onClick={() => onNavigate('vida_individual')}
        />
        <QuickActionCard
          title="Cotizar Autos"
          description="Cotización de seguros de autos"
          icon={Car}
          onClick={() => {}}
          disabled
        />
        <QuickActionCard
          title="Consulta de Casos"
          description="Buscar cotizaciones y pólizas"
          icon={FolderSearch}
          onClick={() => onNavigate('consulta_cotizaciones')}
          disabled
        />
      </div>

      {/* Activity Panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Activity (2/3) */}
        <BentoCard className="lg:col-span-2">
          <h2 className="text-h6 font-semibold text-gray-900">Actividad Reciente</h2>
          <ul className="mt-4 space-y-3">
            {RECENT_ACTIVITY.map((item) => (
              <li key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                <span className="text-sm text-gray-700">{item.text}</span>
                <span className="text-[11px] text-gray-400 shrink-0 ml-4">{item.date}</span>
              </li>
            ))}
          </ul>
        </BentoCard>

        {/* Monthly Goals (1/3) */}
        <BentoCard>
          <h2 className="text-h6 font-semibold text-gray-900">Metas Mensuales</h2>
          <div className="mt-4 space-y-4">
            <GoalProgress label="Cotizaciones" current={12} target={20} />
            <GoalProgress label="Pólizas emitidas" current={5} target={10} />
            <GoalProgress label="Prima acumulada" current={65} target={100} suffix="%" />
          </div>
        </BentoCard>
      </div>
    </div>
  );
}

function GoalProgress({
  label,
  current,
  target,
  suffix = '',
}: {
  label: string;
  current: number;
  target: number;
  suffix?: string;
}): React.JSX.Element {
  const pct = Math.min(Math.round((current / target) * 100), 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">
          {current}{suffix} / {target}{suffix}
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-[#00C875] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
