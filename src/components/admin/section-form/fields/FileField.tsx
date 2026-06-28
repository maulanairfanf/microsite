import { FileUpload } from "@/components/admin/FileUpload";
import type { FieldContext } from "../types";

function parseAspectRatio(ratio: string): number | null {
  const parts = ratio.split(":").map(Number);
  const [width, height] = parts;

  if (
    parts.length !== 2 ||
    parts.some(isNaN) ||
    width === undefined ||
    height === undefined ||
    width === 0 ||
    height === 0
  ) {
    return null;
  }

  return width / height;
}

export function FileField({ field, path, value, update }: FieldContext) {
  const aspectRatio = field.aspectRatio ? parseAspectRatio(field.aspectRatio) : null;
  console.log("field", field);
  const previewWidth = field.width || 400;

  return (
    <FileUpload
      value={(value as string) || undefined}
      onChange={(url) => update(path, url)}
      label={field.label}
      previewWidth={previewWidth}
      previewHeight={aspectRatio ? Math.round(previewWidth / aspectRatio) : 160}
    />
  );
}
