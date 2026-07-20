
async function fetchWithRetry(url: string, options: RequestInit, retries = 1, backoff = 2000): Promise<Response> {
  try {
    const response = await fetch(url, options);
    if (response.status === 503 && retries > 0) {
      console.warn(`Whale AI experienced high demand (503). Retrying in ${backoff}ms... (${retries} attempt left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 1.5);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 1.5);
    }
    throw error;
  }
}

export const generateBlogSeed = async (count: number = 5): Promise<unknown[]> => {
  try {
    const response = await fetchWithRetry("/api/ai/generate-blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
    });

    const contentType = response.headers.get("content-type");
    let errorData: { error?: string; advice?: string } | null = null;
    
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (response.ok) return data as unknown[];
      errorData = data;
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Neural disruption (${response.status}). Please standby.`);
      }
      try {
        return JSON.parse(text) as unknown[];
      } catch {
        return [];
      }
    }

    if (!response.ok) {
      let message = errorData?.error || "Neural transmission failure.";
      const errorStr = JSON.stringify(errorData).toUpperCase();
      
      if (errorStr.includes("API_KEY_INVALID") || errorStr.includes("PERMISSION_DENIED")) {
        message = "Whale AI node disconnected. Configuration required.";
      } else if (errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("429")) {
        message = errorData?.advice || "Neural core exhausted. Cooling down...";
      } else if (errorStr.includes("OVERLOADED") || errorStr.includes("503") || response.status === 503) {
        message = "Whale AI is experiencing extreme demand. Retrying...";
      }
      throw new Error(message);
    }
    return [];
  } catch (error: unknown) {
    console.error("AI Generation Critical Path Error:", error);
    throw error;
  }
};

export const getAiResponse = async (messages: { role: string, text: string }[]): Promise<string> => {
  try {
    const response = await fetchWithRetry("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    const contentType = response.headers.get("content-type");
    let errorData: { error?: string; advice?: string } | null = null;

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (response.ok) return data.text as string;
      errorData = data;
    } else {
      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Interface interference (${response.status}).`);
      }
      return text;
    }

    if (!response.ok) {
      let message = errorData?.error || "Neural interface timeout.";
      const errorStr = JSON.stringify(errorData).toUpperCase();

      if (errorStr.includes("API_KEY_INVALID") || errorStr.includes("PERMISSION_DENIED")) {
        message = "Neural link failed. Security verification required.";
      } else if (errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("429")) {
        message = errorData?.advice || "Neural core bandwidth limit reached.";
      } else if (errorStr.includes("OVERLOADED") || errorStr.includes("503") || response.status === 503) {
        message = "Neural core synchronized at max capacity. Try again in 5s.";
      }
      throw new Error(message);
    }
    return "";
  } catch (error: unknown) {
    console.error("AI Interface Critical Path Error:", error);
    throw error;
  }
};
