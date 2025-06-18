
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, Send, FileText, MessageSquare, Mail } from "lucide-react";

interface EnvioModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "envio" | "cobranca";
  fatura: any;
}

const EnvioModal = ({ isOpen, onClose, type, fatura }: EnvioModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<"whatsapp" | "email" | "">("");
  const [message, setMessage] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = () => {
    setIsGeneratingPDF(true);
    // Simula geração de PDF
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `boleto_${fatura?.cliente?.replace(/\s+/g, '_')}_${fatura?.mesReferencia?.replace(/\s+/g, '_')}.pdf`;
      console.log(`Gerando boleto PDF para ${fatura?.cliente}`);
      alert(`Boleto PDF gerado para ${fatura?.cliente}!`);
      setIsGeneratingPDF(false);
    }, 2000);
  };

  const handleSend = () => {
    if (!selectedMethod || !message.trim()) {
      alert("Selecione um método de envio e digite uma mensagem");
      return;
    }

    if (selectedMethod === "whatsapp") {
      if (!whatsappNumber.trim()) {
        alert("Digite o número do WhatsApp");
        return;
      }
      
      // Envio real via WhatsApp
      const whatsappMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');
      console.log(`Enviando via WhatsApp para ${whatsappNumber}: ${message}`);
      alert(`Redirecionando para WhatsApp (${whatsappNumber})!`);
    } else {
      if (!emailAddress.trim()) {
        alert("Digite o endereço de email");
        return;
      }
      
      // Envio real via Email
      const subject = encodeURIComponent(`Fatura ${fatura?.mesReferencia} - ${fatura?.cliente}`);
      const body = encodeURIComponent(message);
      const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
      window.open(mailtoUrl, '_blank');
      console.log(`Enviando via Email para ${emailAddress}: ${message}`);
      alert(`Abrindo cliente de email para enviar para ${emailAddress}!`);
    }
    
    setMessage("");
    setSelectedMethod("");
    setWhatsappNumber("");
    setEmailAddress("");
    onClose();
  };

  if (!isOpen || !fatura) return null;

  const defaultMessage = type === "envio" 
    ? `Olá! Sua fatura de ${fatura.mesReferencia} no valor de R$ ${fatura.valor?.toLocaleString()} está disponível. Vencimento: ${new Date(fatura.vencimento).toLocaleDateString()}`
    : `Olá! Sua fatura de ${fatura.mesReferencia} no valor de R$ ${fatura.valor?.toLocaleString()} está vencida. Por favor, efetue o pagamento o quanto antes.`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Send className="w-5 h-5" />
              <span>{type === "envio" ? "Enviar Fatura" : "Enviar Cobrança"}</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Cliente: {fatura.cliente}</h3>
            <p className="text-sm text-gray-600">Valor: R$ {fatura.valor?.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Referência: {fatura.mesReferencia}</p>
          </div>

          <div>
            <Button 
              onClick={handleGeneratePDF}
              className="w-full flex items-center justify-center space-x-2 mb-4"
              variant="outline"
              disabled={isGeneratingPDF}
            >
              <FileText className="w-4 h-4" />
              <span>{isGeneratingPDF ? "Gerando..." : "Gerar Boleto PDF"}</span>
            </Button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escolha o método de envio:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedMethod("whatsapp")}
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 ${
                  selectedMethod === "whatsapp" ? "border-green-500 bg-green-50" : "border-gray-300"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => setSelectedMethod("email")}
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 ${
                  selectedMethod === "email" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {selectedMethod === "whatsapp" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do WhatsApp (com DDD):
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Ex: 5511999999999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {selectedMethod === "email" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço de Email:
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="cliente@exemplo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {selectedMethod && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digite sua mensagem:
              </label>
              <textarea
                value={message || defaultMessage}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Digite sua mensagem aqui..."
              />
            </div>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleSend} 
              className="flex-1" 
              disabled={!selectedMethod || (selectedMethod === "whatsapp" && !whatsappNumber) || (selectedMethod === "email" && !emailAddress)}
            >
              {selectedMethod === "whatsapp" ? "Enviar WhatsApp" : "Enviar Email"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvioModal;
