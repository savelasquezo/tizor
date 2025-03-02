import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { I18next } from "@/utils/i18next";

import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
import "@/styles/styles.css";

export const metadata: Metadata = {
  title: "Tizor",
  description: "Tizor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE}`} />
        <Script
          strategy="afterInteractive"
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE}');
            `,
          }}
        />
        <I18next>{children}</I18next>
      </body>
    </html>
  );
}
