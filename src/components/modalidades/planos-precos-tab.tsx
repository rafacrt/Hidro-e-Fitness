
'use client';

import PlanosPrecosStats from './planos-precos-stats';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PlanosList from './planos-list';
import PlanosPrecosActions from './planos-precos-actions';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { AddPlanForm } from './add-plan-form';
import { useRouter } from 'next/navigation';
import type { Database } from '@/lib/database.types';

type Modality = Database['public']['Tables']['modalities']['Row'];
type Plan = Database['public']['Tables']['plans']['Row'] & { modalities: Pick<Modality, 'name'> | null };


interface PlanosPrecosTabProps {
    modalities: Modality[];
    plans: Plan[];
    onSuccess: () => void;
}

export default function PlanosPrecosTab({ modalities, plans, onSuccess }: PlanosPrecosTabProps) {
    const router = useRouter();
    
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
                    {modalities.map((m) => (
                        <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <PlanosList plans={plans} modalities={modalities} onSuccess={onSuccess} />
            <PlanosPrecosActions onSuccess={onSuccess} />
        </div>
    )
}
