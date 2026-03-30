type PingHeaderProps = {
  title: string;
  subtitle: string;
};

export function PingHeader({ title, subtitle }: PingHeaderProps) {
  return (
    <header className="ping-header">
      <h1 className="ping-title">{title}</h1>
      <p className="ping-subtitle">{subtitle}</p>
    </header>
  );
}
