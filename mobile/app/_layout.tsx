import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import { Colors } from "@/lib/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function RootLayoutContent() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "fade",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="login"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="story/[id]"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
