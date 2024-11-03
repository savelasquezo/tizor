'use client';

import React, { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from "@nextui-org/react";

import Context from '@/components/admin/context/index';
import Meta from '@/components/admin/meta/index';
import Logs from '@/components/admin/logs/index';
import History from '@/components/admin/history/index';
import Shared from '@/components/admin/shared/index';

import { FaPowerOff } from "react-icons/fa";
import HashLoader from 'react-spinners/HashLoader';


import { useLanguage } from '@/utils/i18next';
import { SiteType } from '@/lib/types/types';
import I18nextUI  from '@/utils/i18nextUI';

const AdminPage: React.FC = () => {
  const { data: session } = useSession();
  const { t, setLanguage, language } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState('us');

  useEffect(() => {
    const storedLanguage = JSON.parse(localStorage.getItem('nextsite.locale') || '"us"');
    setSelectedLanguage(storedLanguage);

    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/site/fetch-information/`);
        const settings: SiteType = response.data;
        localStorage.setItem('nextsite.data', JSON.stringify(settings));
      } catch (error) {
        console.error('There was an error with the network request:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    setLanguage(lang);
  };

  return (
    <main className='w-screen h-screen overflow-x-hidden bg-gray-100 pb-12 lg:pb-0'>
      {session && session?.user ? (
        <div>
          <nav className='w-full h-16 flex flex-row items-center justify-between bg-white shadow-sm px-8 py-1'>
            <Link href="/" className="inline-flex text-center justify-center items-center">
              <Image priority width={360} height={130} src={"/assets/images/tbank01.webp"} className="h-12 w-auto object-fit self-start mr-4 z-10" alt="Logo" />
            </Link>
            <div className="flex flex-row items-center justify-end gap-x-2">
              <div className='flex flex-row items-center justify-center gap-x-4'>
                <I18nextUI  selectedLanguage={selectedLanguage} onLanguageChange={handleLanguageChange}/>
              </div>
              <Button onClick={() => { signOut({ callbackUrl: '/' }); }} type="submit" isIconOnly color="default" className="!bg-gray-100" aria-label="">
                <FaPowerOff />
              </Button>
            </div>
          </nav>
          <section className='w-full h-auto flex flex-col px-6 gap-y-6'>
            <Context session={session} />
            <div className='w-full h-auto lg:h-96 flex flex-col lg:flex-row gap-4'>
              <Meta session={session} />
              <Logs session={session} />
            </div>
            <div className='w-full h-auto lg:h-72 flex flex-col lg:flex-row gap-4'>
              <Shared session={session} />
              <History session={session} />
            </div>
          </section>
        </div>
      ) : (
        <div>
          <div className="absolute inset-0 flex flex-col items-center justify-center animate__animated animate-fade-out animate__fadeIn">
            <HashLoader size={100} speedMultiplier={0.75} />
          </div>
        </div>
      )}
    </main >
  );
};

export default AdminPage;
