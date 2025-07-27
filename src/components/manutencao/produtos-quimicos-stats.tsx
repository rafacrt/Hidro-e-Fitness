import { Card, CardContent } from "@/components/ui/card";
import { Package, PackageX, Droplets, DollarSign } from "lucide-react";
import { Separator } from "../ui/separator";

const stats = [
    { title: "Produtos em Estoque", value: "5", icon: Package, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Estoque Baixo", value: "1", icon: PackageX, color: "text-red-600", bgColor: "bg-red-50" },
];

export default function ProdutosQuimicosStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Card className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-4 rounded-lg bg-green-50">
                    <div className="flex-1 flex items-center gap-4">
                        <Droplets className="h-8 w-8 text-green-600" />
                        <div>
                            <p className="text-sm font-medium text-green-600">Qualidade da Água</p>
                            <p className="text-2xl font-bold">Boa</p>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="h-12 bg-green-200" />
                     <div className="flex-1 flex items-center gap-4 pl-4">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        <div>
                            <p className="text-sm font-medium text-green-600">Valor do Estoque</p>
                            <p className="text-2xl font-bold">R$ 875,05</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
