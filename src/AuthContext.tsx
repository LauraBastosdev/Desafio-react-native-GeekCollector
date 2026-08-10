// Importação dos hooks e tipos essenciais da biblioteca React
import React, { createContext, useState, useEffect, ReactNode } from 'react';
// Importação do SecureStore para armazenar dados sensíveis de forma criptografada no dispositivo (RF004)
import * as SecureStore from 'expo-secure-store';

// Definição da estrutura (interface) dos dados do usuário logado
interface User {
  id: string;    // Identificador único do usuário
  name: string;  // Nome do usuário
  email: string; // Endereço de e-mail do usuário
}

// Definição dos dados e funções que o Contexto de Autenticação irá disponibilizar globalmente
interface AuthContextData {
  signed: boolean;                                            // Flag que indica se o usuário está autenticado
  user: User | null;                                         // Dados do usuário logado ou null caso deslogado
  loading: boolean;                                          // Estado para controle de carregamento dos dados gravados
  signIn: (token: string, userData: User) => Promise<void>;   // Função assíncrona para efetuar o login
  signOut: () => Promise<void>;                              // Função assíncrona para efetuar o logout
}

// Criação do objeto de Contexto usando o React Context API (RF008)
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Componente Provedor de Autenticação que envolve a aplicação repassando os estados globais via prop children (RF011)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado para armazenar os dados do usuário ativo na aplicação
  const [user, setUser] = useState<User | null>(null);
  // Estado para controlar a exibição da tela enquanto lê a memória local do dispositivo
  const [loading, setLoading] = useState(true);

  // Hook que é executado na inicialização do aplicativo para verificar se o usuário já possui sessão ativa (RF004)
  useEffect(() => {
    // Função assíncrona para buscar as chaves gravadas no armazenamento seguro
    async function loadStorageData() {
      // Busca o token de autenticação armazenado
      const storedToken = await SecureStore.getItemAsync('user_token');
      // Busca os dados do usuário armazenados
      const storedUser = await SecureStore.getItemAsync('user_data');

      // Se ambos os dados existirem localmente
      if (storedToken && storedUser) {
        // Converte o JSON em texto de volta para objeto e atualiza o estado
        setUser(JSON.parse(storedUser));
      }
      // Finaliza o estado de carregamento inicial
      setLoading(false);
    }
    // Executa a busca assíncrona
    loadStorageData();
  }, []); // O array vazio indica que esse hook roda uma única vez no carregamento do aplicativo

  // Função para logar o usuário, recebendo o token e os dados vindos da API
  const signIn = async (token: string, userData: User) => {
    // Atualiza o estado global com os dados do usuário logado
    setUser(userData);
    // Salva o token retornado de forma criptografada no dispositivo
    await SecureStore.setItemAsync('user_token', token);
    // Converte e salva o objeto do usuário como texto JSON no dispositivo
    await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
  };

  // Função para deslogar o usuário e limpar a sessão armazenada
  const signOut = async () => {
    // Exclui o token salvo do armazenamento seguro
    await SecureStore.deleteItemAsync('user_token');
    // Exclui os dados do usuário do armazenamento seguro
    await SecureStore.deleteItemAsync('user_data');
    // Reseta o estado do usuário para null, deslogando a aplicação
    setUser(null);
  };

  // Retorna o Provider alimentando o aplicativo e renderizando seus filhos (children)
  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};