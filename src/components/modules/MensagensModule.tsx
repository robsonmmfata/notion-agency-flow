
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { MessageSquare, Upload, Send, Users, FileText } from "lucide-react";
import { useState } from "react";
import ImportExportModal from "../ImportExportModal";

const MensagensModule = () => {
  const [contacts, setContacts] = useState([
    { id: 1, nome: "João Silva", telefone: "+5511999999999", email: "joao@email.com" },
    { id: 2, nome: "Maria Santos", telefone: "+5511888888888", email: "maria@email.com" },
    { id: 3, nome: "Pedro Costa", telefone: "+5511777777777", email: "pedro@email.com" }
  ]);
  
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [importModal, setImportModal] = useState(false);

  const handleImportContacts = (file: File, type: string) => {
    console.log(`Importando contatos: ${file.name} (${type})`);
    
    if (type === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        const newContacts = lines.slice(1).filter(line => line.trim()).map((line, index) => {
          const values = line.split(',');
          return {
            id: Date.now() + index,
            nome: values[0]?.replace(/"/g, '') || `Contato ${index + 1}`,
            telefone: values[1]?.replace(/"/g, '') || "",
            email: values[2]?.replace(/"/g, '') || ""
          };
        });
        
        setContacts(prev => [...prev, ...newContacts]);
        alert(`${newContacts.length} contatos importados com sucesso!`);
      };
      reader.readAsText(file);
    } else {
      alert(`Arquivo ${file.name} importado com sucesso!`);
    }
  };

  const handleSelectContact = (id: number) => {
    setSelectedContacts(prev => 
      prev.includes(id) 
        ? prev.filter(contactId => contactId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.id));
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      alert("Digite uma mensagem antes de enviar");
      return;
    }

    if (selectedContacts.length === 0) {
      alert("Selecione pelo menos um contato");
      return;
    }

    const selectedContactsData = contacts.filter(c => selectedContacts.includes(c.id));
    
    console.log("Enviando mensagem:", message);
    console.log("Para contatos:", selectedContactsData);
    
    // Simulando envio real
    selectedContactsData.forEach(contact => {
      console.log(`Enviando WhatsApp para ${contact.nome} (${contact.telefone}): ${message}`);
    });

    alert(`Mensagem enviada para ${selectedContacts.length} contatos via WhatsApp!`);
    setMessage("");
    setSelectedContacts([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disparo de Mensagens</h1>
          <p className="text-gray-500">Envio em massa via WhatsApp</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => setImportModal(true)}
        >
          <Upload className="w-4 h-4 mr-2" />
          Importar Contatos
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Contatos</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Selecionados</p>
                <p className="text-2xl font-bold text-gray-900">{selectedContacts.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Mensagens Hoje</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Send className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Contatos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Contatos</CardTitle>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSelectAll}
              >
                {selectedContacts.length === contacts.length ? "Desmarcar Todos" : "Selecionar Todos"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {contacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedContacts.includes(contact.id) 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelectContact(contact.id)}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{contact.nome}</p>
                      <p className="text-sm text-gray-500">{contact.telefone}</p>
                      <p className="text-xs text-gray-400">{contact.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Área de Mensagem */}
        <Card>
          <CardHeader>
            <CardTitle>Compose Mensagem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem para {selectedContacts.length} contato(s) selecionado(s)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={8}
                placeholder="Digite sua mensagem aqui..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Caracteres: {message.length}/1000
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleSendMessage}
                className="w-full"
                disabled={selectedContacts.length === 0 || !message.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar via WhatsApp ({selectedContacts.length} contatos)
              </Button>
              
              <div className="text-xs text-gray-500 text-center">
                ⚠️ Certifique-se de ter permissão para enviar mensagens para estes contatos
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ImportExportModal
        isOpen={importModal}
        onClose={() => setImportModal(false)}
        type="import"
        onImport={handleImportContacts}
      />
    </div>
  );
};

export default MensagensModule;
