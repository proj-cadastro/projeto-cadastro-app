import React, { useState } from "react";
import { List, Text } from "react-native-paper";

type Props = {
  items: string[];
  onSelect: (value: string) => void 
};

export default function ListPicker({ items, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false); // controla se o accordion está aberto
  const [selected, setSelected] = useState<string | null>(null); // guarda o item selecionado

  const handlePress = () => setExpanded(!expanded);

  const handleSelect = (title: string) => {
    setSelected(title); // salva o selecionado
    setExpanded(false); // fecha o accordion
    onSelect(title)
  };

  return (
    <>
      <List.Section>
        <List.Accordion
          title={selected ? `${selected}` : "Escolha uma Opção"}
          expanded={expanded}
          onPress={handlePress}
          left={(props) => <List.Icon {...props} icon="equal" />}
        >
          {items.map((item, index) => (
            <List.Item key={index} title={item} onPress={() => handleSelect(item)} />
          ))}
        </List.Accordion>
      </List.Section>
    </>
  );
}
