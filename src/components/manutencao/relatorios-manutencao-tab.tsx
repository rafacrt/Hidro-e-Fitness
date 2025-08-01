'use client';

import * as React from 'react';
import RelatoriosManutencaoCards from './relatorios-manutencao-cards';
import FiltrosRelatorioManutencao from './filtros-relatorio-manutencao';
import StatusEquipamentosReport from './status-equipamentos-report';
import ConfiabilidadeEquipamentosReport from './confiabilidade-equipamentos-report';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PlaceholderContent from './placeholder-content';
import PlaceholderReport from '../turmas/placeholder-report';
import CustoManutencaoMensalReport from './custo-manutencao-mensal-report';
import DistribuicaoManutencaoReport from './distribuicao-manutencao-report';
import ConsumoQuimicosMensalReport from './consumo-quimicos-mensal-report';
import VariacaoParametrosAguaReport from './variacao-parametros-agua-report';
import CustoPorCategoriaReport from './custo-por-categoria-report';
import CustoPorEquipamentoReport from './custo-por-equipamento-report';

type ActiveReport = 'equipamentos' | 'manutencao' | 'quimico' | 'custos' | null;

export default function RelatoriosManutencaoTab() {
  const [activeReport, setActiveReport] = React.useState<ActiveReport>(null);
  
  const renderReportContent = () => {
    switch (activeReport) {
      case 'equipamentos':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Equipamentos</CardTitle>
              <CardDescription>Status e performance dos equipamentos</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <StatusEquipamentosReport />
              <ConfiabilidadeEquipamentosReport />
            </CardContent>
          </Card>
        );
      case 'manutencao':
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Relatório de Manutenções</CardTitle>
                    <CardDescription>Análise de custos e tipos de manutenção realizadas.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CustoManutencaoMensalReport />
                    <DistribuicaoManutencaoReport />
                </CardContent>
            </Card>
        );
      case 'quimico':
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Relatório de Controle Químico</CardTitle>
                    <CardDescription>Análise de consumo de produtos e qualidade da água.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ConsumoQuimicosMensalReport />
                    <VariacaoParametrosAguaReport />
                </CardContent>
            </Card>
        );
      case 'custos':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Análise de Custos de Manutenção</CardTitle>
              <CardDescription>Distribuição de custos por categoria e por equipamento.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CustoPorCategoriaReport />
              <CustoPorEquipamentoReport />
            </CardContent>
          </Card>
        );
      default:
        return (
            <Card>
                <CardContent className='p-6'>
                    <PlaceholderReport />
                </CardContent>
            </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <RelatoriosManutencaoCards activeCard={activeReport} setActiveCard={setActiveReport} />
      <FiltrosRelatorioManutencao />
      {renderReportContent()}
    </div>
  );
}
