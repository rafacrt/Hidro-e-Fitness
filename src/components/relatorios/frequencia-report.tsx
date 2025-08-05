
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FrequenciaHorarioReport from "./frequencia-horario-report";
import FrequenciaModalidadeReport from "./frequencia-modalidade-report";
import FrequenciaStatsReport from "./frequencia-stats-report";

export default function FrequenciaReport() {
    return (
        <div className="space-y-6">
            <FrequenciaStatsReport />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                     <CardHeader>
                        <CardTitle>Frequência por Modalidade</CardTitle>
                        <CardDescription>Taxa de presença média em cada modalidade.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <FrequenciaModalidadeReport />
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader>
                        <CardTitle>Frequência por Horário</CardTitle>
                        <CardDescription>Percentual de presença nos horários de pico.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FrequenciaHorarioReport />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
