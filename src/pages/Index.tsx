
import Dashboard from "../components/Dashboard";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUser = supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/auth";
      } else {
        setUser(data.user);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          window.location.href = "/auth";
        }
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <div>
          <h1 className="text-xl font-bold">Seja bem-vindo, {user?.user_metadata?.name || user?.user_metadata?.full_name || "Usuário"}</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </header>
      <div className="flex flex-1">
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
        <div className="flex-1 ml-64">
          <Dashboard activeModule={activeModule} />
        </div>
      </div>
    </div>
  );
};

export default Index;
