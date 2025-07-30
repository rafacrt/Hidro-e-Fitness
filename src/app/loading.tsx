import { WaveSpinner } from '@/components/ui/wave-spinner';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <WaveSpinner className="h-12 w-12 text-primary mx-auto" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
