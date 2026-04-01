import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { apiFetch } from "@/lib/api";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

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
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStories = async () => {
    try {
      // We'll use the submissions endpoint and filter on our end
      // since the web app does direct DB queries for approved stories
      const data = await apiFetch("/api/journeys");
      // For now, show journeys as "stories" since the submissions API
      // doesn't have a public GET for approved submissions yet.
      // You can add /api/submissions/approved later.
      setStories(
        (data.journeys || []).map((j: any) => ({
          id: j.id,
          title: j.title,
          description: j.description,
          readingTime: `${Math.max(1, Math.ceil((j.description?.split(" ").length || 0) / 200))} min read`,
          tag: j.category || "Story",
          coverImage: j.image || undefined,
        }))
      );
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
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.blue} />
      }
    >
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
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
      </Animated.View>

      {/* Stories Grid */}
      <View style={styles.grid}>
        {stories.length > 0 ? (
          stories.map((story, index) => (
            <Animated.View
              key={story.id}
              entering={FadeInUp.delay(index * 80).duration(500)}
            >
              <Pressable
                onPress={() => router.push(`/story/${story.id}` as any)}
                style={({ pressed }) => [
                  styles.storyCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                {story.coverImage ? (
                  <Image
                    source={{ uri: story.coverImage }}
                    style={styles.storyImage}
                    contentFit="cover"
                    transition={300}
                  />
                ) : (
                  <View
                    style={[
                      styles.storyImagePlaceholder,
                      { backgroundColor: `${colors.blue}10` },
                    ]}
                  >
                    <Ionicons name="book-outline" size={32} color={`${colors.blue}50`} />
                  </View>
                )}

                <View style={styles.storyContent}>
                  <View style={styles.tagRow}>
                    <View
                      style={[styles.tag, { backgroundColor: `${colors.blue}20` }]}
                    >
                      <Text style={[styles.tagText, { color: colors.blue }]}>
                        {story.tag}
                      </Text>
                    </View>
                    <Text style={[styles.readingTime, { color: colors.mutedForeground }]}>
                      {story.readingTime}
                    </Text>
                  </View>
                  <Text
                    style={[styles.storyTitle, { color: colors.foreground }]}
                    numberOfLines={2}
                  >
                    {story.title}
                  </Text>
                  <Text
                    style={[styles.storyDescription, { color: colors.mutedForeground }]}
                    numberOfLines={2}
                  >
                    {story.description}
                  </Text>
                </View>
              </Pressable>
            </Animated.View>
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
    paddingHorizontal: 20,
    gap: 16,
  },
  storyCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  storyImage: {
    width: "100%",
    height: 180,
  },
  storyImagePlaceholder: {
    width: "100%",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  storyContent: {
    padding: 16,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
  },
  readingTime: {
    fontSize: 12,
    fontWeight: "500",
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  storyDescription: {
    fontSize: 14,
    lineHeight: 20,
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
