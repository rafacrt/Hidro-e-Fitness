import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BarChart } from "lucide-react";

const modalities: any[] = [
    // Dados removidos para implementação com dados reais
];

export default function FrequenciaPorModalidade() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Frequência por Modalidade</CardTitle>
                <BarChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-6">
                {modalities.length > 0 ? modalities.map((mod, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                                <span className={`h-3 w-3 rounded-full ${mod.color} mr-2`}></span>
                                <p className="font-medium">{mod.name}</p>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold">
                                <TrendingUp className="h-4 w-4 text-green-500"/>
                                <span>{mod.overallAvg}%</span>
                            </div>
                        </div>
                        <Progress value={mod.overallAvg} className="h-2" indicatorClassName={mod.color} />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Hoje: {mod.today}</span>
                            <span>Média Semanal: {mod.weeklyAvg}</span>
                            <span>Total Alunos: {mod.totalStudents}</span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-muted-foreground py-10">
                        <BarChart className="mx-auto h-12 w-12 mb-4" />
                        <p>Ainda não há dados de frequência para exibir.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
