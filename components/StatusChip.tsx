import type { ReactNode } from "react";

type StatusTone = "neutral" | "active" | "success" | "pending";

type StatusChipProps = {
  children: ReactNode;
  tone?: StatusTone;
};

export function StatusChip({ children, tone = "neutral" }: StatusChipProps) {
  return <span className={`status-chip status-${tone}`}>{children}</span>;
}
