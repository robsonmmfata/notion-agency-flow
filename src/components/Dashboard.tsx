
import DashboardOverview from "./modules/DashboardOverview";
import CRMModule from "./modules/CRMModule";
import FinanceiroModule from "./modules/FinanceiroModule";
import FaturasModule from "./modules/FaturasModule";
import EquipeModule from "./modules/EquipeModule";
import ConfiguracoesModule from "./modules/ConfiguracoesModule";
import MensagensModule from "./modules/MensagensModule";
import LeadsModule from "./modules/LeadsModule";

interface DashboardProps {
  activeModule: string;
}

const Dashboard = ({ activeModule }: DashboardProps) => {
  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <DashboardOverview />;
      case "crm":
        return <CRMModule />;
      case "financeiro":
        return <FinanceiroModule />;
      case "faturas":
        return <FaturasModule />;
      case "equipe":
        return <EquipeModule />;
      case "leads":
        return <LeadsModule />;
      case "mensagens":
        return <MensagensModule />;
      case "configuracoes":
        return <ConfiguracoesModule />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="p-6">
      {renderModule()}
    </div>
  );
};

export default Dashboard;
