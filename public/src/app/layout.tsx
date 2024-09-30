import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { I18next } from '@/utils/i18next';
import '@/styles/styles.css';

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Tizorbank",
  description: "Tizorbank",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html>
      <body className="bg-tizor5">
        <I18next>
          {children}
        </I18next>
      </body>
    </html>
  );
}