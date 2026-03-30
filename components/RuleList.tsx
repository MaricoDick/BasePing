const RULES = [
  "Every message is permanently recorded onchain.",
  "Each message is strictly limited to 140 characters.",
  "All posted content is public and visible to everyone.",
  "Posting sends a real Base transaction and returns a tx hash.",
] as const;

export function RuleList() {
  return (
    <ul className="rule-list">
      {RULES.map((rule) => (
        <li className="rule-item" key={rule}>
          {rule}
        </li>
      ))}
    </ul>
  );
}
