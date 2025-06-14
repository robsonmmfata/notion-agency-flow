
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { X, Database, Clock, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  backupConfig: any;
  onSave: (config: any) => void;
}

const BackupModal = ({ isOpen, onClose, backupConfig, onSave }: BackupModalProps) => {
  const [formData, setFormData] = useState({
    automatico: backupConfig?.automatico || true,
    horario: backupConfig?.horario || "03:00",
    frequencia: backupConfig?.frequencia || "diario",
    retencao: backupConfig?.retencao || 30,
    notificarSucesso: backupConfig?.notificarSucesso || true,
    notificarErro: backupConfig?.notificarErro || true,
    compressao: backupConfig?.compressao || true
  });

  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: "Configurações Salvas!",
      description: "Configurações de backup salvas com sucesso.",
    });
    onClose();
  };

  const handleBackupManual = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    toast({
      title: "Backup manual iniciado",
      description: "Backup manual está em execução. Você será notificado ao finalizar.",
    });
    // Aqui você pode chamar uma API real futuramente!
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Backup concluído",
        description: "O backup manual foi finalizado com sucesso!",
      });
    }, 3400);
    console.log("Iniciando backup manual...");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Configurações de Backup</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Backup Manual</p>
                <p className="text-sm text-gray-600">Executar backup agora</p>
              </div>
              <Button 
                type="button" 
                onClick={handleBackupManual} 
                size="sm"
                disabled={isProcessing}
              >
                {isProcessing ? "Processando..." : "Executar"}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Backup Automático</p>
                  <p className="text-sm text-gray-500">Ativar backups programados</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.automatico}
                  onChange={(e) => setFormData({...formData, automatico: e.target.checked})}
                  className="rounded"
                />
              </div>

              {formData.automatico && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Horário do Backup
                    </label>
                    <input
                      type="time"
                      value={formData.horario}
                      onChange={(e) => setFormData({...formData, horario: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequência</label>
                    <select
                      value={formData.frequencia}
                      onChange={(e) => setFormData({...formData, frequencia: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="diario">Diário</option>
                      <option value="semanal">Semanal</option>
                      <option value="quinzenal">Quinzenal</option>
                      <option value="mensal">Mensal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Retenção (dias)
                    </label>
                    <input
                      type="number"
                      min="7"
                      max="365"
                      value={formData.retencao}
                      onChange={(e) => setFormData({...formData, retencao: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Backups serão mantidos por este período</p>
                  </div>
                </>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Opções Avançadas
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Compressão</p>
                      <p className="text-xs text-gray-500">Reduz o tamanho dos backups</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.compressao}
                      onChange={(e) => setFormData({...formData, compressao: e.target.checked})}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Notificar Sucesso</p>
                      <p className="text-xs text-gray-500">Avisar quando backup concluir</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notificarSucesso}
                      onChange={(e) => setFormData({...formData, notificarSucesso: e.target.checked})}
                      className="rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Notificar Erro</p>
                      <p className="text-xs text-gray-500">Avisar se backup falhar</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.notificarErro}
                      onChange={(e) => setFormData({...formData, notificarErro: e.target.checked})}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Salvar Configurações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupModal;

