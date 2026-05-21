export function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter((s) => s.length > 0);
  return segments[0] || "en";
}
