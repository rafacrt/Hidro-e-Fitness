import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const equipmentStatus = [
  {
    category: "Bombas e Filtros",
    stats: [
      { label: "Operacional", value: 7, color: "text-green-600" },
      { label: "Manutenção", value: 1, color: "text-yellow-600" },
      { label: "Quebrado", value: 0, color: "text-red-600" },
      { label: "Total", value: 8, color: "text-secondary-foreground font-bold border-t mt-2 pt-2" },
    ]
  },
  {
    category: "Aquecimento",
    stats: [
      { label: "Operacional", value: 2, color: "text-green-600" },
      { label: "Manutenção", value: 1, color: "text-yellow-600" },
      { label: "Quebrado", value: 0, color: "text-red-600" },
      { label: "Total", value: 3, color: "text-secondary-foreground font-bold border-t mt-2 pt-2" },
    ]
  },
  {
    category: "Iluminação",
    stats: [
      { label: "Operacional", value: 10, color: "text-green-600" },
      { label: "Manutenção", value: 1, color: "text-yellow-600" },
      { label: "Quebrado", value: 1, color: "text-red-600" },
      { label: "Total", value: 12, color: "text-secondary-foreground font-bold border-t mt-2 pt-2" },
    ]
  },
  {
    category: "Automação",
    stats: [
      { label: "Operacional", value: 6, color: "text-green-600" },
      { label: "Manutenção", value: 0, color: "text-yellow-600" },
      { label: "Quebrado", value: 0, color: "text-red-600" },
      { label: "Total", value: 6, color: "text-secondary-foreground font-bold border-t mt-2 pt-2" },
    ]
  }
];

export default function StatusEquipamentos() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Equipamentos</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {equipmentStatus.map((group, index) => (
          <div key={index} className="p-4 rounded-lg bg-secondary text-secondary-foreground">
            <h3 className="font-semibold mb-4 text-center">{group.category}</h3>
            <div className="space-y-2">
              {group.stats.map((stat, statIndex) => (
                <div key={statIndex} className={`flex justify-between text-sm ${stat.color}`}>
                  <span>{stat.label}</span>
                  <span className="font-medium">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
