import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Phone, Globe } from "lucide-react";
import { NotionClient } from "../../integrations/notionClient";

interface Lead {
  id: number;
  nome: string;
  status: string;
  responsavel: string;
  gastosClientes: number;
  valorPago: number;
}

const NOTION_API_KEY = "ntn_i980772942516M6XivKfVnPusMB7nj5pffh9Tw1ebb23Qu";
const NOTION_DATABASE_ID = "COLOQUE_AQUI_O_ID_DO_BANCO_DE_DADOS";

import LeadsModal from "./LeadsModal";
const LeadsModule = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const notionClient = new NotionClient({ apiKey: NOTION_API_KEY });

    const fetchLeadsFromNotion = async () => {
      try {
        const data = await notionClient.queryDatabase(NOTION_DATABASE_ID);
        if (data && data.results) {
          const mappedLeads = data.results.map((page: any, index: number) => {
            const properties = page.properties;

            // Mapear os campos do Notion para o Lead
            return {
              id: index + 1,
              nome: properties.Name?.title[0]?.plain_text || "Sem nome",
              status: properties.Status?.select?.name || "Sem status",
              responsavel: properties.Responsavel?.people?.[0]?.name || "Sem responsável",
              gastosClientes: Number(properties.GastosClientes?.number) || 0,
              valorPago: Number(properties.ValorPago?.number) || 0,
            };
          });
          setLeads(mappedLeads);
        }
      } catch (error) {
        console.error("Erro ao buscar leads do Notion:", error);
      }
    };

    fetchLeadsFromNotion();
  }, []);

  const handleWhatsAppClick = (lead: Lead) => {
    alert(`Abrir WhatsApp para ${lead.nome}`);
  };

  const handleGoogleClick = (lead: Lead) => {
    alert(`Abrir Google para ${lead.nome}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
          Novo Lead
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Lista de Leads</h2>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-4 font-medium text-gray-700">Nome</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Status</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Responsável</th>
                  <th className="py-2 px-4 font-medium text-gray-700">WhatsApp</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Google</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Gastos com Clientes</th>
                  <th className="py-2 px-4 font-medium text-gray-700">Valor Pago</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-4">{lead.nome}</td>
                    <td className="py-2 px-4">{lead.status}</td>
                    <td className="py-2 px-4">{lead.responsavel}</td>
                    <td className="py-2 px-4">
                      <Button size="sm" variant="outline" onClick={() => handleWhatsAppClick(lead)}>
                        <Phone className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="py-2 px-4">
                      <Button size="sm" variant="outline" onClick={() => handleGoogleClick(lead)}>
                        <Globe className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="py-2 px-4">R$ {lead.gastosClientes.toLocaleString()}</td>
                    <td className="py-2 px-4">R$ {lead.valorPago.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <LeadsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(newLead) => {
          setLeads((prevLeads) => [
            ...prevLeads,
            { id: prevLeads.length + 1, ...newLead },
          ]);
          setIsModalOpen(false);
          alert("Lead adicionado com sucesso!");
        }}
      />
    </div>
  );
};

export default LeadsModule;
