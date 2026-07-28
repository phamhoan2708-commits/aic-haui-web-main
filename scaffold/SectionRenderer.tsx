import type { ReactNode } from "react";
import type { ContentState } from "../content/types";

export function SectionRenderer<T>({
  state,
  scaffold,
  children,
}: {
  state: ContentState<T>;
  scaffold?: ReactNode;
  children: ReactNode;
}) {
  if (state.status === "empty") return null;
  if (state.status === "scaffold") return scaffold ?? null;
  return children;
}
