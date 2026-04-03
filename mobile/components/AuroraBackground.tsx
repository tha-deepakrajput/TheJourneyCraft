import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/lib/theme";

const { width, height } = Dimensions.get("window");

export default function AuroraBackground({ children }: { children?: React.ReactNode }) {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];

  // Animation values for blobs
  const blob1Pos = useSharedValue({ x: 0, y: 0 });
  const blob2Pos = useSharedValue({ x: 0, y: 0 });
  const blob3Pos = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    // Blob 1 Animation
    blob1Pos.value = withRepeat(
      withSequence(
        withTiming({ x: 50, y: 30 }, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
        withTiming({ x: -30, y: 50 }, { duration: 12000, easing: Easing.inOut(Easing.sin) }),
        withTiming({ x: 0, y: 0 }, { duration: 10000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Blob 2 Animation
    blob2Pos.value = withRepeat(
      withSequence(
        withTiming({ x: -60, y: -40 }, { duration: 15000, easing: Easing.inOut(Easing.sin) }),
        withTiming({ x: 40, y: -60 }, { duration: 13000, easing: Easing.inOut(Easing.sin) }),
        withTiming({ x: 0, y: 0 }, { duration: 15000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const animatedBlob1 = useAnimatedStyle(() => ({
    transform: [{ translateX: blob1Pos.value.x }, { translateY: blob1Pos.value.y }],
  }));

  const animatedBlob2 = useAnimatedStyle(() => ({
    transform: [{ translateX: blob2Pos.value.x }, { translateY: blob2Pos.value.y }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Aurora Blobs */}
      <Animated.View style={[styles.blob, styles.blob1, animatedBlob1]}>
        <LinearGradient
          colors={[colors.orange + "80", colors.orange + "00"]}
          style={styles.gradient}
        />
      </Animated.View>

      <Animated.View style={[styles.blob, styles.blob2, animatedBlob2]}>
        <LinearGradient
          colors={[colors.blue + "60", colors.blue + "00"]}
          style={styles.gradient}
        />
      </Animated.View>

      <View style={[styles.blob, styles.blob3]}>
        <LinearGradient
          colors={[colors.purple + "40", colors.purple + "00"]}
          style={styles.gradient}
        />
      </View>

      {/* Grid Overlay */}
      <View style={styles.gridOverlay}>
        <View style={[styles.gridLine, { width: "100%", height: 1 }]} />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: (width * 1.5) / 2,
    opacity: 0.5,
  },
  blob1: {
    top: -width * 0.5,
    left: -width * 0.5,
  },
  blob2: {
    bottom: -width * 0.6,
    right: -width * 0.6,
  },
  blob3: {
    top: height * 0.2,
    right: -width * 0.3,
    width: width,
    height: width,
  },
  gradient: {
    flex: 1,
    borderRadius: (width * 1.5) / 2,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    // Note: Complex dot grid is harder in pure RN without Skia, 
    // so we'll use a subtle opacity for now.
  },
  gridLine: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
});
