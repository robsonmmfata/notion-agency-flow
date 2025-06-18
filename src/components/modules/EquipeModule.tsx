import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus, User, Briefcase, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";
import MembroModal from "../MembroModal";
import TarefaModal from "../TarefaModal";

const EquipeModule = () => {
  const [activeTab, setActiveTab] = useState("membros");
  const [membroModal, setMembroModal] = useState(false);
  const [tarefaModal, setTarefaModal] = useState(false);

  const [membros, setMembros] = useState([
    {
      id: 1,
      nome: "Ana Silva",
      funcao: "Gerente de Projetos",
      email: "ana@agencia.com",
      status: "ativo",
      dataEntrada: "2024-03-15",
      tarefasAtivas: 8,
      avatar: "AS"
    },
    {
      id: 2,
      nome: "Carlos Santos",
      funcao: "Designer Gráfico",
      email: "carlos@agencia.com",
      status: "ativo",
      dataEntrada: "2024-05-20",
      tarefasAtivas: 12,
      avatar: "CS"
    },
    {
      id: 3,
      nome: "Beatriz Costa",
      funcao: "Social Media",
      email: "beatriz@agencia.com",
      status: "ativo",
      dataEntrada: "2024-01-10",
      tarefasAtivas: 15,
      avatar: "BC"
    },
    {
      id: 4,
      nome: "Diego Oliveira",
      funcao: "Desenvolvedor",
      email: "diego@agencia.com",
      status: "ativo",
      dataEntrada: "2024-07-01",
      tarefasAtivas: 6,
      avatar: "DO"
    }
  ]);

  const [tarefas, setTarefas] = useState([
    {
      id: 1,
      titulo: "Criar campanha Instagram - Cliente ABC",
      responsavel: "Beatriz Costa",
      cliente: "ABC Marketing",
      status: "em_andamento",
      prioridade: "alta",
      prazo: "2025-06-15",
      progresso: 75
    },
    {
      id: 2,
      titulo: "Desenvolver landing page - Tech Solutions",
      responsavel: "Diego Oliveira",
      cliente: "Tech Solutions",
      status: "em_andamento",
      prioridade: "media",
      prazo: "2025-06-20",
      progresso: 40
    },
    {
      id: 3,
      titulo: "Relatório mensal de performance",
      responsavel: "Ana Silva",
      cliente: "Múltiplos",
      status: "pendente",
      prioridade: "alta",
      prazo: "2025-06-18",
      progresso: 0
    },
    {
      id: 4,
      titulo: "Design banner promocional",
      responsavel: "Carlos Santos",
      cliente: "StartUp Growth",
      status: "concluida",
      prioridade: "baixa",
      prazo: "2025-06-10",
      progresso: 100
    },
    {
      id: 5,
      titulo: "Planejamento editorial julho",
      responsavel: "Beatriz Costa",
      cliente: "Inovação Digital",
      status: "pendente",
      prioridade: "media",
      prazo: "2025-06-25",
      progresso: 0
    }
  ]);

  const handleSaveMembro = (novoMembro: any) => {
    const id = Math.max(...membros.map(m => m.id)) + 1;
    setMembros([...membros, { ...novoMembro, id }]);
  };

  const handleSaveTarefa = (novaTarefa: any) => {
    const id = Math.max(...tarefas.map(t => t.id)) + 1;
    setTarefas([...tarefas, { ...novaTarefa, id }]);
  };

  const vagasAbertas = [
    {
      id: 1,
      titulo: "Especialista em Tráfego Pago",
      departamento: "Marketing Digital",
      tipo: "Tempo Integral",
      salario: "R$ 4.500 - R$ 6.000",
      status: "Recrutando"
    },
    {
      id: 2,
      titulo: "Editor de Vídeo",
      departamento: "Criação",
      tipo: "Freelancer",
      salario: "R$ 80/hora",
      status: "Aguardando aprovação"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida": return "bg-green-100 text-green-800";
      case "em_andamento": return "bg-blue-100 text-blue-800";
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "atrasada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "bg-red-100 text-red-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "baixa": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "concluida": return <CheckCircle className="w-4 h-4" />;
      case "em_andamento": return <Clock className="w-4 h-4" />;
      case "pendente": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipe & Tarefas</h1>
          <p className="text-gray-500">Gestão de colaboradores e atividades</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            if (activeTab === "tarefas") {
              setTarefaModal(true);
            } else {
              setMembroModal(true);
            }
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {activeTab === "tarefas" ? "Nova Tarefa" : "Novo Membro"}
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Membros Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{membros.length}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tarefas Ativas</p>
                <p className="text-2xl font-bold text-gray-900">{tarefas.filter(t => t.status !== "concluida").length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Concluídas (Mês)</p>
                <p className="text-2xl font-bold text-gray-900">{tarefas.filter(t => t.status === "concluida").length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("membros")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "membros"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Membros da Equipe
            </button>
            <button
              onClick={() => setActiveTab("tarefas")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "tarefas"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tarefas
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "membros" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {membros.map((membro) => (
                <Card key={membro.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-blue-600">{membro.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{membro.nome}</h3>
                        <p className="text-sm text-gray-500">{membro.funcao}</p>
                        <p className="text-xs text-gray-400">{membro.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tarefas ativas:</span>
                        <span className="font-medium">{membro.tarefasAtivas}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Desde:</span>
                        <span className="font-medium">{new Date(membro.dataEntrada).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "tarefas" && (
            <div className="space-y-4">
              <div className="flex gap-4 mb-6">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Todos os Status</option>
                  <option>Pendente</option>
                  <option>Em Andamento</option>
                  <option>Concluída</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Todos os Responsáveis</option>
                  {membros.map(m => (
                    <option key={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Tarefa</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Responsável</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Prioridade</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Prazo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Progresso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tarefas.map((tarefa) => (
                      <tr key={tarefa.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">{tarefa.titulo}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{tarefa.responsavel}</td>
                        <td className="py-3 px-4 text-gray-600">{tarefa.cliente}</td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tarefa.status)}`}>
                            {getStatusIcon(tarefa.status)}
                            <span>{tarefa.status.replace('_', ' ').charAt(0).toUpperCase() + tarefa.status.replace('_', ' ').slice(1)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadeColor(tarefa.prioridade)}`}>
                            {tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(tarefa.prazo).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${tarefa.progresso}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{tarefa.progresso}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Modais */}
      <MembroModal
        isOpen={membroModal}
        onClose={() => setMembroModal(false)}
        onSave={handleSaveMembro}
      />
      
      <TarefaModal
        isOpen={tarefaModal}
        onClose={() => setTarefaModal(false)}
        onSave={handleSaveTarefa}
        membros={membros}
      />
    </div>
  );
};

export default EquipeModule;
