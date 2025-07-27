
import DicasConfiguracao from './dicas-configuracao';
import MetodosPagamentoList from './metodos-pagamento-list';
import MetodosPagamentoStats from './metodos-pagamento-stats';

export default function MetodosPagamentoTab() {
    return (
        <div className="space-y-6">
            <MetodosPagamentoStats />
            <MetodosPagamentoList />
            <DicasConfiguracao />
        </div>
    )
}
