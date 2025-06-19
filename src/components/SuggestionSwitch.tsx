import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Switch } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedGradientWrapper } from './atoms/AnimatedGradientWrapper';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
};

export const SuggestionSwitch: React.FC<Props> = ({
  value,
  onValueChange,
  label = "Sugestões de \n     Cadastro",
}) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    {value ? (
      <AnimatedGradientWrapper style={styles.gradientWrapper}>
        <Switch
          value={true}
          onValueChange={onValueChange}
          color="#fff"
          trackColor={{ false: "#ccc", true: "transparent" }}
          thumbColor="#fff"
          style={styles.switch}
        />
      </AnimatedGradientWrapper>
    ) : (
      <Switch
        value={false}
        onValueChange={onValueChange}
        color="#D32719"
        trackColor={{ false: "#ccc", true: "#D32719" }}
        thumbColor="#fff"
        style={styles.switch}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 12,
    marginBottom: 8,
    marginRight: 8,
  },
  label: {
    marginRight: 8,
    fontSize: 10,
    color: "#333",
    fontWeight: "600",
  },
  gradientWrapper: {
    borderRadius: 20,
    padding: 2,
  },
  switch: {
    width: 48,
    height: 32,
    alignSelf: "center"
  },
});