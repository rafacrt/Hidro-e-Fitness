import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { Filter, Search } from "lucide-react";

export default function ProfessoresFilters() {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nome ou especialidade..." className="pl-9" />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Select>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Todas as Especialidades" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as Especialidades</SelectItem>
                            <SelectItem value="natacao">Natação</SelectItem>
                            <SelectItem value="hidroginastica">Hidroginástica</SelectItem>
                            <SelectItem value="funcional">Funcional</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full md:w-auto">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
