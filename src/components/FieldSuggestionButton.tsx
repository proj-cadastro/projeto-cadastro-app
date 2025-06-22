import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = {
  onPress: () => void;
};

export const FieldSuggestionButton: React.FC<Props> = ({ onPress }) => (
  <Button
    mode="contained"
    compact
    onPress={onPress}
    style={styles.suggestionButtonCustom}
    labelStyle={styles.suggestionButtonLabel}
    contentStyle={styles.suggestionButtonContent}
  >
    <Icon name="check" size={26} color="#fff" />
  </Button>
);

const styles = StyleSheet.create({
  suggestionButtonCustom: {
    marginLeft: 8,
    height: 38,
    width: 38,
    borderRadius: 8,
    backgroundColor: "#D32719",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    flexShrink: 0,
    marginBottom: 12,
  },
  suggestionButtonLabel: {
    fontSize: 0,
    padding: 0,
  },
  suggestionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
});