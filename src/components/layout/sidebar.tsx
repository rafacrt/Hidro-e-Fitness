import { NavContent } from "./nav-content";

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 border-r bg-card flex-shrink-0">
      <NavContent />
    </aside>
  );
}
