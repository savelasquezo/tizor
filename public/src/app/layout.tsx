import type { Metadata } from "next";
import { Inter } from "next/font/google";

import '@/styles/styles.css';

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Tizorbank",
  description: "Tizorbank",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) 
{
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}


