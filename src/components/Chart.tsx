import { BarChart } from "react-native-chart-kit";
import { Dimensions, View, Text } from "react-native";
 
const screenWidth = Dimensions.get("window").width;
 
type Props = {
  label: string[];
  data: number[];
};
 
export default function BarsChart({ label, data }: Props) {
  return (
    <View>
      <Text>Relação de Professores e suas Especialidades</Text>
      <BarChart
        data={{
          labels: label,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={screenWidth}
        height={220}
        segments={Math.ceil(Math.max(...data))}
        chartConfig={{
          fillShadowGradient: "#87CEEB",
          fillShadowGradientOpacity: 1,
          barPercentage: 1,
          horizontalLabelRotation: 90,
          backgroundColor: "transparent",
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 50, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        yAxisSuffix={""}
        yAxisLabel={""}
      />
    </View>
  );
}