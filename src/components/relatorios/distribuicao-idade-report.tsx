
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { age: '0-10', Alunos: 25 },
  { age: '11-20', Alunos: 42 },
  { age: '21-30', Alunos: 58 },
  { age: '31-40', Alunos: 65 },
  { age: '41-50', Alunos: 48 },
  { age: '51+', Alunos: 35 },
];

export default function DistribuicaoIdadeReport() {
  return (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="age" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} width={0} />
            <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
            />
            <Bar dataKey="Alunos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
