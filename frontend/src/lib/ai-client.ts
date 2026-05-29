import { API_URL } from "@/lib/api";

export async function askEstateAI(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = []
) {
  try {
    const response = await fetch(`${API_URL}/api/v1/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: history.map((h) => ({ role: h.role, content: h.content })),
      }),
    });
    if (!response.ok) throw new Error("API unavailable");
    const payload = await response.json();
    return payload.message as string;
  } catch {
    return "EstateAI is currently in offline mode. I can still help: focus on high rental demand, low-risk multifamily, and positive appreciation corridors.";
  }
}
