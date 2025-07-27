'use client';

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Peças e Reposição', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Mão de Obra Externa', value: 30, color: 'hsl(var(--primary) / 0.8)' },
  { name: 'Produtos Químicos', value: 15, color: 'hsl(var(--primary) / 0.6)' },
  { name: 'Serviços Terceirizados', value: 10, color: 'hsl(var(--primary) / 0.4)' },
];

export default function CustoPorCategoriaReport() {
  return (
    <div>
        <h3 className="text-lg font-semibold mb-4">Custo por Categoria</h3>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                />
                <Legend iconType="circle" />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
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
    </div>
  );
}
