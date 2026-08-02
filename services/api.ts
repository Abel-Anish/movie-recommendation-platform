const DEFAULT_TIMEOUT = 10000;

export type ApiError = {
  message: string;
  status?: number;
};

export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(init?.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(message);
  } finally {
    clearTimeout(timeout);
  }
}

export function buildTmdbUrl(path: string, query?: Record<string, string>) {
  const base = `https://api.themoviedb.org/3${path}`;
  const params = new URLSearchParams({
    api_key: process.env.TMDB_API_KEY || "",
    ...query,
  });

  return `${base}?${params.toString()}`;
}
