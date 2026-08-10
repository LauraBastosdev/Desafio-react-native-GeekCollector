// Importação do React e hooks para formulário local
import React, { useState } from 'react';
// Importação de componentes nativos de layout e exibição
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Alert, ScrollView } from 'react-native';
// Importação do gradiente do Expo
import { LinearGradient } from 'expo-linear-gradient';
// Importação do componente reutilizável de entrada de texto
import { CustomInput } from '../src/CustomInput';
// Importação do Axios para efetuar o cadastro na API
import axios from 'axios';

// Componente da Tela de Registro/Cadastro (RF003)
export default function RegisterScreen ({ navigation }: any){
  // Estado local para o campo Nome
  const [name, setName] = useState('');
  // Estado local para o campo E-mail
  const [email, setEmail] = useState('');
  // Estado local para o campo Senha
  const [password, setPassword] = useState('');
  // Estado local para o campo Confirmar Senha
  const [confirmPassword, setConfirmPassword] = useState('');
  // Estado para controlar o carregamento do botão durante a requisição
  const [loading, setLoading] = useState(false);

  // Função chamada ao clicar no botão "Cadastre-se"
    const handleRegister = async () => {
        // Validação 1: Verifica se todos os campos foram preenchidos (RF003)
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }

        // Validação 2: Verifica se o campo "Confirmar Senha" é idêntico ao campo "Senha" (RF003)
        if (password !== confirmPassword) {
            Alert.alert('Erro de Validação', 'O campo Confirmar Senha deve ser igual à Senha.');
            return;
        }

        try {
            // Ativa a indicação visual de carregamento no botão
            setLoading(true);
            // Faz a chamada HTTP enviando os dados informados para a API backend em Laravel (RF003)
            await axios.post('https://minha-api.com/api/register', {
                name,
                email,
                password
            });

            // Se bem-sucedido, avisa o usuário e o redireciona de volta para a tela de Login
            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } 
        catch (error) {
            // Emite alerta em caso de falha de conexão ou e-mail já cadastrado
            Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
        } 
        finally {
            // Desativa o indicador de carregamento
            setLoading(false);
        }
    };

    return (
        // Fundo em gradiente idêntico ao protótipo da imagem
        <LinearGradient colors={['#7DA7FF', '#1D4ED8', '#0D1B2A']} style={styles.container}>
            
            {/* ScrollView que permite rolagem suave em telas menores */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}> 
                
                {/* Banner Superior Estilo Gamer com a frase "CREATE YOUR CHARACTER" */}
                <View style={styles.bannerContainer}>
                    <ImageBackground
                        source={require('../assets/images/geekcolletor/Registro-blue.png')}
                        style={styles.bannerBackground}
                        resizeMode="cover"
                    ></ImageBackground>
                </View>

                {/* Logo do GeekCollector posicionado no canto superior direito */}
                <View style={styles.logoHeader}>
                    <Image source={require('..assets/images/geekcolletor/logotexto-nova_fonte-recised-s fundo.png')} style={styles.logoIcon} />
                </View>

                {/* Container que guarda os inputs do formulário */}
                <View style={styles.formContainer}>

                    {/* Campo para preenchimento do Nome completo */}
                    <CustomInput
                        label="Nome:"
                        placeholder="Digite seu nome"
                        value={name}
                        onChangeText={setName}
                    />

                    {/* Campo para preenchimento do E-mail */}
                    <CustomInput
                        label="E-mail:"
                        placeholder="Digite seu email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Campo para preenchimento da Senha */}
                    <CustomInput
                        label="Senha:"
                        placeholder="Digite sua senha"
                        isPassword
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/* Campo para confirmação da Senha informada */}
                    <CustomInput
                        label="Confirmar senha:"
                        placeholder="Digite sua senha"
                        isPassword
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />

                    {/* Botão Amarelo/Dourado "Cadastre-se" */}
                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                        <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastre-se'}</Text>
                    </TouchableOpacity>
                
                </View>
            </ScrollView>
        </LinearGradient>
    );
};