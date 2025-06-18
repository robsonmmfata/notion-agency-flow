
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign, TrendingUp, Users, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";

const DashboardOverview = () => {
  const [selectedMonth, setSelectedMonth] = useState("2025-06");

  // Dados mockados por mês
  const dadosPorMes = {
    "2025-06": {
      receita: 45280,
      despesas: 28150,
      lucro: 17130,
      clientes: 23,
      cobrancas: 7,
      contratos: 31,
      crescimentoReceita: "+12.5%",
      crescimentoDespesas: "+3.2%",
      crescimentoLucro: "+24.8%"
    },
    "2025-05": {
      receita: 41000,
      despesas: 26500,
      lucro: 14500,
      clientes: 21,
      cobrancas: 5,
      contratos: 29,
      crescimentoReceita: "+8.3%",
      crescimentoDespesas: "+2.1%",
      crescimentoLucro: "+18.2%"
    },
    "2025-04": {
      receita: 44000,
      despesas: 28000,
      lucro: 16000,
      clientes: 22,
      cobrancas: 6,
      contratos: 30,
      crescimentoReceita: "+15.2%",
      crescimentoDespesas: "+5.8%",
      crescimentoLucro: "+28.1%"
    }
  };

  const dadosAtual = dadosPorMes[selectedMonth as keyof typeof dadosPorMes] || dadosPorMes["2025-06"];

  const stats = [
    {
      title: "Receita do Mês",
      value: `R$ ${dadosAtual.receita.toLocaleString()}`,
      change: dadosAtual.crescimentoReceita,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Despesas Totais",
      value: `R$ ${dadosAtual.despesas.toLocaleString()}`,
      change: dadosAtual.crescimentoDespesas,
      icon: TrendingUp,
      color: "text-red-600"
    },
    {
      title: "Lucro Líquido",
      value: `R$ ${dadosAtual.lucro.toLocaleString()}`,
      change: dadosAtual.crescimentoLucro,
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Clientes Ativos",
      value: dadosAtual.clientes.toString(),
      change: "+2",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Cobranças Pendentes",
      value: dadosAtual.cobrancas.toString(),
      change: "-1",
      icon: AlertCircle,
      color: "text-orange-600"
    },
    {
      title: "Contratos Vigentes",
      value: dadosAtual.contratos.toString(),
      change: "+4",
      icon: FileText,
      color: "text-indigo-600"
    }
  ];

  const monthlyData = [
    { mes: "Jan", receita: 38000, despesas: 25000 },
    { mes: "Fev", receita: 42000, despesas: 27000 },
    { mes: "Mar", receita: 39000, despesas: 26000 },
    { mes: "Abr", receita: 44000, despesas: 28000 },
    { mes: "Mai", receita: 41000, despesas: 26500 },
    { mes: "Jun", receita: dadosAtual.receita, despesas: dadosAtual.despesas }
  ];

  const serviceData = [
    { name: "Gestão de Redes", value: 40, color: "#3B82F6" },
    { name: "Anúncios Pagos", value: 35, color: "#10B981" },
    { name: "Criação de Conteúdo", value: 15, color: "#F59E0B" },
    { name: "Consultoria", value: 10, color: "#8B5CF6" }
  ];

  const getMesNome = (mesValue: string) => {
    const meses = {
      "2025-06": "Junho 2025",
      "2025-05": "Maio 2025",
      "2025-04": "Abril 2025"
    };
    return meses[mesValue as keyof typeof meses] || "Junho 2025";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Geral</h1>
          <p className="text-gray-500">Visão completa da sua agência - {getMesNome(selectedMonth)}</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="2025-06">Junho 2025</option>
            <option value="2025-05">Maio 2025</option>
            <option value="2025-04">Abril 2025</option>
          </select>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.color}`}>{stat.change} vs mês anterior</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Receitas vs Despesas */}
        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas (6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                <Bar dataKey="receita" fill="#3B82F6" name="Receita" />
                <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Tipo de Serviço */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {serviceData.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }}></div>
                    <span className="text-sm text-gray-600">{service.name}</span>
                  </div>
                  <span className="text-sm font-medium">{service.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Tarefas Pendentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <span>Alertas Importantes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Fatura vencida - Cliente ABC Marketing</p>
                  <p className="text-xs text-red-600">Vencimento: 05/06/2025 - R$ 3.500</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">Contrato expira em 15 dias</p>
                  <p className="text-xs text-orange-600">Cliente: Tech Solutions - Renovação pendente</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">Relatório mensal pendente</p>
                  <p className="text-xs text-yellow-600">3 clientes aguardando relatório de performance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Tarefas da Semana</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                <span className="text-sm line-through text-gray-500">Criar campanha para Cliente XYZ</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Reunião de alinhamento - Tech Solutions</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Apresentação de proposta - Novo Cliente</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Relatório financeiro mensal</span>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Análise de performance das campanhas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
