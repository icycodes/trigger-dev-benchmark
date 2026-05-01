import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "User Onboarding",
  description: "Durable subscription onboarding with waitpoints",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}