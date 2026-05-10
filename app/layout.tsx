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

const siteUrl = "https://laja.design";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Làjà — Senior Product Designer | Lagos, Nigeria",
    template: "%s | Làjà",
  },
  description:
    "Abdulmuiz Adelaja (Làjà) — Senior Product Designer and UX Lead based in Lagos, Nigeria. 6+ years building fintech, SaaS, and e-commerce products. Every design decision traced to a number — conversion, retention, revenue.",
  keywords: [
    "product designer Lagos",
    "UX designer Nigeria",
    "UI designer Africa",
    "senior product designer Nigeria",
    "fintech UX design Lagos",
    "SaaS product design Africa",
    "UX lead Lagos Nigeria",
    "design consultant Nigeria",
    "Abdulmuiz Adelaja",
    "Làjà designer",
    "product designer Gold Coast",
    "mobile app designer Lagos",
    "conversion rate optimisation design",
    "design systems Nigeria",
    "outcomes-driven design",
    "product design portfolio Africa",
    "best product designer Nigeria",
    "UX research Nigeria",
    "design system consultant",
    "Volta Charger designer",
    "Estility designer",
  ],
  authors: [{ name: "Abdulmuiz Adelaja", url: siteUrl }],
  creator: "Abdulmuiz Adelaja",
  publisher: "Abdulmuiz Adelaja",
  category: "Portfolio",
  openGraph: {
    title: "Làjà — Senior Product Designer | Lagos, Nigeria",
    description:
      "Outcomes-driven design. Every decision traced to a number — conversion, retention, revenue. 6+ years, 80+ projects across fintech, SaaS, and e-commerce.",
    url: siteUrl,
    siteName: "Làjà — Portfolio",
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "/laja-icon.svg",
        width: 512,
        height: 512,
        alt: "Làjà — Senior Product Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Làjà — Senior Product Designer",
    description:
      "Outcomes-driven design from Lagos to the world. 6+ years, 80+ projects.",
    images: ["/laja-icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdulmuiz Adelaja",
  alternateName: ["Làjà", "Laja"],
  jobTitle: "Senior Product Designer",
  description:
    "Senior Product Designer and UX Lead based in Lagos, Nigeria. 6+ years, 80+ projects across fintech, SaaS, and e-commerce. Outcomes-driven design.",
  url: siteUrl,
  image: `${siteUrl}/laja-icon.svg`,
  email: "abdulmuizadelaja@gmail.com",
  knowsAbout: [
    "Product Design",
    "UX Design",
    "UI Design",
    "Design Systems",
    "Fintech Design",
    "SaaS Product Design",
    "Conversion Rate Optimisation",
    "User Research",
    "A/B Testing",
    "Design Team Leadership",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressRegion: "Lagos State",
    addressCountry: "NG",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Federal University of Technology Akure",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Akure",
      addressCountry: "NG",
    },
  },
  worksFor: {
    "@type": "Organization",
    name: "Volta Charger",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gold Coast",
      addressCountry: "AU",
    },
  },
  hasOccupation: {
    "@type": "Occupation",
    name: "Senior Product Designer",
    occupationLocation: {
      "@type": "City",
      name: "Lagos",
    },
    skills: "Product Design, UX Research, Design Systems, Figma, Framer",
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
      suppressHydrationWarning
    >
      <head>
        {/* Set theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('laja-theme');var t=s||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
