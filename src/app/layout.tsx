import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kivo — AI Restaurant Growth & Operations Agent",
    template: "%s | Kivo",
  },
  description:
    "O teu agente AI para gerir e otimizar o canal de delivery. Analisa vendas, otimiza preços, sugere promoções e executa ações automaticamente.",
  keywords: [
    "delivery",
    "restaurantes",
    "inteligência artificial",
    "Uber Eats",
    "Glovo",
    "Bolt Food",
    "gestão",
    "otimização",
  ],
  authors: [{ name: "Kivo AI" }],
  creator: "Kivo AI",
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: "https://kivo.ai",
    siteName: "Kivo",
    title: "Kivo — AI Restaurant Growth & Operations Agent",
    description:
      "O teu agente AI para gerir e otimizar o canal de delivery.",
    images: [
      {
        url: "https://kivo.ai/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kivo — AI Restaurant Growth & Operations Agent",
    description:
      "O teu agente AI para gerir e otimizar o canal de delivery.",
    images: ["https://kivo.ai/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
