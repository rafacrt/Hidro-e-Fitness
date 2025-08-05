
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PerformanceAlunosModalidadeReport from "./performance-alunos-modalidade-report";
import PerformanceReceitaModalidadeReport from "./performance-receita-modalidade-report";
import PerformanceStatsReport from "./performance-stats-report";

export default function PerformanceReport() {
    return (
        <div className="space-y-6">
            <PerformanceStatsReport />
            <Card>
                <CardHeader>
                    <CardTitle>Performance por Modalidade</CardTitle>
                    <CardDescription>Comparativo de alunos e receita gerada por cada modalidade.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PerformanceAlunosModalidadeReport />
                    <PerformanceReceitaModalidadeReport />
                </CardContent>
            </Card>
        </div>
    )
}
