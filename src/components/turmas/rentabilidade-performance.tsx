import { Progress } from "@/components/ui/progress";

const profitabilityData = [
    { name: "Natação Adulto", costs: "R$ 6.048,00", percentage: 65, color: "bg-green-500" },
    { name: "Hidroginástica", costs: "R$ 5.184,00", percentage: 70, color: "bg-green-500" },
    { name: "Natação Infantil", costs: "R$ 2.400,00", percentage: 60, color: "bg-green-500" },
    { name: "Aqua Aeróbica", costs: "R$ 2.016,00", percentage: 68, color: "bg-green-500" },
    { name: "Natação Avançada", costs: "R$ 1.100,00", percentage: 75, color: "bg-green-500" },
];

export default function RentabilidadePerformance() {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Rentabilidade</h3>
            <div className="space-y-4">
                {profitabilityData.map((item, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <div>
                               <span className="font-medium">{item.name}</span>
                               <p className="text-xs text-muted-foreground">Custos: {item.costs}</p>
                            </div>
                            <span className="font-semibold text-green-600">{item.percentage}%</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" indicatorClassName={item.color} />
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
