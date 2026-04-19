import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { BlurView } from "expo-blur";
import { fetchJourneys } from "@/lib/api";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuroraBackground from "@/components/AuroraBackground";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Journey {
  id: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  date: string;
  location?: string;
  category?: string;
}

export default function TimelineScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadJourneys = async () => {
    try {
      const data = await fetchJourneys();
      setJourneys(data);
    } catch (err) {
      console.error("Error loading journeys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneys();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadJourneys();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  return (
    <AuroraBackground>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.orange} />
        }
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 90 }]}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${colors.orange}15`, borderColor: `${colors.orange}30` },
            ]}
          >
            <Ionicons name="compass" size={28} color={colors.orange} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            The Journey{"\n"}
            <Text style={{ color: colors.orange }}>Timeline.</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Explore the milestones, challenges, and beautiful moments that shaped
            this incredible story across time.
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {/* Vertical Line */}
          <View
            style={[
              styles.verticalLine,
              {
                backgroundColor: `${colors.orange}30`,
              },
            ]}
          />

          {journeys.length > 0 ? (
            journeys.map((journey, index) => (
              <View key={journey.id} style={styles.timelineRow}>
                <View style={styles.timelineDotContainer}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: colors.orange,
                        borderColor: colors.background,
                      },
                    ]}
                  />
                </View>

                <View
                  style={[
                    styles.timelineCard,
                    {
                      borderColor: colors.border + "60",
                    },
                  ]}
                >
                  {journey.image ? (
                    <Image
                      source={{ uri: journey.image }}
                      style={StyleSheet.absoluteFillObject}
                      contentFit="cover"
                      transition={300}
                    />
                  ) : (
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.orange + "20" }]} />
                  )}

                  <LinearGradient
                    colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.85)"]}
                    style={StyleSheet.absoluteFillObject}
                  />

                  <View style={styles.cardContentWrapper}>
                    <BlurView intensity={85} tint="dark" style={styles.cardGlassBox}>
                      <Text style={[styles.cardDate, { color: colors.orange }]}>
                        {journey.date}
                      </Text>
                      <Text style={[styles.cardTitle, { color: "#FFF" }]} numberOfLines={2}>
                        {journey.title}
                      </Text>
                      <Text style={[styles.cardDescription, { color: "rgba(255,255,255,0.9)" }]} numberOfLines={2}>
                        {journey.description}
                      </Text>
                      {journey.location ? (
                        <View style={styles.locationRow}>
                          <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.7)" />
                          <Text style={[styles.locationText, { color: "rgba(255,255,255,0.7)" }]}>
                            {journey.location}
                          </Text>
                        </View>
                      ) : null}
                    </BlurView>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No milestones have been added to the journey yet.
              </Text>
            </View>
          )}
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
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1.5,
    lineHeight: 48,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 340,
    fontWeight: "300",
  },
  timelineContainer: {
    paddingHorizontal: 0,
    position: "relative",
  },
  verticalLine: {
    position: "absolute",
    left: 40,
    top: 0,
    bottom: 0,
    width: 2,
    borderRadius: 1,
  },
  timelineRow: {
    flexDirection: "row",
    marginBottom: 40,
  },
  timelineDotContainer: {
    width: 82,
    alignItems: "center",
    paddingTop: 36,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 4,
    zIndex: 10,
  },
  timelineCard: {
    flex: 1,
    height: 380,
    marginRight: 24,
    borderRadius: 36,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  cardContentWrapper: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  cardGlassBox: {
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  cardDate: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },
});
