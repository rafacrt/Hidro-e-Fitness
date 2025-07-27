import { Progress } from "@/components/ui/progress";

const frequencyByModality = [
    { name: "Natação Adulto", absenceRate: 15, frequency: 85, color: "bg-green-500" },
    { name: "Hidroginástica", absenceRate: 12, frequency: 88, color: "bg-green-500" },
    { name: "Natação Infantil", absenceRate: 25, frequency: 75, color: "bg-green-500" },
    { name: "Aqua Aeróbica", absenceRate: 20, frequency: 80, color: "bg-green-500" },
    { name: "Natação Avançada", absenceRate: 5, frequency: 95, color: "bg-green-500" },
];

export default function FrequenciaPorModalidadeReport() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Frequência por Modalidade</h3>
            <div className="space-y-4">
                {frequencyByModality.map((modality, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <div>
                               <span className="font-medium">{modality.name}</span>
                               <p className="text-xs text-muted-foreground">{modality.absenceRate}% de faltas</p>
                            </div>
                            <span className="font-semibold">{modality.frequency}%</span>
                        </div>
                        <Progress value={modality.frequency} className="h-2" indicatorClassName={modality.color} />
                    </div>
                ))}
            </div>
        </div>
    )
}
