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
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { fetchMySubmissions } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuroraBackground from "@/components/AuroraBackground";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_SIZE = (SCREEN_WIDTH - 24 * 2 - 16) / 2;

interface Submission {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImage?: string;
  status: string;
  readingTime: string;
  createdAt: string;
}

export default function MyPostsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSubmissions = async () => {
    try {
      const data = await fetchMySubmissions();
      setSubmissions(data || []);
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSubmissions();
    setRefreshing(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "#10b981";
      case "Rejected": return "#ef4444";
      default: return "#f59e0b";
    }
  };

  const getStatusIcon = (status: string): any => {
    switch (status) {
      case "Approved": return "checkmark-circle";
      case "Rejected": return "close-circle";
      default: return "time";
    }
  };

  if (!isAuthenticated) {
    return (
      <AuroraBackground>
        <View style={[styles.center, { paddingTop: insets.top + 80 }]}>
          <View style={[styles.emptyIcon, { backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}30` }]}>
            <Ionicons name="lock-closed" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Sign In Required</Text>
          <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
            Sign in to view your submitted posts and track their status.
          </Text>
          <Pressable
            onPress={() => router.push("/login")}
            style={({ pressed }) => [
              styles.signInBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={[styles.signInBtnText, { color: colors.primaryForeground }]}>Sign In</Text>
          </Pressable>
        </View>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header with user info */}
        <View style={[styles.header, { paddingTop: insets.top + 60 }]}>
          {/* Back button */}
          <Pressable
            onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/profile")}
            style={[styles.backBtn, { backgroundColor: colors.muted }]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </Pressable>

          <View style={styles.profileSection}>
            <Image
              source={{
                uri: user?.image || `https://api.dicebear.com/7.x/notionists/png?seed=${encodeURIComponent(user?.name || "User")}&backgroundColor=transparent`,
              }}
              style={[styles.avatar, { borderColor: colors.primary + "50" }]}
              contentFit="cover"
            />
            <Text style={[styles.userName, { color: colors.foreground }]}>{user?.name}</Text>
            <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>{user?.email}</Text>

            <View style={styles.statsRow}>
              <View style={[styles.statBubble, { backgroundColor: colors.card, borderColor: colors.border + "60" }]}>
                <Text style={[styles.statNumber, { color: colors.foreground }]}>{submissions.length}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Posts</Text>
              </View>
              <View style={[styles.statBubble, { backgroundColor: colors.card, borderColor: colors.border + "60" }]}>
                <Text style={[styles.statNumber, { color: "#10b981" }]}>
                  {submissions.filter((s) => s.status === "Approved").length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Approved</Text>
              </View>
              <View style={[styles.statBubble, { backgroundColor: colors.card, borderColor: colors.border + "60" }]}>
                <Text style={[styles.statNumber, { color: "#f59e0b" }]}>
                  {submissions.filter((s) => s.status === "Pending").length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
        ) : submissions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: `${colors.muted}60`, borderColor: colors.border }]}>
              <Ionicons name="document-text-outline" size={36} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Posts Yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              Share your first story and it will appear here.
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/submit")}
              style={({ pressed }) => [
                styles.signInBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
              ]}
            >
              <Text style={[styles.signInBtnText, { color: colors.primaryForeground }]}>Share a Story</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.grid}>
            {submissions.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  if (item.status === "Approved") {
                    router.push(`/story/${item.id}` as any);
                  }
                }}
                style={({ pressed }) => [
                  styles.gridCard,
                  {
                    borderColor: colors.border + "60",
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
              >
                {item.coverImage ? (
                  <Image
                    source={{ uri: item.coverImage }}
                    style={StyleSheet.absoluteFillObject}
                    contentFit="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={[colors.primary + "30", colors.primary + "10"]}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}

                <LinearGradient
                  colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.8)"]}
                  style={StyleSheet.absoluteFillObject}
                />

                {/* Status Badge */}
                <View style={styles.statusBadgeWrapper}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + "25", borderColor: getStatusColor(item.status) + "40" }]}>
                    <Ionicons name={getStatusIcon(item.status)} size={12} color={getStatusColor(item.status)} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                  </View>
                </View>

                {/* Content */}
                <View style={styles.gridCardContent}>
                  <Text style={styles.gridCardCategory}>{item.category}</Text>
                  <Text style={styles.gridCardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  profileSection: {
    alignItems: "center",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    marginBottom: 16,
  },
  userName: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBubble: {
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 85,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 16,
  },
  gridCard: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.25,
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  statusBadgeWrapper: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  gridCardContent: {
    position: "absolute",
    bottom: 14,
    left: 14,
    right: 14,
    zIndex: 10,
  },
  gridCardCategory: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  gridCardTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#FFF",
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  signInBtn: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  signInBtnText: {
    fontSize: 16,
    fontWeight: "800",
  },
});
