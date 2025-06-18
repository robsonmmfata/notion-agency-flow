import { useState } from "react";
import { supabase } from "../integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      window.location.href = "/";
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Cadastro realizado com sucesso! Verifique seu email para confirmar.");
      setIsLogin(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Cadastro"}
        </h2>
        {errorMsg && (
          <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>
        <div className="mt-4 text-center">
          {isLogin ? (
            <>
              Não tem uma conta?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 hover:underline"
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 hover:underline"
              >
                Faça login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
