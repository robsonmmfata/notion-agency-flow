
import { Building2, DollarSign, FileText, Users, BarChart3, Settings, UserPlus } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const Sidebar = ({ activeModule, setActiveModule }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "crm", label: "CRM Principal", icon: Building2 },
    { id: "financeiro", label: "Financeiro", icon: DollarSign },
    { id: "faturas", label: "Faturas & Cobranças", icon: FileText },
    { id: "equipe", label: "Equipe & Tarefas", icon: Users },
    { id: "leads", label: "Leads", icon: UserPlus },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">CRM Agência</h1>
        <p className="text-sm text-gray-500">Sistema de Gestão</p>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                activeModule === item.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
