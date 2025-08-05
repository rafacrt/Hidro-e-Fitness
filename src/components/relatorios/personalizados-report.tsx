
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, Sparkles } from "lucide-react";

const savedReports = [
    { name: "Alunos Ativos (Natação)", lastRun: "2 dias atrás" },
    { name: "Receita Mensal (Hidroginástica)", lastRun: "5 dias atrás" },
    { name: "Frequência (Turmas da Manhã)", lastRun: "1 semana atrás" },
]

export default function PersonalizadosReport() {
    return (
        <div className="space-y-6">
             <Card className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Sparkles className="h-12 w-12" />
                        <div>
                            <h2 className="text-xl font-bold">Crie Relatórios Sob Medida</h2>
                            <p className="text-sm opacity-90">Combine filtros e métricas para obter os insights que você precisa.</p>
                        </div>
                    </div>
                    <Button variant="secondary" size="lg">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Criar Novo Relatório
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Meus Relatórios Salvos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {savedReports.map((report, index) => (
                            <div key={index} className="p-4 rounded-lg border bg-card shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-semibold">{report.name}</p>
                                        <p className="text-xs text-muted-foreground">Última execução: {report.lastRun}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Executar</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
