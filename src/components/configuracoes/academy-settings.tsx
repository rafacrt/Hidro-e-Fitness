
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

export default function AcademySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Academia</CardTitle>
        <CardDescription>Personalize as informações da sua academia.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Logo do Sistema</Label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-lg border flex items-center justify-center bg-secondary">
               <Image src="https://placehold.co/64x64.png" alt="Logo da Academia" width={64} height={64} data-ai-hint="water fitness" />
            </div>
            <Button variant="outline">Alterar Logo</Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="academy-name">Nome da Academia</Label>
          <Input id="academy-name" defaultValue="Hidro Fitness" />
        </div>
        <Button className="w-full">Salvar Dados da Academia</Button>
      </CardContent>
    </Card>
  );
}
