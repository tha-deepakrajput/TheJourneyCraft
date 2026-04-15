import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/lib/theme";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { fetchNotifications, markNotificationAsRead } from "@/lib/api";
import AuroraBackground from "@/components/AuroraBackground";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const data = await fetchNotifications();
      setNotifications(data || []);
    } catch (err: any) {
      console.error("Failed to fetch notifications:", err);
      setError(err.message || "Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleMarkAsRead = async (id?: string) => {
    try {
      await markNotificationAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isStatusUpdate = item.type === 'status_update';
    const isApproved = item.status === 'Approved';
    const isRejected = item.status === 'Rejected';
    
    let iconName: any = "document-text-outline";
    let iconColor = colors.orange;
    
    if (isStatusUpdate) {
      if (isApproved) {
        iconName = "checkmark-circle-outline";
        iconColor = colors.emerald;
      } else if (isRejected) {
        iconName = "close-circle-outline";
        iconColor = "#ef4444";
      } else {
        iconName = "time-outline";
        iconColor = colors.orange;
      }
    }

    return (
      <View style={[styles.notificationItem, { backgroundColor: `${colors.muted}30`, borderColor: colors.border }]}>
        <View style={styles.iconContainer}>
          <View style={[styles.statusDot, { backgroundColor: iconColor }]} />
          <Ionicons name={iconName} size={26} color={iconColor} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.notificationTitle, { color: colors.foreground }]}>
            {item.type === 'status_update' ? 'Story Update' : 'New Submission'}
          </Text>
          <Text style={[styles.notificationText, { color: colors.mutedForeground }]}>
            {item.message || item.title}
          </Text>
          <Text style={[styles.timestamp, { color: colors.mutedForeground }]}>
            {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <View style={styles.actions}>
            <Pressable
              onPress={() => handleMarkAsRead(item.id)}
              style={({ pressed }) => [
                styles.actionButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Text style={[styles.actionText, { color: iconColor }]}>Clear</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <AuroraBackground>
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Notifications</Text>
          <Pressable onPress={() => handleMarkAsRead()} style={styles.clearAll}>
            <Text style={[styles.clearAllText, { color: colors.mutedForeground }]}>Clear All</Text>
          </Pressable>
        </View>

        {!isAuthenticated ? (
          <View style={styles.centered}>
            <Ionicons name="lock-closed-outline" size={64} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Log in to view notifications</Text>
            <Pressable
              onPress={() => router.push("/login")}
              style={({ pressed }) => [
                styles.retryButton,
                { backgroundColor: colors.orange, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <Text style={styles.retryText}>Log In</Text>
            </Pressable>
          </View>
        ) : loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.orange} />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Ionicons name="cloud-offline-outline" size={64} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{error}</Text>
            <Pressable
              onPress={() => { setLoading(true); loadNotifications(); }}
              style={({ pressed }) => [
                styles.retryButton,
                { backgroundColor: colors.orange, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.orange} />
            }
          />
        ) : (
          <View style={styles.centered}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No new notifications</Text>
          </View>
        )}
      </View>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  clearAll: {
    padding: 8,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  statusDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000",
    zIndex: 1,
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 13,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "400",
    opacity: 0.8,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  retryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
