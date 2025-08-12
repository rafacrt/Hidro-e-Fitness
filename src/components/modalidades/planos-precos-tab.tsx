
'use client';

import PlanosPrecosStats from './planos-precos-stats';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PlanosList from './planos-list';
import PlanosPrecosActions from './planos-precos-actions';

export default function PlanosPrecosTab() {
    return (
        <div className="space-y-6">
            <PlanosPrecosStats />
            <div className='flex items-center justify-between'>
                <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[220px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas as Modalidades</SelectItem>
                    <SelectItem value="natacao">Natação</SelectItem>
                    <SelectItem value="hidro">Hidroginástica</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <PlanosList />
            <PlanosPrecosActions />
        </div>
    )
}
