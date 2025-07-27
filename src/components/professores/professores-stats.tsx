import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, Dumbbell, Calendar } from "lucide-react";

const stats = [
    { title: "Total de Professores", value: "4", icon: Users },
    { title: "Professores Ativos", value: "4", icon: CheckCircle },
    { title: "Especialidades", value: "5", icon: Dumbbell },
    { title: "Média de Aulas/Semana", value: "12", icon: Calendar },
];

export default function ProfessoresStats() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {stats.map((stat, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-center mb-2">
                                <stat.icon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
