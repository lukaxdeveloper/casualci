import type { Metadata } from "next";
import CookieNotice from "./cookie-notice";

export const metadata: Metadata = {
  title: "Casualci — dobri komadi, bez mnogo priče",
  description: "Pažljivo odabrani casual komadi za svaki dan. Poruči pouzećem u Srbiji.",
  icons: {
    icon: "/assets/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <head><link rel="stylesheet" href="/styles.css" /></head>
      <body>{children}<CookieNotice /></body>
    </html>
  );
}
