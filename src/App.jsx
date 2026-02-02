import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';

// Importação das Páginas (que agora buscam seus próprios dados no Supabase)
import AccessPortal from './pages/AccessPortal';
import AdminArea from './pages/AdminArea';
import ManagerArea from './pages/ManagerArea';
import ProviderArea from './pages/ProviderArea';
import ResidentArea from './pages/ResidentArea';

// Importação do Serviço de Auth
import { supabase } from './services/supabase';

function App() {
  const navigate = useNavigate();

  // --- FUNÇÕES GLOBAIS DE NAVEGAÇÃO ---
  
  const handleLogin = (type) => {
    // Redireciona para a rota correta baseada no tipo de usuário retornado pelo Login
    if (type === 'admin') navigate('/admin');
    if (type === 'manager') navigate('/manager');
    if (type === 'provider') navigate('/provider');
    if (type === 'resident') navigate('/resident');
  };

  const handleLogout = async () => {
    try {
      // 1. Desloga do Supabase (limpa sessão no navegador)
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    } finally {
      // 2. Redireciona visualmente para a tela inicial
      navigate('/'); 
    }
  };

  // --- ROTEAMENTO ---
  // Note que removemos todas as props de dados (notices, providers, etc)
  // pois as páginas agora gerenciam isso internamente com o Banco de Dados.

  return (
    <Routes>
      {/* Rota Pública (Login/Hub) */}
      <Route path="/" element={<AccessPortal onLogin={handleLogin} />} />

      {/* Rota Admin (Painel Mestre) */}
      <Route 
        path="/admin" 
        element={<AdminArea onLogout={handleLogout} />} 
      />

      {/* Rota Manager (Síndico) */}
      <Route 
        path="/manager" 
        element={<ManagerArea onLogout={handleLogout} />} 
      />

      {/* Rota Provider (Prestador) */}
      <Route 
        path="/provider" 
        element={<ProviderArea onLogout={handleLogout} />} 
      />

      {/* Rota Resident (Morador) */}
      <Route 
        path="/resident" 
        element={<ResidentArea onLogout={handleLogout} />} 
      />

      {/* Rota Coringa (Qualquer URL errada volta pro início) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;