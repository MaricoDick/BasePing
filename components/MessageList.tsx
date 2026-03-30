import { MessageCard } from "@/components/MessageCard";
import type { PingMessage } from "@/lib/basePing";

type MessageListProps = {
  messages: PingMessage[];
  loading: boolean;
  onRefresh: () => void;
};

export function MessageList({ messages, loading, onRefresh }: MessageListProps) {
  return (
    <section className="surface message-list">
      <div className="message-list-top">
        <strong>Latest Pings</strong>
        <button
          className="btn btn-secondary btn-inline"
          type="button"
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="small-note">Reading onchain messages...</p>
      ) : messages.length === 0 ? (
        <p className="small-note">No messages yet. Create the first ping.</p>
      ) : (
        messages.map((message) => (
          <MessageCard key={message.index.toString()} message={message} />
        ))
      )}
    </section>
  );
}
