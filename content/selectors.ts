import type { ContentState } from "./types";

export function resolveSectionState<T>(
  items: readonly T[],
  scaffoldMode = uiScaffoldMode,
  expectedCount?: number,
): ContentState<T> {
  if (items.length > 0) return { status: "ready", items: [...items] };
  if (scaffoldMode) return { status: "scaffold", expectedCount };
  return { status: "empty" };
}

export const uiScaffoldMode = import.meta.env.VITE_UI_SCAFFOLD_MODE === "true";
