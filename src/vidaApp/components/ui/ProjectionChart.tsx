/**
 * Gráfico de proyección basado en Recharts (AreaChart).
 * Ramo Vida Individual — Simón Ventas.
 */

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ProjectionDataPoint } from '../../types';

export interface ProjectionChartProps {
  data: ProjectionDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  type?: 'rentas' | 'necesidades';
}

const CHART_COLORS: Record<string, { stroke: string; fill: string }> = {
  rentas: { stroke: '#15803d', fill: '#bbf7d0' },
  necesidades: { stroke: '#b45309', fill: '#fde68a' },
};

export function ProjectionChart({
  data,
  xAxisLabel = 'Año',
  yAxisLabel = 'Valor ($)',
  type = 'rentas',
}: ProjectionChartProps): React.JSX.Element {
  const colors = CHART_COLORS[type] ?? { stroke: '#15803d', fill: '#bbf7d0' };

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
        Sin datos de proyección
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11 }}
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -16, fontSize: 11 }}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(1)}M`}
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toLocaleString('es-CO')}`, 'Valor']}
            labelFormatter={(label: number) => `Año ${label}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors.stroke}
            fill={colors.fill}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
