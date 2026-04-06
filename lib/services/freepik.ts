const FREEPIK_API_BASE = "https://api.freepik.com";
const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;

export type FreepikSearchParams = {
  term: string;
  page?: number;
  limit?: number;
  order?: "relevance" | "recent";
  slug?: string;
  acceptLanguage?: string;
};

export type FreepikGenerateImageParams = {
  prompt: string;
  negativePrompt?: string;
  guidanceScale?: number;
  seed?: number;
  numImages?: number;
  size?:
    | "square_1_1"
    | "classic_4_3"
    | "traditional_3_4"
    | "widescreen_16_9"
    | "social_story_9_16"
    | "standard_3_2"
    | "portrait_2_3"
    | "horizontal_2_1"
    | "vertical_1_2"
    | "social_post_4_5";
  filterNsfw?: boolean;
};

type FreepikErrorPayload = {
  message?: string;
  error?: string;
};

function getFreepikHeaders(extraHeaders?: HeadersInit) {
  return {
    "Content-Type": "application/json",
    "x-freepik-api-key": FREEPIK_API_KEY ?? "",
    ...extraHeaders
  };
}

async function parseFreepikError(response: Response) {
  const payload = (await response.json().catch(() => null)) as FreepikErrorPayload | null;
  return payload?.message ?? payload?.error ?? `Freepik request failed with ${response.status}.`;
}

async function freepikFetch<T>(pathname: string, init?: RequestInit): Promise<T> {
  if (!FREEPIK_API_KEY) {
    throw new Error("Freepik API is not configured.");
  }

  const response = await fetch(`${FREEPIK_API_BASE}${pathname}`, {
    ...init,
    headers: getFreepikHeaders(init?.headers)
  });

  if (!response.ok) {
    throw new Error(await parseFreepikError(response));
  }

  return response.json() as Promise<T>;
}

export function isFreepikConfigured() {
  return Boolean(FREEPIK_API_KEY);
}

export async function searchFreepikResources(params: FreepikSearchParams) {
  const searchParams = new URLSearchParams({
    term: params.term,
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 12),
    order: params.order ?? "relevance"
  });

  if (params.slug) {
    searchParams.set("slug", params.slug);
  }

  return freepikFetch(`/v1/resources?${searchParams.toString()}`, {
    headers: params.acceptLanguage
      ? {
          "Accept-Language": params.acceptLanguage
        }
      : undefined
  });
}

export async function generateFreepikImages(params: FreepikGenerateImageParams) {
  return freepikFetch<{
    data: Array<{
      base64: string;
      has_nsfw: boolean;
    }>;
    meta: {
      image: {
        size: string;
        width: number;
        height: number;
      };
      seed?: number;
      guidance_scale?: number;
      prompt: string;
      num_inference_steps?: number;
    };
  }>("/v1/ai/text-to-image", {
    method: "POST",
    body: JSON.stringify({
      prompt: params.prompt,
      negative_prompt: params.negativePrompt,
      guidance_scale: params.guidanceScale ?? 1,
      seed: params.seed,
      num_images: params.numImages ?? 1,
      image: {
        size: params.size ?? "square_1_1"
      },
      filter_nsfw: params.filterNsfw ?? true
    })
  });
}

export function toFreepikDataUrl(base64: string, mimeType = "image/png") {
  return `data:${mimeType};base64,${base64}`;
}
