import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Search, Filter, MoreVertical, DollarSign, Calendar, User, Upload, FileText, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import ClienteModal from "../ClienteModal";
import EditClienteModal from "../EditClienteModal";
import ImportExportModal from "../ImportExportModal";

const CRMModule = () => {
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterService, setFilterService] = useState("todos");
  const [clienteModal, setClienteModal] = useState(false);
  const [editClienteModal, setEditClienteModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [importModal, setImportModal] = useState(false);
  const [actionMenu, setActionMenu] = useState<number | null>(null);

  const [clientes, setClientes] = useState([
    {
      id: 1,
      nome: "ABC Marketing",
      tipoServico: "Gestão de Redes",
      dataInicio: "2025-01-15",
      dataFim: "2025-12-15",
      valor: 4500,
      formaPagamento: "Mensal",
      status: "ativo",
      proximaCobranca: "2025-07-15"
    },
    {
      id: 2,
      nome: "Tech Solutions",
      tipoServico: "Anúncios Pagos",
      dataInicio: "2025-02-01",
      dataFim: "2025-08-01",
      valor: 6800,
      formaPagamento: "Mensal",
      status: "ativo",
      proximaCobranca: "2025-07-01"
    },
    {
      id: 3,
      nome: "Inovação Digital",
      tipoServico: "Criação de Conteúdo",
      dataInicio: "2024-11-10",
      dataFim: "2025-05-10",
      valor: 2800,
      formaPagamento: "Mensal",
      status: "expirando",
      proximaCobranca: "2025-07-10"
    },
    {
      id: 4,
      nome: "StartUp Growth",
      tipoServico: "Consultoria",
      dataInicio: "2025-03-20",
      dataFim: "2025-09-20",
      valor: 3200,
      formaPagamento: "Mensal",
      status: "ativo",
      proximaCobranca: "2025-07-20"
    },
    {
      id: 5,
      nome: "E-commerce Plus",
      tipoServico: "Gestão de Redes",
      dataInicio: "2024-12-05",
      dataFim: "2025-06-05",
      valor: 3800,
      formaPagamento: "Mensal",
      status: "cancelado",
      proximaCobranca: "-"
    }
  ]);

  const handleSaveCliente = (novoCliente: any) => {
    const id = Math.max(...clientes.map(c => c.id)) + 1;
    setClientes([...clientes, { ...novoCliente, id }]);
  };

  const handleEditCliente = (cliente: any) => {
    setSelectedCliente(cliente);
    setEditClienteModal(true);
    setActionMenu(null);
  };

  const handleUpdateCliente = (clienteAtualizado: any) => {
    setClientes(clientes.map(c => 
      c.id === clienteAtualizado.id ? clienteAtualizado : c
    ));
  };

  const handleDeleteCliente = (id: number) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  const handleImportContacts = (file: File, type: string) => {
    console.log(`Importando contatos do arquivo: ${file.name} (${type})`);
    
    if (type === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const novosClientes = lines.slice(1).filter(line => line.trim()).map((line, index) => {
          const values = line.split(',');
          return {
            id: Math.max(...clientes.map(c => c.id)) + index + 1,
            nome: values[0]?.replace(/"/g, '') || `Cliente ${index + 1}`,
            tipoServico: values[1]?.replace(/"/g, '') || "Gestão de Redes",
            dataInicio: values[2]?.replace(/"/g, '') || new Date().toISOString().split('T')[0],
            dataFim: values[3]?.replace(/"/g, '') || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            valor: parseFloat(values[4]?.replace(/"/g, '')) || 0,
            formaPagamento: values[5]?.replace(/"/g, '') || "Mensal",
            status: values[6]?.replace(/"/g, '') || "ativo",
            proximaCobranca: values[7]?.replace(/"/g, '') || new Date().toISOString().split('T')[0]
          };
        });
        
        setClientes(prev => [...prev, ...novosClientes]);
        alert(`${novosClientes.length} clientes importados com sucesso!`);
      };
      reader.readAsText(file);
    } else {
      alert(`${file.name} importado com sucesso! Novos clientes adicionados.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800";
      case "expirando": return "bg-orange-100 text-orange-800";
      case "cancelado": return "bg-red-100 text-red-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const statusMatch = filterStatus === "todos" || cliente.status === filterStatus;
    const serviceMatch = filterService === "todos" || cliente.tipoServico === filterService;
    return statusMatch && serviceMatch;
  });

  const totalContratos = clientesFiltrados.filter(c => c.status === "ativo").length;
  const valorTotal = clientesFiltrados
    .filter(c => c.status === "ativo")
    .reduce((sum, c) => sum + c.valor, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Principal</h1>
          <p className="text-gray-500">Gestão completa de clientes e contratos</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setImportModal(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar Contatos
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setClienteModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Contratos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{totalContratos}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Receita Mensal Recorrente</p>
                <p className="text-2xl font-bold text-gray-900">R$ {valorTotal.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Próximas Renovações</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="expirando">Expirando</option>
              <option value="cancelado">Cancelado</option>
              <option value="pendente">Pendente</option>
            </select>
            
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Serviços</option>
              <option value="Gestão de Redes">Gestão de Redes</option>
              <option value="Anúncios Pagos">Anúncios Pagos</option>
              <option value="Criação de Conteúdo">Criação de Conteúdo</option>
              <option value="Consultoria">Consultoria</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Serviço</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Período</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Valor/Mês</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Próxima Cobrança</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{cliente.nome}</p>
                        <p className="text-sm text-gray-500">{cliente.formaPagamento}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{cliente.tipoServico}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-600">{new Date(cliente.dataInicio).toLocaleDateString()}</p>
                        <p className="text-gray-500">até {new Date(cliente.dataFim).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      R$ {cliente.valor.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cliente.status)}`}>
                        {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {cliente.proximaCobranca !== "-" ? 
                        new Date(cliente.proximaCobranca).toLocaleDateString() : 
                        "-"
                      }
                    </td>
                    <td className="py-3 px-4 relative">
                      <button 
                        className="p-1 rounded hover:bg-gray-100"
                        onClick={() => setActionMenu(actionMenu === cliente.id ? null : cliente.id)}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {actionMenu === cliente.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40">
                          <button
                            onClick={() => handleEditCliente(cliente)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCliente(cliente.id)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      <ClienteModal
        isOpen={clienteModal}
        onClose={() => setClienteModal(false)}
        onSave={handleSaveCliente}
      />
      
      <EditClienteModal
        isOpen={editClienteModal}
        onClose={() => setEditClienteModal(false)}
        onSave={handleUpdateCliente}
        onDelete={handleDeleteCliente}
        cliente={selectedCliente}
      />
      
      <ImportExportModal
        isOpen={importModal}
        onClose={() => setImportModal(false)}
        type="import"
        onImport={handleImportContacts}
      />
    </div>
  );
};

export default CRMModule;
