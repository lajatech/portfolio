import type { Metadata } from "next";
import { Anton, Manrope } from "next/font/google";
import "./globals.css";

/* Anton carries every headline. It only ships one weight, which is the point:
   the hierarchy comes from scale and the artboard unit, not from weight. */
const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Làjà, Senior Product Designer in Lagos",
  description:
    "Abdulmuiz Adelaja (Làjà) is a Senior Product Designer and UX Lead. A statistics degree behind every design decision: +1050% loan completion, 640% AOV, numbers that hold.",
  keywords: [
    "product designer",
    "UX design",
    "UI design",
    "fintech design",
    "design lead",
    "Nigeria",
    "Lagos",
    "Abdulmuiz Adelaja",
    "Làjà",
  ],
  authors: [{ name: "Abdulmuiz Adelaja" }],
  openGraph: {
    title: "Làjà, Senior Product Designer",
    description:
      "Outcomes-driven product design. 6+ years, 80+ projects, numbers that hold.",
    type: "website",
    url: "https://muizadelaja.online",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@lajanumba",
    title: "Làjà, Senior Product Designer",
    description: "Outcomes-driven product design. Numbers that hold.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
