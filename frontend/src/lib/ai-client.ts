import { apiFetch } from "@/lib/api";

export async function askEstateAI(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = []
) {
  try {
    const payload = await apiFetch<{ message: string }>("/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        history: history.map((h) => ({ role: h.role, content: h.content })),
      }),
    });
    return payload.message as string;
  } catch {
    return "EstateAI is currently in offline mode. I can still help: focus on high rental demand, low-risk multifamily, and positive appreciation corridors.";
  }
}
