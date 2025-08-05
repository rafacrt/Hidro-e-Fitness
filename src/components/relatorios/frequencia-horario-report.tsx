
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { time: '06-08h', Presença: 65 },
  { time: '08-10h', Presença: 92 },
  { time: '10-12h', Presença: 78 },
  { time: '12-14h', Presença: 45 },
  { time: '14-16h', Presença: 82 },
  { time: '16-18h', Presença: 88 },
  { time: '18-20h', Presença: 95 },
  { time: '20-22h', Presença: 75 },
];

export default function FrequenciaHorarioReport() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            width={30}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            formatter={(value: number) => [`${value}%`, 'Presença']}
          />
          <Bar dataKey="Presença" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
