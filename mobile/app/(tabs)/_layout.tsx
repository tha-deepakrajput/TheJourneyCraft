import { Tabs } from "expo-router";
import { useColorScheme, Platform, View, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.tabBarWrapper, { bottom: insets.bottom + 10 }]}>
      <BlurView
        intensity={80}
        tint={colorScheme}
        style={[
          styles.tabBarContainer,
          { 
            backgroundColor: colorScheme === "dark" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)",
            borderColor: colors.border + "40" 
          }
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
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
              case "submit": return isFocused ? "add-circle" : "add-circle-outline";
              case "stories": return isFocused ? "book" : "book-outline";
              case "profile": return isFocused ? "person" : "person-outline";
              default: return "help";
            }
          };

          const isSubmit = route.name === "submit";

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [
                styles.tabItem,
                isSubmit && styles.submitTabItem,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <View style={[
                  isSubmit && [styles.submitIconBg, { backgroundColor: colors.orange }]
              ]}>
                <Ionicons
                  name={iconName() as any}
                  size={isSubmit ? 32 : 24}
                  color={isSubmit ? "#fff" : isFocused ? colors.orange : colors.mutedForeground}
                />
              </View>
              {!isSubmit && (
                <Text style={[
                    styles.tabLabel, 
                    { color: isFocused ? colors.orange : colors.mutedForeground }
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
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.mutedForeground,
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
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    zIndex: 100,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  tabBarContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  submitTabItem: {
    marginTop: -35,
    height: 70,
  },
  submitIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: -0.2,
  },
});
