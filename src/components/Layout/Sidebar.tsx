import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, Briefcase, User, Menu, X } from "lucide-react";
import { messages } from "@/i18n/messages";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: messages.nav.dashboard },
    { path: "/reportes", icon: FileText, label: messages.nav.reportes },
    { path: "/jobs", icon: Briefcase, label: messages.nav.jobs },
    { path: "/perfil", icon: User, label: messages.nav.perfil },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border shadow-lg`}
    >
      <div className="p-6 flex items-center justify-between border-b border-sidebar-border/50">
        {!collapsed && (
          <div className="flex flex-col">
            <h1 className="text-lg font-bold uppercase tracking-wider">Menú</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm"
                  : "text-sidebar-foreground/90 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground font-medium"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
