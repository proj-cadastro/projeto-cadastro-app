import React, { useState } from "react";
import { List } from "react-native-paper";

type Props<T> = {
  items: T[];
  onSelect: (value: any) => void;
  getLabel?: (item: T) => string;
  getValue?: (item: T) => any;
};

export default function ListPicker<T>({
  items,
  onSelect,
  getLabel,
  getValue,
}: Props<T>) {
  const [expanded, setExpanded] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const handlePress = () => {
    if (items.length > 0) {
      setExpanded(!expanded);
    }
  };

  const handleSelect = (item: T) => {
    const label = getLabel ? getLabel(item) : String(item);
    const value = getValue ? getValue(item) : item;

    setSelectedLabel(label);
    setExpanded(false);
    onSelect(value);
  };

  const title = items.length === 0
    ? "Não há itens"
    : selectedLabel ?? "Escolha uma opção";

  return (
    <List.Section>
      <List.Accordion
        title={title}
        expanded={expanded}
        onPress={handlePress}
        left={(props) => <List.Icon {...props} icon="menu-down" />}
      >
        {items.length > 0 &&
          items.map((item, index) => (
            <List.Item
              key={index}
              title={getLabel ? getLabel(item) : String(item)}
              onPress={() => handleSelect(item)}
            />
          ))}
      </List.Accordion>
    </List.Section>
  );
}
