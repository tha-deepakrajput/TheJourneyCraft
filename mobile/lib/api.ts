import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Use your machine's local IP for physical device testing.
// Use localhost for simulators/emulators.
const API_BASE_URL = __DEV__
  ? Platform.OS === "android"
    ? "http://10.0.2.2:3000" // Android emulator loopback
    : "http://localhost:3000"
  : "https://your-production-url.com"; // Replace with your deployed URL

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync("auth_token");
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync("auth_token", token);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync("auth_token");
}

interface FetchOptions extends RequestInit {
  authenticated?: boolean;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { authenticated = false, headers: extraHeaders, ...rest } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (authenticated) {
    const token = await getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...rest,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

// ── Typed API methods ──

export async function login(email: string, password: string) {
  const data = await apiFetch<{
    success: boolean;
    token: string;
    user: { id: string; name: string; email: string; role: string };
  }>("/api/auth/mobile-login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data.success && data.token) {
    await setToken(data.token);
  }

  return data;
}

export async function fetchJourneys() {
  const data = await apiFetch<{
    success: boolean;
    journeys: any[];
  }>("/api/journeys");
  return data.journeys;
}

export async function fetchStories() {
  const data = await apiFetch<any[]>("/api/submissions/approved");
  return data;
}

export async function submitStory(storyData: {
  name: string;
  email: string;
  title: string;
  story: string;
  category: string;
  images?: string[];
  video?: string;
}) {
  return apiFetch("/api/submissions", {
    method: "POST",
    body: JSON.stringify(storyData),
  });
}
