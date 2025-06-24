import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CourseProvider } from "../context/CourseContext";
import { ProfessorProvider } from "../context/ProfessorContext";
import { SuggestionSwitchProvider } from "../context/SuggestionSwitchContext";

const Stack = createNativeStackNavigator();

const screens = {
  Home: require("../screens/home").default,
  SupportPage: require("../screens/support").default,
  ListProfessors: require("../screens/professors/list").default,
  EditProfessors: require("../screens/professors/edit").default,
  RegisterProfessorsIndex: require("../screens/professors/register").default,
  RegisterProfessorsStepOne: require("../screens/professors/register/stepOne").default,
  RegisterProfessorsStepTwo: require("../screens/professors/register/stepTwo").default,
  RegisterProfessorsFinished: require("../screens/professors/register/finished").default,
  ImportProfessors: require("../screens/professors/register/import").default,
  DetailsProfessors: require("../screens/professors/details").default,
  RegisterCursosIndex: require("../screens/courses/register").default,
  RegisterCursosStepOne: require("../screens/courses/register/stepOne").default,
  RegisterCourseStepTwo: require("../screens/courses/register/stepTwo").default,
  RegisterCursosFinished: require("../screens/courses/register/finished").default,
  EditCourses: require("../screens/courses/edit").default,
  ListCourses: require("../screens/courses/list").default,
};

export function ProtectedRoutes() {
  return (
    <CourseProvider>
      <ProfessorProvider>
        <SuggestionSwitchProvider>
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
        </SuggestionSwitchProvider>
      </ProfessorProvider>
    </CourseProvider>
  );
}