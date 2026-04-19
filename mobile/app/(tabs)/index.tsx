import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Colors } from "@/lib/theme";
import { Link, useRouter } from "expo-router";
import { 
  Compass, 
  ArrowRight, 
  Sparkles, 
  Image as ImageIcon, 
  BookOpen,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark
} from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuroraBackground from "@/components/AuroraBackground";
import { fetchJourneys, fetchStories } from "@/lib/api";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Journey {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  category?: string;
}

interface Story {
  id: string;
  title: string;
  description: string;
  readingTime: string;
  tag: string;
  coverImage?: string;
}

const cardStyles = [
  { colors: ["rgba(59,130,246,0.2)", "rgba(6,182,212,0.2)"], borderColor: "rgba(59,130,246,0.3)", tagBg: "rgba(59,130,246,0.2)", tagColor: "#3b82f6" },
  { colors: ["rgba(249,115,22,0.2)", "rgba(245,158,11,0.2)"], borderColor: "rgba(249,115,22,0.3)", tagBg: "rgba(249,115,22,0.2)", tagColor: "#f97316" },
  { colors: ["rgba(168,85,247,0.2)", "rgba(236,72,153,0.2)"], borderColor: "rgba(168,85,247,0.3)", tagBg: "rgba(168,85,247,0.2)", tagColor: "#a855f7" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [journeysData, storiesData] = await Promise.all([
          fetchJourneys(),
          fetchStories()
        ]);
        
        // Take latest 3 of each
        setJourneys(journeysData.slice(0, 3));
        setStories(storiesData.slice(0, 3));
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <AuroraBackground>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* --- HERO SECTION --- */}
        <View 
          style={[styles.heroSection, { paddingTop: insets.top + 90 }]}
        >
          <View style={StyleSheet.flatten([styles.badge, { backgroundColor: colors.background + "80", borderColor: colors.border + "30" }])}>
            <View style={[styles.pulseDot, { backgroundColor: colors.orange }]} />
            <Text style={[styles.badgeText, { color: colors.foreground }]}>
              A cinematic digital museum
            </Text>
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>
            Memories in{"\n"}
            <Text style={{ color: colors.mutedForeground }}>Motion.</Text>
          </Text>

          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Chronicle your adventures with breathtaking elegance. Explore a curated timeline of journeys that shaped the world.
          </Text>

          <View style={styles.actions}>
            <Link href="/timeline" asChild>
              <Pressable
                style={StyleSheet.flatten([styles.primaryButton, { backgroundColor: colors.primary }])}
              >
                <Compass color={colors.primaryForeground} size={20} style={{ marginRight: 8 }} />
                <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
                  Start Exploring
                </Text>
              </Pressable>
            </Link>

            <Link href="/submit" asChild>
              <Pressable
                style={StyleSheet.flatten([styles.secondaryButton, { borderColor: colors.border + "40" }])}
              >
                <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>
                  Share a Story
                </Text>
                <ArrowRight color={colors.foreground} size={18} style={{ marginLeft: 8 }} />
              </Pressable>
            </Link>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
        ) : (
          <>
            {/* --- JOURNEY HIGHLIGHTS SECTION --- */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <View style={StyleSheet.flatten([styles.sectionBadge, { backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}30` }])}>
                  <Sparkles size={14} color={colors.primary} />
                  <Text style={[styles.sectionBadgeText, { color: colors.primary }]}>CURATED COLLECTIONS</Text>
                </View>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Journey Highlights</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>
                  Immerse yourself in spectacular moments frozen in time.
                </Text>
              </View>

              {journeys.length > 0 ? (
                <View style={styles.showcaseFeed}>
                  {journeys.map((journey, i) => {
                    return (
                      <Pressable 
                        key={journey.id}
                        onPress={() => router.push(`/journey/${journey.id}` as any)}
                        style={({ pressed }) => [
                          styles.showcaseCard, 
                          {
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                            opacity: pressed ? 0.95 : 1,
                            borderColor: colors.border + "60",
                          }
                        ]}
                      >
                        {journey.image ? (
                          <Image 
                            source={{ uri: journey.image }} 
                            style={StyleSheet.absoluteFillObject} 
                            contentFit="cover"
                          />
                        ) : (
                          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.primary + "20" }]} />
                        )}
                        <LinearGradient
                          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
                          style={StyleSheet.absoluteFillObject}
                        />

                        {/* Top glass bubble */}
                        <View style={styles.showcaseTopTags}>
                          <BlurView intensity={70} tint="dark" style={styles.showcaseGlassBubble}>
                            <Sparkles size={14} color={colors.primary} />
                            <Text style={[styles.showcaseBubbleText, { color: "#FFF" }]}>{journey.category || "Highlight"}</Text>
                          </BlurView>
                        </View>

                        {/* Floating Content Box */}
                        <View style={styles.showcaseContentWrapper}>
                          <BlurView intensity={85} tint="dark" style={styles.showcaseGlassBox}>
                            <View style={styles.showcaseDateRow}>
                              <Compass size={14} color="rgba(255,255,255,0.8)" />
                              <Text style={[styles.showcaseDate, { color: "rgba(255,255,255,0.8)" }]}>{journey.date}</Text>
                            </View>
                            <Text style={[styles.showcaseTitle, { color: "#FFF" }]} numberOfLines={2}>
                              {journey.title}
                            </Text>
                            <Text style={[styles.showcaseDesc, { color: "rgba(255,255,255,0.9)" }]} numberOfLines={2}>
                              {journey.description}
                            </Text>
                            <View style={styles.showcaseAction}>
                              <Text style={[styles.showcaseActionText, { color: "#FFF" }]}>Explore Journey</Text>
                              <View style={[styles.showcaseActionIconBtn, { backgroundColor: colors.primary }]}>
                                <ArrowRight size={16} color="#FFF" />
                              </View>
                            </View>
                          </BlurView>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View style={[styles.emptyContainer, { borderColor: colors.border + "50" }]}>
                   <View style={[styles.emptyIconBox, { backgroundColor: colors.muted + "50" }]}>
                      <ImageIcon size={24} color={colors.mutedForeground} />
                   </View>
                   <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No journey highlights yet.</Text>
                </View>
              )}

              <Link href="/timeline" asChild>
                <Pressable style={StyleSheet.flatten([styles.viewAllBtn, { backgroundColor: colors.card, borderColor: colors.border }])}>
                  <Text style={[styles.viewAllBtnText, { color: colors.foreground }]}>View Full Timeline</Text>
                  <ArrowRight size={18} color={colors.foreground} />
                </Pressable>
              </Link>
            </View>

            {/* --- LATEST STORIES SECTION --- */}
            <View style={[styles.sectionContainer, styles.storiesSection]}>
              <View style={styles.storiesHeaderRow}>
                <View style={styles.storiesHeaderLeft}>
                  <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign: "left", marginBottom: 8 }]}>
                    Latest Stories
                  </Text>
                  <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground, textAlign: "left", maxWidth: 280, marginBottom: 0 }]}>
                    Intimate narratives and deep reflections.
                  </Text>
                </View>
                
                <Link href="/stories" asChild>
                  <Pressable style={styles.browseAllLnk}>
                    <Text style={[styles.browseAllLnkText, { color: colors.primary }]}>Browse All</Text>
                    <View style={[styles.browseAllIcon, { backgroundColor: `${colors.primary}20` }]}>
                      <ArrowRight size={14} color={colors.primary} />
                    </View>
                  </Pressable>
                </Link>
              </View>

              {stories.length > 0 ? (
                <View style={styles.showcaseFeed}>
                  {stories.map((story, i) => (
                    <Pressable 
                      key={story.id}
                      onPress={() => router.push(`/story/${story.id}` as any)}
                      style={({ pressed }) => [
                        styles.showcaseCardSmall,
                        {
                          transform: [{ scale: pressed ? 0.98 : 1 }],
                          opacity: pressed ? 0.95 : 1,
                          borderColor: colors.border + "60",
                        }
                      ]}
                    >
                      {story.coverImage ? (
                        <Image 
                          source={{ uri: story.coverImage }} 
                          style={StyleSheet.absoluteFillObject} 
                          contentFit="cover"
                        />
                      ) : (
                        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.primary + "20" }]} />
                      )}
                      
                      <LinearGradient
                        colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.85)"]}
                        style={StyleSheet.absoluteFillObject}
                      />

                      <View style={styles.showcaseTopTags}>
                        <BlurView intensity={70} tint="dark" style={styles.showcaseGlassBubble}>
                          <BookOpen size={13} color="#FFF" />
                          <Text style={[styles.showcaseBubbleText, { color: "#FFF" }]}>{story.readingTime}</Text>
                        </BlurView>
                      </View>

                      <View style={styles.showcaseContentWrapper}>
                        <BlurView intensity={85} tint="dark" style={styles.showcaseGlassBox}>
                          <Text style={[styles.showcaseStoryTag, { color: colors.primary }]}>{story.tag || "Story"}</Text>
                          <Text style={[styles.showcaseStoryTitle, { color: "#FFF" }]} numberOfLines={2}>
                            {story.title}
                          </Text>
                          <Text style={[styles.showcaseStoryDesc, { color: "rgba(255,255,255,0.9)" }]} numberOfLines={2}>
                            {story.description}
                          </Text>
                        </BlurView>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={[styles.emptyContainer, { borderColor: colors.border + "50" }]}>
                   <View style={[styles.emptyIconBox, { backgroundColor: colors.muted + "50" }]}>
                      <BookOpen size={24} color={colors.mutedForeground} />
                   </View>
                   <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No stories shared yet.</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  heroSection: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
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
  sectionContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  sectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    marginBottom: 16,
    gap: 6
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "300",
  },
  showcaseFeed: {
    gap: 24,
    marginBottom: 32,
  },
  showcaseCard: {
    width: "100%",
    height: 480,
    borderRadius: 40,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
  showcaseCardSmall: {
    width: "100%",
    height: 360,
    borderRadius: 36,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  showcaseTopTags: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  showcaseGlassBubble: {
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
  showcaseBubbleText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  showcaseContentWrapper: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    zIndex: 10,
  },
  showcaseGlassBox: {
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  showcaseDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  showcaseDate: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  showcaseTitle: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
    lineHeight: 38,
    marginBottom: 12,
  },
  showcaseDesc: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  showcaseAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  showcaseActionText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  showcaseActionIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  showcaseStoryTag: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  showcaseStoryTitle: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 10,
  },
  showcaseStoryDesc: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  viewAllBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    gap: 8,
  },
  viewAllBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  storiesSection: {
    paddingTop: 32,
  },
  storiesHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  storiesHeaderLeft: {
    flex: 1,
  },
  browseAllLnk: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  browseAllLnkText: {
    fontSize: 14,
    fontWeight: "700",
  },
  browseAllIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 24,
    borderStyle: "dashed",
    marginBottom: 24,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 15,
  }
});
