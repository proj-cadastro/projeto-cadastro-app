//está tela poderá ser utilizada tanto para sucesso de professores quanto cursos.

import React from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { FormStyles } from "../style/FormStyles";
import { Button, Card, MD3Colors, ProgressBar } from "react-native-paper";

type Props = {
  title: string;
  description: string;
  onPressFn: () => void;
};

const SuccessScreen = ({ title, description, onPressFn }: Props) => {
  return (
    <SafeAreaView style={FormStyles.safeArea}>
      <View style={FormStyles.container}>
        <Card style={[FormStyles.card, { height: "70%" }]}>
          <Card.Content>
            <Text style={FormStyles.title}>{title}</Text>
            <Text style={FormStyles.description}>{description}</Text>
          </Card.Content>

          <Card.Actions style={{ paddingTop: "65%" }}>
            <Button
              onPress={onPressFn}
              style={[FormStyles.button]}
              labelStyle={{ color: "white" }}
            >
              Concluir
            </Button>
          </Card.Actions>
          <ProgressBar progress={1} color={MD3Colors.neutral40} />
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default SuccessScreen;
