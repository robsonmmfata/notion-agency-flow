
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Download, Send, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

const FaturasModule = () => {
  const [filterStatus, setFilterStatus] = useState("todas");

  const [faturas, setFaturas] = useState([
    {
      id: 1,
      cliente: "ABC Marketing",
      valor: 4500,
      mesReferencia: "Junho 2025",
      vencimento: "2025-07-15",
      status: "pendente",
      anexo: "fatura_abc_jun25.pdf",
      dataPagamento: null
    },
    {
      id: 2,
      cliente: "Tech Solutions",
      valor: 6800,
      mesReferencia: "Junho 2025",
      vencimento: "2025-07-01",
      status: "paga",
      anexo: "fatura_tech_jun25.pdf",
      dataPagamento: "2025-06-28"
    },
    {
      id: 3,
      cliente: "E-commerce Plus",
      valor: 3800,
      mesReferencia: "Maio 2025",
      vencimento: "2025-06-05",
      status: "vencida",
      anexo: "fatura_ecom_mai25.pdf",
      dataPagamento: null
    },
    {
      id: 4,
      cliente: "StartUp Growth",
      valor: 3200,
      mesReferencia: "Junho 2025",
      vencimento: "2025-07-20",
      status: "enviada",
      anexo: "fatura_startup_jun25.pdf",
      dataPagamento: null
    },
    {
      id: 5,
      cliente: "Inovação Digital",
      valor: 2800,
      mesReferencia: "Junho 2025",
      vencimento: "2025-07-10",
      status: "pendente",
      anexo: "fatura_inov_jun25.pdf",
      dataPagamento: null
    }
  ]);

  const handleEnviarFatura = (id: number) => {
    setFaturas(faturas.map(fatura => 
      fatura.id === id ? { ...fatura, status: "enviada" } : fatura
    ));
    alert("Fatura enviada com sucesso!");
  };

  const handleCobrarFatura = (id: number) => {
    const fatura = faturas.find(f => f.id === id);
    alert(`Cobrança enviada para ${fatura?.cliente}. WhatsApp e e-mail de cobrança disparados.`);
  };

  const handleDownloadFatura = (anexo: string) => {
    // Simula download
    alert(`Download iniciado: ${anexo}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paga": return "bg-green-100 text-green-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "vencida": return "bg-red-100 text-red-800";
      case "enviada": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paga": return <CheckCircle className="w-4 h-4" />;
      case "vencida": return <AlertCircle className="w-4 h-4" />;
      case "enviada": return <Send className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const faturasFiltradas = faturas.filter(fatura => 
    filterStatus === "todas" || fatura.status === filterStatus
  );

  const totalFaturado = faturas.filter(f => f.status === "paga").reduce((sum, f) => sum + f.valor, 0);
  const totalPendente = faturas.filter(f => f.status === "pendente" || f.status === "enviada").reduce((sum, f) => sum + f.valor, 0);
  const totalVencido = faturas.filter(f => f.status === "vencida").reduce((sum, f) => sum + f.valor, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturas & Cobranças</h1>
          <p className="text-gray-500">Gestão completa de faturamento e cobrança</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => alert("Modal de nova fatura seria aberto aqui")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Fatura
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Faturado</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalFaturado.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Aguardando Pagamento</p>
                <p className="text-2xl font-bold text-yellow-600">R$ {totalPendente.toLocaleString()}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Faturas Vencidas</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalVencido.toLocaleString()}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Faturas</p>
                <p className="text-2xl font-bold text-gray-900">{faturas.length}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">{faturas.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas as Faturas</option>
              <option value="pendente">Pendentes</option>
              <option value="enviada">Enviadas</option>
              <option value="paga">Pagas</option>
              <option value="vencida">Vencidas</option>
            </select>
            
            <input
              type="month"
              defaultValue="2025-06"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Faturas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Faturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Valor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Referência</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Vencimento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Anexo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {faturasFiltradas.map((fatura) => (
                  <tr key={fatura.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{fatura.cliente}</p>
                        {fatura.dataPagamento && (
                          <p className="text-xs text-green-600">Pago em {new Date(fatura.dataPagamento).toLocaleDateString()}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      R$ {fatura.valor.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{fatura.mesReferencia}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className={`text-gray-600 ${
                          new Date(fatura.vencimento) < new Date() && fatura.status !== "paga"
                            ? "text-red-600 font-medium" 
                            : ""
                        }`}>
                          {new Date(fatura.vencimento).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fatura.status)}`}>
                        {getStatusIcon(fatura.status)}
                        <span>{fatura.status.charAt(0).toUpperCase() + fatura.status.slice(1)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleDownloadFatura(fatura.anexo)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>{fatura.anexo}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {fatura.status === "pendente" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEnviarFatura(fatura.id)}
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Enviar
                          </Button>
                        )}
                        {fatura.status === "vencida" && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleCobrarFatura(fatura.id)}
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Cobrar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaturasModule;
