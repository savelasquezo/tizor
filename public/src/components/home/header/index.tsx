'use client';

import React, {useState, useEffect} from 'react';
import Image from 'next/image';

import { useLanguage } from '@/utils/i18next';
import I18nextUI  from '@/utils/i18nextUI';

import Auth from '@/components/auth/index'

import { Button } from "@nextui-org/react";
import { ImQuestion } from "react-icons/im";

export default function Header() {
  const { t, setLanguage, language } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('us');
  
  useEffect(() => {
    const storedLanguage = JSON.parse(localStorage.getItem('nextsite.locale') || '"us"');
    setSelectedLanguage(storedLanguage);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  return (
    <header className='h-16 sm:h-32 flex items-center z-30 w-full'>
      <div className='container mx-auto px-6 flex items-center justify-between'>
        <div className='uppercase text-gray-800 font-black text-3xl pointer-events-none select-none'>
          <Image priority width={360} height={130} src={"/assets/images/tbank01.webp"} className="h-12 sm:h-16 w-auto object-fit self-start mr-4" alt="" />
        </div>
        <div className='flex flex-row items-center justify-end'>
          <nav className='text-gray-800 text-lg flex flex-row items-center justify-center'>
            <a href="/" className='px-6 text-sm font-semibold font-cocogoose hidden sm:flex'>{t('home.header.link')}</a>
            <a href="/about-us" className='px-6 text-sm font-semibold font-cocogoose hidden sm:flex whitespace-nowrap'>Tizor</a>
            <div className='flex flex-row justify-center items-center gap-x-2'>
              <a href="/about-us"><Button isIconOnly color="default" className="!bg-gray-100 flex sm:hidden" aria-label=""><ImQuestion /></Button></a>
              <Auth />
              <I18nextUI  selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange}/>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}







