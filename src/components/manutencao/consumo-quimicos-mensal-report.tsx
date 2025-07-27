'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { month: 'Ago/23', Cloro: 40, Barrilha: 24, Algicida: 10 },
  { month: 'Set/23', Cloro: 30, Barrilha: 13, Algicida: 8 },
  { month: 'Out/23', Cloro: 20, Barrilha: 38, Algicida: 12 },
  { month: 'Nov/23', Cloro: 27, Barrilha: 39, Algicida: 9 },
  { month: 'Dez/23', Cloro: 18, Barrilha: 48, Algicida: 15 },
  { month: 'Jan/24', Cloro: 23, Barrilha: 38, Algicida: 11 },
];

export default function ConsumoQuimicosMensalReport() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Consumo Mensal de Produtos (kg/L)</h3>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    formatter={(value: number, name: string) => [`${value} ${name === 'Cloro' || name === 'Barrilha' ? 'kg' : 'L'}`, name]}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Cloro" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Barrilha" stackId="a" fill="hsl(var(--primary) / 0.7)" />
                <Bar dataKey="Algicida" stackId="a" fill="hsl(var(--primary) / 0.4)" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
