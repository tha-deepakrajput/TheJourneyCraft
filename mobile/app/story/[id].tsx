import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { apiFetch } from "@/lib/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

interface StoryData {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readingTime: string;
  category: string;
  images: string[];
  video: string | null;
}

export default function StoryDetailScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Use the journey data since we're showing journeys as stories
        const data = await apiFetch(`/api/journeys`);
        const found = (data.journeys || []).find((j: any) => j.id === id);
        if (found) {
          setStory({
            id: found.id,
            title: found.title,
            content: found.description,
            author: "JourneyCraft",
            date: found.date || new Date(found.createdAt).toLocaleDateString(),
            readingTime: `${Math.max(1, Math.ceil((found.description?.split(" ").length || 0) / 200))} min read`,
            category: found.category || "Story",
            images: found.image ? [found.image] : [],
            video: found.video || null,
          });
        }
      } catch (err) {
        console.error("Error loading story:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (!story) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedForeground }}>Story not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Back Button */}
      <Pressable
        onPress={() => router.back()}
        style={[styles.backButton, { backgroundColor: `${colors.background}CC` }]}
      >
        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Hero Image */}
        {story.images.length > 0 && (
          <Image
            source={{ uri: story.images[0] }}
            style={styles.heroImage}
            contentFit="cover"
            transition={400}
          />
        )}

        <Animated.View entering={FadeInDown.duration(600)} style={styles.content}>
          {/* Tags */}
          <View style={styles.tagRow}>
            <View style={[styles.tag, { backgroundColor: `${colors.blue}20` }]}>
              <Text style={[styles.tagText, { color: colors.blue }]}>
                {story.category}
              </Text>
            </View>
            <Text style={[styles.readingTime, { color: colors.mutedForeground }]}>
              {story.readingTime}
            </Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.foreground }]}>{story.title}</Text>

          {/* Author / Date */}
          <View style={styles.metaRow}>
            <View style={styles.authorRow}>
              <View
                style={[
                  styles.authorAvatar,
                  { backgroundColor: `${colors.purple}20` },
                ]}
              >
                <Ionicons name="person" size={14} color={colors.purple} />
              </View>
              <Text style={[styles.authorName, { color: colors.mutedForeground }]}>
                {story.author}
              </Text>
            </View>
            <Text style={[styles.date, { color: colors.mutedForeground }]}>
              {story.date}
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Story Content */}
          <Text style={[styles.storyContent, { color: colors.foreground }]}>
            {story.content}
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
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
    top: 56,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroImage: {
    width: "100%",
    height: 300,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "700",
  },
  readingTime: {
    fontSize: 13,
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.8,
    lineHeight: 34,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  authorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
  },
  date: {
    fontSize: 13,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 24,
  },
  storyContent: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400",
    letterSpacing: 0.1,
  },
});
