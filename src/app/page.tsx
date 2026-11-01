import Link from "next/link";

const areas = [
  { href: "/transactions", title: "Record everyday spending", text: "Keep income, expenses and transfers in one transaction history." },
  { href: "/accounts", title: "Know your available cash", text: "Track current accounts, savings and opening balances." },
  { href: "/forecasts", title: "Plan until your next dividend", text: "Explore salary, dividend timing and household spending together." },
];

export default function Home() {
  return (
    <>
      <p className="eyebrow">Your financial workspace</p>
      <h1>A clearer view of the months ahead.</h1>
      <p className="intro">A foundation for managing household cash flow when income arrives as both salary and dividends.</p>
      <section className="cards" aria-label="Workspace areas">
        {areas.map((area) => (
          <Link className="card" href={area.href} key={area.href}>
            <h2>{area.title}</h2><p>{area.text}</p><span>Explore section →</span>
          </Link>
        ))}
      </section>
      <aside className="notice"><h2>Ready for the first milestone</h2><p>This is the application shell. Account storage, transaction entry and forecasting will be built next. No sample balances are presented as real data.</p></aside>
    </>
  );
}
