import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TextInput,
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { FormStyles } from "../../../style/FormStyles";
import { Button, Card } from "react-native-paper";
import { RouteParamsProps } from "../../../types/rootStackParamList ";
import { useProfessor } from "../../../context/ProfessorContext";
import ListPicker from "../../../components/atoms/ListPicker";
import { StatusAtividade, Titulacao } from "../../../enums/professors/professorEnum";
import { Professor } from "../../../types/professor"; // Ajuste o caminho se necessário
import { updateProfessor } from "../../../services/professors/professorService";

const EditProfessorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteParamsProps<"EditProfessors">>();
  const { id } = route.params;

  const { getProfessorById } = useProfessor();
  const professor = getProfessorById(Number(id));

  const [formData, setFormData] = useState<Professor | null>(null);

  useEffect(() => {
    if (professor) setFormData(professor);
  }, [professor]);

  const handleUpdate = async () => {
    try {
      if (formData) await updateProfessor(id, formData)
      navigation.navigate("ListProfessors" as never)
    } catch (error: any) {
      console.error(error.response?.data?.mensagem || error.message);
    }
  };

  if (!formData) {
    return (
      <SafeAreaView style={FormStyles.safeArea}>
        <Text style={FormStyles.title}>Professor não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={FormStyles.safeArea}>
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
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={FormStyles.card}>
            <Card.Content>
              <Text style={FormStyles.title}>Atualizar {professor?.nome}</Text>
              <Text style={FormStyles.description}>
                Modifique os dados conforme necessário 🙂
              </Text>

              <Text style={FormStyles.label}>Nome</Text>
              <TextInput
                style={FormStyles.input}
                placeholder="Digite o nome"
                value={formData.nome}
                onChangeText={(e) => setFormData({ ...formData, nome: e })}
              />

              <Text style={FormStyles.label}>Email</Text>
              <TextInput
                style={FormStyles.input}
                placeholder="email@exemplo.com"
                value={formData.email}
                onChangeText={(e) => setFormData({ ...formData, email: e })}
              />

              <Text style={FormStyles.label}>Titulação</Text>
              <ListPicker
                items={Object.values(Titulacao)}
                selected={formData.titulacao}
                onSelect={(titulacao: Titulacao) =>
                  setFormData({ ...formData, titulacao })
                }
              />

              <Text style={FormStyles.label}>Unidade (ID)</Text>
              <TextInput
                style={FormStyles.input}
                placeholder="Ex: 123"
                value={formData.idUnidade}
                onChangeText={(e) =>
                  setFormData({ ...formData, idUnidade: e })
                }
              />

              <Text style={FormStyles.label}>Referência</Text>
              <TextInput
                style={FormStyles.input}
                placeholder="Ex: 123"
                value={formData.referencia}
                onChangeText={(e) =>
                  setFormData({ ...formData, referencia: e })
                }
              />

              <Text style={FormStyles.label}>Lattes</Text>
              <TextInput
                style={FormStyles.input}
                placeholder="https://lattes.cnpq.br/..."
                value={formData.lattes}
                onChangeText={(e) => setFormData({ ...formData, lattes: e })}
              />

              <Text style={FormStyles.label}>Status de Atividade</Text>
              <ListPicker
                items={Object.values(StatusAtividade)}
                selected={formData.statusAtividade}
                onSelect={(statusAtividade: string) =>
                  setFormData({ ...formData, statusAtividade })
                }
              />

              {formData.observacoes &&
                <>
                  <Text style={FormStyles.label}>Observações</Text>
                  <TextInput
                    style={[FormStyles.input, { height: 80 }]}
                    placeholder="Observações adicionais"
                    value={formData.observacoes || ""}
                    onChangeText={(e) =>
                      setFormData({ ...formData, observacoes: e })
                    }
                    multiline
                  />
                </>
              }

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
    </SafeAreaView>
  );
};

export default EditProfessorScreen;
