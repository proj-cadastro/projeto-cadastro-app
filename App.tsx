import 'react-native-reanimated'
import 'react-native-gesture-handler'

import React, { useState } from "react";
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
  MD3LightTheme as DefaultTheme,
  ActivityIndicator,
} from "react-native-paper";

import { ProtectedRoutes } from "./src/routes/protectedRoutes";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { AuthListener } from "./src/components/AuthListener";

const PublicScreens = {
  Login: require("./src/screens/login").default,
  Register: require("./src/screens/register").default,
  Loading: require("./src/screens/loading").default,

};

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    bodyLarge: {
      ...DefaultTheme.fonts.bodyLarge,
      fontFamily: "Inter_400Regular",
    },
    bodyMedium: {
      ...DefaultTheme.fonts.bodyMedium,
      fontFamily: "Inter_400Regular",
    },
    bodySmall: {
      ...DefaultTheme.fonts.bodySmall,
      fontFamily: "Inter_400Regular",
    },
    titleLarge: {
      ...DefaultTheme.fonts.titleLarge,
      fontFamily: "Inter_700Bold",
    },
    titleMedium: {
      ...DefaultTheme.fonts.titleMedium,
      fontFamily: "Inter_500Medium",
    },
    titleSmall: {
      ...DefaultTheme.fonts.titleSmall,
      fontFamily: "Inter_500Medium",
    },
  },
};

export default function App() {

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <AuthProvider>
      <AuthListener />
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}

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
