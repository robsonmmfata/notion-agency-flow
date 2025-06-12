-- Criação das tabelas para CRM no Supabase

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  tipo_servico VARCHAR(100) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  forma_pagamento VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  proxima_cobranca DATE NOT NULL
);

-- Tabela de faturas
CREATE TABLE IF NOT EXISTS faturas (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  valor NUMERIC(12,2) NOT NULL,
  mes_referencia VARCHAR(50) NOT NULL,
  vencimento DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  anexo VARCHAR(255),
  data_pagamento DATE
);

-- Tabela de entradas financeiras
CREATE TABLE IF NOT EXISTS entradas_financeiras (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(255) NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  data DATE NOT NULL,
  comprovante VARCHAR(255),
  forma VARCHAR(50),
  observacoes TEXT
);

-- Tabela de saídas financeiras
CREATE TABLE IF NOT EXISTS saidas_financeiras (
  id SERIAL PRIMARY KEY,
  categoria VARCHAR(100) NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  data DATE NOT NULL,
  descricao TEXT,
  recorrente BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tabela de membros da equipe
CREATE TABLE IF NOT EXISTS membros (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  funcao VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(50) NOT NULL,
  data_entrada DATE NOT NULL,
  tarefas_ativas INTEGER NOT NULL DEFAULT 0,
  avatar VARCHAR(10)
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  responsavel_id INTEGER NOT NULL REFERENCES membros(id) ON DELETE SET NULL,
  cliente VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  prioridade VARCHAR(50) NOT NULL,
  prazo DATE NOT NULL,
  progresso INTEGER NOT NULL DEFAULT 0
);

-- Tabela de contatos para mensagens
CREATE TABLE IF NOT EXISTS contatos_mensagens (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(50),
  email VARCHAR(255)
);

-- Tabela de usuários para login
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserção de dois administradores
INSERT INTO usuarios (email, senha, role) VALUES
('admin1@example.com', '123456eu', 'admin'),
('admin2@example.com', '123456eu', 'admin')
ON CONFLICT (email) DO NOTHING;
 
 -- Create table entradas if it does not exist
CREATE TABLE IF NOT EXISTS entradas (
  id SERIAL PRIMARY KEY,
  cliente TEXT,
  categoria TEXT,
  valor NUMERIC,
  data DATE,
  forma TEXT,
  descricao TEXT,
  observacoes TEXT,
  recorrente BOOLEAN DEFAULT FALSE,
  comprovante TEXT
);
-- Tabela saidas
CREATE TABLE IF NOT EXISTS saidas (
  id SERIAL PRIMARY KEY,
  categoria TEXT,
  valor NUMERIC,
  data DATE,
  descricao TEXT,
  recorrente BOOLEAN DEFAULT FALSE
);