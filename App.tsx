import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Screens } from "./src/types/screens";
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

const screens = {
  Login: require("./src/screens/login").default,
  Register: require("./src/screens/register").default,
  Loading: require("./src/screens/loading").default,
  Home: require("./src/screens/home").default,
  ListProfessors: require("./src/screens/professors/list").default,
  RegisterProfessors: require("./src/screens/professors/register").default,
  EditProfessors: require("./src/screens/professors/edit").default,
  ListCourses: require("./src/screens/courses/list").default,
  RegisterCourses: require("./src/screens/courses/register").default,
  EditCourses: require("./src/screens/courses/edit").default,
};

const Stack = createNativeStackNavigator();

// Cria tema com Inter como fonte padrão
const theme = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    bodyLarge: { ...DefaultTheme.fonts.bodyLarge, fontFamily: "Inter_400Regular" },
    bodyMedium: { ...DefaultTheme.fonts.bodyMedium, fontFamily: "Inter_400Regular" },
    bodySmall: { ...DefaultTheme.fonts.bodySmall, fontFamily: "Inter_400Regular" },
    titleLarge: { ...DefaultTheme.fonts.titleLarge, fontFamily: "Inter_700Bold" },
    titleMedium: { ...DefaultTheme.fonts.titleMedium, fontFamily: "Inter_500Medium" },
    titleSmall: { ...DefaultTheme.fonts.titleSmall, fontFamily: "Inter_500Medium" },
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
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Loading"
          screenOptions={{ headerShown: false }}
        >
          {Object.keys(screens).map((screenName) => (
            <Stack.Screen
              key={screenName}
              name={screenName}
              component={screens[screenName as keyof Screens]}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
