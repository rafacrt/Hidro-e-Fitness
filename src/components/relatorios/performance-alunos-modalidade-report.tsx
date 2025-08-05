
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Hidroginástica', Alunos: 108 },
  { name: 'Natação Adulto', Alunos: 96 },
  { name: 'Aqua Aeróbica', Alunos: 45 },
  { name: 'Natação Infantil', Alunos: 40 },
  { name: 'Funcional', Alunos: 18 },
];

export default function PerformanceAlunosModalidadeReport() {
  return (
    <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 0, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                 formatter={(value: number) => [`${value} alunos`, 'Alunos']}
            />
            <Bar dataKey="Alunos" fill="hsl(var(--primary) / 0.7)" radius={[0, 4, 4, 0]} barSize={24} />
        </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
