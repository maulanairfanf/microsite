async function clientApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

export const clientApi = {
  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return clientApiRequest<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return clientApiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return clientApiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return clientApiRequest<T>(endpoint, { ...options, method: "DELETE" });
  },
};
