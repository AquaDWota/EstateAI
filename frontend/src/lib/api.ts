import { supabase } from "@/lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = supabase
    ? (await supabase.auth.getSession()).data.session?.access_token ?? null
    : null;
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    let detail = `API error: ${res.status}`;
    try {
      const payload = (await res.json()) as { detail?: string; message?: string; error?: string };
      detail = payload.detail || payload.message || payload.error || detail;
    } catch {
      // keep default message
    }
    throw new Error(detail);
  }
  return res.json();
}

export { API_URL };
