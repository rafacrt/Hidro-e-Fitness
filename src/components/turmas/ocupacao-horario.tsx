import { Progress } from "@/components/ui/progress";

const occupancyByTime = [
    { time: "06:00-08:00", classes: "4 turmas", percentage: 65, color: "bg-green-500" },
    { time: "08:00-10:00", classes: "6 turmas", percentage: 95, color: "bg-green-500" },
    { time: "10:00-12:00", classes: "4 turmas", percentage: 78, color: "bg-green-500" },
    { time: "14:00-16:00", classes: "3 turmas", percentage: 82, color: "bg-green-500" },
    { time: "16:00-18:00", classes: "4 turmas", percentage: 88, color: "bg-green-500" },
    { time: "18:00-20:00", classes: "3 turmas", percentage: 92, color: "bg-green-500" },
];

export default function OcupacaoHorario() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Ocupação por Horário</h3>
            <div className="space-y-4">
                {occupancyByTime.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <div className="w-2/5">
                            <p className="font-medium text-sm">{item.time}</p>
                            <p className="text-xs text-muted-foreground">{item.classes}</p>
                        </div>
                        <div className="w-3/5 flex items-center gap-2">
                            <Progress value={item.percentage} className="h-2" indicatorClassName={item.color} />
                            <span className="font-semibold text-sm w-10 text-right">{item.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
