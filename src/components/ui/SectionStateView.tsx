import type { ReactNode } from "react";
import type { SectionState } from "../../content/types";
import { EmptySection } from "./EmptySection";

export function SectionStateView({
  state,
  emptyLabel,
  children,
}: {
  state: SectionState;
  emptyLabel: string;
  children: ReactNode;
}) {
  if (state === "hidden") return null;
  if (state === "empty") return <EmptySection title={emptyLabel} />;
  return <>{children}</>;
}
