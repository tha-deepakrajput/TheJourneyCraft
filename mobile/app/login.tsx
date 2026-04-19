import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  useColorScheme,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/lib/theme";
import { useAuth } from "@/lib/auth-context";
import { resendCode } from "@/lib/api";
import { useRouter } from "expo-router";
import AuroraBackground from "@/components/AuroraBackground";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type AuthMode = "signin" | "signup" | "verify";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const { login, signup, verifyEmail } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verification
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(TextInput | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.requiresVerification) {
        setMode("verify");
        return;
      }
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      if (err.message?.includes("verify your email")) {
        setMode("verify");
        // Resend code automatically
        try { await resendCode(email); } catch {}
      } else {
        Alert.alert("Login Failed", err.message || "Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      setMode("verify");
      startResendCooldown();
    } catch (err: any) {
      Alert.alert("Sign Up Failed", err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(email, code);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      Alert.alert("Verification Failed", err.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendCode(email);
      startResendCooldown();
      Alert.alert("Code Sent", "A new verification code has been sent to your email.");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to resend code.");
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !verificationCode[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <AuroraBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Close button */}
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            style={[styles.closeButton, { backgroundColor: `${colors.muted}` }]}
          >
            <Ionicons name="close" size={22} color={colors.foreground} />
          </Pressable>

          <View style={styles.content}>
            {/* Icon */}
            <LinearGradient
              colors={[colors.primary + "25", colors.primary + "05"]}
              style={styles.iconGradient}
            >
              <View style={[styles.iconContainer, { borderColor: colors.primary + "30" }]}>
                <Ionicons
                  name={mode === "verify" ? "mail" : mode === "signup" ? "person-add" : "lock-closed"}
                  size={32}
                  color={colors.primary}
                />
              </View>
            </LinearGradient>

            <Text style={[styles.title, { color: colors.foreground }]}>
              {mode === "verify"
                ? "Verify Email"
                : mode === "signup"
                ? "Create Account"
                : "Welcome Back"}
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {mode === "verify"
                ? `Enter the 6-digit code sent to\n${email}`
                : mode === "signup"
                ? "Sign up to share your journey with the world"
                : "Sign in to access your dashboard"}
            </Text>

            {/* ─── VERIFICATION MODE ─── */}
            {mode === "verify" && (
              <View style={styles.form}>
                <View style={styles.codeRow}>
                  {verificationCode.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={(ref) => { codeInputRefs.current[i] = ref; }}
                      style={[
                        styles.codeInput,
                        {
                          backgroundColor: `${colors.muted}50`,
                          borderColor: digit ? colors.primary : colors.border,
                          color: colors.foreground,
                        },
                      ]}
                      value={digit}
                      onChangeText={(v) => handleCodeChange(i, v)}
                      onKeyPress={({ nativeEvent }) => handleCodeKeyPress(i, nativeEvent.key)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                      selectTextOnFocus
                    />
                  ))}
                </View>

                <Pressable
                  onPress={handleVerify}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    {
                      backgroundColor: colors.primary,
                      opacity: loading ? 0.7 : pressed ? 0.9 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
                    {loading ? "Verifying..." : "Verify Email"}
                  </Text>
                </Pressable>

                <Pressable onPress={handleResendCode} disabled={resendCooldown > 0}>
                  <Text style={[styles.linkText, { color: resendCooldown > 0 ? colors.mutedForeground : colors.primary }]}>
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
                  </Text>
                </Pressable>

                <Pressable onPress={() => { setMode("signin"); setVerificationCode(["", "", "", "", "", ""]); }}>
                  <Text style={[styles.linkText, { color: colors.mutedForeground }]}>
                    ← Back to Sign In
                  </Text>
                </Pressable>
              </View>
            )}

            {/* ─── SIGN IN MODE ─── */}
            {mode === "signin" && (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.mutedForeground }]}>EMAIL</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: `${colors.muted}50`, borderColor: colors.border }]}>
                    <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.input, { color: colors.foreground }]}
                      placeholder="your@email.com"
                      placeholderTextColor={`${colors.mutedForeground}80`}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.mutedForeground }]}>PASSWORD</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: `${colors.muted}50`, borderColor: colors.border }]}>
                    <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.input, { color: colors.foreground, flex: 1 }]}
                      placeholder="••••••••"
                      placeholderTextColor={`${colors.mutedForeground}80`}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={colors.mutedForeground}
                      />
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  onPress={handleSignIn}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    {
                      backgroundColor: colors.primary,
                      opacity: loading ? 0.7 : pressed ? 0.9 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Text>
                </Pressable>

                <View style={styles.switchRow}>
                  <Text style={[styles.switchText, { color: colors.mutedForeground }]}>
                    Don't have an account?
                  </Text>
                  <Pressable onPress={() => setMode("signup")}>
                    <Text style={[styles.switchLink, { color: colors.primary }]}> Sign Up</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* ─── SIGN UP MODE ─── */}
            {mode === "signup" && (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.mutedForeground }]}>FULL NAME</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: `${colors.muted}50`, borderColor: colors.border }]}>
                    <Ionicons name="person-outline" size={18} color={colors.mutedForeground} style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.input, { color: colors.foreground }]}
                      placeholder="Jane Doe"
                      placeholderTextColor={`${colors.mutedForeground}80`}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.mutedForeground }]}>EMAIL</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: `${colors.muted}50`, borderColor: colors.border }]}>
                    <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.input, { color: colors.foreground }]}
                      placeholder="your@email.com"
                      placeholderTextColor={`${colors.mutedForeground}80`}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.mutedForeground }]}>PASSWORD</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: `${colors.muted}50`, borderColor: colors.border }]}>
                    <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.input, { color: colors.foreground, flex: 1 }]}
                      placeholder="Min 6 characters"
                      placeholderTextColor={`${colors.mutedForeground}80`}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={colors.mutedForeground}
                      />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: colors.mutedForeground }]}>CONFIRM PASSWORD</Text>
                  <View style={[styles.inputWrapper, { backgroundColor: `${colors.muted}50`, borderColor: colors.border }]}>
                    <Ionicons name="shield-checkmark-outline" size={18} color={colors.mutedForeground} style={{ marginRight: 10 }} />
                    <TextInput
                      style={[styles.input, { color: colors.foreground }]}
                      placeholder="Re-enter password"
                      placeholderTextColor={`${colors.mutedForeground}80`}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showPassword}
                    />
                  </View>
                </View>

                <Pressable
                  onPress={handleSignUp}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    {
                      backgroundColor: colors.primary,
                      opacity: loading ? 0.7 : pressed ? 0.9 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </Text>
                </Pressable>

                <View style={styles.switchRow}>
                  <Text style={[styles.switchText, { color: colors.mutedForeground }]}>
                    Already have an account?
                  </Text>
                  <Pressable onPress={() => setMode("signin")}>
                    <Text style={[styles.switchLink, { color: colors.primary }]}> Sign In</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuroraBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  content: {
    alignItems: "center",
  },
  iconGradient: {
    padding: 14,
    borderRadius: 28,
    marginBottom: 24,
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
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 10,
    letterSpacing: -1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 36,
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  inputWrapper: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  primaryButton: {
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  switchText: {
    fontSize: 14,
    fontWeight: "500",
  },
  switchLink: {
    fontSize: 14,
    fontWeight: "800",
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 32,
  },
  codeInput: {
    width: 48,
    height: 60,
    borderRadius: 16,
    borderWidth: 2,
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
  },
});
