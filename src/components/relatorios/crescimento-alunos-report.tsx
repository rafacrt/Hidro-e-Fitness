
'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { month: 'Ago/23', "Novos Alunos": 12 },
  { month: 'Set/23', "Novos Alunos": 19 },
  { month: 'Out/23', "Novos Alunos": 25 },
  { month: 'Nov/23', "Novos Alunos": 22 },
  { month: 'Dez/23', "Novos Alunos": 32 },
  { month: 'Jan/24', "Novos Alunos": 28 },
];

export default function CrescimentoAlunosReport() {
  return (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Line 
                type="monotone" 
                dataKey="Novos Alunos" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                dot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }} 
            />
        </LineChart>
        </ResponsiveContainer>
    </div>
  );
}
