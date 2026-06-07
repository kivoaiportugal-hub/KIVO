import OpenAI from "openai";

let _ai: OpenAI | null = null;

export function getAI(): OpenAI {
  if (!_ai) {
    const apiKey = process.env.NVIDIA_API_KEY;
    const baseURL = process.env.NVIDIA_BASE_URL;
    if (!apiKey) {
      throw new Error(
        "NVIDIA_API_KEY is not configured. Add it in Vercel → Settings → Environment Variables."
      );
    }
    _ai = new OpenAI({
      apiKey,
      baseURL: baseURL || "https://integrate.api.nvidia.com/v1",
    });
  }
  return _ai;
}

// Keep backward compatibility
const ai = new Proxy({} as OpenAI, {
  get(_, prop) {
    return (getAI() as any)[prop];
  },
});

export default ai;
