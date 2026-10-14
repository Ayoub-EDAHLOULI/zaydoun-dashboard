// Joins class names, skipping falsy values. No tailwind-merge: components
// expose variants instead of relying on className overrides.
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
