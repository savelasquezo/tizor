'use client';
import React, { Suspense } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import Navbar from '@/components/navbar/index';
import Header from '@/components/header/index';

export default function Home() {
  return (
    <SessionProvider >
      <Navbar />
      <Header />
    </SessionProvider>
  );
}
