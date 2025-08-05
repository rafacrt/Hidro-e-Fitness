
'use client';

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Hidroginástica', value: 91, color: 'hsl(var(--primary))' },
  { name: 'Natação Adulto', value: 87, color: 'hsl(var(--primary) / 0.9)' },
  { name: 'Funcional Aquático', value: 89, color: 'hsl(var(--primary) / 0.8)' },
  { name: 'Aqua Aeróbica', value: 87, color: 'hsl(var(--primary) / 0.7)' },
  { name: 'Natação Infantil', value: 80, color: 'hsl(var(--primary) / 0.6)' },
];

export default function FrequenciaModalidadeReport() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            formatter={(value: number, name: string) => [`${value}%`, name]}
          />
          <Legend
            iconType="circle"
            formatter={(value, entry) => (
              <span className="text-muted-foreground">{value}</span>
            )}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            dataKey="value"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
