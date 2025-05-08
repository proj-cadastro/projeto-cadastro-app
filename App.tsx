import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

type Screens = {
  Login: React.ComponentType<any>;
  Register: React.ComponentType<any>;
  Loading: React.ComponentType<any>;
};

const screens = {
  Login: require("./src/screens/login").default,
  Register: require("./src/screens/register").default,
  Loading: require("./src/screens/loading").default,
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
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
    </>
  );
}
