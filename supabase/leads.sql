-- Criação da tabela leads para armazenar os dados dos leads importados do Notion

CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  status VARCHAR(100),
  responsavel VARCHAR(255),
  gastos_clientes NUMERIC(12, 2) DEFAULT 0,
  valor_pago NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
