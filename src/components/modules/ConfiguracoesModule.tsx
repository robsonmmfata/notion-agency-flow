
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Settings, User, Bell, Shield, Database, Download, Upload, Clock } from "lucide-react";
import { useState } from "react";
import ImportExportModal from "../ImportExportModal";
import NotificacaoModal from "../NotificacaoModal";
import BackupModal from "../BackupModal";

const ConfiguracoesModule = () => {
  const [importModal, setImportModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [notificacaoModal, setNotificacaoModal] = useState(false);
  const [backupModal, setBackupModal] = useState(false);

  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      titulo: "Faturas vencendo",
      descricao: "Alertas 7 dias antes do vencimento",
      tipo: "fatura_vencendo",
      ativo: true,
      diasAntecedencia: 7
    },
    {
      id: 2,
      titulo: "Novos pagamentos",
      descricao: "Notificar quando receber pagamentos",
      tipo: "pagamento_recebido",
      ativo: true,
      diasAntecedencia: null
    }
  ]);

  const [backupConfig, setBackupConfig] = useState({
    automatico: true,
    horario: "03:00",
    frequencia: "diario",
    retencao: 30,
    notificarSucesso: true,
    notificarErro: true,
    compressao: true
  });

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

  const handleSaveNotificacao = (novaNotificacao: any) => {
    const id = Math.max(...notificacoes.map(n => n.id), 0) + 1;
    setNotificacoes([...notificacoes, { ...novaNotificacao, id }]);
    alert("Notificação criada com sucesso!");
  };

  const handleUpdateNotificacao = (id: number, notificacaoAtualizada: any) => {
    setNotificacoes(notificacoes.map(n => 
      n.id === id ? { ...notificacaoAtualizada, id } : n
    ));
    alert("Notificação atualizada com sucesso!");
  };

  const handleDeleteNotificacao = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta notificação?")) {
      setNotificacoes(notificacoes.filter(n => n.id !== id));
      alert("Notificação excluída com sucesso!");
    }
  };

  const handleSaveBackupConfig = (config: any) => {
    setBackupConfig(config);
    console.log("Configurações de backup salvas:", config);
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
            {notificacoes.slice(0, 3).map((notificacao) => (
              <div key={notificacao.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{notificacao.titulo}</p>
                  <p className="text-sm text-gray-500">{notificacao.descricao}</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notificacao.ativo} 
                  onChange={(e) => handleUpdateNotificacao(notificacao.id, { ...notificacao, ativo: e.target.checked })}
                  className="rounded" 
                />
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setNotificacaoModal(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Gerenciar Notificações
            </Button>
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
              <p className="text-sm text-gray-500">
                {backupConfig.automatico ? `Automático às ${backupConfig.horario}` : 'Manual'}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2"
              onClick={() => alert("Backup manual iniciado!")}
            >
              <Database className="w-4 h-4" />
              <span>Backup Manual</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center space-x-2"
              onClick={() => setBackupModal(true)}
            >
              <Clock className="w-4 h-4" />
              <span>Configurar</span>
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Backup automático</p>
                <p className="text-sm text-gray-500">
                  {backupConfig.frequencia.charAt(0).toUpperCase() + backupConfig.frequencia.slice(1)} às {backupConfig.horario}
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={backupConfig.automatico}
                onChange={(e) => setBackupConfig({...backupConfig, automatico: e.target.checked})}
                className="rounded" 
              />
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

      <NotificacaoModal
        isOpen={notificacaoModal}
        onClose={() => setNotificacaoModal(false)}
        notificacoes={notificacoes}
        onSave={handleSaveNotificacao}
        onUpdate={handleUpdateNotificacao}
        onDelete={handleDeleteNotificacao}
      />

      <BackupModal
        isOpen={backupModal}
        onClose={() => setBackupModal(false)}
        backupConfig={backupConfig}
        onSave={handleSaveBackupConfig}
      />
    </div>
  );
};

export default ConfiguracoesModule;
