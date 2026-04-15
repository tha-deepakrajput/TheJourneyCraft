import React, { useEffect } from "react";
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg";
import Animated, { 
  useAnimatedProps, 
  withTiming, 
  withDelay, 
  useSharedValue,
} from "react-native-reanimated";
import { View, StyleSheet } from "react-native";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function Logo({ size = 40, color = "#f97316" }: { size?: number, color?: string }) {
  const pathLength = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    pathLength.value = withDelay(300, withTiming(1, { duration: 1500 }));
    opacity.value = withDelay(500, withTiming(1, { duration: 800 }));
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: (1 - pathLength.value) * 350, // Approximation of total length
    opacity: opacity.value,
  }));

  const bgProps = useAnimatedProps(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
      >
        <Defs>
          <LinearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </LinearGradient>
          <LinearGradient id="logo-accent" x1="100%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </LinearGradient>
        </Defs>
        
        <AnimatedPath
          d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z"
          stroke="url(#logo-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="350"
          animatedProps={animatedProps}
        />
        
        <AnimatedPath
          d="M50 15 L80 30 L50 95 Z"
          fill="url(#logo-gradient)"
          animatedProps={bgProps}
        />
        <AnimatedPath
          d="M50 15 L20 30 L50 95 Z"
          fill="url(#logo-gradient)"
          opacity={0.5}
          animatedProps={bgProps}
        />
        <Circle cx="50" cy="50" r="4" fill={color} />
      </Svg>
    </View>
  );
}
