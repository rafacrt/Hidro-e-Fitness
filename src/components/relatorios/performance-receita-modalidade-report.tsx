
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Hidroginástica', Receita: 17280 },
  { name: 'Natação Adulto', Receita: 17280 },
  { name: 'Natação Infantil', Receita: 13770 },
  { name: 'Aqua Aeróbica', Receita: 6300 },
  { name: 'Funcional', Receita: 3960 },
];

export default function PerformanceReceitaModalidadeReport() {
  return (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(value) => `R$${value/1000}k`} />
            <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                formatter={(value: number) => [
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
                    'Receita'
                ]}
            />
            <Bar dataKey="Receita" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
        </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
