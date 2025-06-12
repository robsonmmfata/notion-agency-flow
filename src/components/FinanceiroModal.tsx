
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, DollarSign } from "lucide-react";

interface FinanceiroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entrada: any) => void;
  type: "entrada" | "saida";
}

const FinanceiroModal = ({ isOpen, onClose, onSave, type }: FinanceiroModalProps) => {
  const [formData, setFormData] = useState({
    cliente: "",
    categoria: "",
    valor: "",
    data: "",
    forma: "PIX",
    descricao: "",
    observacoes: "",
    recorrente: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      valor: parseFloat(formData.valor),
      comprovante: `${type}_${Date.now()}.pdf`
    });
    setFormData({
      cliente: "",
      categoria: "",
      valor: "",
      data: "",
      forma: "PIX",
      descricao: "",
      observacoes: "",
      recorrente: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Nova {type === "entrada" ? "Entrada" : "Saída"}</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === "entrada" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <input
                  type="text"
                  required
                  value={formData.cliente}
                  onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Salários">Salários</option>
                  <option value="Aluguel">Aluguel</option>
                  <option value="Ferramentas">Ferramentas</option>
                  <option value="Freelas">Freelas</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                required
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {type === "entrada" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                <select
                  value={formData.forma}
                  onChange={(e) => setFormData({...formData, forma: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PIX">PIX</option>
                  <option value="Transferência">Transferência</option>
                  <option value="Boleto">Boleto</option>
                  <option value="Cartão">Cartão</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            {type === "saida" && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.recorrente}
                  onChange={(e) => setFormData({...formData, recorrente: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label className="text-sm text-gray-700">Despesa recorrente</label>
              </div>
            )}
            
            <Button type="submit" className="w-full">
              Salvar {type === "entrada" ? "Entrada" : "Saída"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceiroModal;
