'use client';

import React, { useState, useEffect, Suspense } from "react";
import axios from 'axios';

import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/navbar/index';
import { SiteType } from '@/lib/types/types';

import { useLanguage } from '@/utils/i18next';


export default function Home() {
  const { t, setLanguage } = useLanguage();
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
        <main className="bg-tizor5 h-screen w-screen overflow-hidden">
          <Navbar />
          <div className="mt-40 text-white">
            <h1>{t('welcome_message')}</h1>
            <div>
              <button onClick={() => setLanguage('en')}>English</button>
              <button onClick={() => setLanguage('es')}>Español</button>
            </div>
          </div>
        </main>
      </Suspense>
    </SessionProvider>
  );
}