import type { ApiResponse, QueryParams } from "./types";

export function buildQuery(params: QueryParams) {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));
  query.set("sort", params.sort);
  query.set("order", params.order);

  if (params.from && params.from.trim()) query.set("from", params.from.trim());
  if (params.to && params.to.trim()) query.set("to", params.to.trim());

  return query.toString();
}

//Made of copilot suggestion and minor modifications
export async function fetchDailyStats(
  params: QueryParams,
  options?: { signal?: AbortSignal },
): Promise<ApiResponse> {
  const query = buildQuery(params);

  //Get the data from the backend-file
  const response = await fetch(`/api/statistics?${query}`, {
    signal: options?.signal,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  return (await response.json()) as ApiResponse;
}
