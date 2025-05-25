import { BarChart } from "react-native-chart-kit";
import { Dimensions, View, StyleSheet, Text } from "react-native";

const screenWidth = Dimensions.get("window").width;

type Props = {
  label: string[];
  data: number[];
};

export default function BarsChart({ label, data }: Props) {
  const total = data.reduce((sum, v) => sum + v, 0);

  return (
    <View style={styles.wrapper}>
      <BarChart
        data={{
          labels: label,
          datasets: [
            {
              data: data,
            },
          ],
        }}
        width={Math.min(screenWidth * 0.9, 380)}
        height={220}
        segments={Math.max(3, Math.ceil(Math.max(...data)))}
        chartConfig={{
          fillShadowGradient: "#4F8EF7",
          fillShadowGradientOpacity: 1,
          barPercentage: 0.7,
          backgroundColor: "transparent",
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 0,
          color: (opacity = 1) => "#4F8EF7",
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#e3e3e3",
          },
          propsForLabels: {
            fontSize: 13,
          },
        }}
        yAxisSuffix={""}
        yAxisLabel={""}
        style={{
          borderRadius: 12,
        }}
        fromZero
        showValuesOnTopOfBars
        withInnerLines
      />
      <View style={styles.legendContainer}>
        {label.map((item, idx) => {
          const percent =
            total > 0 ? ((data[idx] / total) * 100).toFixed(1) : "0";
          return (
            <View key={item} style={styles.legendRow}>
              <Text style={styles.legendLabel}>
                {item} — {data[idx]} ({percent}%)
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 18,
    width: "100%",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
    marginBottom: 8,
  },
  legendLabel: {
    fontSize: 15,
    color: "#333",
  },
});