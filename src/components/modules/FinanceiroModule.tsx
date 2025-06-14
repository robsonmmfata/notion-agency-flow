
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import FinanceiroModal from "../FinanceiroModal";
import { supabase } from "../../integrations/supabase/client";

const FinanceiroModule = () => {
  const [activeTab, setActiveTab] = useState("entradas");
  const [entradaModal, setEntradaModal] = useState(false);
  const [saidaModal, setSaidaModal] = useState(false);

  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);

  useEffect(() => {
    fetchEntradas();
    fetchSaidas();
  }, []);

  const fetchEntradas = async () => {
    const { data, error } = await supabase
      .from("entradas")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.error("Erro ao buscar entradas:", error);
    } else {
      setEntradas(data || []);
    }
  };

  const fetchSaidas = async () => {
    const { data, error } = await supabase
      .from("saidas")
      .select("*")
      .order("id", { ascending: true });
    if (error) {
      console.error("Erro ao buscar saídas:", error);
    } else {
      setSaidas(data || []);
    }
  };

  const handleSaveEntrada = async (novaEntrada: any) => {
    const { data, error } = await supabase
      .from("entradas")
      .insert([novaEntrada])
      .select()
      .single();
    if (error) {
      console.error("Erro ao salvar entrada:", error);
      alert("Erro ao salvar entrada");
    } else if (data) {
      await fetchEntradas();
      setEntradaModal(false);
    }
  };

  const handleSaveSaida = async (novaSaida: any) => {
    // Ajustar os campos para corresponder à tabela 'saidas'
    const saidaParaSalvar = {
      categoria: novaSaida.categoria || null,
      valor: novaSaida.valor || 0,
      data: novaSaida.data || null,
      descricao: novaSaida.descricao || null,
      recorrente: novaSaida.recorrente || false,
    };

    const { data, error } = await supabase
      .from("saidas")
      .insert([saidaParaSalvar])
      .select()
      .single();
    if (error) {
      console.error("Erro ao salvar saída:", error);
      alert("Erro ao salvar saída");
    } else if (data) {
      await fetchSaidas();
      setSaidaModal(false);
    }
  };

  const dadosComparacao = [
    { mes: "Jan", entradas: 38000, saidas: 25000 },
    { mes: "Fev", entradas: 42000, saidas: 27000 },
    { mes: "Mar", entradas: 39000, saidas: 26000 },
    { mes: "Abr", entradas: 44000, saidas: 28000 },
    { mes: "Mai", entradas: 41000, saidas: 26500 },
    { mes: "Jun", entradas: 17300, saidas: 24850 }
  ];

  const totalEntradas = entradas.reduce((sum, e) => sum + e.valor, 0);
  const totalSaidas = saidas.reduce((sum, s) => sum + s.valor, 0);
  const lucroLiquido = totalEntradas - totalSaidas;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-500">Controle completo de entradas e saídas</p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Entradas (Junho)</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalEntradas.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12% vs mês anterior</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Saídas (Junho)</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalSaidas.toLocaleString()}</p>
                <p className="text-sm text-red-600">+6% vs mês anterior</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Resultado Líquido</p>
                <p className={`text-2xl font-bold ${lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {Math.abs(lucroLiquido).toLocaleString()}
                </p>
                <p className={`text-sm ${lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {lucroLiquido >= 0 ? 'Lucro' : 'Prejuízo'}
                </p>
              </div>
              <DollarSign className={`w-8 h-8 ${lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Comparação */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução Entradas vs Saídas (6 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosComparacao}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
              <Bar dataKey="entradas" fill="#10B981" name="Entradas" />
              <Bar dataKey="saidas" fill="#EF4444" name="Saídas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs Entradas/Saídas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("entradas")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "entradas"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Entradas
              </button>
              <button
                onClick={() => setActiveTab("saidas")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === "saidas"
                    ? "bg-red-100 text-red-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Saídas
              </button>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => activeTab === "entradas" ? setEntradaModal(true) : setSaidaModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova {activeTab === "entradas" ? "Entrada" : "Saída"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "entradas" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Valor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Data</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Forma</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Comprovante</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {entradas.map((entrada) => (
                    <tr key={entrada.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{entrada.cliente}</td>
                      <td className="py-3 px-4 font-bold text-green-600">R$ {entrada.valor.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">{new Date(entrada.data).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {entrada.forma}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                          {entrada.comprovante}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{entrada.observacoes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Categoria</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Valor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Data</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Descrição</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {saidas.map((saida) => (
                    <tr key={saida.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{saida.categoria}</td>
                      <td className="py-3 px-4 font-bold text-red-600">R$ {saida.valor.toLocaleString()}</td>
                      <td className="py-3 px-4 text-gray-600">{new Date(saida.data).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-gray-600">{saida.descricao}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          saida.recorrente 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {saida.recorrente ? "Recorrente" : "Pontual"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <FinanceiroModal
        isOpen={entradaModal}
        onClose={() => setEntradaModal(false)}
        onSave={handleSaveEntrada}
        type="entrada"
      />
      
      <FinanceiroModal
        isOpen={saidaModal}
        onClose={() => setSaidaModal(false)}
        onSave={handleSaveSaida}
        type="saida"
      />
    </div>
  );
};

export default FinanceiroModule;