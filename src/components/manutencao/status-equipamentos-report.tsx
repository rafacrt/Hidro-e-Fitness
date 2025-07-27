
const equipmentStatus = [
  {
    category: "Bombas e Filtros",
    total: 8,
    stats: [
      { label: "Operacional", value: 7, color: "bg-green-100 text-green-800" },
      { label: "Manutenção", value: 1, color: "bg-yellow-100 text-yellow-800" },
      { label: "Quebrado", value: 0, color: "bg-red-100 text-red-800" },
    ]
  },
  {
    category: "Aquecimento",
    total: 3,
    stats: [
      { label: "Operacional", value: 2, color: "bg-green-100 text-green-800" },
      { label: "Manutenção", value: 1, color: "bg-yellow-100 text-yellow-800" },
      { label: "Quebrado", value: 0, color: "bg-red-100 text-red-800" },
    ]
  },
  {
    category: "Iluminação",
    total: 12,
    stats: [
      { label: "Operacional", value: 10, color: "bg-green-100 text-green-800" },
      { label: "Manutenção", value: 1, color: "bg-yellow-100 text-yellow-800" },
      { label: "Quebrado", value: 1, color: "bg-red-100 text-red-800" },
    ]
  },
  {
    category: "Automação",
    total: 6,
    stats: [
      { label: "Operacional", value: 6, color: "bg-green-100 text-green-800" },
      { label: "Manutenção", value: 0, color: "bg-yellow-100 text-yellow-800" },
      { label: "Quebrado", value: 0, color: "bg-red-100 text-red-800" },
    ]
  }
];

export default function StatusEquipamentosReport() {
  return (
    <div>
        <h3 className="text-lg font-semibold mb-4">Status dos Equipamentos</h3>
        <div className="space-y-4">
            {equipmentStatus.map((group, index) => (
            <div key={index}>
                <div className="flex justify-between items-center mb-1">
                    <p className="font-medium">{group.category}</p>
                    <p className="text-sm text-muted-foreground">{group.total} equipamentos</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    {group.stats.map((stat) => (
                        <div key={stat.label} className={`p-2 rounded-md ${stat.color}`}>
                            <p className="font-bold">{stat.value}</p>
                            <p className="text-xs">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            ))}
        </div>
    </div>
  );
}
