
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, User } from "lucide-react";

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: any) => void;
}

const ClienteModal = ({ isOpen, onClose, onSave }: ClienteModalProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    tipoServico: "Gestão de Redes",
    dataInicio: "",
    dataFim: "",
    valor: "",
    formaPagamento: "Diario",
    status: "ativo"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nome: formData.nome,
      tipo_servico: formData.tipoServico,
      data_inicio: formData.dataInicio,
      data_fim: formData.dataFim,
      valor: parseFloat(formData.valor),
      forma_pagamento: formData.formaPagamento,
      status: formData.status,
      proxima_cobranca: formData.dataInicio
    });
    setFormData({
      nome: "",
      tipoServico: "Gestão de Redes",
      dataInicio: "",
      dataFim: "",
      valor: "",
      formaPagamento: "Mensal",
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
              <span>Novo Cliente</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Serviço</label>
              <select
                value={formData.tipoServico}
                onChange={(e) => setFormData({...formData, tipoServico: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Gestão de Redes">Gestão de Redes</option>
                <option value="Anúncios Pagos">Anúncios Pagos</option>
                <option value="Criação de Conteúdo">Criação de Conteúdo</option>
                <option value="Consultoria">Consultoria</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                <input
                  type="date"
                  required
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({...formData, dataInicio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                <input
                  type="date"
                  required
                  value={formData.dataFim}
                  onChange={(e) => setFormData({...formData, dataFim: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mensal (R$)</label>
              <input
                type="number"
                required
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
              <select
                value={formData.formaPagamento}
                onChange={(e) => setFormData({...formData, formaPagamento: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Diario">Diario</option>
                <option value="Mensal">Mensal</option>
                <option value="Quinzenal">Quinzenal</option>
              </select>
            </div>
            
            <Button type="submit" className="w-full">
              Salvar Cliente
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteModal;
