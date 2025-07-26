import { Card, CardContent } from "@/components/ui/card"
import { Users, Check, X, Clock } from "lucide-react"

const stats = [
    { title: "Total de Alunos", value: 5, icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Presentes", value: 3, icon: Check, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Ausentes", value: 1, icon: X, color: "text-red-600", bgColor: "bg-red-50" },
    { title: "Justificados", value: 1, icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50" },
]

export default function AttendanceStatCards() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="shadow-sm">
                    <CardContent className={`p-4 flex items-center gap-4 rounded-lg ${stat.bgColor}`}>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${stat.color}`}>{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
