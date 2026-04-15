import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/lib/theme";
import Logo from "./Logo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { fetchNotifications } from "@/lib/api";

export default function Header() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotificationCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const data = await fetchNotifications();
      setUnreadCount(data?.length || 0);
    } catch {
      // Silently fail for header badge — not critical
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Delay initial load to let auth settle after app start
    const timeout = setTimeout(loadNotificationCount, 2000);
    const interval = setInterval(loadNotificationCount, 60000); // Poll every 60s
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [loadNotificationCount]);

  const handlePress = (target: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(target as any);
  };

  return (
    <View style={[styles.wrapper, { top: insets.top + 8 }]}>
      <BlurView
        intensity={95}
        tint={colorScheme}
        style={[
          styles.container,
          { 
            backgroundColor: colorScheme === "dark" ? "rgba(24, 24, 27, 0.75)" : "rgba(255, 255, 255, 0.85)",
            borderColor: colors.border + "80"
          }
        ]}
      >
        <View style={styles.content}>
          {/* Left: Brand */}
          <Pressable 
            onPress={() => handlePress("/")}
            style={styles.brand}
          >
            <Logo size={34} color={colors.orange} />
            <Text style={[styles.brandText, { color: colors.foreground }]}>
              JourneyCraft
            </Text>
          </Pressable>

          {/* Right: Actions */}
          <View style={styles.actions}>
            <Pressable 
              onPress={() => handlePress("/notifications")}
              style={({ pressed }) => [
                styles.iconButton,
                { 
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor: pressed ? `${colors.muted}40` : "transparent"
                }
              ]}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.foreground} />
              {unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: "#ef4444", borderColor: colors.background }]} />
              )}
            </Pressable>
            
            <Pressable 
              onPress={() => handlePress("/(tabs)/profile")}
              style={({ pressed }) => [
                styles.profileButton,
                { 
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor: pressed ? `${colors.muted}40` : "transparent"
                }
              ]}
            >
              {isAuthenticated && user ? (
                <Image 
                  source={{ uri: user.image || `https://api.dicebear.com/7.x/notionists/png?seed=${encodeURIComponent(user.name || 'User')}&backgroundColor=transparent` }} 
                  style={{ width: 30, height: 30, borderRadius: 15 }} 
                  contentFit="cover"
                />
              ) : (
                <Ionicons name="person-circle-outline" size={30} color={colors.foreground} />
              )}
            </Pressable>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 12,
    right: 12,
    height: 64,
    zIndex: 1000,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  container: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandText: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -1,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  }
});
