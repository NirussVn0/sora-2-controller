import { API_BASE_URL } from "../config";

interface ApiRequestOptions extends RequestInit {
  searchParams?: Record<string, string | number | boolean | undefined>;
  parseJson?: boolean;
}

const defaultHeaders = {
  "Content-Type": "application/json"
};

const buildUrl = (path: string, searchParams?: Record<string, string | number | boolean | undefined>) => {
  const url = path.startsWith("http") ? new URL(path) : new URL(path.replace(/^\//, ""), API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined) return;
      url.searchParams.set(key, String(value));
    });
  }

  return url;
};

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { searchParams, parseJson = true, headers, body, ...rest } = options;
  const url = buildUrl(path, searchParams);
  const response = await fetch(url.toString(), {
    ...rest,
    headers: body instanceof FormData ? headers : { ...defaultHeaders, ...headers },
    body
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`API request failed (${response.status}): ${detail}`);
  }

  if (!parseJson) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
