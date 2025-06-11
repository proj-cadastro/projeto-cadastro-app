import React from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Image
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";

import { FormStyles } from "../../../style/FormStyles";
import { Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const RegisterProfessorScreen = () => {
  const navigation = useNavigation();


  return (
    <SafeAreaView style={FormStyles.safeArea}>
      <View style={FormStyles.menuContainer}>
        <HamburgerMenu />
      </View>
      <View style={FormStyles.container}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Card style={[FormStyles.card, { width: "90%" }]} mode="elevated">

              <Card.Content>

                <Image
                  source={require("../../../../assets/professor.jpg")}
                  style={{ width: 300, height: 200, alignSelf: "center", marginBottom: 16 }}
                  resizeMode="contain"
                />

                <Text style={FormStyles.title}>Cadastro de Professor</Text>

                <Text style={FormStyles.description}>
                  Escolha como deseja cadastrar.
                </Text>
              </Card.Content>

              <Card.Actions
                style={{ flexDirection: "column", gap: 10, marginTop: 10 }}
              >
                <Button
                  mode="contained"
                  buttonColor="green"
                  labelStyle={{ color: "white" }}
                  style={FormStyles.button}
                  onPress={() =>
                    navigation.navigate("RegisterProfessorsStepOne" as never)
                  }
                >
                  Cadastrar Manualmente
                </Button>

                <Button
                  mode="contained"
                  buttonColor="blue"
                  labelStyle={{ color: "white" }}
                  style={FormStyles.button}
                  onPress={() => navigation.navigate("ImportProfessors" as never)}
                >
                  Importar Planilha
                </Button>
              </Card.Actions>
            </Card>
          </View>
        </ScrollView>

      </View>
    </SafeAreaView>
  );
};



export default RegisterProfessorScreen;
