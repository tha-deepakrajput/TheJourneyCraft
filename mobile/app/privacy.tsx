import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/lib/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuroraBackground from "@/components/AuroraBackground";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();

  return (
    <AuroraBackground>
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Privacy & Terms</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Section title="Privacy Policy" colors={colors}>
            Your privacy is important to us. This policy describes how JourneyCraft collects, uses, and protects your personal information. We only collect data necessary to provide you with the best storytelling experience.
          </Section>

          <Section title="Data Collection" colors={colors}>
            We collect your name and email address when you sign up. We also store the stories and media you submit to the digital museum to display them as part of our permanent collection.
          </Section>

          <Section title="How We Use Your Data" colors={colors}>
            Your data is used to personalize your experience, allow you to manage your submissions, and to notify you of important updates regarding your account or the JourneyCraft platform.
          </Section>

          <Section title="Your Rights" colors={colors}>
            You have the right to access, update, or delete your personal data at any time. You can manage your profile settings or contact our support team for data deletion requests.
          </Section>

          <Section title="Terms of Service" colors={colors}>
            By using JourneyCraft, you agree to our terms. You are responsible for the content you submit and must ensure you have the rights to any media you share. We reserve the right to review and approve submissions before they are published.
          </Section>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
              Last Updated: April 4, 2026
            </Text>
          </View>
        </ScrollView>
      </View>
    </AuroraBackground>
  );
}

function Section({ title, children, colors }: { title: string; children: React.ReactNode; colors: any }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.orange }]}>{title}</Text>
      <Text style={[styles.sectionContent, { color: colors.foreground }]}>{children}</Text>
    </View>
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
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "400",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
