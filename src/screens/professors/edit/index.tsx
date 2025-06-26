import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView, Text, View, ScrollView, TextInput } from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { FormStyles } from "../../../style/FormStyles";
import { Button, Card } from "react-native-paper";
import { RouteParamsProps } from "../../../routes/rootStackParamList ";
import { useProfessor } from "../../../context/ProfessorContext";
import ListPicker from "../../../components/atoms/ListPicker";
import {
  StatusAtividade,
  Titulacao,
} from "../../../enums/professors/professorEnum";
import { Professor } from "../../../types/professor";
import { updateProfessor } from "../../../services/professors/professorService";
import { useThemeMode } from "../../../context/ThemeContext"; // Importa o contexto do tema
import { useToast } from "../../../utils/useToast";
import Toast from "../../../components/atoms/Toast";

const EditProfessorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteParamsProps<"EditProfessors">>();
  const { id } = route.params;

  const { getProfessorById } = useProfessor();
  const professor = getProfessorById(Number(id));

  const [formData, setFormData] = useState<Professor | null>(null);

  // Usa o contexto do tema
  const { isDarkMode } = useThemeMode();
  const { toast, showError, showSuccess, hideToast } = useToast();

  useEffect(() => {
    if (professor) setFormData(professor);
  }, [professor]);

  const handleUpdate = async () => {
    try {
      if (formData) {
        await updateProfessor(id, formData);
        showSuccess("Professor atualizado com sucesso!");
        setTimeout(() => {
          navigation.navigate("ListProfessors" as never);
        }, 1500);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.mensagem ||
        error.message ||
        "Erro ao atualizar professor";
      showError(errorMessage);
    }
  };

  if (!formData) {
    return (
      <SafeAreaView
        style={[
          FormStyles.safeArea,
          { backgroundColor: isDarkMode ? "#181818" : "#fff" },
        ]}
      >
        <Text
          style={[FormStyles.title, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          Professor não encontrado
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        FormStyles.safeArea,
        { backgroundColor: isDarkMode ? "#181818" : "#fff" },
      ]}
    >
      <View style={FormStyles.menuContainer}>
        <HamburgerMenu />
      </View>
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={FormStyles.goBackButton}
        labelStyle={{ color: "white" }}
      >
        Voltar
      </Button>

      <View style={FormStyles.container}>
        <Text
          style={[FormStyles.title, { color: isDarkMode ? "#fff" : "#000" }]}
        >
          Atualizar {professor?.nome}
        </Text>

        <Text
          style={[
            FormStyles.description,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          Modifique os dados conforme necessário 🙂
        </Text>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card
            style={[
              FormStyles.card,
              { backgroundColor: isDarkMode ? "#232323" : "#fff" },
            ]}
          >
            <Card.Content>
              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Nome
              </Text>
              <TextInput
                style={[
                  FormStyles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholder="Digite o nome"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.nome}
                onChangeText={(e) => setFormData({ ...formData, nome: e })}
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Email
              </Text>
              <TextInput
                style={[
                  FormStyles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholder="email@exemplo.com"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.email}
                onChangeText={(e) => setFormData({ ...formData, email: e })}
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Titulação
              </Text>
              <ListPicker
                items={Object.values(Titulacao)}
                selected={formData.titulacao}
                onSelect={(titulacao: Titulacao) =>
                  setFormData({ ...formData, titulacao })
                }
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Unidade (ID)
              </Text>
              <TextInput
                style={[
                  FormStyles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholder="Ex: 123"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.idUnidade}
                onChangeText={(e) => setFormData({ ...formData, idUnidade: e })}
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Referência
              </Text>
              <TextInput
                style={[
                  FormStyles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholder="Ex: 123"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.referencia}
                onChangeText={(e) =>
                  setFormData({ ...formData, referencia: e })
                }
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Lattes
              </Text>
              <TextInput
                style={[
                  FormStyles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholder="https://lattes.cnpq.br/..."
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.lattes}
                onChangeText={(e) => setFormData({ ...formData, lattes: e })}
              />

              <Text
                style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
                Status de Atividade
              </Text>
              <ListPicker
                items={Object.values(StatusAtividade)}
                selected={formData.statusAtividade}
                onSelect={(statusAtividade: string) =>
                  setFormData({ ...formData, statusAtividade })
                }
              />

              {formData.observacoes && (
                <>
                  <Text
                    style={[
                      FormStyles.label,
                      { color: isDarkMode ? "#fff" : "#000" },
                    ]}
                  >
                    Observações
                  </Text>
                  <TextInput
                    style={[
                      FormStyles.input,
                      {
                        height: 80,
                        color: isDarkMode ? "#fff" : "#000",
                        borderColor: isDarkMode ? "#444" : "#ccc",
                      },
                    ]}
                    placeholder="Observações adicionais"
                    placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                    value={formData.observacoes || ""}
                    onChangeText={(e) =>
                      setFormData({ ...formData, observacoes: e })
                    }
                    multiline
                  />
                </>
              )}
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={handleUpdate}
                style={FormStyles.button}
                labelStyle={{ color: "white" }}
              >
                Atualizar
              </Button>
            </Card.Actions>
          </Card>
        </ScrollView>
      </View>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
    </SafeAreaView>
  );
};

export default EditProfessorScreen;
