import { Progress } from "@/components/ui/progress";

const occupancyByModality = [
    { name: "Natação Adulto", students: "96 alunos", classes: "8 turmas", percentage: 85, color: "bg-cyan-500" },
    { name: "Hidroginástica", students: "108 alunos", classes: "6 turmas", percentage: 90, color: "bg-cyan-500" },
    { name: "Natação Infantil", students: "40 alunos", classes: "5 turmas", percentage: 80, color: "bg-cyan-500" },
    { name: "Aqua Aeróbica", students: "45 alunos", classes: "3 turmas", percentage: 83, color: "bg-cyan-500" },
    { name: "Natação Avançada", students: "20 alunos", classes: "2 turmas", percentage: 100, color: "bg-cyan-500" },
];

export default function OcupacaoModalidade() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Ocupação por Modalidade</h3>
            <div className="space-y-4">
                {occupancyByModality.map((modality, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-medium">{modality.name}</span>
                            <div className="flex items-center">
                                <span className="font-semibold">{modality.percentage}%</span>
                            </div>
                        </div>
                        <Progress value={modality.percentage} className="h-2" indicatorClassName={modality.color} />
                        <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                            <span>{modality.students}</span>
                            <span>{modality.classes}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
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
