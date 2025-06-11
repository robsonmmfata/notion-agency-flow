
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign, TrendingUp, Users, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const DashboardOverview = () => {
  const stats = [
    {
      title: "Receita do Mês",
      value: "R$ 45.280",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Despesas Totais",
      value: "R$ 28.150",
      change: "+3.2%",
      icon: TrendingUp,
      color: "text-red-600"
    },
    {
      title: "Lucro Líquido",
      value: "R$ 17.130",
      change: "+24.8%",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Clientes Ativos",
      value: "23",
      change: "+2",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Cobranças Pendentes",
      value: "7",
      change: "-1",
      icon: AlertCircle,
      color: "text-orange-600"
    },
    {
      title: "Contratos Vigentes",
      value: "31",
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
    { mes: "Jun", receita: 45280, despesas: 28150 }
  ];

  const serviceData = [
    { name: "Gestão de Redes", value: 40, color: "#3B82F6" },
    { name: "Anúncios Pagos", value: 35, color: "#10B981" },
    { name: "Criação de Conteúdo", value: 15, color: "#F59E0B" },
    { name: "Consultoria", value: 10, color: "#8B5CF6" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Geral</h1>
          <p className="text-gray-500">Visão completa da sua agência - Junho 2025</p>
        </div>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Junho 2025</option>
            <option>Maio 2025</option>
            <option>Abril 2025</option>
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
