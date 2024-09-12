'use client';

import React, { useState, useEffect, Suspense } from "react";
import axios from 'axios';
import { SessionProvider } from 'next-auth/react';

import Navbar from '@/components/navbar/index';
import Header from '@/components/header/index';

import { SiteType } from '@/lib/types/types';

export default function Home() {
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/site/fetch-information/`);
      const settings: SiteType = response.data;
      const formattedSettings: SiteType = { ...settings };
      localStorage.setItem('nextsite.data', JSON.stringify(formattedSettings));
    } catch (error) {
      console.error('There was an error with the network request:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SessionProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <main className="bg-gradient-to-r from-indigo-950 to-purple-950 leading-normal tracking-normal text-indigo-100 m-6 bg-cover bg-fixed">
          <Navbar />
          <Header />
        </main>
      </Suspense>
    </SessionProvider>
  );
}
