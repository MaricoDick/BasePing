import { StatusChip } from "@/components/StatusChip";
import { formatDateTime, shortAddress, timeAgo } from "@/lib/format";
import type { PingMessage } from "@/lib/basePing";

type MessageCardProps = {
  message: PingMessage;
};

export function MessageCard({ message }: MessageCardProps) {
  return (
    <article className="message-card">
      <div className="message-head">
        <span className="address">{shortAddress(message.user)}</span>
        <StatusChip tone="active">Onchain</StatusChip>
      </div>
      <p className="message-content">{message.content}</p>
      <footer className="message-foot">
        <span>{timeAgo(message.time)}</span>
        <span>{formatDateTime(message.time)}</span>
      </footer>
    </article>
  );
}
