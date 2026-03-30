import { BottomNav } from "@/components/BottomNav";
import { PingHeader } from "@/components/PingHeader";
import { RuleList } from "@/components/RuleList";

export default function AboutPage() {
  return (
    <main className="app-shell">
      <PingHeader
        title="About BasePing"
        subtitle="A lightweight onchain bulletin board with clear posting rules."
      />

      <section className="surface spaced">
        <RuleList />
        <p className="small-note">
          Data is loaded from the deployed contract, not mocked UI data.
        </p>
      </section>

      <BottomNav />
    </main>
  );
}
