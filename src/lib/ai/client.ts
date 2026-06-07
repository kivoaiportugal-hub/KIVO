let _ai: any = null;

export async function getAI() {
  if (!_ai) {
    const apiKey = process.env.NVIDIA_API_KEY;
    const baseURL = process.env.NVIDIA_BASE_URL;
    if (!apiKey) {
      throw new Error(
        "NVIDIA_API_KEY is not configured. Add it in Vercel → Settings → Environment Variables."
      );
    }
    const { default: OpenAI } = await import("openai");
    _ai = new OpenAI({
      apiKey,
      baseURL: baseURL || "https://integrate.api.nvidia.com/v1",
    });
  }
  return _ai;
}
