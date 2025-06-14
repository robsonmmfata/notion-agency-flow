import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign, TrendingUp, Users, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MESES = [
  { value: "2025-06", label: "Junho 2025", ano: 2025, mes: 6 },
  { value: "2025-05", label: "Maio 2025", ano: 2025, mes: 5 },
  { value: "2025-04", label: "Abril 2025", ano: 2025, mes: 4 },
];

function formatCurrency(val: number | undefined) {
  if (typeof val !== "number") return "R$ 0,00";
  return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function getMonthName(dt: string) {
  const hash = MESES.find((m) => m.value === dt);
  return hash?.label || "Mês";
}

// Main metric queries
const useDashboardData = (selectedMonth: string) => {
  const mesObj = MESES.find((m) => m.value === selectedMonth);
  // Data de início/fim para busca no mês selecionado: ano-mes
  const monthStart = mesObj ? `${mesObj.ano}-${String(mesObj.mes).padStart(2, "0")}-01` : undefined;
  const monthEnd = mesObj
    ? new Date(mesObj.ano, mesObj.mes, 0).toISOString().slice(0, 10)
    : undefined;

  // Entradas (Receitas)
  const receita = useQuery({
    queryKey: ["receitas", selectedMonth],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("entradas_financeiras")
        .select("valor,data")
        .gte("data", monthStart)
        .lte("data", monthEnd);
      if (error) throw error;
      return data?.reduce((sum: number, row: any) => sum + Number(row.valor), 0) || 0;
    },
    enabled: !!monthStart && !!monthEnd,
  });

  // Despesas
  const despesas = useQuery({
    queryKey: ["despesas", selectedMonth],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saidas_financeiras")
        .select("valor,data")
        .gte("data", monthStart)
        .lte("data", monthEnd);
      if (error) throw error;
      return data?.reduce((sum: number, row: any) => sum + Number(row.valor), 0) || 0;
    },
    enabled: !!monthStart && !!monthEnd,
  });

  // Clientes ativos
  const clientes = useQuery({
    queryKey: ["clientes", selectedMonth],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("id, status, data_inicio, data_fim");
      if (error) throw error;
      // Considera 'ativo' se status = "ativo" ou data_fim no futuro
      const hoje = new Date();
      return data?.filter(
        (c: any) => c.status?.toLowerCase() === "ativo" || new Date(c.data_fim) >= hoje
      )?.length || 0;
    },
  });

  // Contratos vigentes (ex: clientes ativos)
  const contratos = clientes; // Para simplificar, mesmo filtro

  // Cobranças pendentes (faturas em aberto e vencidas neste mês)
  const cobrancas = useQuery({
    queryKey: ["cobrancas", selectedMonth],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faturas")
        .select("id, status, vencimento")
        .gte("vencimento", monthStart)
        .lte("vencimento", monthEnd);
      if (error) throw error;
      return data?.filter((f: any) => f.status?.toLowerCase() !== "paga")?.length || 0;
    },
    enabled: !!monthStart && !!monthEnd,
  });

  // Gráfico receita/despesa últimos 6 meses
  const graficoReceitaDespesa = useQuery({
    queryKey: ["grafico-rd"],
    queryFn: async () => {
      const meses: string[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        meses.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
      }
      // Entradas
      const { data: entradas } = await supabase
        .from("entradas_financeiras")
        .select("valor, data");
      // Saídas
      const { data: saidas } = await supabase
        .from("saidas_financeiras")
        .select("valor, data");
      // Agregar por ano-mes
      const group = (arr: any[] | null | undefined, tipo: "receita" | "despesa") =>
        meses.map((mes) => ({
          mes: mes.split("-")[1] +
            "/" +
            mes.split("-")[0].substring(2), // e.g. 06/25
          [tipo]:
            arr
              ?.filter((row) => row.data?.toString().slice(0, 7) === mes)
              ?.reduce((sum, row) => sum + Number(row.valor || 0), 0) || 0,
        }));
      const receitasMes = group(entradas, "receita");
      const despesasMes = group(saidas, "despesa");
      // Juntar os dois (pelo mês)
      return receitasMes.map((r, i) => ({
        mes: r.mes,
        receita: r.receita,
        despesas: despesasMes[i]?.despesa || 0,
      }));
    },
  });

  // Tipos de serviço dos clientes ativos (para Pizza)
  const tiposServico = useQuery({
    queryKey: ["tipos-servico"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clientes").select("tipo_servico");
      if (error) throw error;
      // Contar tipos
      const counts: Record<string, number> = {};
      (data || []).forEach((row) => {
        const tipo = row.tipo_servico || "Outro";
        counts[tipo] = (counts[tipo] || 0) + 1;
      });
      // Cores fixas
      const cores = [
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#8B5CF6",
        "#EF4444",
        "#6366F1",
        "#F472B6",
      ];
      return Object.entries(counts).map(([name, value], idx) => ({
        name,
        value,
        color: cores[idx % cores.length],
      }));
    },
  });

  return {
    receita,
    despesas,
    clientes,
    contratos,
    cobrancas,
    graficoReceitaDespesa,
    tiposServico,
  };
};

const DashboardOverview = () => {
  const [selectedMonth, setSelectedMonth] = useState("2025-06");
  const {
    receita,
    despesas,
    clientes,
    contratos,
    cobrancas,
    graficoReceitaDespesa,
    tiposServico,
  } = useDashboardData(selectedMonth);

  // Lucro líquido (receita - despesas)
  const lucro = useMemo(() => {
    if (receita.data !== undefined && despesas.data !== undefined) {
      return receita.data - despesas.data;
    }
    return 0;
  }, [receita.data, despesas.data]);

  // Filtros de loading/erro
  const isLoading =
    receita.isLoading ||
    despesas.isLoading ||
    clientes.isLoading ||
    contratos.isLoading ||
    cobrancas.isLoading ||
    graficoReceitaDespesa.isLoading ||
    tiposServico.isLoading;

  const erro =
    receita.error ||
    despesas.error ||
    clientes.error ||
    contratos.error ||
    cobrancas.error ||
    graficoReceitaDespesa.error ||
    tiposServico.error;

  const stats = [
    {
      title: "Receita do Mês",
      value: receita.isLoading
        ? "..."
        : formatCurrency(receita.data),
      change: "",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Despesas Totais",
      value: despesas.isLoading
        ? "..."
        : formatCurrency(despesas.data),
      change: "",
      icon: TrendingUp,
      color: "text-red-600",
    },
    {
      title: "Lucro Líquido",
      value: receita.isLoading || despesas.isLoading
        ? "..."
        : formatCurrency(lucro),
      change: "",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Clientes Ativos",
      value: clientes.isLoading ? "..." : clientes.data?.toString(),
      change: "",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Cobranças Pendentes",
      value: cobrancas.isLoading ? "..." : cobrancas.data?.toString(),
      change: "",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      title: "Contratos Vigentes",
      value: contratos.isLoading ? "..." : contratos.data?.toString(),
      change: "",
      icon: FileText,
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Geral</h1>
          <p className="text-gray-500">
            Visão completa da sua agência - {getMonthName(selectedMonth)}
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {MESES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
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
            {graficoReceitaDespesa.isLoading ? (
              <div className="text-center py-8 text-gray-400">Carregando gráfico...</div>
            ) : graficoReceitaDespesa.error ? (
              <div className="text-center py-8 text-red-400">Erro ao carregar dados do gráfico.</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graficoReceitaDespesa.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number"
                        ? `R$ ${value.toLocaleString("pt-BR")}`
                        : value
                    }
                  />
                  <Bar dataKey="receita" fill="#3B82F6" name="Receita" />
                  <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Distribuição por Tipo de Serviço */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo de Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            {tiposServico.isLoading ? (
              <div className="text-center py-8 text-gray-400">Carregando dados...</div>
            ) : tiposServico.error ? (
              <div className="text-center py-8 text-red-500">Erro ao carregar tipos de serviço.</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tiposServico.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {(tiposServico.data || []).map((entry: any, idx: number) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {(tiposServico.data || []).map((service: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: service.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{service.name}</span>
                      </div>
                      <span className="text-sm font-medium">{service.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Tarefas Pendentes (Mockado ainda) */}
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

      {/* Erro global */}
      {erro && (
        <div className="mt-4 text-center text-red-500">
          Ocorreu um erro ao buscar dados do dashboard.
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
