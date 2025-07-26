import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search } from "lucide-react";


export default function AttendanceFilters() {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                <Button variant="outline" className="w-full md:w-auto">
                    <Calendar className="mr-2 h-4 w-4" />
                    26/07/2025
                </Button>
                <Select>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Todas as Turmas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Turmas</SelectItem>
                        <SelectItem value="natacao_adulto">Natação Adulto - Iniciante</SelectItem>
                        <SelectItem value="hidroginastica">Hidroginástica</SelectItem>
                    </SelectContent>
                </Select>
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nome do aluno..." className="pl-9" />
                </div>
            </CardContent>
        </Card>
    )
}