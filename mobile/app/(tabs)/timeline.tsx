import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { fetchJourneys } from "@/lib/api";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import AuroraBackground from "@/components/AuroraBackground";

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
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.orange} />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
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
        </Animated.View>

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
              <Animated.View
                key={journey.id}
                entering={FadeInUp.delay(index * 100).duration(600)}
                style={[
                  styles.timelineCard,
                  {
                    backgroundColor: colors.card + "90",
                    borderColor: colors.border + "40",
                  },
                  index % 2 === 0 ? styles.cardLeft : styles.cardRight,
                ]}
              >
                {/* Timeline dot */}
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: colors.orange,
                      borderColor: colors.background,
                      left: index % 2 === 0 ? -8 : undefined,
                      right: index % 2 !== 0 ? -8 : undefined,
                    },
                  ]}
                />

                {journey.image ? (
                  <Image
                    source={{ uri: journey.image }}
                    style={styles.cardImage}
                    contentFit="cover"
                    transition={300}
                  />
                ) : null}

                <View style={styles.cardContent}>
                  <Text style={[styles.cardDate, { color: colors.orange }]}>
                    {journey.date}
                  </Text>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                    {journey.title}
                  </Text>
                  <Text
                    style={[styles.cardDescription, { color: colors.mutedForeground }]}
                    numberOfLines={3}
                  >
                    {journey.description}
                  </Text>
                  {journey.location ? (
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
                      <Text style={[styles.locationText, { color: colors.mutedForeground }]}>
                        {journey.location}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </Animated.View>
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
    paddingHorizontal: 24,
    position: "relative",
  },
  verticalLine: {
    position: "absolute",
    left: SCREEN_WIDTH / 2 - 1,
    top: 0,
    bottom: 0,
    width: 2,
    borderRadius: 1,
  },
  timelineCard: {
    width: SCREEN_WIDTH / 2 - 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardLeft: {
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  cardRight: {
    alignSelf: "flex-end",
    marginRight: 8,
  },
  timelineDot: {
    position: "absolute",
    top: 20,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    zIndex: 10,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardContent: {
    padding: 14,
  },
  cardDate: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "500",
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
