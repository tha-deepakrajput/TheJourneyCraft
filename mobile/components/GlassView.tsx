import React from "react";
import { View, StyleSheet, ViewStyle, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useColorScheme } from "react-native";
import { Colors } from "@/lib/theme";

interface GlassViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export default function GlassView({ children, style, intensity = 40 }: GlassViewProps) {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { borderColor: colors.border + "40" }, style]}>
      {Platform.OS !== "android" ? (
        <BlurView intensity={intensity} style={StyleSheet.absoluteFill} tint={colorScheme} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colorScheme === "dark" ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)" }]} />
      )}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 24,
    borderWidth: 1,
    position: "relative",
  },
});
