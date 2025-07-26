import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BarChart } from "lucide-react";

const modalities = [
    { name: "Natação Adulto", today: "84/96", weeklyAvg: "85.2%", totalStudents: 96, overallAvg: 87.5, color: "bg-blue-500" },
    { name: "Hidroginástica", today: "98/108", weeklyAvg: "89.1%", totalStudents: 108, overallAvg: 90.7, color: "bg-green-500" },
    { name: "Natação Infantil", today: "32/40", weeklyAvg: "82.5%", totalStudents: 40, overallAvg: 80, color: "bg-yellow-500" },
    { name: "Aqua Aeróbica", today: "39/45", weeklyAvg: "84.3%", totalStudents: 45, overallAvg: 86.7, color: "bg-purple-500" },
    { name: "Funcional Aquático", today: "16/18", weeklyAvg: "91.2%", totalStudents: 18, overallAvg: 88.9, color: "bg-orange-500" },
];

export default function FrequenciaPorModalidade() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Frequência por Modalidade</CardTitle>
                <BarChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-6">
                {modalities.map((mod, index) => (
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
                ))}
            </CardContent>
        </Card>
    );
}
// Add a new prop to Progress to allow for custom indicator color
const OldProgress = Progress;
const NewProgress = ({ indicatorClassName, ...props }: React.ComponentProps<typeof OldProgress> & { indicatorClassName?: string }) => {
    return (
        <OldProgress
            {...props}
            classNames={{
                indicator: indicatorClassName
            }}
        />
    )
}

export { NewProgress as Progress }
