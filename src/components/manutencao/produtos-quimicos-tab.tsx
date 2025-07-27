import AcoesRapidasProdutosQuimicos from "./acoes-rapidas-produtos-quimicos";
import AplicacoesRecentes from "./aplicacoes-recentes";
import EstoqueProdutosQuimicos from "./estoque-produtos-quimicos";
import ProdutosQuimicosStats from "./produtos-quimicos-stats";
import QualidadeAgua from "./qualidade-agua";


export default function ProdutosQuimicosTab() {
    return (
        <div className="space-y-6">
            <ProdutosQuimicosStats />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <EstoqueProdutosQuimicos />
                </div>
                <div>
                    <QualidadeAgua />
                </div>
            </div>
            <AplicacoesRecentes />
            <AcoesRapidasProdutosQuimicos />
        </div>
    )
}
