// src/routes/ProtectedRoutes.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Screens } from "../types/screens";
import { CourseProvider } from "../context/CourseContext";
import { ProfessorProvider } from "../context/ProfessorContext";

// Importe as telas privadas
const Stack = createNativeStackNavigator();

const screens = {
  Home: require("../screens/home").default,
  ListProfessors: require("../screens/professors/list").default,
  EditProfessors: require("../screens/professors/edit").default,
  RegisterProfessorsIndex: require("../screens/professors/register").default,
  RegisterProfessorsStepOne: require("../screens/professors/register/stepOne").default,
  RegisterProfessorsStepTwo: require("../screens/professors/register/stepTwo").default,
  RegisterProfessorsFinished: require("../screens/professors/register/finished").default,
  RegisterCursosIndex: require("../screens/courses/register").default,
  RegisterCursosStepOne: require("../screens/courses/register/stepOne").default,
  RegisterCursosStepTwo: require("../screens/courses/register/stepTwo").default,
  RegisterCursosFinished: require("../screens/courses/register/finished").default,
  EditCursos: require("../screens/courses/edit").default,
  ListCourses: require("../screens/courses/list").default,
};

export function ProtectedRoutes() {
  return (
    <CourseProvider>
      <ProfessorProvider>
        <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
          {Object.keys(screens).map((screenName) => (
            <Stack.Screen
              key={screenName}
              name={screenName}
              component={screens[screenName as keyof typeof screens]}
            />
          ))}
        </Stack.Navigator>
      </ProfessorProvider>
    </CourseProvider>
  );
}
