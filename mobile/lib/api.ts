import { storage } from "./storage";
import { Platform } from "react-native";

// Configuration for the backend API
// During build time, EXPO_PUBLIC_API_URL is inlined.
// Production URL is used as fallback so standalone APK builds always work.
const PRODUCTION_URL = "https://the-journey-craft.vercel.app";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || PRODUCTION_URL;

console.log("[API] Connecting to:", API_BASE_URL); // Log for debugging

export async function getToken(): Promise<string | null> {
  return storage.getItem("auth_token");
}

export async function setToken(token: string): Promise<void> {
  await storage.setItem("auth_token", token);
}

export async function removeToken(): Promise<void> {
  await storage.removeItem("auth_token");
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
    } else {
      console.warn(`[API] No auth token found for authenticated request to ${endpoint}`);
      throw new Error("Not authenticated — please log in again");
    }
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...rest,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    console.error(`[API] ${endpoint} failed with ${res.status}:`, errorBody.error);
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

// ── Typed API methods ──

export async function login(email: string, password: string) {
  const data = await apiFetch<{
    success: boolean;
    token: string;
    user: { id: string; name: string; email: string; role: string; image?: string | null };
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
  const data = await apiFetch<{ success: boolean; stories: any[] }>("/api/submissions/approved");
  return data.stories;
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
    body: JSON.stringify({
      name: storyData.name,
      email: storyData.email,
      title: storyData.title,
      story: storyData.story,
      category: storyData.category,
      images: storyData.images || [],
      video: storyData.video || "",
    }),
  });
}

export async function fetchNotifications() {
  const data = await apiFetch<{ notifications: any[] }>("/api/notifications", {
    authenticated: true,
  });
  return data.notifications;
}

export async function markNotificationAsRead(id?: string) {
  return apiFetch("/api/notifications", {
    method: "PATCH",
    authenticated: true,
    body: JSON.stringify({ id }),
  });
}

export async function fetchUserProfile() {
  const data = await apiFetch<{ user: { name: string; email: string; role: string; image?: string } }>(
    "/api/user/profile",
    { authenticated: true }
  );
  return data.user;
}

export async function updateUserProfile(profileData: { name: string; image?: string }) {
  return apiFetch("/api/user/profile", {
    method: "PUT",
    authenticated: true,
    body: JSON.stringify(profileData),
  });
}
