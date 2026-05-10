import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import CustomCursor from "@/components/ui/CustomCursor";
import "./globals.css";

const geist = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-editorial",
  subsets: ["latin"],
  style: ["italic"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Làjà — Senior Product Designer",
  description:
    "Abdulmuiz Adelaja (Làjà) — Senior Product Designer and UX Lead. 6+ years, 80+ projects, outcomes-driven design from Lagos to the world.",
  keywords: [
    "product designer",
    "UX design",
    "UI design",
    "fintech design",
    "Nigeria",
    "Lagos",
    "Abdulmuiz Adelaja",
    "Làjà",
  ],
  authors: [{ name: "Abdulmuiz Adelaja" }],
  openGraph: {
    title: "Làjà — Senior Product Designer",
    description:
      "Outcomes-driven design. 6+ years, 80+ projects, numbers that hold.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-dvh">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
