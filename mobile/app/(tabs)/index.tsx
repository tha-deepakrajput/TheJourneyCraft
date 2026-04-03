import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from "react-native";
import { Colors } from "@/lib/theme";
import { Link } from "expo-router";
import { Compass, ArrowRight } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import AuroraBackground from "@/components/AuroraBackground";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];

  return (
    <AuroraBackground>
      <View style={styles.container}>
        <Animated.View 
          entering={FadeInDown.delay(300).duration(1000)}
          style={styles.content}
        >
          {/* Badge */}
          <View style={[styles.badge, { backgroundColor: colors.background + "80", borderColor: colors.border + "30" }]}>
            <View style={[styles.pulseDot, { backgroundColor: colors.orange }]} />
            <Text style={[styles.badgeText, { color: colors.foreground }]}>
              A cinematic digital museum
            </Text>
          </View>

          {/* Hero Title */}
          <Text style={[styles.title, { color: colors.foreground }]}>
            Memories in{"\n"}
            <Text style={{ color: colors.mutedForeground }}>Motion.</Text>
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Chronicle your adventures with breathtaking elegance. Explore a curated timeline of journeys that shaped the world.
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <Link href="./timeline" asChild>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              >
                <Compass color={colors.primaryForeground} size={20} style={{ marginRight: 8 }} />
                <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
                  Start Exploring
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href="/submit" asChild>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.secondaryButton, { borderColor: colors.border + "40" }]}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>
                  Share a Story
                </Text>
                <ArrowRight color={colors.foreground} size={18} style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>

        {/* Decorative Scroll Line */}
        <Animated.View 
          entering={FadeInDown.delay(1500).duration(1000)}
          style={styles.scrollIndicator}
        >
          <View style={[styles.scrollLine, { backgroundColor: colors.primary + "40" }]} />
        </Animated.View>
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: {
    alignItems: "center",
    width: "100%",
    marginTop: -80,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    marginBottom: 32,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  title: {
    fontSize: width > 400 ? 56 : 48,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: width > 400 ? 64 : 54,
    letterSpacing: -2,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "300",
    maxWidth: 300,
    marginBottom: 40,
  },
  actions: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    height: 60,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
  },
  secondaryButton: {
    height: 60,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
  scrollIndicator: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  scrollLine: {
    width: 1,
    height: 60,
  },
});
