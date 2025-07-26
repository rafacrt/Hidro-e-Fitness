import { Progress } from "@/components/ui/progress";

const revenueByModality = [
    { name: "Natação Adulto", percentage: 42.4, value: "R$ 18.000,00", color: "bg-green-500" },
    { name: "Hidroginástica", percentage: 29.4, value: "R$ 12.500,00", color: "bg-teal-500" },
    { name: "Natação Infantil", percentage: 18.8, value: "R$ 8.000,00", color: "bg-emerald-500" },
    { name: "Aqua Aeróbica", percentage: 9.4, value: "R$ 4.000,00", color: "bg-lime-500" },
];

export default function ReceitaPorModalidade() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Receita por Modalidade</h3>
            <div className="space-y-4">
                {revenueByModality.map((modality, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-medium">{modality.name}</span>
                            <div className="flex items-center">
                                <span className="text-muted-foreground mr-2">{modality.percentage}%</span>
                                <span className="font-semibold">{modality.value}</span>
                            </div>
                        </div>
                        <Progress value={modality.percentage} className="h-2" indicatorClassName={modality.color} />
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
