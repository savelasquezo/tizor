'use client';

import dotenv from 'dotenv';
dotenv.config();

import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';

import Navbar from '@/components/navbar/index';
import Header from '@/components/header/index';

export default function Home() {
  return (
    <SessionProvider >
      <Suspense fallback={null}>
        <main className="bg-gradient-to-r from-indigo-950 to-purple-950 leading-normal tracking-normal text-indigo-100 m-6 bg-cover bg-fixed">
          <Navbar/>
          <Header/>
        </main>
      </Suspense>
    </SessionProvider>
  );
}
