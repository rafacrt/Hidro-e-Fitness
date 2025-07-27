'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { day: '08/01', pH: 7.2, Cloro: 1.8 },
  { day: '09/01', pH: 7.4, Cloro: 1.5 },
  { day: '10/01', pH: 7.1, Cloro: 2.2 },
  { day: '11/01', pH: 7.3, Cloro: 1.9 },
  { day: '12/01', pH: 7.5, Cloro: 1.4 },
  { day: '13/01', pH: 7.2, Cloro: 2.0 },
  { day: '14/01', pH: 7.4, Cloro: 1.7 },
];

export default function VariacaoParametrosAguaReport() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Variação dos Parâmetros da Água</h3>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} fontSize={12} domain={[6.8, 7.8]} />
                <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} fontSize={12} domain={[1.0, 3.0]} />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    formatter={(value: number, name: string) => [`${value.toFixed(1)} ${name === 'Cloro' ? 'ppm' : ''}`, name]}
                />
                <Legend iconType="circle" />
                <Line yAxisId="left" type="monotone" dataKey="pH" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="Cloro" stroke="hsl(var(--primary) / 0.6)" strokeWidth={2} dot={false} />
            </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
