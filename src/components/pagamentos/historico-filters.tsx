import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { Filter, Search, Download } from "lucide-react";

export default function HistoricoFilters() {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por aluno, email, ID do pagamento..." className="pl-9" />
                </div>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <Select>
                        <SelectTrigger className="w-full md:w-[160px]">
                            <SelectValue placeholder="Todos os Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Status</SelectItem>
                            <SelectItem value="concluido">Concluído</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="falhou">Falhou</SelectItem>
                            <SelectItem value="estornado">Estornado</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select>
                        <SelectTrigger className="w-full md:w-[160px]">
                            <SelectValue placeholder="Todos os Métodos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Métodos</SelectItem>
                            <SelectItem value="pix">PIX</SelectItem>
                            <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                            <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-full md:w-[160px]">
                            <SelectValue placeholder="Últimos 30 dias" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30">Últimos 30 dias</SelectItem>
                            <SelectItem value="60">Últimos 60 dias</SelectItem>
                            <SelectItem value="90">Últimos 90 dias</SelectItem>
                            <SelectItem value="all">Todo o período</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full md:w-auto">
                        <Filter className="mr-2 h-4 w-4" />
                    </Button>
                    <Button className="w-full md:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
