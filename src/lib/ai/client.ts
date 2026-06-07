export function getAIConfig() {
  const apiKey = process.env.NVIDIA_API_KEY;
  const baseURL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
  if (!apiKey) {
    throw new Error(
      "NVIDIA_API_KEY is not configured. Add it in Vercel → Settings → Environment Variables."
    );
  }
  return { apiKey, baseURL };
}

export async function* streamChat(model: string, messages: Array<{ role: string; content: string }>) {
  const { apiKey, baseURL } = getAIConfig();

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA API error: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        const data = trimmed.slice(6);
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {}
      }
    }
  }
}
