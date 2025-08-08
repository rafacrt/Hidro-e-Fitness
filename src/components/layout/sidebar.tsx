import type { Database } from "@/lib/database.types";

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-64 border-r bg-card flex-shrink-0">
      {children}
    </aside>
  );
}
