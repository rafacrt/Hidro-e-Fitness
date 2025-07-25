import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const modalities = [
  { name: 'Natação Adulto', classes: 8, students: 99, capacity: 120, color: 'bg-blue-500' },
  { name: 'Hidroginástica', classes: 5, students: 100, capacity: 110, color: 'bg-green-500' },
  { name: 'Natação Infantil', classes: 5, students: 40, capacity: 50, color: 'bg-yellow-500' },
  { name: 'Aqua Aeróbica', classes: 4, students: 49, capacity: 60, color: 'bg-purple-500' },
  { name: 'Natação Avançada', classes: 2, students: 20, capacity: 20, color: 'bg-red-500' },
];

export default function EstatisticasModalidade() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Estatísticas por Modalidade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {modalities.map((mod, index) => {
          const occupancy = (mod.students / mod.capacity) * 100;
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <span className={`h-3 w-3 rounded-full ${mod.color} mr-2`}></span>
                  <p className="font-medium">{mod.name}</p>
                </div>
                <p className="text-sm font-semibold">{occupancy.toFixed(0)}%</p>
              </div>
              <Progress value={occupancy} className="h-2 [&>div]:bg-transparent" style={{ background: `linear-gradient(to right, ${mod.color.replace('bg-', 'var(--color-')}), ${mod.color.replace('bg-', 'var(--color-')}) ${occupancy}%, hsl(var(--muted)) ${occupancy}%)` }} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{mod.classes} Turmas</span>
                <span>{mod.students} alunos</span>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );
}

// Quick fix to use the color from the component in the progress bar.
// Ideally, this would be handled by the theme.
const colorMap: { [key: string]: string } = {
  'bg-blue-500': '#3b82f6',
  'bg-green-500': '#22c55e',
  'bg-yellow-500': '#eab308',
  'bg-purple-500': '#a855f7',
  'bg-red-500': '#ef4444',
};

function styleWithVars(style: React.CSSProperties): React.CSSProperties {
    const newStyle: React.CSSProperties = {};
    for (const key in style) {
        const value = (style as any)[key];
        if (typeof value === 'string') {
            const colorKey = value.match(/var\(--color-([^)]+)\)/);
            if (colorKey && colorMap[`bg-${colorKey[1]}`]) {
                newStyle[key as any] = value.replace(`var(--color-${colorKey[1]})`, colorMap[`bg-${colorKey[1]}`]);
            } else {
                 (newStyle as any)[key] = value;
            }
        }
    }
    return newStyle;
}
