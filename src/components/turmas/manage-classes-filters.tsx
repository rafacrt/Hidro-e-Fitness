import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { Filter, Search } from "lucide-react";

export default function ManageClassesFilters() {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nome da turma ou professor..." className="pl-9" />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Todas as Modalidades" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as Modalidades</SelectItem>
                            <SelectItem value="natacao_adulto">Natação Adulto</SelectItem>
                            <SelectItem value="hidroginastica">Hidroginástica</SelectItem>
                            <SelectItem value="natacao_infantil">Natação Infantil</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Todos os Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Status</SelectItem>
                            <SelectItem value="ativa">Ativa</SelectItem>
                            <SelectItem value="inativa">Inativa</SelectItem>
                            <SelectItem value="lotada">Lotada</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full md:w-auto">
                        <Filter className="mr-2 h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
