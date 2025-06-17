import { SafeAreaView, View, Text } from "react-native";
import HamburgerMenu from "../../../../components/HamburgerMenu";
import { FormStyles } from "../../../../style/FormStyles";
import { Button, Card, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import { DocPicker } from "../../../../components/atoms/DocPicker";
import { downloadProfessorXlsFile } from "../../../../services/file/fileService";

const ImportProfessors = () => {
  const navigation = useNavigation();
  const { colors } = useTheme(); // <-- Hook do tema

  return (
    <SafeAreaView style={[FormStyles.safeArea, { backgroundColor: colors.background }]}>
      <View style={FormStyles.menuContainer}>
        <HamburgerMenu />
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10 }}>
        <Button
          onPress={() => navigation.goBack()}
          style={FormStyles.goBackButton}
          labelStyle={{ color: colors.onPrimary }}
        >
          Voltar
        </Button>
        <Card style={[FormStyles.card, { backgroundColor: colors.elevation.level1 }]} mode="elevated">
          <Card.Content>
            <LottieView
              source={require("../../../../../assets/animation2.json")}
              autoPlay
              loop
              style={{
                width: "100%",
                height: 150,
                alignSelf: "center",
                marginBottom: 16,
              }}
            />
            <Text style={[FormStyles.title, { color: colors.onBackground }]}>Importar Planilha</Text>
            <Text style={[FormStyles.description, { color: colors.onBackground }]}>
              Siga os passos abaixo para importar seus professores usando uma planilha.
            </Text>
            <Text style={[FormStyles.description, { marginTop: 20, color: colors.onBackground }]}>
              Clique no botão de baixar planilha modelo abaixo e preencha os dados.
            </Text>
            <Button
              mode="contained"
              buttonColor={colors.primary}
              labelStyle={{ color: colors.onPrimary }}
              style={[FormStyles.button, { backgroundColor: colors.primary }]}
              onPress={downloadProfessorXlsFile}
            >
              Baixar Planilha Modelo
            </Button>
            <Text style={[FormStyles.description, { marginTop: 30, color: colors.onBackground }]}>
              Importe a planilha com os dados que você preencheu.
            </Text>
            <DocPicker />
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default ImportProfessors;