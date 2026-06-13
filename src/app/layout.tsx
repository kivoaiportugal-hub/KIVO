import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kivo | Delivery operations copilot for Uber Eats",
  description:
    "Kivo is an AI delivery operations copilot for restaurants, built by chefs for chefs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
