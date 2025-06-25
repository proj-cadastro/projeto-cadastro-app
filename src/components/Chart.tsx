import { BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions, View, StyleSheet, Text, Animated } from "react-native";
import React, { useRef, useEffect } from "react";

const screenWidth = Dimensions.get("window").width;

type ChartColors = {
  cardBg?: string;
  legendBg?: string;
  legendFont?: string;
  legendValue?: string;
  legendPercent?: string;
  legendSeparator?: string;
  barBgLine?: string;
  chartLabel?: string;
};

type Props = {
  label: string[];
  data: number[];
  chartType?: "bar" | "pie";
  backgroundColor?: string;
  isDarkMode?: boolean;
  colors?: ChartColors;
  getColorByIndex?: (idx: number) => string;
};

const defaultColorsLight: ChartColors = {
  cardBg: "#fff",
  legendBg: "#fff",
  legendFont: "#333",
  legendValue: "#333",
  legendPercent: "#888",
  legendSeparator: "#bbb",
  barBgLine: "#e3e3e3",
  chartLabel: "#333",
};

const defaultColorsDark: ChartColors = {
  cardBg: "#2d2d2d",
  legendBg: "#232323",
  legendFont: "#fff",
  legendValue: "#fff",
  legendPercent: "#ccc",
  legendSeparator: "#888",
  barBgLine: "#444",
  chartLabel: "#fff",
};

function defaultGetColorByIndex(idx: number) {
  const palette = [
    "#1976D2", "#388E3C", "#7B1FA2", "#FBC02D", "#E64A19", "#C2185B", "#FFA000"
  ];
  return palette[idx % palette.length];
}

export default function BarsChart({
  label,
  data,
  chartType = "bar",
  backgroundColor,
  isDarkMode = false,
  colors,
  getColorByIndex = defaultGetColorByIndex,
}: Props) {
  const themeColors = {
    ...(isDarkMode ? defaultColorsDark : defaultColorsLight),
    ...colors,
  };

  const total = data.reduce((sum, v) => sum + v, 0);
  const max = Math.max(...data);
  const min = Math.min(...data);

  const yLabels =
    max === min
      ? [min, min + 1, min + 2, min + 3, min + 4]
      : Array.from({ length: 5 }, (_, i) => min + ((max - min) * i) / 4);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [chartType, label, data]);

  const chartBg = backgroundColor ?? themeColors.cardBg;
  const cardBorderColor = isDarkMode ? "#444" : "black";

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, backgroundColor: chartBg, borderColor: cardBorderColor }]}>
      {chartType === "bar" ? (
        <BarChart
          data={{
            labels: label,
            datasets: [
              {
                data: data,
                colors: data.map((_, idx) => () => getColorByIndex(idx)),
              },
            ],
          }}
          width={Math.min(screenWidth * 0.8, 380)}
          height={230}
          segments={4}
          fromZero
          showValuesOnTopOfBars
          withInnerLines
          yAxisSuffix={""}
          yAxisLabel={""}
          style={{
            borderRadius: 12,
          }}
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFrom: chartBg,
            backgroundGradientTo: chartBg,
            decimalPlaces: 0,
            color: (opacity = 1) => getColorByIndex(0),
            labelColor: (opacity = 1) => isDarkMode ? "#fff" : "#222", // Preto no claro, branco no escuro
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: "#222",
            },
            propsForLabels: {
              fontSize: 13,
            },
            formatYLabel: (yValue) => {
              const y = Number(yValue);
              return yLabels.some((val) => Math.round(val) === Math.round(y))
                ? String(Math.round(y))
                : "";
            },
          }}
          verticalLabelRotation={0}
        />
      ) : (
        <PieChart
          data={label.map((item, idx) => ({
            name: item,
            population: data[idx],
            color: getColorByIndex(idx),
            legendFontColor: themeColors.legendFont,
            legendFontSize: 14,
          }))}
          width={Math.min(screenWidth * 0.8, 320)}
          height={200}
          chartConfig={{
            color: () => "#F44336",
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"10"}
          absolute
        />
      )}
      <View style={styles.legendContainer}>
        {label.map((item, idx) => {
          const percent = total > 0 ? Math.round((data[idx] / total) * 100) : 0;
          const color = getColorByIndex(idx);
          return (
            <View
              key={item}
              style={[
                styles.legendCard,
                {
                  borderColor: color,
                  shadowColor: color,
                  backgroundColor: themeColors.legendBg,
                },
              ]}
            >
              <View style={styles.legendRow}>
                <Text style={[styles.legendLabel, { color }]}>{item}</Text>
                <Text style={[styles.legendSeparator, { color: themeColors.legendSeparator }]}>|</Text>
                <Text style={[styles.legendValue, { color: themeColors.legendValue }]}>{data[idx]}</Text>
                <Text style={[styles.legendSeparator, { color: themeColors.legendSeparator }]}>|</Text>
                <Text style={[styles.legendPercent, { color: themeColors.legendPercent }]}>{percent}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#D32719",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    marginBottom: 24,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 18,
    width: "100%",
  },
  legendCard: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 12,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendLabel: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 4,
  },
  legendValue: {
    fontSize: 15,
    color: "#333",
    marginLeft: 4,
    marginRight: 4,
    fontWeight: "bold",
  },
  legendPercent: {
    fontSize: 15,
    color: "#888",
    marginLeft: 4,
    fontWeight: "bold",
  },
  legendSeparator: {
    fontSize: 15,
    color: "#bbb",
    marginHorizontal: 4,
    fontWeight: "bold",
  },
});