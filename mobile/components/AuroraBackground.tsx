import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
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
import { useTheme } from "@/lib/theme-context";

const { width, height } = Dimensions.get("window");

export default function AuroraBackground({ children }: { children?: React.ReactNode }) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  // Animation values for blobs
  const blob1X = useSharedValue(0);
  const blob1Y = useSharedValue(0);
  const blob2X = useSharedValue(0);
  const blob2Y = useSharedValue(0);

  useEffect(() => {
    // Blob 1 Animation
    blob1X.value = withRepeat(
      withSequence(
        withTiming(50, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-30, { duration: 12000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    blob1Y.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
        withTiming(50, { duration: 12000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 10000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Blob 2 Animation
    blob2X.value = withRepeat(
      withSequence(
        withTiming(-60, { duration: 15000, easing: Easing.inOut(Easing.sin) }),
        withTiming(40, { duration: 13000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 15000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    blob2Y.value = withRepeat(
      withSequence(
        withTiming(-40, { duration: 15000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-60, { duration: 13000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 15000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const animatedBlob1 = useAnimatedStyle(() => ({
    transform: [{ translateX: blob1X.value }, { translateY: blob1Y.value }],
  }));

  const animatedBlob2 = useAnimatedStyle(() => ({
    transform: [{ translateX: blob2X.value }, { translateY: blob2Y.value }],
  }));

  const BlobContainer = Platform.OS === "web" ? View : Animated.View;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Aurora Blobs */}
      <BlobContainer style={[styles.blob, styles.blob1, Platform.OS === "web" ? {} : animatedBlob1]}>
        <LinearGradient
          colors={[colors.orange + "80", colors.orange + "00"]}
          style={styles.gradient}
        />
      </BlobContainer>

      <BlobContainer style={[styles.blob, styles.blob2, Platform.OS === "web" ? {} : animatedBlob2]}>
        <LinearGradient
          colors={[colors.blue + "60", colors.blue + "00"]}
          style={styles.gradient}
        />
      </BlobContainer>

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
