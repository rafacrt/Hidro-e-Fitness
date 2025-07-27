
import { Progress } from "@/components/ui/progress";

const reliabilityData = [
    { name: "Bomba Principal Piscina 1", mtbf: "2400 horas", reliability: 98.5 },
    { name: "Filtro de Areia Principal", mtbf: "3200 horas", reliability: 99.2 },
    { name: "Sistema LED Piscina 1", mtbf: "1800 horas", reliability: 95.8 },
    { name: "Controlador de pH", mtbf: "1200 horas", reliability: 87.3 },
];

export default function ConfiabilidadeEquipamentosReport() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Confiabilidade dos Equipamentos</h3>
            <div className="space-y-4">
                {reliabilityData.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                            <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">MTBF: {item.mtbf}</p>
                            </div>
                            <span className="font-semibold text-sm">{item.reliability}%</span>
                        </div>
                        <Progress value={item.reliability} className="h-2" indicatorClassName="bg-green-500" />
                    </div>
                ))}
            </div>
        </div>
    )
}
