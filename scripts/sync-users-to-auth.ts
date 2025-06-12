import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zmkohkrlzkpggrsawxho.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY environment variable is required");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function syncUsers() {
  // Busca usuários da tabela 'usuarios'
  const { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('email, senha, role');

  if (error) {
    console.error("Erro ao buscar usuários:", error);
    return;
  }

  if (!usuarios || usuarios.length === 0) {
    console.log("Nenhum usuário encontrado na tabela 'usuarios'");
    return;
  }

  for (const user of usuarios) {
    try {
      // Tenta criar usuário no Supabase Auth
      const { data, error: signUpError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.senha,
        email_confirm: true,
        user_metadata: {
          role: user.role,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('User already exists')) {
          console.log(`Usuário ${user.email} já existe no Supabase Auth.`);
        } else {
          console.error(`Erro ao criar usuário ${user.email}:`, signUpError.message);
        }
      } else {
        console.log(`Usuário ${user.email} criado com sucesso no Supabase Auth.`);
      }
    } catch (err) {
      console.error(`Erro inesperado ao criar usuário ${user.email}:`, err);
    }
  }
}

syncUsers().then(() => {
  console.log("Sincronização finalizada.");
  process.exit(0);
});
