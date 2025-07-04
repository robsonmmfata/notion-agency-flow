import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, Search, Filter, MoreVertical, DollarSign, Calendar, User, Upload, FileText, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import ClienteModal from "../ClienteModal";
import EditClienteModal from "../EditClienteModal";
import ImportExportModal from "../ImportExportModal";
import { supabase } from "../../integrations/supabase/client";

interface Cliente {
  id?: number;
  nome: string;
  tipo_servico: string;
  data_inicio: string;
  data_fim: string | null;
  valor: number;
  forma_pagamento: string;
  status: string;
  proxima_cobranca: string | null;
  progresso?: number;
}

const CRMModule = () => {
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterService, setFilterService] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [clienteModal, setClienteModal] = useState<boolean>(false);
  const [editClienteModal, setEditClienteModal] = useState<boolean>(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [importModal, setImportModal] = useState<boolean>(false);
  const [actionMenu, setActionMenu] = useState<number | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id", { ascending: true });
      if (error) {
        throw error;
      }
      setClientes(data || []);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const handleSaveCliente = async (novoCliente: Cliente) => {
    try {
      const { data, error } = await supabase
        .from("clientes")
        .insert([novoCliente])
        .select()
        .single();
      if (error) {
        throw error;
      }
      if (data !== null && data !== undefined) {
        setClientes((prev) => [...prev, data]);
      }
      setClienteModal(false);
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      alert("Erro ao salvar cliente");
    }
  };

  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setEditClienteModal(true);
    setActionMenu(null);
  };

  const handleUpdateCliente = async (clienteAtualizado: Cliente) => {
    try {
      const { id, ...updates } = clienteAtualizado;
      const { data, error } = await supabase
        .from("clientes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        throw error;
      }
      if (data !== null && data !== undefined) {
        setClientes((prev) =>
          prev.map((c) => (c.id === data.id ? data : c))
        );
      }
      setEditClienteModal(false);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      alert("Erro ao atualizar cliente");
    }
  };

  const handleDeleteCliente = async (id: number) => {
    try {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id);
      if (error) {
        throw error;
      }
      setClientes((prev) => prev.filter((c) => c.id !== id));
      setActionMenu(null);
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      alert("Erro ao deletar cliente");
    }
  };

  // Função para converter string de pagamento em número percentual
  const parseProgresso = (pagamentoStr: string): number => {
    if (!pagamentoStr) return 0;
    pagamentoStr = pagamentoStr.toLowerCase().trim();

    // Tenta extrair número direto, ex: "pagou 50 %"
    const numMatch = pagamentoStr.match(/(\d+)(?:\s*%|%|)/);
    if (numMatch) {
      return parseInt(numMatch[1], 10);
    }

    // Tenta extrair fração, ex: "pagou 1/3"
    const fracMatch = pagamentoStr.match(/(\d+)\/(\d+)/);
    if (fracMatch) {
      const numerator = parseInt(fracMatch[1], 10);
      const denominator = parseInt(fracMatch[2], 10);
      if (denominator !== 0) {
        return Math.round((numerator / denominator) * 100);
      }
    }

    return 0;
  };

  const handleImportContacts = async (file: File, type: string) => {
    console.log(`Importando contatos do arquivo: ${file.name} (${type})`);

    if (type === "csv") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        console.log("Arquivo lido, processando...");
        const text = e.target?.result as string;
        console.log("Conteúdo do arquivo:", text);
        const lines = text.split("\n");
        const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
        console.log("Headers:", headers);

        const pagamentoIndex = headers.findIndex(h => h.toLowerCase() === "pagamento");

        const novosClientes = lines
          .slice(1)
          .filter((line) => line.trim())
          .map((line, index) => {
            const values = line.split(",");
            console.log(`Processando linha ${index + 1}:`, values);

            // Mapeamento dos campos do CSV exportado do Notion para os campos do banco (tabela Lista de Clientes)
            // Extrair nome principal removendo URLs e emojis, limitando a 50 caracteres
            const rawNome = values[0]?.replace(/"/g, "") || `Cliente ${index + 1}`;
            // Remover emojis e URLs entre parênteses
            const nomeSemEmoji = rawNome.replace(/^[^\w\s]+/, '').replace(/\([^)]*\)/g, '').trim();
            const nome = nomeSemEmoji.length > 50 ? nomeSemEmoji.substring(0, 50) : nomeSemEmoji;

            // Mapear status do CSV para status esperado no CRM
            // Exemplo: "Executando" -> "ativo", "Lead" -> "lead", outros -> "ativo" por padrão
            const statusRaw = values[1]?.replace(/"/g, "")?.toLowerCase() || "ativo";
            let status = "ativo";
            if (statusRaw === "executando") status = "ativo";
            else if (statusRaw === "lead") status = "lead";
            else if (statusRaw === "cancelado") status = "cancelado";
            else status = "ativo";

            // Converter datas para ISO (assumindo formato "May 18, 2025" ou vazio)
            const parseDate = (dateStr: string) => {
              const d = new Date(dateStr.replace(/"/g, ""));
              return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
            };
            const data_inicio = parseDate(values[2]);
            const proxima_cobranca = parseDate(values[3]);

            // Valor: usar "Valor Pago" (values[8]) ou "Total" (values[6]) se valor pago vazio
            const parseValor = (valStr: string) => {
              if (!valStr) return 0;
              const numStr = valStr.replace(/["R$\s,.]/g, "").replace(",", ".");
              const num = parseFloat(numStr);
              return isNaN(num) ? 0 : num;
            };
            let valor = parseValor(values[8]);
            if (valor === 0) {
              valor = parseValor(values[6]);
            }

            // Extrair progresso da coluna "Pagamento"
            let progresso = 0;
            if (pagamentoIndex !== -1) {
              progresso = parseProgresso(values[pagamentoIndex]);
            }

            // Campos fixos ou padrão
            const tipo_servico = "Gestão de Redes";
            // data_fim: 1 ano após data_inicio, se data_inicio existir
            const data_fim = data_inicio ? new Date(new Date(data_inicio).setFullYear(new Date(data_inicio).getFullYear() + 1)).toISOString().split("T")[0] : null;
            const forma_pagamento = "Mensal";

            return data_inicio ? {
              nome,
              tipo_servico,
              data_inicio,
              data_fim,
              valor,
              forma_pagamento,
              status,
              proxima_cobranca,
              progresso,
            } : null;
          })
          .filter(cliente => cliente !== null);

        console.log("Dados a serem inseridos:", novosClientes);

        const { data, error } = await supabase
          .from("clientes")
          .insert(novosClientes);

        if (error) {
          console.error("Erro ao importar clientes:", error);
          if (error.details) {
            console.error("Detalhes do erro:", error.details);
          }
          alert("Erro ao importar clientes: " + (error.message || "Erro desconhecido"));
        } else {
          console.log("Clientes importados com sucesso:", data);
          await fetchClientes();
          alert(`${data.length} clientes importados com sucesso!`);
          setImportModal(false);
        }
      };
      reader.readAsText(file);
    } else {
      alert(`${file.name} importado com sucesso! Novos clientes adicionados.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800";
      case "expirando":
        return "bg-orange-100 text-orange-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const statusMatch = filterStatus === "todos" || cliente.status === filterStatus;
    const serviceMatch = filterService === "todos" || cliente.tipo_servico === filterService;
    const searchMatch = cliente.nome.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && serviceMatch && searchMatch;
  });

  const totalContratos = clientesFiltrados.filter((c) => c.status === "ativo").length;
  const valorTotal = clientesFiltrados
    .filter((c) => c.status === "ativo")
    .reduce((sum, c) => sum + c.valor, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CRM Principal</h1>
          <p className="text-gray-500">Gestão completa de clientes e contratos</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setImportModal(true)}>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="executando">Executando</option>
              <option value="lead">Lead</option>
              <option value="qualificado">Qualificado</option>
              <option value="contrato enviada">Contrato Enviada</option>
              <option value="negociacao">Negociação</option>
              <option value="aguardando pagamento">Aguardando Pagamento</option>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Progresso</th>
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
                        <p className="text-sm text-gray-500">{cliente.forma_pagamento}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{cliente.tipo_servico}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-600">{new Date(cliente.data_inicio).toLocaleDateString()}</p>
                        <p className="text-gray-500">até {new Date(cliente.data_fim).toLocaleDateString()}</p>
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
                    <td className="py-3 px-4 text-gray-600">
                      {cliente.progresso !== undefined ? `${cliente.progresso}%` : "-"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {cliente.proxima_cobranca !== "-" ? 
                        new Date(cliente.proxima_cobranca).toLocaleDateString() : 
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
