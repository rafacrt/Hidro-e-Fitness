import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Thermometer, Droplet, Zap, Wind, Waves, Calendar } from "lucide-react";
import { Separator } from "../ui/separator";

const waterQuality = [
    { name: "pH", value: "7.2", ideal: "7.0-7.4", icon: Droplet },
    { name: "Cloro", value: "1.8 ppm", ideal: "1.0-3.0", icon: Zap },
    { name: "Alcalinidade", value: "95 ppm", ideal: "80-120", icon: Wind },
    { name: "Temperatura", value: "28°C", ideal: "26-30", icon: Thermometer },
    { name: "Turbidez", value: "0.3 NTU", ideal: "<0.5", icon: Waves },
];

export default function QualidadeAgua() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Qualidade da Água</CardTitle>
                <Select defaultValue="piscina1">
                    <SelectTrigger className="w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="piscina1">Piscina 1</SelectItem>
                        <SelectItem value="piscina2">Piscina 2</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {waterQuality.map((item, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <item.icon className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Ideal: {item.ideal}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{item.value}</p>
                                    <Badge variant="outline" className="font-medium bg-green-100 text-green-800 border-green-200">Ideal</Badge>
                                </div>
                            </div>
                            {index < waterQuality.length - 1 && <Separator className="mt-4" />}
                        </div>
                    ))}
                </div>
                 <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-700" />
                    <div>
                        <p className="font-semibold text-sm text-blue-800">Próximo Teste</p>
                        <p className="text-xs text-blue-700">16/01/2024, 14:30:00</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
