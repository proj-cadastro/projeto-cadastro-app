import 'react-native-reanimated'
import 'react-native-gesture-handler'
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Provider as PaperProvider,
  ActivityIndicator,
  Button,
  useTheme, // <-- Para usar o tema nas telas
  Text,     // <-- Usando o Text do Paper para herdar o tema
} from "react-native-paper";
import { View, StyleSheet } from "react-native";

import { ProtectedRoutes } from "./src/routes/protectedRoutes";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { AuthListener } from "./src/components/AuthListener";
import { ThemeProvider, useThemeMode } from "./src/context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function App() {
  // Carrega as fontes customizadas
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // Envolve tudo com AuthProvider e ThemeProvider
  return (
    <AuthProvider>
      <AuthListener />
      <ThemeProvider>
        <Main />
      </ThemeProvider>
    </AuthProvider>
  );
}

// Componente principal que aplica o tema global
function Main() {
  const { theme, toggleTheme, isDarkMode } = useThemeMode();

  // Personaliza as fontes do tema
  const customTheme = {
    ...theme,
    fonts: {
      ...theme.fonts,
      bodyLarge: { ...theme.fonts.bodyLarge, fontFamily: "Inter_400Regular" },
      bodyMedium: { ...theme.fonts.bodyMedium, fontFamily: "Inter_400Regular" },
      bodySmall: { ...theme.fonts.bodySmall, fontFamily: "Inter_400Regular" },
      titleLarge: { ...theme.fonts.titleLarge, fontFamily: "Inter_700Bold" },
      titleMedium: { ...theme.fonts.titleMedium, fontFamily: "Inter_500Medium" },
      titleSmall: { ...theme.fonts.titleSmall, fontFamily: "Inter_500Medium" },
    },
  };

  return (
    // Aplica o tema global do PaperProvider
    <PaperProvider theme={customTheme}>
      <NavigationContainer>
        {/* Exemplo de tela principal usando as cores do tema */}
        <View style={[styles.themeDemo, { backgroundColor: customTheme.colors.background }]}>
          <Button mode="contained-tonal" onPress={toggleTheme}>
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </Button>
          
        </View>
        <Routes />
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  themeDemo: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 999,
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    // Não defina cor fixa aqui!
  },
});

// Rotas públicas e protegidas
function Routes() {
  const { isAuthenticated } = useAuth();

  const PublicScreens = {
    Login: require("./src/screens/login").default,
    Register: require("./src/screens/register").default,
    Loading: require("./src/screens/loading").default,
    ForgetPasswordStepOne: require("./src/screens/forgetPassword/stepOne").default,
    ForgetPasswordStepTwo: require("./src/screens/forgetPassword/stepTwo").default,
    ForgetPasswordStepThree: require("./src/screens/forgetPassword/stepThree").default
  };

  const Stack = createNativeStackNavigator();

  return isAuthenticated ? (
    <ProtectedRoutes />
  ) : (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {Object.keys(PublicScreens).map((screenName) => (
        <Stack.Screen
          key={screenName}
          name={screenName}
          component={
            PublicScreens[screenName as keyof typeof PublicScreens]
          }
        />
      ))}
    </Stack.Navigator>
  );
}

