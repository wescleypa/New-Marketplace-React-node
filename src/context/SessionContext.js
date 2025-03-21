import React, { createContext, useContext, useState, useEffect } from 'react';

// Cria o contexto
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado do usuário
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Verifica se há um usuário logado ao carregar o app
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // Recupera o usuário do localStorage
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Atualiza o estado com o usuário salvo
    }
    setLoading(false); // Finaliza o carregamento
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Função de login
  const login = (userData) => {
    setUser(userData); // Atualiza o estado do usuário
    localStorage.setItem('user', JSON.stringify(userData)); // Salva o usuário no localStorage
  };

  // Função de logout
  const logout = () => {
    setUser(null); // Remove o usuário do estado
    localStorage.removeItem('user'); // Remove o usuário do localStorage
  };

  // Valor do contexto
  const value = {
    user,
    login,
    logout,
    loading,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Renderiza os filhos apenas após o carregamento */}
    </AuthContext.Provider>
  );
};