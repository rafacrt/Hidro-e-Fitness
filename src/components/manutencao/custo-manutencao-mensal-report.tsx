'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { month: 'Ago/23', Custo: 1800 },
  { month: 'Set/23', Custo: 2200 },
  { month: 'Out/23', Custo: 1500 },
  { month: 'Nov/23', Custo: 2500 },
  { month: 'Dez/23', Custo: 2100 },
  { month: 'Jan/24', Custo: 2850 },
];

export default function CustoManutencaoMensalReport() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Custo Mensal de Manutenção</h3>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    formatter={(value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`}
                />
                <Bar dataKey="Custo" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
