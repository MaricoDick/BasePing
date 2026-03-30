import type { FormEvent } from "react";

type ComposerCardProps = {
  content: string;
  remaining: number;
  txHash: `0x${string}` | null;
  error: string | null;
  isBusy: boolean;
  isConnected: boolean;
  isChainMismatch: boolean;
  isSwitchingChain: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSwitchChain: () => void;
};

export function ComposerCard({
  content,
  remaining,
  txHash,
  error,
  isBusy,
  isConnected,
  isChainMismatch,
  isSwitchingChain,
  onChange,
  onSubmit,
  onSwitchChain,
}: ComposerCardProps) {
  return (
    <section className="surface">
      <form className="compose-form" onSubmit={onSubmit}>
        <textarea
          className="compose-textarea"
          value={content}
          onChange={(event) => onChange(event.target.value)}
          maxLength={140}
          placeholder="Write your ping..."
          aria-label="Ping content"
        />

        <div className="compose-foot">
          <span className={`char-left ${remaining < 0 ? "over" : ""}`}>
            Remaining {remaining}
          </span>
          <span>{isBusy ? "Waiting for confirmation..." : "Up to 140 chars"}</span>
        </div>

        {isChainMismatch ? (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onSwitchChain}
            disabled={isSwitchingChain}
          >
            {isSwitchingChain ? "Switching..." : "Switch to Base"}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isBusy || !isConnected || !content.trim()}
          >
            {isBusy ? "Submitting..." : "Send Onchain"}
          </button>
        )}
      </form>

      {txHash ? (
        <p className="feedback feedback-success">
          tx hash:{" "}
          <a
            className="inline-link"
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            {txHash}
          </a>
        </p>
      ) : null}

      {error ? <p className="feedback feedback-error">{error}</p> : null}
    </section>
  );
}
