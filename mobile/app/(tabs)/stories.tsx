import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { fetchStories } from "@/lib/api";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuroraBackground from "@/components/AuroraBackground";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Story {
  id: string;
  title: string;
  description: string;
  readingTime: string;
  tag: string;
  coverImage?: string;
}

export default function StoriesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStories = async () => {
    try {
      const data = await fetchStories();
      setStories(data || []);
    } catch (err) {
      console.error("Error loading stories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStories();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  return (
    <AuroraBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.blue} />
          }
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 90 }]}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${colors.blue}15`, borderColor: `${colors.blue}30` },
              ]}
            >
              <Ionicons name="book" size={28} color={colors.blue} />
            </View>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Stories &{"\n"}
              <Text style={{ color: colors.blue }}>Thoughts.</Text>
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Deep dives into the experiences, lessons, and philosophies that drive
              the journey.
            </Text>
          </View>

          {/* Stories Grid */}
          <View style={styles.grid}>
            {stories.length > 0 ? (
              stories.map((story, index) => (
                <View key={story.id}>
                  <Pressable
                    onPress={() => router.push(`/story/${story.id}` as any)}
                    style={({ pressed }) => [
                      styles.storyCard,
                      {
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                        opacity: pressed ? 0.95 : 1,
                        borderColor: colors.border + "60",
                      },
                    ]}
                  >
                    {story.coverImage ? (
                      <Image
                        source={{ uri: story.coverImage }}
                        style={StyleSheet.absoluteFillObject}
                        contentFit="cover"
                        transition={300}
                      />
                    ) : (
                      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.blue + "20" }]} />
                    )}

                    <LinearGradient
                      colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.85)"]}
                      style={StyleSheet.absoluteFillObject}
                    />

                    <View style={styles.storyTopTags}>
                      <BlurView intensity={70} tint="dark" style={styles.storyGlassBubble}>
                        <Ionicons name="time-outline" size={14} color="#FFF" />
                        <Text style={[styles.storyBubbleText, { color: "#FFF" }]}>{story.readingTime}</Text>
                      </BlurView>
                    </View>

                    <View style={styles.storyContentWrapper}>
                      <BlurView intensity={85} tint="dark" style={styles.storyGlassBox}>
                        <Text style={[styles.storyTag, { color: colors.blue }]}>{story.tag}</Text>
                        <Text style={[styles.storyTitle, { color: "#FFF" }]} numberOfLines={2}>
                          {story.title}
                        </Text>
                        <Text style={[styles.storyDescription, { color: "rgba(255,255,255,0.9)" }]} numberOfLines={2}>
                          {story.description}
                        </Text>
                      </BlurView>
                    </View>
                  </Pressable>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <View
                  style={[
                    styles.emptyIcon,
                    { backgroundColor: `${colors.muted}80`, borderColor: colors.border },
                  ]}
                >
                  <Ionicons name="book-outline" size={32} color={colors.mutedForeground} />
                </View>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  No stories shared yet. Be the first to share your journey!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 32,
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
  grid: {
    paddingHorizontal: 24,
    gap: 24,
  },
  storyCard: {
    width: "100%",
    height: 380,
    borderRadius: 36,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  storyTopTags: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 24,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  storyGlassBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    gap: 8,
    overflow: "hidden",
  },
  storyBubbleText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  storyContentWrapper: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    zIndex: 10,
  },
  storyGlassBox: {
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  storyTag: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 10,
  },
  storyDescription: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
