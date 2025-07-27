'use client';

import * as React from 'react';
import RelatoriosManutencaoCards from './relatorios-manutencao-cards';
import FiltrosRelatorioManutencao from './filtros-relatorio-manutencao';
import StatusEquipamentosReport from './status-equipamentos-report';
import ConfiabilidadeEquipamentosReport from './confiabilidade-equipamentos-report';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

type ActiveReport = 'equipamentos' | 'manutencao' | 'quimico' | 'custos';

export default function RelatoriosManutencaoTab() {
  const [activeReport, setActiveReport] = React.useState<ActiveReport>('equipamentos');
  
  return (
    <div className="space-y-6">
      <RelatoriosManutencaoCards activeCard={activeReport} setActiveCard={setActiveReport} />
      <FiltrosRelatorioManutencao />
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
    </div>
  );
}
