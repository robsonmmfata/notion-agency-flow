
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <div className="flex-1 ml-64">
        <Dashboard activeModule={activeModule} />
      </div>
    </div>
  );
};

export default Index;
