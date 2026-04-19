import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { submitStory } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import AuroraBackground from "@/components/AuroraBackground";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  Layout 
} from "react-native-reanimated";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CATEGORIES = ["Personal Growth", "Career", "Travel", "Overcoming Challenges"];

interface FormData {
  name: string;
  email: string;
  title: string;
  category: string;
  story: string;
  video: string;
  image: string | null;
}

export default function SubmitScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    title: "",
    category: "Personal Growth",
    story: "",
    video: "",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-fill name and email from auth context
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [isAuthenticated, user]);

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to upload a cover image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setFormData(prev => ({ 
        ...prev, 
        image: asset.uri,
        // We temporarily store the base64 string on the form data so we can send it directly
        // But since formData.image is typed as string | null, we'll store it in a new field or use it later.
        imageBase64: asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : null 
      } as any));
    }
  };

  const removeImage = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.title || !formData.story) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Convert local image URI to base64 for upload
      let imagesArray: string[] = [];
      if ((formData as any).imageBase64) {
         imagesArray = [(formData as any).imageBase64];
      } else if (formData.image && formData.image.startsWith('data:')) {
         imagesArray = [formData.image];
      }

      await submitStory({
        name: formData.name,
        email: formData.email,
        title: formData.title,
        story: formData.story,
        category: formData.category,
        images: imagesArray,
        video: formData.video || undefined,
      }, isAuthenticated);
      setIsSubmitted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setFormData({
        name: isAuthenticated && user ? user.name || "" : "",
        email: isAuthenticated && user ? user.email || "" : "",
        title: "",
        category: "Personal Growth",
        story: "",
        video: "",
        image: null,
      });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to submit story.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AuroraBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.delay(200)}
          style={[styles.header, { paddingTop: insets.top + 90 }]}
        >
          <LinearGradient
            colors={[colors.emerald + "30", colors.emerald + "05"]}
            style={styles.iconWrapper}
          >
            <View style={[styles.iconContainer, { borderColor: colors.emerald + "40" }]}>
              <Ionicons name="create-outline" size={32} color={colors.emerald} />
            </View>
          </LinearGradient>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Share Your{"\n"}
            <Text style={{ color: colors.emerald }}>Legend.</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Your experiences inspire others. Submit your journey below for review.
          </Text>
        </Animated.View>

        {/* Form Container */}
        <View style={styles.form}>
          
          {/* Section 1: Story Details */}
          <Section CardTitle="The Content" colors={colors} number="1">
            <InputField
              label="Author Name"
              placeholder="Jane Doe"
              value={formData.name}
              onChangeText={(v: string) => updateField("name", v)}
              colors={colors}
              required
            />
            <InputField
              label="Author Email"
              placeholder="jane@example.com"
              value={formData.email}
              onChangeText={(v: string) => updateField("email", v)}
              colors={colors}
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />
            <InputField
              label="Journey Title"
              placeholder="e.g. My Career Pivot"
              value={formData.title}
              onChangeText={(v: string) => updateField("title", v)}
              colors={colors}
              required
            />
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                NARRATIVE <Text style={{ color: colors.emerald }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.card + "40",
                    borderColor: colors.border + "60",
                    color: colors.foreground,
                  },
                ]}
                placeholder="Pour your thoughts here..."
                placeholderTextColor={colors.mutedForeground + "70"}
                value={formData.story}
                onChangeText={(v: string) => updateField("story", v)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </Section>

          {/* Section 2: Visuals & Category */}
          <Section CardTitle="Visuals & Context" colors={colors} number="2">
            
            {/* Image Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                STORY COVER IMAGE
              </Text>
              {formData.image ? (
                <Animated.View 
                  layout={Layout.springify()}
                  entering={FadeInDown}
                  style={styles.imagePreviewContainer}
                >
                  <Image 
                    source={{ uri: formData.image }} 
                    style={styles.imagePreview} 
                    contentFit="cover"
                  />
                  <Pressable 
                    onPress={removeImage}
                    style={styles.removeImageBtn}
                  >
                    <BlurView intensity={80} tint="dark" style={styles.removeImageBlur}>
                      <Ionicons name="close" size={20} color="#fff" />
                    </BlurView>
                  </Pressable>
                </Animated.View>
              ) : (
                <Pressable
                  onPress={pickImage}
                  style={({ pressed }) => [
                    styles.imagePlaceholder,
                    { 
                      backgroundColor: colors.card + "40",
                      borderColor: colors.border + "60",
                      opacity: pressed ? 0.7 : 1
                    }
                  ]}
                >
                  <Ionicons name="camera-outline" size={32} color={colors.emerald} />
                  <Text style={[styles.imagePlaceholderText, { color: colors.mutedForeground }]}>
                    Upload Cover Photo
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                CATEGORY
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      updateField("category", cat);
                    }}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: formData.category === cat ? colors.emerald : colors.card + "60",
                        borderColor: formData.category === cat ? colors.emerald : colors.border + "40",
                      },
                    ]}
                  >
                    <Text style={[
                      styles.categoryText,
                      { color: formData.category === cat ? "#fff" : colors.foreground }
                    ]}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <InputField
              label="Video Link (Optional)"
              placeholder="https://..."
              value={formData.video}
              onChangeText={(v: string) => updateField("video", v)}
              colors={colors}
            />
          </Section>

          {/* Submit Button */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.submitButton,
                { opacity: (isSubmitting || pressed) ? 0.8 : 1 }
              ]}
            >
              <LinearGradient
                colors={isSubmitted ? ["#10b981", "#059669"] : [colors.emerald, colors.emerald + "DD"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitGradient}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : isSubmitted ? (
                  <View style={styles.btnContent}>
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                    <Text style={styles.submitText}>Story Submitted!</Text>
                  </View>
                ) : (
                  <View style={styles.btnContent}>
                    <Text style={styles.submitText}>Submit for Review</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </View>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
            By submitting, you agree to our community guidelines. Your story will be reviewed before going live.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </AuroraBackground>
  );
}

function Section({ children, CardTitle, colors, number }: any) {
  return (
    <Animated.View layout={Layout.springify()} style={styles.section}>
      <BlurView intensity={20} tint={colors.background === '#fff' ? 'light' : 'dark'} style={[styles.blurSection, { borderColor: colors.border + "30" }]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: colors.emerald + "20" }]}>
            <Text style={{ color: colors.emerald, fontWeight: "900", fontSize: 12 }}>{number}</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{CardTitle}</Text>
        </View>
        {children}
      </BlurView>
    </Animated.View>
  );
}

function InputField({ label, placeholder, value, onChangeText, colors, required }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
        {label.toUpperCase()} {required && <Text style={{ color: colors.emerald }}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.card + "40",
            borderColor: colors.border + "60",
            color: colors.foreground,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground + "70"}
        value={value}
        onChangeText={(v) => {
          if (v.length > 0 && value.length === 0) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onChangeText(v);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingHorizontal: 32,
    marginBottom: 40,
  },
  iconWrapper: {
    padding: 12,
    borderRadius: 24,
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1.5,
    lineHeight: 46,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
    fontWeight: "300",
  },
  form: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  blurSection: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  sectionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 160,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 16,
    lineHeight: 24,
  },
  imagePlaceholder: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontWeight: "600",
  },
  imagePreviewContainer: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageBtn: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  removeImageBlur: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  categoryScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1.5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "700",
  },
  submitButton: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 10,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitGradient: {
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  disclaimer: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});
