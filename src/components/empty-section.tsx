import Link from "next/link";

export function EmptySection({ title, description, next }: { title: string; description: string; next: string }) {
  return <>
    <p className="eyebrow">Workspace foundation</p>
    <h1>{title}</h1>
    <p className="intro">{description}</p>
    <section className="notice"><h2>Not connected yet</h2><p>{next}</p></section>
    <Link className="back-link" href="/">← Back to overview</Link>
  </>;
}
