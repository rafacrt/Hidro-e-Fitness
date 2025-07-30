'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/lib/database.types';
import { updateAcademySettings, uploadLogo } from '@/app/configuracoes/actions';
import { Loader2 } from 'lucide-react';

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];

interface AcademySettingsProps {
  settings: AcademySettings | null;
}

export default function AcademySettings({ settings }: AcademySettingsProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState(settings?.logo_url || null);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('logo', file);
    
    const result = await uploadLogo(formData);

    if (result.success && result.logoUrl) {
      setLogoUrl(result.logoUrl);
      toast({ title: 'Sucesso!', description: result.message });
    } else {
      toast({ title: 'Erro!', description: result.message, variant: 'destructive' });
    }
    setIsUploading(false);
  };

  const handleSaveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const result = await updateAcademySettings(formData);

    if (result.success) {
      toast({ title: 'Sucesso!', description: result.message });
    } else {
      toast({ title: 'Erro!', description: result.message, variant: 'destructive' });
    }
    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Academia</CardTitle>
        <CardDescription>Personalize as informações da sua academia.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="space-y-2">
            <Label>Logo do Sistema</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border flex items-center justify-center">
                 <Image src={logoUrl || "https://placehold.co/64x64.png"} alt="Logo da Academia" width={64} height={64} className="object-contain" data-ai-hint="water fitness" />
              </div>
              <Button type="button" variant="outline" onClick={handleLogoClick} disabled={isUploading}>
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Alterar Logo
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
                disabled={isUploading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="academy-name">Nome da Academia</Label>
            <Input id="academy-name" name="name" defaultValue={settings?.name || 'Hidro Fitness'} />
          </div>
          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Salvar Dados da Academia
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
