"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartEntry {
  label: string;
  cost: number;
}

function fmt$(n: number): string {
  if (n < 0.001) return "<$0.001";
  if (n < 1) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{
        backgroundColor: "var(--z-bg-elevated)",
        border: "1px solid var(--z-border-gold)",
        color: "var(--z-text-primary)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      }}
    >
      <p style={{ color: "var(--z-text-muted)" }} className="mb-1">
        {label}
      </p>
      <p className="font-semibold">{fmt$(payload[0].value)}</p>
    </div>
  );
}

export default function CostChart({ data }: { data: ChartEntry[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart
        data={data}
        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--z-gold)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--z-gold)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--z-text-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--z-text-muted)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => (v === 0 ? "$0" : `$${v.toFixed(3)}`)}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="cost"
          stroke="var(--z-gold)"
          strokeWidth={2}
          fill="url(#goldGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "var(--z-gold)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
