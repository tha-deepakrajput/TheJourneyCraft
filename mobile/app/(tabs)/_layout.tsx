import { Tabs } from "expo-router";
import { Platform, View, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Header from "@/components/Header";
import { useTheme } from "@/lib/theme-context";

import { useAuth } from "@/lib/auth-context";
import { Image } from "expo-image";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { user, isAuthenticated } = useAuth();

  return (
    <View style={[styles.tabBarWrapper, { bottom: insets.bottom + 12 }]}>
      <BlurView
        intensity={95}
        tint={colorScheme}
        style={[
          styles.tabBarContainer,
          { 
            backgroundColor: colorScheme === "dark" ? "rgba(24, 24, 27, 0.7)" : "rgba(255, 255, 255, 0.85)",
            borderColor: colors.border + "80" 
          }
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : options.title !== undefined 
            ? options.title 
            : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            Haptics.selectionAsync();
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = () => {
            switch (route.name) {
              case "index": return isFocused ? "home" : "home-outline";
              case "timeline": return isFocused ? "compass" : "compass-outline";
              case "submit": return "add";
              case "stories": return isFocused ? "book" : "book-outline";
              case "profile": return isFocused ? "person" : "person-outline";
              default: return "help";
            }
          };

          const isSubmit = route.name === "submit";
          const isProfileTab = route.name === "profile";
          const hasImage = isProfileTab && isAuthenticated && user;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tabItem,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              {isSubmit ? (
                <View style={[
                  styles.submitIconBg, 
                  { 
                    backgroundColor: "#fff", 
                    shadowColor: colorScheme === "dark" ? "#000" : colors.orange 
                  }
                ]}>
                  <Ionicons name="add" size={32} color={colors.orange} />
                </View>
              ) : (
                <View style={styles.tabIconContainer}>
                  {hasImage && user ? (
                    <Image
                      source={{ uri: user.image || `https://api.dicebear.com/7.x/notionists/png?seed=${encodeURIComponent(user.name || 'User')}&backgroundColor=transparent` }}
                      style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: 12,
                        borderWidth: isFocused ? 2 : 1,
                        borderColor: isFocused ? colors.orange : colors.border
                      }}
                      contentFit="cover"
                    />
                  ) : (
                    <Ionicons
                      name={iconName() as any}
                      size={24}
                      color={isFocused ? colors.orange : colors.mutedForeground}
                    />
                  )}
                  {isFocused && (
                    <View style={[styles.activeIndicator, { backgroundColor: colors.orange }]} />
                  )}
                </View>
              )}
              {!isSubmit && (
                <Text style={[
                    styles.tabLabel, 
                    { 
                      color: isFocused ? colors.orange : colors.mutedForeground,
                      fontWeight: isFocused ? "800" : "600"
                    }
                ]}>
                  {label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        header: () => <Header />,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="timeline" options={{ title: "Journey" }} />
      <Tabs.Screen name="submit" options={{ title: "Share" }} />
      <Tabs.Screen name="stories" options={{ title: "Stories" }} />
      <Tabs.Screen name="profile" options={{ title: "Me" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    left: 12,
    right: 12,
    height: 72,
    borderRadius: 16,
    zIndex: 100,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  tabBarContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
    overflow: "hidden",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  submitIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  tabLabel: {
    fontSize: 9,
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

