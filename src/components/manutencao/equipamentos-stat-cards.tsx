
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const stats = [
    { title: "Total de Equipamentos", value: "5", icon: Wrench, color: "bg-blue-50 text-blue-800" },
    { title: "Operacionais", value: "3", icon: CheckCircle, color: "bg-green-50 text-green-800" },
    { title: "Em Manutenção", value: "1", icon: Clock, color: "bg-yellow-50 text-yellow-800" },
    { title: "Quebrados", value: "1", icon: AlertTriangle, color: "bg-red-50 text-red-800" },
];

export default function EquipamentosStatCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className={`${stat.color}`}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <stat.icon className="h-6 w-6" />
                            <div>
                                <p className="text-sm font-medium">{stat.title}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
