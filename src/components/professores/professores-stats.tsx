import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, Dumbbell, Calendar } from "lucide-react";
import type { Database } from "@/lib/database.types";
import { useMemo } from "react";

type Instructor = Database['public']['Tables']['instructors']['Row'];

interface ProfessoresStatsProps {
    instructors: Instructor[];
}

export default function ProfessoresStats({ instructors }: ProfessoresStatsProps) {
    const stats = useMemo(() => {
        const total = instructors.length;
        const active = instructors.length; // Assuming all are active for now
        const specialties = new Set(instructors.flatMap(i => i.specialties as string[] || [])).size;
        const avgClasses = 12; // Static for now

        return [
            { title: "Total de Professores", value: total.toString(), icon: Users },
            { title: "Professores Ativos", value: active.toString(), icon: CheckCircle },
            { title: "Especialidades", value: specialties.toString(), icon: Dumbbell },
            { title: "Média de Aulas/Semana", value: avgClasses.toString(), icon: Calendar },
        ];
    }, [instructors]);

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
