import React, { useEffect, useState } from "react";
import { List } from "react-native-paper";

type Props<T> = {
  items: T[];
  onSelect: (value: any) => void;
  selected?: T; // ✅ nova prop
  getLabel?: (item: T) => string;
  getValue?: (item: T) => any;
};

export default function ListPicker<T>({
  items,
  onSelect,
  selected,
  getLabel,
  getValue,
}: Props<T>) {
  const [expanded, setExpanded] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  // Atualiza o label quando a prop `selected` mudar
  useEffect(() => {
    if (selected) {
      const label = getLabel ? getLabel(selected) : String(selected);
      setSelectedLabel(label);
    }
  }, [selected, getLabel]);

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

  const title =
    items.length === 0 ? "Não há itens" : selectedLabel ?? "Escolha uma opção";

  return (
    <List.Section>
      <List.Accordion
        title={title}
        expanded={expanded}
        onPress={handlePress}
        left={(props) => <List.Icon {...props} icon="menu-down" />}
      >
        {items.map((item, index) => (
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
