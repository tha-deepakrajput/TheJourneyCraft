import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  useColorScheme,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { submitStory } from "@/lib/api";
import Animated, { FadeInDown } from "react-native-reanimated";
import AuroraBackground from "@/components/AuroraBackground";

const CATEGORIES = ["Personal Growth", "Career", "Travel", "Overcoming Challenges"];

export default function SubmitScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    category: "Personal Growth",
    story: "",
    video: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.title || !formData.story) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitStory(formData);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        title: "",
        category: "Personal Growth",
        story: "",
        video: "",
      });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to submit story.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (key: string, value: string) => {
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
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${colors.emerald}15`, borderColor: `${colors.emerald}30` },
            ]}
          >
            <Ionicons name="create" size={28} color={colors.emerald} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Share Your{"\n"}
            <Text style={{ color: colors.emerald }}>Legend.</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Every journey matters. Submit your own milestone, story, or memory.
          </Text>
        </Animated.View>

        {/* Form */}
        <View style={styles.form}>
          {/* Section 1: Author Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionNumber, { backgroundColor: `${colors.emerald}20` }]}>
                <Text style={[styles.sectionNumberText, { color: colors.emerald }]}>1</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Author Details
              </Text>
            </View>

            <InputField
              label="Name"
              placeholder="Jane Doe"
              value={formData.name}
              onChangeText={(v) => updateField("name", v)}
              colors={colors}
              required
            />
            <InputField
              label="Email"
              placeholder="jane@example.com"
              value={formData.email}
              onChangeText={(v) => updateField("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
              colors={colors}
              required
            />
          </View>

          {/* Section 2: The Narrative */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionNumber, { backgroundColor: `${colors.emerald}20` }]}>
                <Text style={[styles.sectionNumberText, { color: colors.emerald }]}>2</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                The Narrative
              </Text>
            </View>

            <InputField
              label="Journey Title"
              placeholder="e.g. The day everything changed"
              value={formData.title}
              onChangeText={(v) => updateField("title", v)}
              colors={colors}
              required
            />

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                CATEGORY <Text style={{ color: colors.emerald }}>*</Text>
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 8 }}
              >
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => updateField("category", cat)}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor:
                          formData.category === cat ? colors.emerald : `${colors.muted}`,
                        borderColor:
                          formData.category === cat ? colors.emerald : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        {
                          color:
                            formData.category === cat
                              ? "#ffffff"
                              : colors.mutedForeground,
                        },
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                THE STORY <Text style={{ color: colors.emerald }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: `${colors.background}80`,
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
                placeholder="Pour your thoughts here..."
                placeholderTextColor={`${colors.mutedForeground}80`}
                value={formData.story}
                onChangeText={(v) => updateField("story", v)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Section 3: Visuals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionNumber, { backgroundColor: `${colors.emerald}20` }]}>
                <Text style={[styles.sectionNumberText, { color: colors.emerald }]}>3</Text>
              </View>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Visuals (Optional)
              </Text>
            </View>

            <InputField
              label="Video Link"
              placeholder="https://youtube.com/..."
              value={formData.video}
              onChangeText={(v) => updateField("video", v)}
              keyboardType="url"
              autoCapitalize="none"
              colors={colors}
            />
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.submitButton,
              {
                backgroundColor: isSubmitted ? colors.emerald : pressed ? `${colors.emerald}CC` : colors.emerald,
                opacity: isSubmitting ? 0.7 : 1,
              },
            ]}
          >
            {isSubmitting ? (
              <Text style={styles.submitText}>Submitting...</Text>
            ) : isSubmitted ? (
              <View style={styles.submitRow}>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text style={styles.submitText}>Submitted Successfully!</Text>
              </View>
            ) : (
              <View style={styles.submitRow}>
                <Text style={styles.submitText}>Submit for Review</Text>
                <Ionicons name="send" size={18} color="#fff" />
              </View>
            )}
          </Pressable>

          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
            Your story will be reviewed by our team before publishing.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </AuroraBackground>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  colors,
  required,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: any;
  autoCapitalize?: any;
  colors: any;
  required?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
        {label.toUpperCase()}{" "}
        {required && <Text style={{ color: colors.emerald }}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: `${colors.background}80`,
            borderColor: colors.border,
            color: colors.foreground,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={`${colors.mutedForeground}80`}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1.5,
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
    fontWeight: "300",
  },
  form: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  sectionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionNumberText: {
    fontSize: 14,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 15,
  },
  textArea: {
    minHeight: 140,
    paddingHorizontal: 16,
    paddingTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  submitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 12,
  },
});
