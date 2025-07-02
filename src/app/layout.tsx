import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script"; 
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "GameShop",
  description: "Wbesite for buying games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        />
      </head>
      <body>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
