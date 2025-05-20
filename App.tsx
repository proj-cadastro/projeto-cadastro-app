import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Screens } from "./src/types/screens";

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
