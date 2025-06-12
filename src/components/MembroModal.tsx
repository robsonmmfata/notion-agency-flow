
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, User } from "lucide-react";

interface MembroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (membro: any) => void;
}

const MembroModal = ({ isOpen, onClose, onSave }: MembroModalProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    funcao: "",
    email: "",
    dataEntrada: "",
    status: "ativo"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const avatar = formData.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    onSave({
      ...formData,
      avatar,
      tarefasAtivas: 0
    });
    setFormData({
      nome: "",
      funcao: "",
      email: "",
      dataEntrada: "",
      status: "ativo"
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
              <User className="w-5 h-5" />
              <span>Novo Membro</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
              <input
                type="text"
                required
                value={formData.funcao}
                onChange={(e) => setFormData({...formData, funcao: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Designer Gráfico, Social Media, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrada</label>
              <input
                type="date"
                required
                value={formData.dataEntrada}
                onChange={(e) => setFormData({...formData, dataEntrada: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Button type="submit" className="w-full">
              Adicionar Membro
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembroModal;
