'use client';

import * as React from 'react';
import RelatoriosManutencaoCards from './relatorios-manutencao-cards';
import FiltrosRelatorioManutencao from './filtros-relatorio-manutencao';
import StatusEquipamentosReport from './status-equipamentos-report';
import ConfiabilidadeEquipamentosReport from './confiabilidade-equipamentos-report';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import PlaceholderContent from '../financeiro/placeholder-content';
import PlaceholderReport from '../turmas/placeholder-report';

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
        return <PlaceholderContent title="Relatório de Manutenções" />;
      case 'quimico':
        return <PlaceholderContent title="Controle Químico" />;
      case 'custos':
        return <PlaceholderContent title="Análise de Custos" />;
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
