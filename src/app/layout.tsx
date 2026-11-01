import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Budgetting | Personal cash-flow planning",
  description: "Plan household spending around salary, savings and dividends.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header>
          <Link className="brand" href="/">Budgetting<span>Personal cash-flow planning</span></Link>
          <nav aria-label="Main navigation">
            <Link href="/">Overview</Link>
            <Link href="/transactions">Transactions</Link>
            <Link href="/accounts">Accounts</Link>
            <Link href="/forecasts">Forecasts</Link>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer>Development skeleton · No financial data connected</footer>
      </body>
    </html>
  );
}
