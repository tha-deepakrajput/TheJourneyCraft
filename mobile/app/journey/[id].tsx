import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { fetchJourneys } from "@/lib/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuroraBackground from "@/components/AuroraBackground";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

interface JourneyData {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
  video?: string;
}

export default function JourneyDetailScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [journey, setJourney] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const journeysData = await fetchJourneys();
        const found = journeysData.find((j: any) => j.id === id);
        if (found) {
          setJourney({
            id: found.id,
            title: found.title,
            description: found.description,
            date: found.date || new Date(found.createdAt).toLocaleDateString(),
            category: found.category || "Journey",
            image: found.image,
            video: found.video,
          });
        }
      } catch (err) {
        console.error("Error loading journey:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <AuroraBackground>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AuroraBackground>
    );
  }

  if (!journey) {
    return (
      <AuroraBackground>
        <View style={styles.center}>
          <Text style={{ color: colors.mutedForeground }}>Journey not found.</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={{ color: colors.primary }}>Go Back</Text>
          </Pressable>
        </View>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        style={[styles.backButton, { top: Math.max(insets.top + 10, 50) }]}
      >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Dynamic Hero Section */}
        <View style={styles.heroContainer}>
          {journey.image ? (
            <Image
              source={{ uri: journey.image }}
              style={styles.heroImage}
              contentFit="cover"
              transition={500}
            />
          ) : (
            <View style={[styles.heroImage, { backgroundColor: colors.muted }]} />
          )}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)", colors.background]}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <View style={[styles.tag, { backgroundColor: colors.primary + "40" }]}>
              <Text style={styles.tagText}>{journey.category}</Text>
            </View>
            <Text style={styles.title}>{journey.title}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.date}>{journey.date}</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <View style={[styles.glassCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.description, { color: colors.foreground }]}>
              {journey.description}
            </Text>
          </View>
        </View>
      </ScrollView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  heroContainer: {
    width: width,
    height: height * 0.55,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
  },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  tagText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFF",
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1,
    lineHeight: 44,
    marginBottom: 16,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  date: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  glassCard: {
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  description: {
    fontSize: 18,
    lineHeight: 30,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
});
