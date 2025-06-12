
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, Download, X, FileText, FileSpreadsheet, Archive, FileImage } from "lucide-react";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "import" | "export";
  onImport?: (file: File, type: string) => void;
  onExport?: (format: string) => void;
}

const ImportExportModal = ({ isOpen, onClose, type, onImport, onExport }: ImportExportModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formats = [
    { type: "csv", label: "CSV", icon: FileText, description: "Arquivo separado por vírgulas" },
    { type: "xls", label: "Excel", icon: FileSpreadsheet, description: "Planilha Excel" },
    { type: "zip", label: "ZIP", icon: Archive, description: "Arquivo compactado" },
    { type: "pdf", label: "PDF", icon: FileImage, description: "Documento PDF" },
    { type: "txt", label: "TXT", icon: FileText, description: "Arquivo de texto" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      setSelectedFormat(fileExtension || "");
    }
  };

  const handleImport = () => {
    if (selectedFile && onImport) {
      onImport(selectedFile, selectedFormat);
      onClose();
    }
  };

  const handleExport = () => {
    if (selectedFormat && onExport) {
      onExport(selectedFormat);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              {type === "import" ? <Upload className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              <span>{type === "import" ? "Importar Dados" : "Exportar Dados"}</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {type === "import" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar arquivo para importar
                </label>
                <input
                  type="file"
                  accept=".csv,.xls,.xlsx,.zip,.pdf,.txt"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {selectedFile && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Arquivo selecionado:</p>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">Tamanho: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              )}
              
              <Button 
                onClick={handleImport} 
                disabled={!selectedFile}
                className="w-full"
              >
                Importar Arquivo
              </Button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar formato para exportar
                </label>
                <div className="space-y-2">
                  {formats.map((format) => {
                    const Icon = format.icon;
                    return (
                      <button
                        key={format.type}
                        onClick={() => setSelectedFormat(format.type)}
                        className={`w-full p-3 text-left border rounded-lg hover:bg-gray-50 ${
                          selectedFormat === format.type ? "border-blue-500 bg-blue-50" : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{format.label}</p>
                            <p className="text-sm text-gray-500">{format.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <Button 
                onClick={handleExport} 
                disabled={!selectedFormat}
                className="w-full"
              >
                Exportar como {selectedFormat.toUpperCase()}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportExportModal;
