import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  useColorScheme,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/lib/theme";
import { fetchUserProfile, updateUserProfile } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import AuroraBackground from "@/components/AuroraBackground";

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { user: authUser } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setName(profile.name);
        setEmail(profile.email);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({ name });
      if (Platform.OS === "web") {
        alert("Profile updated successfully!");
      } else {
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuroraBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.orange} />
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Profile Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: `${colors.muted}20`, 
                  borderColor: colors.border,
                  color: colors.foreground 
                }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: `${colors.muted}10`, 
                  borderColor: colors.border,
                  color: colors.mutedForeground 
                }]}
                value={email}
                editable={false}
              />
              <Text style={[styles.helpText, { color: colors.mutedForeground }]}>Email cannot be changed</Text>
            </View>

            <View style={styles.spacer} />

            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>App Preferences</Text>
            
            <View style={[styles.preferenceRow, { borderBottomColor: colors.border }]}>
              <View style={styles.prefInfo}>
                <Ionicons name="moon-outline" size={20} color={colors.foreground} />
                <Text style={[styles.prefLabel, { color: colors.foreground }]}>Dark Mode</Text>
              </View>
              <Text style={[styles.statusText, { color: colors.orange }]}>System Default</Text>
            </View>

            <View style={[styles.preferenceRow, { borderBottomColor: colors.border }]}>
              <View style={styles.prefInfo}>
                <Ionicons name="notifications-outline" size={20} color={colors.foreground} />
                <Text style={[styles.prefLabel, { color: colors.foreground }]}>Push Notifications</Text>
              </View>
              <Text style={[styles.statusText, { color: colors.mutedForeground }]}>Enabled</Text>
            </View>

            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={({ pressed }) => [
                styles.saveButton,
                { 
                  backgroundColor: colors.orange,
                  opacity: (pressed || saving) ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </Pressable>
          </View>
        )}
      </ScrollView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
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
  form: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  helpText: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 0.5,
  },
  prefInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  prefLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    shadowColor: "#f97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  centered: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  spacer: {
    height: 10,
  },
});
