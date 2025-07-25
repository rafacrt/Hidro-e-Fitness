import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Users, Activity, Heart, Anchor, Waves, Brain } from 'lucide-react';
import { ReactElement } from 'react';

const popularModalities: { name: string; students: number; classes: number; icon: ReactElement; color: string }[] = [
    { name: 'Hidroginástica', students: 100, classes: 5, icon: <Activity className="h-6 w-6" />, color: 'bg-green-500' },
    { name: 'Natação Adulto', students: 99, classes: 8, icon: <Users className="h-6 w-6" />, color: 'bg-blue-500' },
    { name: 'Aqua Aeróbica', students: 49, classes: 4, icon: <Heart className="h-6 w-6" />, color: 'bg-purple-500' },
    { name: 'Natação Infantil', students: 40, classes: 5, icon: <Waves className="h-6 w-6" />, color: 'bg-yellow-500' },
    { name: 'Zumba Aquática', students: 22, classes: 2, icon: <Dumbbell className="h-6 w-6" />, color: 'bg-pink-500' },
];


export default function PopularModalities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Modalidades Mais Populares</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {popularModalities.map((mod, index) => (
            <li key={index} className="flex items-center space-x-4">
                <div className={`flex items-center justify-center h-10 w-10 rounded-lg text-white ${mod.color}`}>
                    {mod.icon}
                </div>
              <div className="flex-grow">
                <p className="font-semibold">{mod.name}</p>
                <p className="text-sm text-muted-foreground">{mod.students} alunos - {mod.classes} turmas</p>
              </div>
              <p className="font-bold text-lg">#{index + 1}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
