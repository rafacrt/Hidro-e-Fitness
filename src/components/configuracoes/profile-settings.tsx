
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { uploadAvatar } from '@/app/configuracoes/actions';

export default function ProfileSettings() {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = React.useState("https://placehold.co/96x96.png");
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('avatar', file);

    const result = await uploadAvatar(formData);

    setIsUploading(false);

    if (result.success && result.avatarUrl) {
      setAvatarUrl(result.avatarUrl);
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
    } else {
      toast({
        title: 'Erro!',
        description: result.message,
        variant: 'destructive',
      });
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Atualize sua foto e senha.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt="Admin's avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8" onClick={handleAvatarClick} disabled={isUploading}>
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
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
          <div className="text-center">
            <p className="font-semibold">Admin Sistema</p>
            <p className="text-sm text-muted-foreground">admin@hidrofitness.com</p>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-medium">Alterar Senha</h4>
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </div>
        <Button className="w-full">Salvar Alterações</Button>
      </CardContent>
    </Card>
  );
}
