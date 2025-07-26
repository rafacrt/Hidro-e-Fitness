import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FiltrosRelatorio() {
    return (
        <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-4 w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Calendar className="mr-2 h-4 w-4" />
                        Janeiro de 2024
                    </Button>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Filter className="mr-2 h-4 w-4" />
                    </Button>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select defaultValue="pdf">
                        <SelectTrigger className="w-full sm:w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="xlsx">XLSX</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
