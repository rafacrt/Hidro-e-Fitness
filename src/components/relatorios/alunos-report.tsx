
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StudentStats from "@/components/alunos/student-stats";
import CrescimentoAlunosReport from "./crescimento-alunos-report";
import DistribuicaoIdadeReport from "./distribuicao-idade-report";
import StudentStatsReport from "./alunos-stats-report";

export default function AlunosReport() {
    // Mock data for now, in a real scenario this would be fetched
    const allStudents = [
        { status: 'ativo', birth_date: '2000-01-01', is_whatsapp: true },
        { status: 'ativo', birth_date: '1995-05-10', is_whatsapp: false },
        { status: 'inativo', birth_date: '2010-08-20', is_whatsapp: true },
        { status: 'ativo', birth_date: '1988-11-30', is_whatsapp: true },
        { status: 'ativo', birth_date: '2015-02-15', is_whatsapp: true },
    ];

    return (
        <div className="space-y-6">
            <StudentStatsReport />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                     <CardHeader>
                        <CardTitle>Crescimento de Alunos</CardTitle>
                        <CardDescription>Novos alunos cadastrados nos últimos 6 meses.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <CrescimentoAlunosReport />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                     <CardHeader>
                        <CardTitle>Distribuição por Idade</CardTitle>
                        <CardDescription>Distribuição dos alunos por faixa etária.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DistribuicaoIdadeReport />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
