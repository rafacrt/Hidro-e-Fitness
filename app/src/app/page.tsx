// This page is handled by the middleware, but needs a valid component.
// It will redirect to /login or /dashboard based on session status.
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-muted-foreground">Carregando...</p>
    </div>
  );
}
