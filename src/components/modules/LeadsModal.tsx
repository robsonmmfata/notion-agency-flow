import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Lead {
  id: number;
  nome: string;
  status: string;
  responsavel: string;
  gastosClientes: number;
  valorPago: number;
}

interface LeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Omit<Lead, "id">) => void;
}

const LeadsModal = ({ isOpen, onClose, onSave }: LeadsModalProps) => {
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [gastosClientes, setGastosClientes] = useState(0);
  const [valorPago, setValorPago] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!nome || !status || !responsavel) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    onSave({
      nome,
      status,
      responsavel,
      gastosClientes,
      valorPago,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Adicionar Novo Lead</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Responsável</label>
            <input
              type="text"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gastos com Clientes</label>
            <input
              type="number"
              value={gastosClientes}
              onChange={(e) => setGastosClientes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor Pago</label>
            <input
              type="number"
              value={valorPago}
              onChange={(e) => setValorPago(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsModal;
