
'use client';

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Manhã', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Tarde', value: 35, color: 'hsl(var(--primary) / 0.8)' },
  { name: 'Noite', value: 20, color: 'hsl(var(--primary) / 0.6)' },
];

export default function DistribuicaoPorPeriodoDia() {
  return (
    <div>
        <h3 className="text-lg font-semibold mb-4">Distribuição por Período do Dia</h3>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                        return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    {payload[0].name}
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                    {payload[0].value}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        );
                    }
                    return null;
                    }}
                />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
