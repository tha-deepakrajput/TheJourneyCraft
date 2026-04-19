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
  Modal,
  Platform,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { fetchMySubmissions } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuroraBackground from "@/components/AuroraBackground";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_GAP = 3;
const NUM_COLS = 2;
const TILE_SIZE = (SCREEN_WIDTH - 40 - GRID_GAP * (NUM_COLS - 1)) / NUM_COLS;

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

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

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

  const filtered =
    activeFilter === "all"
      ? submissions
      : submissions.filter((s) => s.status === activeFilter);

  const stats = {
    total: submissions.length,
    approved: submissions.filter((s) => s.status === "Approved").length,
    pending: submissions.filter((s) => s.status === "Pending").length,
    rejected: submissions.filter((s) => s.status === "Rejected").length,
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Approved": return "#10b981";
      case "Rejected": return "#ef4444";
      default: return "#f59e0b";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Approved": return "Live";
      case "Rejected": return "Rejected";
      default: return "Review";
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (confirmed) logout();
      return;
    }
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => logout() },
    ]);
  };

  // ── Not Authenticated ──
  if (!isAuthenticated) {
    return (
      <AuroraBackground>
        <View style={[styles.centerFull, { paddingTop: insets.top + 80 }]}>
          <LinearGradient
            colors={[`${colors.primary}20`, `${colors.primary}08`]}
            style={styles.emptyIconBox}
          >
            <Ionicons name="person-outline" size={36} color={colors.primary} />
          </LinearGradient>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Welcome to JourneyCraft</Text>
          <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
            Sign in to access your profile, manage your stories, and track your journey.
          </Text>
          <Pressable
            onPress={() => router.push("/login")}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Ionicons name="log-in-outline" size={18} color={colors.primaryForeground} />
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>Get Started</Text>
          </Pressable>
        </View>
      </AuroraBackground>
    );
  }

  const avatarUri =
    user?.image ||
    `https://api.dicebear.com/7.x/notionists/png?seed=${encodeURIComponent(user?.name || "User")}&backgroundColor=transparent`;

  return (
    <AuroraBackground>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* ─── Top Bar ─── */}
        <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
          <Text style={[styles.topBarTitle, { color: colors.foreground }]}>My Account</Text>
          <Pressable
            onPress={() => setShowMenu(true)}
            hitSlop={12}
            style={({ pressed }) => [
              styles.menuBtn,
              { backgroundColor: pressed ? `${colors.muted}60` : `${colors.muted}30` },
            ]}
          >
            <Ionicons name="menu" size={22} color={colors.foreground} />
          </Pressable>
        </View>

        {/* ─── Profile Hero Card ─── */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={
              colorScheme === "dark"
                ? ["#1a1a2e", "#16213e", "#0f3460"]
                : ["#f8f9fa", "#e9ecef", "#dee2e6"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { borderColor: `${colors.border}50` }]}
          >
            {/* Decorative circles */}
            <View style={[styles.heroCircle1, { backgroundColor: `${colors.primary}12` }]} />
            <View style={[styles.heroCircle2, { backgroundColor: `${colors.primary}08` }]} />

            <View style={styles.heroContent}>
              {/* Avatar with ring */}
              <View style={styles.avatarWrapper}>
                <LinearGradient
                  colors={[colors.primary, "#a855f7", "#ec4899"]}
                  style={styles.avatarRing}
                >
                  <View style={[styles.avatarInner, { backgroundColor: colorScheme === "dark" ? "#1a1a2e" : "#f8f9fa" }]}>
                    <Image
                      source={{ uri: avatarUri }}
                      style={styles.avatarImage}
                      contentFit="cover"
                    />
                  </View>
                </LinearGradient>
              </View>

              {/* User Details */}
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: colors.foreground }]} numberOfLines={1}>
                  {user?.name}
                </Text>
                <Text style={[styles.userEmail, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {user?.email}
                </Text>
                <View style={[styles.roleBadge, { backgroundColor: `${colors.primary}18` }]}>
                  <View style={[styles.roleDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.roleText, { color: colors.primary }]}>
                    {user?.role?.toUpperCase() || "EXPLORER"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.heroStats}>
              {[
                { num: stats.total, label: "Journeys", color: colors.foreground },
                { num: stats.approved, label: "Published", color: "#10b981" },
                { num: stats.pending, label: "In Review", color: "#f59e0b" },
                { num: stats.rejected, label: "Returned", color: "#ef4444" },
              ].map((s, i) => (
                <View key={s.label} style={styles.heroStatItem}>
                  <Text style={[styles.heroStatNum, { color: s.color }]}>{s.num}</Text>
                  <Text style={[styles.heroStatLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <Pressable
                onPress={() => router.push("/settings")}
                style={({ pressed }) => [
                  styles.quickBtn,
                  {
                    backgroundColor: `${colors.primary}15`,
                    borderColor: `${colors.primary}30`,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons name="create-outline" size={16} color={colors.primary} />
                <Text style={[styles.quickBtnText, { color: colors.primary }]}>Edit Profile</Text>
              </Pressable>
              <Pressable
                onPress={() => router.push("/(tabs)/submit")}
                style={({ pressed }) => [
                  styles.quickBtn,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={[styles.quickBtnText, { color: "#fff" }]}>New Journey</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        {/* ─── My Journeys Section ─── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Journeys</Text>
          <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
            {filtered.length} {filtered.length === 1 ? "story" : "stories"}
          </Text>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {[
            { key: "all", label: "All", icon: "layers-outline" as const },
            { key: "Approved", label: "Published", icon: "checkmark-circle-outline" as const },
            { key: "Pending", label: "In Review", icon: "time-outline" as const },
            { key: "Rejected", label: "Returned", icon: "arrow-undo-outline" as const },
          ].map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive ? colors.foreground : `${colors.muted}30`,
                    borderColor: isActive ? colors.foreground : `${colors.border}60`,
                  },
                ]}
              >
                <Ionicons
                  name={f.icon}
                  size={14}
                  color={isActive ? colors.background : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.chipText,
                    { color: isActive ? colors.background : colors.mutedForeground },
                  ]}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ─── Posts Grid ─── */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyBox, { backgroundColor: `${colors.muted}25`, borderColor: `${colors.border}40` }]}>
              <Ionicons name="camera-outline" size={28} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyStateTitle, { color: colors.foreground }]}>
              {activeFilter === "all" ? "Start your journey" : `No ${activeFilter.toLowerCase()} stories`}
            </Text>
            <Text style={[styles.emptyStateDesc, { color: colors.mutedForeground }]}>
              {activeFilter === "all"
                ? "Your shared stories and experiences will appear here."
                : "Nothing matches this filter right now."}
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map((item, index) => {
              // Alternate between tall and normal tiles for visual interest
              const isTall = index % 3 === 0;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    if (item.status === "Approved") {
                      router.push(`/story/${item.id}` as any);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.gridTile,
                    {
                      height: isTall ? TILE_SIZE * 1.4 : TILE_SIZE,
                      opacity: pressed ? 0.85 : 1,
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
                      colors={[`${colors.primary}30`, `${colors.primary}10`]}
                      style={StyleSheet.absoluteFillObject}
                    />
                  )}

                  {/* Bottom gradient overlay */}
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    style={styles.tileOverlay}
                  />

                  {/* Status chip */}
                  <View style={[styles.tileStatus, { backgroundColor: getStatusDot(item.status) + "20" }]}>
                    <View style={[styles.tileStatusDot, { backgroundColor: getStatusDot(item.status) }]} />
                    <Text style={[styles.tileStatusText, { color: getStatusDot(item.status) }]}>
                      {getStatusLabel(item.status)}
                    </Text>
                  </View>

                  {/* Bottom content */}
                  <View style={styles.tileContent}>
                    <Text style={styles.tileCategory}>{item.category}</Text>
                    <Text style={styles.tileTitle} numberOfLines={2}>{item.title}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ─── Slide-Up Menu ─── */}
      <Modal visible={showMenu} transparent animationType="slide" onRequestClose={() => setShowMenu(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View
            style={[
              styles.menuSheet,
              {
                backgroundColor: colors.card,
                borderColor: `${colors.border}60`,
                paddingBottom: insets.bottom + 20,
              },
            ]}
          >
            <View style={[styles.menuHandle, { backgroundColor: colors.mutedForeground }]} />

            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <Image source={{ uri: avatarUri }} style={styles.menuAvatar} contentFit="cover" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuName, { color: colors.foreground }]}>{user?.name}</Text>
                <Text style={[styles.menuEmail, { color: colors.mutedForeground }]}>{user?.email}</Text>
              </View>
            </View>

            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

            <MenuRow icon="notifications-outline" label="Notifications" colors={colors}
              onPress={() => { setShowMenu(false); router.push("/notifications"); }} />
            <MenuRow icon="settings-outline" label="Settings" colors={colors}
              onPress={() => { setShowMenu(false); router.push("/settings"); }} />
            <MenuRow icon="shield-checkmark-outline" label="Privacy" colors={colors}
              onPress={() => { setShowMenu(false); router.push("/privacy"); }} />

            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

            <Pressable
              onPress={() => { setShowMenu(false); handleLogout(); }}
              style={({ pressed }) => [styles.menuRow, { opacity: pressed ? 0.6 : 1 }]}
            >
              <View style={[styles.menuIconBox, { backgroundColor: "#ef444418" }]}>
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              </View>
              <Text style={[styles.menuRowLabel, { color: "#ef4444" }]}>Sign Out</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </AuroraBackground>
  );
}

function MenuRow({ icon, label, colors, onPress }: { icon: any; label: string; colors: any; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.menuRow, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={[styles.menuIconBox, { backgroundColor: `${colors.muted}30` }]}>
        <Ionicons name={icon} size={20} color={colors.foreground} />
      </View>
      <Text style={[styles.menuRowLabel, { color: colors.foreground }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} style={{ marginLeft: "auto" }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ── Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Hero Profile Card
  heroCard: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  heroGradient: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    overflow: "hidden",
  },
  heroCircle1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  heroCircle2: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginBottom: 24,
  },
  avatarWrapper: {},
  avatarRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 35,
    padding: 2,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 33,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  roleText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  // Stats inside hero
  heroStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  heroStatItem: {
    alignItems: "center",
    flex: 1,
  },
  heroStatNum: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  heroStatLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Quick actions
  quickActions: {
    flexDirection: "row",
    gap: 10,
  },
  quickBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },

  // ── Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: "500",
  },

  // ── Filter chips
  chipRow: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 18,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // ── Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: GRID_GAP,
  },
  gridTile: {
    width: TILE_SIZE,
    borderRadius: 18,
    overflow: "hidden",
  },
  tileOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  tileStatus: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tileStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tileStatusText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tileContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  tileCategory: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.2,
    lineHeight: 18,
  },

  // ── Empty states
  centerFull: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
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
    marginBottom: 28,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  emptyState: {
    paddingVertical: 50,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  emptyBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  emptyStateDesc: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },

  // ── Menu Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  menuSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 12,
  },
  menuHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
    opacity: 0.25,
  },
  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  menuAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  menuName: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  menuEmail: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 1,
  },
  menuDivider: {
    height: 0.5,
    marginHorizontal: 24,
    marginVertical: 6,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 13,
    paddingHorizontal: 24,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuRowLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
});
