
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function PagamentosFilters() {
    return (
        <div className="p-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por descrição ou fornecedor..." className="pl-9" />
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Select>
                    <SelectTrigger className="w-full md:w-[160px]">
                        <SelectValue placeholder="Todos os Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="vencido">Vencido</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="w-full md:w-[160px]">
                        <SelectValue placeholder="Todas as Categorias" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Categorias</SelectItem>
                        <SelectItem value="salarios">Salários</SelectItem>
                        <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                        <SelectItem value="operacional">Operacional</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="w-full md:w-auto">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
