import type { Database } from "@/lib/database.types";

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-64 border-r border-sidebar-border bg-sidebar flex-shrink-0">
      {children}
    </aside>
  );
}
