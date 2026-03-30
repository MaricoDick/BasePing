export function shortAddress(address?: string) {
  if (!address) return "0x----";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDateTime(timestamp: bigint) {
  const date = new Date(Number(timestamp) * 1000);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function timeAgo(timestamp: bigint) {
  const now = Date.now();
  const then = Number(timestamp) * 1000;
  const diffSeconds = Math.max(Math.floor((now - then) / 1000), 0);

  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  return `${Math.floor(diffSeconds / 86400)}d ago`;
}
