import React from "react";
import {
  View,
  Text,
  useColorScheme,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import AuroraBackground from "@/components/AuroraBackground";

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const showComingSoon = (feature: string) => {
    if (Platform.OS === "web") {
      alert(`${feature} feature coming soon!`);
    } else {
      Alert.alert("Coming Soon", `${feature} feature will be available in a future update.`);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (confirmed) {
        logout();
      }
      return;
    }

    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <AuroraBackground>
      <View style={styles.container}>
      <View style={styles.content}>
        {/* Avatar */}
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: isAuthenticated ? `${colors.purple}20` : `${colors.muted}`,
              borderColor: isAuthenticated ? `${colors.purple}40` : colors.border,
            },
          ]}
        >
          <Ionicons
            name={isAuthenticated ? "person" : "person-outline"}
            size={40}
            color={isAuthenticated ? colors.purple : colors.mutedForeground}
          />
        </View>

        {isAuthenticated && user ? (
          <>
            <Text style={[styles.name, { color: colors.foreground }]}>{user.name}</Text>
            <Text style={[styles.email, { color: colors.mutedForeground }]}>
              {user.email}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: `${colors.purple}20` }]}>
              <Text style={[styles.roleText, { color: colors.purple }]}>
                {user.role?.toUpperCase() || "USER"}
              </Text>
            </View>

            {/* Menu Items */}
            <View style={[styles.menu, { borderColor: colors.border }]}>
              <MenuItem
                icon="notifications-outline"
                label="Notifications"
                colors={colors}
                onPress={() => router.push("/notifications")}
              />
              <MenuItem
                icon="settings-outline"
                label="Settings"
                colors={colors}
                onPress={() => router.push("/settings")}
              />
              <MenuItem
                icon="shield-checkmark-outline"
                label="Privacy"
                colors={colors}
                onPress={() => router.push("/privacy")}
              />
            </View>

            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                {
                  backgroundColor: `${colors.red}15`,
                  borderColor: `${colors.red}30`,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.red} />
              <Text style={[styles.logoutText, { color: colors.red }]}>Sign Out</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={[styles.name, { color: colors.foreground }]}>Welcome</Text>
            <Text style={[styles.email, { color: colors.mutedForeground }]}>
              Sign in to access your dashboard and manage your journey.
            </Text>

            <Pressable
              onPress={() => router.push("/login")}
              style={({ pressed }) => [
                styles.signInButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Ionicons name="log-in-outline" size={20} color={colors.primaryForeground} />
              <Text style={[styles.signInText, { color: colors.primaryForeground }]}>
                Sign In
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
    </AuroraBackground>
  );
}

function MenuItem({
  icon,
  label,
  colors,
  onPress,
}: {
  icon: any;
  label: string;
  colors: any;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        {
          borderBottomColor: colors.border,
          backgroundColor: pressed ? `${colors.muted}50` : "transparent",
        },
      ]}
    >
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color={colors.mutedForeground} />
        <Text style={[styles.menuLabel, { color: colors.foreground }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 12,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 22,
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 32,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  menu: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    width: "100%",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
  },
  signInButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "800",
  },
});
