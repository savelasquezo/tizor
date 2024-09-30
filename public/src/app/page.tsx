'use client';

import React, { useState, useEffect, Suspense } from "react";
import axios from 'axios';
import { SessionProvider } from 'next-auth/react';

import Flag from 'react-world-flags';
import { Select, SelectItem } from "@nextui-org/react";

import Navbar from '@/components/navbar/index';

import { SiteType } from '@/lib/types/types';
import { useLanguage } from '@/utils/i18next';

export default function Home() {
  const { t, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('us');

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

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  return (
    <SessionProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <main className="bg-tizor5 h-screen w-screen overflow-hidden">
          <Navbar />
          <div className="mt-40 text-white">
            <h1>{t('welcome_message')}</h1>
          </div>
          <Select className="!w-36" radius={'sm'} defaultSelectedKeys={["US"]} disabledKeys={[selectedLanguage === 'us' ? 'US' : 'ES']} startContent={<Flag code={selectedLanguage === 'us' ? 'US' : 'ES'} className="w-6 h-6" />}>
            <SelectItem onClick={() => handleLanguageChange('us')} key="US" startContent={<Flag code="US" className="w-6 h-6" />}>Ingles</SelectItem>
            <SelectItem onClick={() => handleLanguageChange('es')} key="ES" startContent={<Flag code="ES" className="w-6 h-6" />}>Español</SelectItem>
          </Select>
        </main>
      </Suspense>
    </SessionProvider>
  );
}
