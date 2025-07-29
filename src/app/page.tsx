import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Hidro Fitness',
  description: 'Sistema de Gestão para Academias',
};

export default function HomePage() {
  // Em desenvolvimento, redireciona diretamente para o dashboard
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    redirect('/dashboard');
  }

  // Em produção, será tratado pelo middleware
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}