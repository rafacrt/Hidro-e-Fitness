import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const types = [
    { name: 'Aquática', count: 5, revenue: 'R$ 38.000,00', color: 'text-blue-500' },
    { name: 'Inativa', count: 2, revenue: 'R$ 10.500,00', color: 'text-gray-500' },
    { name: 'Terrestre', count: 1, revenue: 'R$ 10.000,00', color: 'text-green-500' },
]

export default function ModalityTypes() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Tipos de Modalidades</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {types.map((type, index) => (
                        <li key={index}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium flex items-center">
                                        <span className={`h-2 w-2 rounded-full mr-2 ${type.color.replace('text-', 'bg-')}`}></span>
                                        {type.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{type.count} modalidades</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{type.revenue}</p>
                                    <p className="text-sm text-muted-foreground">Receita</p>
                                </div>
                            </div>
                            {index < types.length - 1 && <Separator className="mt-4" />}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
