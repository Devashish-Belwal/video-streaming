export const parseRange = (header: unknown, fileSize: number) => {
  if (!header || typeof header !== "string" || !header.startsWith("bytes=")) return null;
  const part = header.slice(6);
  if (part === "" || part.includes(",")) return undefined;

  if (part.startsWith("-")) {
    const suffix = parseInt(part.slice(1), 10);
    if (isNaN(suffix) || suffix <= 0) return undefined;
    const start = Math.max(0, fileSize - suffix);
    return { start, end: Math.min(fileSize - 1, start + suffix - 1) };
  }

  const [startStr, endStr] = part.split("-");
  const start = parseInt(startStr, 10);
  if (isNaN(start) || start < 0) return undefined;
  if (start >= fileSize) return undefined;

  if (endStr === undefined || endStr === "") {
    return { start, end: fileSize - 1 };
  }

  const end = parseInt(endStr, 10);
  if (isNaN(end) || end < 0 || start > end) return undefined;
  return { start, end: Math.min(end, fileSize - 1) };
};
