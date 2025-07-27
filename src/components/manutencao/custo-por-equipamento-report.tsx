'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Aquecedor', Custo: 1200 },
  { name: 'Controlador pH', Custo: 800 },
  { name: 'Bomba Principal', Custo: 450 },
  { name: 'Sistema LED', Custo: 320 },
  { name: 'Filtro de Areia', Custo: 180 },
];

export default function CustoPorEquipamentoReport() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Custo por Equipamento</h3>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => `R$${value}`} />
                <YAxis dataKey="name" type="category" width={100} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    formatter={(value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`}
                />
                <Bar dataKey="Custo" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
