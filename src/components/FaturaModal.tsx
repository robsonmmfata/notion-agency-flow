
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, FileText, Upload } from "lucide-react";
import { supabase } from "../integrations/supabase/client";

interface FaturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fatura: any) => void;
}

const FaturaModal = ({ isOpen, onClose, onSave }: FaturaModalProps) => {
  const [formData, setFormData] = useState({
    cliente: "",
    valor: "",
    mesReferencia: "",
    vencimento: "",
    status: "pendente",
    anexo: null as File | null
  });

  const [clientes, setClientes] = useState<{id: number; nome: string}[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<{id: number; nome: string}[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchClientes();
    }
  }, [isOpen]);

  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nome")
      .order("nome", { ascending: true });
    if (error) {
      console.error("Erro ao buscar clientes:", error);
    } else {
      setClientes(data || []);
      setFilteredClientes(data || []);
    }
  };

  const handleClienteChange = (value: string) => {
    setFormData({...formData, cliente: value});
    if (value === "") {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(c =>
        c.nome.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredClientes(filtered);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const anexoNome = formData.anexo ? formData.anexo.name : "";
    onSave({
      ...formData,
      valor: parseFloat(formData.valor),
      anexo: anexoNome,
      dataPagamento: null
    });
    setFormData({
      cliente: "",
      valor: "",
      mesReferencia: "",
      vencimento: "",
      status: "pendente",
      anexo: null
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['text/csv', 'application/pdf'];
      if (allowedTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.pdf')) {
        setFormData({...formData, anexo: file});
      } else {
        alert('Apenas arquivos CSV e PDF são permitidos');
        e.target.value = '';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Nova Fatura</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <input
                type="text"
                required
                value={formData.cliente}
                onChange={(e) => handleClienteChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                list="clientes-list"
                autoComplete="off"
              />
              <datalist id="clientes-list">
                {filteredClientes.map(cliente => (
                  <option key={cliente.id} value={cliente.nome} />
                ))}
              </datalist>
            </div>
            
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Mês de Referência</label>
              <input
                type="text"
                required
                placeholder="Ex: Junho 2025"
                value={formData.mesReferencia}
                onChange={(e) => setFormData({...formData, mesReferencia: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
              <input
                type="date"
                required
                value={formData.vencimento}
                onChange={(e) => setFormData({...formData, vencimento: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anexo (CSV ou PDF)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".csv,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="anexo-upload"
                />
                <label 
                  htmlFor="anexo-upload"
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{formData.anexo ? formData.anexo.name : "Selecionar arquivo"}</span>
                </label>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              Criar Fatura
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaturaModal;