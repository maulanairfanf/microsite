export const DEFAULT_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

export class UploadError extends Error {
  constructor(
    message: string,
    public readonly code: "no_file" | "invalid_type" | "too_large" | "server" | "network",
  ) {
    super(message);
    this.name = "UploadError";
  }
}

export interface UploadOptions {
  allowedTypes?: readonly string[];
  maxSize?: number;
  endpoint?: string;
}

export async function uploadFile(file: File, options: UploadOptions = {}): Promise<string> {
  const allowedTypes = options.allowedTypes ?? DEFAULT_ALLOWED_TYPES;
  const maxSize = options.maxSize ?? DEFAULT_MAX_SIZE;
  const endpoint = options.endpoint ?? "/api/upload";

  if (!file) {
    throw new UploadError("No file provided", "no_file");
  }
  if (!allowedTypes.includes(file.type)) {
    throw new UploadError(
      `Invalid file type "${file.type}". Allowed: ${allowedTypes.join(", ")}`,
      "invalid_type",
    );
  }
  if (file.size > maxSize) {
    const mb = (maxSize / 1024 / 1024).toFixed(0);
    throw new UploadError(`File too large (max ${mb}MB)`, "too_large");
  }

  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetch(endpoint, { method: "POST", body: formData });
  } catch (err) {
    throw new UploadError(
      err instanceof Error ? err.message : "Network error during upload",
      "network",
    );
  }

  if (!res.ok) {
    let message = `Upload failed (${res.status})`;
    try {
      const err = (await res.json()) as { error?: string };
      if (err.error) message = err.error;
    } catch {}
    throw new UploadError(message, "server");
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) {
    throw new UploadError("Server did not return a file URL", "server");
  }
  return data.url;
}
