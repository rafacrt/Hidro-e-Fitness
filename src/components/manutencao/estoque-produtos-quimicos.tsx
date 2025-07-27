import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { PlusCircle, Plus, Minus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

const products = [
  { 
    name: "Cloro Granulado",
    type: "Sanitizante",
    currentStock: 45.5,
    unit: "kg",
    min: 20,
    max: 100,
    duration: 18,
    status: "Normal",
    statusClass: "bg-green-100 text-green-800 border-green-200"
  },
  { 
    name: "Ácido Muriático",
    type: "Redutor de pH",
    currentStock: 12,
    unit: "L",
    min: 5,
    max: 25,
    duration: 15,
    status: "Normal",
    statusClass: "bg-green-100 text-green-800 border-green-200"
  },
  { 
    name: "Barrilha (Carbonato de Sódio)",
    type: "Elevador de pH",
    currentStock: 8.2,
    unit: "kg",
    min: 10,
    max: 50,
    duration: 27,
    status: "Crítico",
    statusClass: "bg-red-100 text-red-800 border-red-200"
  },
  { 
    name: "Algicida",
    type: "Algicida",
    currentStock: 3.5,
    unit: "L",
    min: 2,
    max: 10,
    duration: 35,
    status: "Normal",
    statusClass: "bg-green-100 text-green-800 border-green-200"
  },
  { 
    name: "Clarificante",
    type: "Clarificante",
    currentStock: 6.8,
    unit: "L",
    min: 3,
    max: 15,
    duration: 34,
    status: "Normal",
    statusClass: "bg-green-100 text-green-800 border-green-200"
  },
];

export default function EstoqueProdutosQuimicos() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Estoque de Produtos Químicos</CardTitle>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {products.map((product, index) => {
                    const progressValue = (product.currentStock - product.min) / (product.max - product.min) * 100;
                    return (
                        <div key={index}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.type}</p>
                                </div>
                                <Badge variant="outline" className={cn("font-medium", product.statusClass)}>{product.status}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex-1">
                                    <div className="flex justify-between text-sm mb-1">
                                        <p>Estoque Atual: <span className="font-bold">{product.currentStock} {product.unit}</span></p>
                                        <p>Duração Estimada: <span className="font-bold">{product.duration} dias</span></p>
                                    </div>
                                    <Progress value={progressValue} />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                        <span>Min: {product.min} {product.unit}</span>
                                        <span>Max: {product.max} {product.unit}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
