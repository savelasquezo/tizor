import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { I18next } from '@/utils/i18next';
import '@/styles/styles.css';
import Head from 'next/head';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tizorbank",
  description: "Tizorbank",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <body>
        <I18next>
          {children}
        </I18next>
      </body>
    </html>
  );
}
