import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/lib/theme";
import { fetchUserProfile, updateUserProfile } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import AuroraBackground from "@/components/AuroraBackground";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme, theme, setTheme } = useTheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { user: authUser, refreshProfile } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [newImageBase64, setNewImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setName(profile.name ?? "");
        setEmail(profile.email ?? "");
        setProfileImage(profile.image ?? null);
      } catch (error) {
        console.error("Failed to load profile:", error);
        // Fallback to auth context data
        if (authUser) {
          setName(authUser.name ?? "");
          setEmail(authUser.email ?? "");
          setProfileImage(authUser.image ?? null);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photos to change your profile image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setProfileImage(asset.uri); // Show preview immediately

      if (asset.base64) {
        const ext = asset.uri.split('.').pop()?.toLowerCase() || 'jpeg';
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
        setNewImageBase64(`data:${mime};base64,${asset.base64}`);
      } else {
        Alert.alert("Error", "Failed to process the image. Please try again.");
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const updateData: { name: string; image?: string } = { name: name.trim() };
      if (newImageBase64) {
        updateData.image = newImageBase64;
      } else if (profileImage && !profileImage.startsWith('file://')) {
        updateData.image = profileImage;
      } else if (authUser?.image) {
        updateData.image = authUser.image;
      }

      await updateUserProfile(updateData);
      
      // Refresh the global auth state so header/tab bar reflect changes
      await refreshProfile();
      
      setNewImageBase64(null); // Clear pending image

      if (Platform.OS === "web") {
        alert("Profile updated successfully!");
      } else {
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const themeOptions: { id: "light" | "dark" | "system"; label: string; icon: any }[] = [
    { id: "light", label: "Light", icon: "sunny-outline" },
    { id: "dark", label: "Dark", icon: "moon-outline" },
    { id: "system", label: "System", icon: "settings-outline" },
  ];

  const avatarUri = profileImage || 
    (authUser ? `https://api.dicebear.com/7.x/notionists/png?seed=${encodeURIComponent(authUser.name || 'User')}&backgroundColor=transparent` : null);

  return (
    <AuroraBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
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
            
            {/* Profile Image */}
            <View style={styles.imageSection}>
              <View style={[styles.avatarContainer, { borderColor: colors.orange + "60" }]}>
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={styles.avatarImage}
                    contentFit="cover"
                  />
                ) : (
                  <Ionicons name="person-outline" size={40} color={colors.mutedForeground} />
                )}
              </View>
              <Pressable
                onPress={pickProfileImage}
                style={({ pressed }) => [
                  styles.changeImageButton,
                  { 
                    backgroundColor: colors.orange + "15",
                    borderColor: colors.orange + "40",
                    opacity: pressed ? 0.7 : 1,
                  }
                ]}
              >
                <Ionicons name="camera-outline" size={18} color={colors.orange} />
                <Text style={[styles.changeImageText, { color: colors.orange }]}>
                  Change Photo
                </Text>
              </Pressable>
              {newImageBase64 && (
                <Text style={[styles.pendingText, { color: colors.emerald }]}>
                  New photo selected — tap Save to apply
                </Text>
              )}
            </View>

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

            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>App Appearance</Text>
            
            <View style={styles.themeContainer}>
              {themeOptions.map((option) => {
                const isActive = theme === option.id;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => setTheme(option.id)}
                    style={[
                      styles.themeOption,
                      { 
                        backgroundColor: isActive ? colors.orange : `${colors.muted}30`,
                        borderColor: isActive ? colors.orange : colors.border
                      }
                    ]}
                  >
                    <Ionicons 
                      name={option.icon} 
                      size={20} 
                      color={isActive ? "#fff" : colors.foreground} 
                    />
                    <Text style={[
                      styles.themeLabel,
                      { color: isActive ? "#fff" : colors.foreground }
                    ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
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
  imageSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 14,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 48,
  },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: "700",
  },
  pendingText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
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
  themeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  themeOption: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: "700",
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
