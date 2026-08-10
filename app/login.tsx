// Importação do React e hooks locais e globais
import React, { useState, useContext } from 'react';
// Importação de componentes básicos e alertas da plataforma React Native
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Alert, ScrollView } from 'react-native';
// Importação do componente de gradiente do Expo para fazer o fundo da tela
import { LinearGradient } from 'expo-linear-gradient';
// Importação do componente reutilizável de entrada de dados
import { CustomInput } from '../src/CustomInput';
// Importação do contexto global para acessar a função de login
import { AuthContext } from '../src/AuthContext';
// Importação da biblioteca Axios para fazer requisições HTTP para a API Laravel
import axios from 'axios';

// Componente da Tela de Login (RF002)
export const LoginScreen = ({ navigation }: any) => {
  // Estado local para capturar o e-mail digitado
  const [email, setEmail] = useState('');
  // Estado local para capturar a senha digitada
  const [password, setPassword] = useState('');
  // Estado para controlar a indicação de carregamento da requisição HTTP
  const [loading, setLoading] = useState(false);
  // Acesso à função signIn disponibilizada via Context API (RF008)
  const { signIn } = useContext(AuthContext);

  // Função para processar o formulário de login
  const handleLogin = async () => {
    // Validação inicial para verificar se os campos foram preenchidos
    if (!email || !password){
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    try{
      //Inicia a animação/estado de carregamento do botão
      setLoading(true);
      //Faz a requisição POST para a API Laravel enviando o e-mail e senha digitados
      const response = await axios.post('https://sua-api.com/api/login', {
        email,
        password,
      });

      //Extrai o token e os dados do usuário vindos do retorno da API
      const { token, user } = response.data;
      //Salva os dados no contexto e dispara a navegação automática para a tela logada
      await signIn(token, user);
    } 
    catch (error){
      //Exibe mensagem de erro caso ocorra falha de comunicação ou credenciais incorretas
      Alert.alert('Erro', 'Falha ao realizar login. Verifique suas credenciais.');
    } 
    finally{
      //Finaliza a indicação de carregamento
      setLoading(false);
    }
    };

    return(
        // Aplica o gradiente azul de fundo idêntico ao protótipo visual
        <LinearGradient colors={['#7DA7FF', '#1D4ED8', '#0D1B2A']} style={styles.container}>
            {/* Componente de rolagem para garantir acessibilidade em telas menores (RNF001) */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
                /* Container do Banner Superior Estilo Pixel Art */
                <View style={styles.bannerContainer}>
                    /* Imagem de fundo com malha retro pixelada */
                    <ImageBackground
                    source={require('../assets/images/geekcolletor/Login-blue.png')}
                    style={styles.bannerBackground}
                    resizeMode="cover"
                    >
                </View>

                {/* Cabeçalho superior direito contendo o logo e nome GeekCollector */}
                <View style={styles.logoHeader}>
                    <Image source={require('../assets/images/geekcolletor/logotexto-nova_fonte-recised-s fundo.png')} style={styles.logoIcon} />
                </View>

                {/* Formulário com os campos de entrada de dados */}
                <View style={styles.formContainer}>

                    {/* Campo de e-mail usando nosso componente customizado */}
                    <CustomInput
                        label="E-mail:"
                        placeholder="Digite seu email"
                        keyboardType="email-address" // Habilita o teclado próprio para inserção de e-mails
                        autoCapitalize="none"        // Desativa a primeira letra maiúscula automática
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Campo de senha com suporte a ícone de ocultar/mostrar */}
                    <CustomInput
                        label="Senha:"
                        placeholder="Digite sua senha"
                        isPassword                 // Ativa as propriedades exclusivas de campo de senha
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/* Botão Amarelo de Login */}
                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Carregando...' : 'Login'}</Text>
                    </TouchableOpacity>

                    {/* Link para transicionar o usuário deslogado até a tela de Cadastro */}
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Register')} 
                        style={styles.footerLinkContainer}
                        >
                        <Text style={styles.footerText}>
                            Não possui uma conta? <Text style={styles.linkText}>Cadastre-se</Text>
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </LinearGradient>
    );
};

// Estilizações CSS específicas para os elementos da Tela de Login
const styles = StyleSheet.create({
  
  container: {
    flex: 1, // Preenche toda a área disponível na tela do celular
  },

  scrollContent: {
    flexGrow: 1, // Garante expansão total da área rolável
  },

  bannerContainer: {
    height: 200,          // Altura do banner superior
    width: '100%',        // Ocupa toda a largura
    borderBottomWidth: 2, // Borda ciano separadora
    borderColor: '#00F0FF',
  },

  bannerBackground: {
    flex: 1,
    justifyContent: 'center', // Centraliza o texto verticalmente dentro do banner
    alignItems: 'center',     // Centraliza o texto horizontalmente dentro do banner
  },

  formContainer: {
    paddingHorizontal: 30,    // Espaçamento interno lateral do formulário
    paddingTop: 10,
    alignItems: 'center',
  },

  logoHeader: {
    flexDirection: 'row',     // Posiciona a foto e o texto lado a lado
    alignItems: 'center',     // Centraliza os elementos na vertical
    alignSelf: 'flex-end',    // Alinha a logo no canto superior direito conforme imagens
    marginBottom: 20,
  },

  logoIcon: {
    width: 32,                // Largura do ícone da logo
    height: 32,               // Altura do ícone da logo
    marginRight: 6,
  },

  button: {
    backgroundColor: '#F59E0B',// Cor dourada/amarela do botão
    borderRadius: 25,         // Formato arredondado de pílula
    width: '100%',            // Ocupa toda a largura do formulário
    height: 48,               // Altura do botão
    justifyContent: 'center', // Centraliza o texto do botão na vertical
    alignItems: 'center',     // Centraliza o texto do botão na horizontal
    marginTop: 15,
    shadowColor: '#000',      // Sombra para dar profundidade
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,             // Sombreamento específico para Android
  },

  buttonText: {
    color: '#FFFFFF',         
    fontSize: 20,
    fontWeight: 'bold',
  },

  footerLinkContainer: {
    marginTop: 25,
    marginBottom: 20,
  },

  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  
  linkText: {
    color: '#FBBF24',          // Destaque em amarelo para a palavra "Cadastre-se"
    textDecorationLine: 'underline', // Texto sublinhado
    fontWeight: 'bold',
  },
});