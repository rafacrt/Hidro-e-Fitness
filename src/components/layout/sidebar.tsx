import type { Database } from "@/lib/database.types";
import { NavContent } from "./nav-content";

type AcademySettings = Database['public']['Tables']['academy_settings']['Row'];

interface SidebarProps {
  settings: AcademySettings | null;
}

export default function Sidebar({ settings }: SidebarProps) {
  return (
    <aside className="hidden lg:block w-64 border-r bg-card flex-shrink-0">
      <NavContent settings={settings} />
    </aside>
  );
}
