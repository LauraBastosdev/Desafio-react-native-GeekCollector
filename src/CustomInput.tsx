// Importação do React e do useState para controlar a visibilidade da senha
import React, { useState } from 'react';
// Importação dos componentes primitivos e de tipagem de estilos do React Native
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, TextInputProps } from 'react-native';
// Importação do pacote de ícones vetoriais do Expo para renderizar o ícone de olho
import { Ionicons } from '@expo/vector-icons';

// Interface que estende as propriedades padrão de entrada de texto do React Native
interface CustomInputProps extends TextInputProps {
  label: string;             // Texto exibido como título acima do campo (Ex: "E-mail:")
  isPassword?: boolean;      // Flag opcional para indicar se o campo trata-se de uma senha
  containerStyle?: ViewStyle; // Propriedade para customizar dinamicamente o estilo do container externo (RF010)
  inputStyle?: TextStyle;     // Propriedade para customizar o texto digitado no campo
}

// Componente reusável de Input estilizável (RF010 e RNF003)
export const CustomInput: React.FC<CustomInputProps> = ({
  label,              // Desestrutura o rótulo do campo
  isPassword = false, // Define por padrão que o campo NÃO é de senha
  containerStyle,     // Recebe estilo customizado para o container
  inputStyle,         // Recebe estilo customizado para o campo de texto
  ...rest             // Captura todas as demais propriedades nativas do TextInput (placeholder, value, etc)
}) => {
  // Estado local para alternar entre mostrar e ocultar a senha digitada
  const [showPassword, setShowPassword] = useState(!isPassword);

  return (
    // Container externo do input, aplicando o estilo padrão + estilo customizado enviado por parâmetro (RF010)
    <View style={[styles.fieldContainer, containerStyle]}>
      {/* Exibe o rótulo do campo */}
      <Text style={styles.label}>{label}</Text>
      
      {/* Envoltório branco no formato de pílula contendo o input e o botão do olho */}
      <View style={styles.inputWrapper}>
        {/* Campo de entrada de texto nativo */}
        <TextInput
          style={[styles.input, inputStyle]} // Aplica estilos base e customizados da caixa de texto
          placeholderTextColor="#8D8DAA"     // Define a cor do texto do placeholder
          secureTextEntry={isPassword && !showPassword} // Oculta o texto se for senha e a opção de visibilidade estiver falsa
          {...rest}                          // Propaga as demais propriedades para o elemento TextInput
        />
        
        {/* Caso o campo seja marcado como senha, renderiza o botão com ícone do olho */}
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)} // Altera o estado de visibilidade ao tocar
            style={styles.eyeIcon}                          // Aplica área de clique ao ícone
            activeOpacity={0.7}                             // Efeito visual ao tocar
          >
            {/* Ícone que muda dinamicamente entre o olho aberto e o olho riscado */}
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={22} 
              color="#3B2A58" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Objeto contendo os estilos estilizados com StyleSheet nativo
const styles = StyleSheet.create({
  fieldContainer: {
    width: '100%',      // Ocupa 100% da largura disponível
    marginBottom: 16,   // Espaçamento inferior entre cada grupo de input
  },
  label: {
    color: '#FFFFFF',   // Cor do texto branca
    fontSize: 18,       // Tamanho da fonte do rótulo
    fontWeight: 'bold', // Texto em negrito
    marginBottom: 6,    // Espaço entre o rótulo e o campo de digitação
  },
  inputWrapper: {
    flexDirection: 'row',     // Organiza o texto e o ícone na horizontal
    alignItems: 'center',     // Centraliza verticalmente o conteúdo interno
    backgroundColor: '#FFFFFF',// Fundo branco conforme protótipo
    borderRadius: 25,         // Borda arredondada em formato de pílula
    paddingHorizontal: 16,    // Espaçamento interno nas laterais
    height: 48,               // Altura fixa do campo
  },
  input: {
    flex: 1,           // Ocupa todo o espaço restante antes do ícone do olho
    color: '#3B2A58',  // Cor do texto digitado
    fontSize: 15,      // Tamanho da fonte digitada
  },
  eyeIcon: {
    padding: 4,        // Espaçamento interno no ícone para facilitar o toque do usuário
  },
});