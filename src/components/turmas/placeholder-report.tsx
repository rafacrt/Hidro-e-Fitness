
import { FileText } from "lucide-react";

export default function PlaceholderReport() {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-semibold">Selecione um relatório para visualizar os dados</h3>
            <p className="text-sm">Clique em um dos cards acima para carregar as informações.</p>
        </div>
    );
}
