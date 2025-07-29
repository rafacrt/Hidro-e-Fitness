'use client';

import { Card, CardContent } from "@/components/ui/card"
import type { Database } from "@/lib/database.types";
import { useMemo } from "react";

type Student = Database['public']['Tables']['students']['Row'];

interface StudentStatsProps {
    students: Student[];
}

const calculateAge = (birthDate: string | null): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
};

export default function StudentStats({ students }: StudentStatsProps) {
    const stats = useMemo(() => {
        const activeStudents = students.filter(s => s.status === 'ativo').length;
        const inactiveStudents = students.filter(s => s.status === 'inativo').length;
        const minors = students.filter(s => {
            const age = calculateAge(s.birth_date);
            return age !== null && age < 18;
        }).length;
        const withWhatsApp = students.filter(s => s.is_whatsapp).length;

        return [
            { value: activeStudents, label: "Alunos Ativos" },
            { value: inactiveStudents, label: "Alunos Inativos" },
            { value: minors, label: "Menores de Idade" },
            { value: withWhatsApp, label: "Com WhatsApp" },
        ]
    }, [students]);


    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {stats.map((stat, index) => (
                        <div key={index}>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
