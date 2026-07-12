import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { uploadFile, UploadError, DEFAULT_ALLOWED_TYPES, DEFAULT_MAX_SIZE } from "@/lib/uploadFile";

function makeFile(opts: { name?: string; type?: string; size?: number } = {}): File {
  const blob = new Blob(["x".repeat(opts.size ?? 10)], { type: opts.type ?? "image/png" });
  return new File([blob], opts.name ?? "test.png", { type: opts.type ?? "image/png" });
}

describe("uploadFile", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the url from a successful upload", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ url: "https://blob.example/abc.png" }), { status: 200 }),
    );

    const url = await uploadFile(makeFile());
    expect(url).toBe("https://blob.example/abc.png");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws UploadError with no_file code when file is missing", async () => {
    await expect(
      uploadFile(null as unknown as File),
    ).rejects.toMatchObject({ name: "UploadError", code: "no_file" });
  });

  it("throws UploadError with invalid_type code for disallowed MIME type", async () => {
    const fetchMock = vi.mocked(fetch);
    await expect(uploadFile(makeFile({ type: "application/pdf" }))).rejects.toBeInstanceOf(
      UploadError,
    );
    try {
      await uploadFile(makeFile({ type: "application/pdf" }));
    } catch (err) {
      expect((err as UploadError).code).toBe("invalid_type");
      expect((err as UploadError).message).toContain("application/pdf");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws UploadError with too_large code when file exceeds limit", async () => {
    const fetchMock = vi.mocked(fetch);
    const big = makeFile({ size: 11 * 1024 * 1024 });
    try {
      await uploadFile(big);
    } catch (err) {
      expect((err as UploadError).code).toBe("too_large");
      expect((err as UploadError).message).toContain("10MB");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws UploadError with server code when response is non-2xx", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "Blob store full" }), { status: 500 }),
    );
    try {
      await uploadFile(makeFile());
    } catch (err) {
      expect((err as UploadError).code).toBe("server");
      expect((err as UploadError).message).toBe("Blob store full");
    }
  });

  it("throws UploadError with server code when response is non-2xx and no JSON error body", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(new Response("plain text body", { status: 500 }));
    try {
      await uploadFile(makeFile());
    } catch (err) {
      expect((err as UploadError).code).toBe("server");
      expect((err as UploadError).message).toBe("Upload failed (500)");
    }
  });

  it("throws UploadError with network code when fetch rejects", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockRejectedValueOnce(new Error("connection refused"));
    try {
      await uploadFile(makeFile());
    } catch (err) {
      expect((err as UploadError).code).toBe("network");
      expect((err as UploadError).message).toBe("connection refused");
    }
  });

  it("throws UploadError with server code when url is missing in response", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));
    try {
      await uploadFile(makeFile());
    } catch (err) {
      expect((err as UploadError).code).toBe("server");
      expect((err as UploadError).message).toBe("Server did not return a file URL");
    }
  });

  it("uses custom endpoint, allowedTypes, and maxSize when provided", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ url: "https://x/y.png" }), { status: 200 }),
    );
    await uploadFile(makeFile({ type: "image/svg+xml" }), {
      allowedTypes: ["image/svg+xml"],
      maxSize: 1024,
      endpoint: "/api/custom-upload",
    });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("/api/custom-upload");
    expect(init).toMatchObject({ method: "POST" });
  });

  it("exports the default allowed types and max size", () => {
    expect(DEFAULT_ALLOWED_TYPES).toContain("image/png");
    expect(DEFAULT_MAX_SIZE).toBe(10 * 1024 * 1024);
  });
});
