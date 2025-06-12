
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Settings, User, Bell, Shield, Database, Download, Upload } from "lucide-react";
import { useState } from "react";
import ImportExportModal from "../ImportExportModal";

const ConfiguracoesModule = () => {
  const [importModal, setImportModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);

  const handleImport = (file: File, type: string) => {
    console.log(`Importando arquivo: ${file.name} (${type})`);
    // Aqui você implementaria a lógica de importação
    alert(`Arquivo ${file.name} importado com sucesso!`);
  };

  const handleExport = (format: string) => {
    console.log(`Exportando dados em formato: ${format}`);
    // Aqui você implementaria a lógica de exportação
    alert(`Dados exportados em formato ${format.toUpperCase()}!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-500">Configurações gerais do sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perfil da Agência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Perfil da Agência</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Agência</label>
              <input 
                type="text" 
                defaultValue="Agência Digital Marketing"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
              <input 
                type="text" 
                defaultValue="12.345.678/0001-90"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input 
                type="email" 
                defaultValue="contato@agencia.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button 
              className="w-full" 
              onClick={() => alert("Perfil salvo com sucesso!")}
            >
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Importar/Exportar Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Importar/Exportar Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center space-x-2"
                onClick={() => setImportModal(true)}
              >
                <Upload className="w-4 h-4" />
                <span>Importar Dados</span>
              </Button>
              <p className="text-xs text-gray-500">Suporta: CSV, Excel, ZIP, PDF, TXT</p>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center space-x-2"
                onClick={() => setExportModal(true)}
              >
                <Download className="w-4 h-4" />
                <span>Exportar Dados</span>
              </Button>
              <p className="text-xs text-gray-500">Escolha o formato de exportação</p>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Faturas vencendo</p>
                <p className="text-sm text-gray-500">Alertas 7 dias antes do vencimento</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Novos pagamentos</p>
                <p className="text-sm text-gray-500">Notificar quando receber pagamentos</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tarefas atrasadas</p>
                <p className="text-sm text-gray-500">Alertas para tarefas com prazo vencido</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Relatórios mensais</p>
                <p className="text-sm text-gray-500">Envio automático no final do mês</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha Atual</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button 
              className="w-full"
              onClick={() => alert("Senha alterada com sucesso!")}
            >
              Alterar Senha
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Backup e Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Backup e Dados</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Último backup</p>
              <p className="text-sm text-gray-500">Hoje às 03:00</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center space-x-2"
              onClick={() => alert("Backup manual iniciado!")}
            >
              <Database className="w-4 h-4" />
              <span>Fazer Backup Manual</span>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Backup automático</p>
                <p className="text-sm text-gray-500">Diário às 03:00</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sobre o Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Sobre o Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-bold text-blue-600 text-2xl">v1.0.0</p>
              <p className="text-sm text-gray-600">Versão atual</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-bold text-green-600 text-2xl">99.9%</p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="font-bold text-purple-600 text-2xl">30</p>
              <p className="text-sm text-gray-600">Dias de uso</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      <ImportExportModal
        isOpen={importModal}
        onClose={() => setImportModal(false)}
        type="import"
        onImport={handleImport}
      />
      
      <ImportExportModal
        isOpen={exportModal}
        onClose={() => setExportModal(false)}
        type="export"
        onExport={handleExport}
      />
    </div>
  );
};

export default ConfiguracoesModule;
