
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, Bell, Plus, Edit, Trash2 } from "lucide-react";

interface NotificacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificacoes: any[];
  onSave: (notificacao: any) => void;
  onUpdate: (id: number, notificacao: any) => void;
  onDelete: (id: number) => void;
}

const NotificacaoModal = ({ isOpen, onClose, notificacoes, onSave, onUpdate, onDelete }: NotificacaoModalProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "fatura_vencendo",
    ativo: true,
    diasAntecedencia: 7
  });

  const tiposNotificacao = [
    { value: "fatura_vencendo", label: "Faturas vencendo" },
    { value: "pagamento_recebido", label: "Pagamento recebido" },
    { value: "tarefa_atrasada", label: "Tarefa atrasada" },
    { value: "relatorio_mensal", label: "Relatório mensal" },
    { value: "backup_completo", label: "Backup concluído" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onSave(formData);
    }
    
    setFormData({
      titulo: "",
      descricao: "",
      tipo: "fatura_vencendo",
      ativo: true,
      diasAntecedencia: 7
    });
    setShowForm(false);
  };

  const handleEdit = (notificacao: any) => {
    setFormData(notificacao);
    setEditingId(notificacao.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      titulo: "",
      descricao: "",
      tipo: "fatura_vencendo",
      ativo: true,
      diasAntecedencia: 7
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Gerenciar Notificações</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showForm ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Notificações Cadastradas</h3>
                <Button onClick={() => setShowForm(true)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Notificação
                </Button>
              </div>
              
              <div className="space-y-3">
                {notificacoes.map((notificacao) => (
                  <div key={notificacao.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{notificacao.titulo}</h4>
                        <p className="text-sm text-gray-600">{notificacao.descricao}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${notificacao.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {notificacao.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                          {notificacao.diasAntecedencia && (
                            <span className="text-xs text-gray-500">
                              {notificacao.diasAntecedencia} dias antes
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(notificacao)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(notificacao.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {notificacoes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma notificação cadastrada
                  </div>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-medium">
                {editingId ? 'Editar Notificação' : 'Nova Notificação'}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {tiposNotificacao.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                  ))}
                </select>
              </div>
              
              {(formData.tipo === "fatura_vencendo" || formData.tipo === "tarefa_atrasada") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dias de Antecedência</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.diasAntecedencia}
                    onChange={(e) => setFormData({...formData, diasAntecedencia: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="ativo" className="text-sm font-medium text-gray-700">
                  Notificação ativa
                </label>
              </div>
              
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingId ? 'Atualizar' : 'Criar'} Notificação
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificacaoModal;
