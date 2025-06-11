import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { useProfessor } from "../../../context/ProfessorContext";
import { TableStyle } from "../../../style/TableStyle";
import { FormStyles } from "../../../style/FormStyles";
import { NavigationProp } from "../../../routes/rootStackParamList ";

const DetailsProfessors = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<{ params: { id: number } }, "params">>();
  const { professors } = useProfessor();

  const id = route.params?.id;
  const professor = professors.find((p) => p.id === id);

  return (
    <SafeAreaView>
      <View style={TableStyle.menuContainer}>
        <HamburgerMenu />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginTop: 10,
        }}
      >
        <Button
          onPress={() => navigation.goBack()}
          style={FormStyles.goBackButton}
          labelStyle={{ color: "white" }}
        >
          Voltar
        </Button>
      </View>
      <Text
        style={[
          TableStyle.title,
          {
            marginBottom: 20,
            marginTop: 20,
            textAlign: "center",
            paddingHorizontal: 18,
          },
        ]}
      >
        Detalhes do Professor
      </Text>
      {professor ? (
        <View
          style={{
            marginTop: 10,
            marginHorizontal: 8,
            padding: 24,
            borderRadius: 20,
            backgroundColor: "#fff",
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#22223b",
              marginBottom: 12,
              letterSpacing: 0.5,
            }}
          >
            {professor.nome}
          </Text>
          <View style={{ marginBottom: 16 }}>
            <InfoLine label="Email" value={professor.email} />
            <InfoLine label="Titulação" value={professor.titulacao} />
            <InfoLine label="Status" value={professor.statusAtividade} />
            <InfoLine label="Referência" value={professor.referencia} />
            <InfoLine label="ID Unidade" value={professor.idUnidade} />
            <InfoLine
              label="Lattes"
              value={professor.lattes}
              valueStyle={{
                color: "#007bff",
                textDecorationLine: "underline",
              }}
            />
            <InfoLine
              label="Observações"
              value={professor.observacoes || "Nenhuma"}
              valueStyle={{ fontStyle: "italic", color: "#6c757d" }}
            />
          </View>
          {professor.cursoCoordenado ? (
            <View
              style={{
                marginTop: 10,
                padding: 14,
                backgroundColor: "#f1f3f6",
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: "#007bff",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  marginBottom: 6,
                  color: "#22223b",
                }}
              >
                Curso Coordenado
              </Text>
              <InfoLine label="Nome" value={professor.cursoCoordenado.nome} />
              <InfoLine label="Sigla" value={professor.cursoCoordenado.sigla} />
              <InfoLine
                label="Código"
                value={professor.cursoCoordenado.codigo}
              />
              <InfoLine
                label="Modelo"
                value={professor.cursoCoordenado.modelo}
              />
              <InfoLine
                label="ID"
                value={professor.cursoCoordenado.id?.toString()}
              />
            </View>
          ) : (
            <Text
              style={{
                marginTop: 10,
                color: "#888",
                textAlign: "center",
              }}
            >
              Não coordena nenhum curso.
            </Text>
          )}
        </View>
      ) : (
        <Text style={TableStyle.emptyText}>Professor não encontrado.</Text>
      )}

      <View style={{ margin: 16 }}>
        <Button
          mode="contained"
          onPress={() => {
            if (professor?.id)
              navigation.navigate("EditProfessors", {
                id: professor.id,
              });
          }}
          style={FormStyles.button}
        >
          Editar Professor
        </Button>
      </View>
    </SafeAreaView>
  );
};

const InfoLine = ({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: any;
}) => (
  <View style={{ flexDirection: "row", marginBottom: 6 }}>
    <Text
      style={{
        fontWeight: "600",
        color: "#495057",
        width: 110,
      }}
    >
      {label}:
    </Text>
    <Text
      style={[{ color: "#22223b", flex: 1 }, valueStyle]}
      numberOfLines={2}
      ellipsizeMode="tail"
    >
      {value}
    </Text>
  </View>
);

export default DetailsProfessors;
