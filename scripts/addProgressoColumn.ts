import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zmkohkrlzkpggrsawxho.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpta29oa3JsemtwZ2dyc2F3eGhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTcwMjE5NCwiZXhwIjoyMDY1Mjc4MTk0fQ.YourServiceRoleKeyHere";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function addProgressoColumn() {
  const sql = `
    ALTER TABLE clientes ADD COLUMN IF NOT EXISTS progresso INTEGER;
  `;

  const { data, error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    console.error('Erro ao adicionar coluna progresso:', error);
  } else {
    console.log('Coluna progresso adicionada com sucesso ou já existente.');
  }
}

addProgressoColumn().catch(console.error);
