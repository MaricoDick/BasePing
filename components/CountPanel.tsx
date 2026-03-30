import { StatusChip } from "@/components/StatusChip";

type CountPanelProps = {
  count: bigint;
  loading: boolean;
};

export function CountPanel({ count, loading }: CountPanelProps) {
  return (
    <section className="surface count-panel">
      <span className="count-label">Total Onchain Messages</span>
      <strong className="count-value">{loading ? "..." : count.toString()}</strong>
      <div className="count-meta">
        <StatusChip tone={loading ? "pending" : "active"}>
          {loading ? "Syncing" : "Live"}
        </StatusChip>
        <span className="small-note">Contract: BasePing</span>
      </div>
    </section>
  );
}
