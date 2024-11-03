'use client';

import React, {useState} from 'react';
import Image from 'next/image';

import { useLanguage } from '@/utils/i18next';
import I18nextUI  from '@/utils/i18nextUI';

import Auth from '@/components/auth/index'

export default function Header() {
  const { t, setLanguage, language } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('us');
  

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  return (
    <header className='h-24 sm:h-32 flex items-center z-30 w-full'>
      <div className='container mx-auto px-6 flex items-center justify-between'>
        <div className='uppercase text-gray-800 font-black text-3xl pointer-events-none select-none'>
          <Image priority width={360} height={130} src={"/assets/images/tbank01.webp"} className="h-16 w-auto object-fit self-start mr-4" alt="" />
        </div>
        <div className='flex flex-row items-center justify-end'>
          <nav className='text-gray-800 text-lg lg:flex items-center'>
            <a href="/" className='py-2 px-6 text-sm font-semibold font-cocogoose hidden lg:flex'>Home</a>
            <a href="/about-us" className='py-2 px-6 text-sm font-semibold font-cocogoose hidden lg:flex'>T-Bank</a>
            <Auth />
            <I18nextUI  selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange}/>
          </nav>
        </div>
      </div>
    </header>
  );
}







