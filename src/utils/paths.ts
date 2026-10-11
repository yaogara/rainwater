const rawBase =
  (import.meta.env.PUBLIC_BASE_PATH as string | undefined) ??
  (import.meta.env.BASE_URL as string | undefined) ??
  "/";
const normalizedBase =
  rawBase === "/"
    ? ""
    : rawBase.endsWith("/")
      ? rawBase.slice(0, -1)
      : rawBase;

const protocolRegex = /^[a-z][a-z0-9+.-]*:/i;

export const getBasePath = () => normalizedBase;

export const withBase = (path: string) => {
  if (!path || path.startsWith("#") || path.startsWith("//") || protocolRegex.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const suffixIndex = normalizedPath.search(/[?#]/);
  const pathname = suffixIndex < 0 ? normalizedPath : normalizedPath.slice(0, suffixIndex);
  const suffix = suffixIndex < 0 ? "" : normalizedPath.slice(suffixIndex);
  const canonicalPath = pathname !== "/" && !pathname.endsWith("/") && !/\.[^/]+$/.test(pathname)
    ? `${pathname}/`
    : pathname;

  if (!normalizedBase) {
    return `${canonicalPath}${suffix}`;
  }

  return `${normalizedBase}${canonicalPath}${suffix}`;
};
