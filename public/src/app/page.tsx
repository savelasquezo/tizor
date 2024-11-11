'use client';

import React, { useState, useEffect, Suspense } from "react";
import { SessionProvider } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';

import { SiteType } from '@/lib/types/types';
import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';
import WhatsappButton from '@/utils/whatsapp-button';
import { WhatsappPlugin } from "@/utils/whatsapp-plugin";


import Header from '@/components/home/header/index';
import Footer from '@/components/home/footer/index';
import Video from '@/components/home/video'
import Math from '@/components/home/math'

import { Button } from "@nextui-org/react";


export default function Home() {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

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
    const fetchedSettings = nextSite();
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
  }, []);

  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <main className="relative bg-white h-screen w-screen overflow-x-hidden">
          <Header />
          <section className='w-11/12 container flex flex-row justify-center items-center mx-auto px-6 py-16'>
            <div className='w-full h-full flex flex-col items-start justify-center lg:justify-start gap-y-4 -mt-[2rem] lg:-mt-[6rem] lg:ml-12'>
              <div className='flex flex-col text-center ml-16'>
                <p className='font-cocogoose text-2xl font-semibold'>{t('home.hero.title.title')}</p>
                <p className='font-cocogoose text-[0.55rem] lg:text-xs font-semibold'>{t('home.hero.title.subtitle')}</p>
              </div>
              <div className='max-w-[22rem] lg:max-w-[38rem] w-full bg-gray-800 px-8 py-12 rounded-tl-[5rem] rounded-br-[5rem] font-gilroy text-white'>
                <p className='text-7xl font-semibold'>{data?.max_interest ?? '--'}%<span className='text-lg'> E.A.</span></p><br />
                <ul className='list-disc pl-6 md:pl-12 text-lg'>
                  <li className='font-thin text-sm lg:text-lg'>{t('home.hero.list.obj1')}</li>
                  <li className='font-thin text-sm lg:text-lg'>{t('home.hero.list.obj2')}</li>
                  <li className='font-thin text-sm lg:text-lg'>{t('home.hero.list.obj3')} 1$</li>
                </ul>
              </div>
              <div className='flex flex-col lg:flex-col'>
                <p className='w-full sm:w-[90%] lg:w-2/3 mt-4 lg:mt-10 font-cocogoose text-[0.65rem] lg:text-xs text-start lg:text-justify leading-none lg:leading-snug'>
                  {t('home.hero.description')}
                </p>
              </div>
            </div>
            <div className='hidden sm:w-4/5 lg:w-3/5 items-start justify-start sm:flex !pointer-events-none !select-none'>
              <Image priority width={800} height={1300} src={"/assets/images/background00.webp"} className="h-full w-auto object-fit scale-125" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" />
            </div>
          </section>
          <hr className="h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 lg:my-12" />
          <div className="w-full flex flex-col items-center justify-center mx-auto px-8 lg:px-24 py-4">
            <p className='font-cocogoose text-2xl font-semibold my-2 text-blue-950 text-center'>{t('home.how-to.title.title')}</p>
            <p className='lg:w-1/2 mb-20 text-center font-cocogoose text-[0.65rem] lg:text-xs text-gray-800'>{t('home.how-to.title.subtitle')}<a className='text-gray-800 font-semibold font-cocogoose mx-1' href="/help-and-tutorials">{t('home.how-to.title.help')}</a></p>
            <ol className="w-full flex flex-col lg:flex-row items-center justify-center gap-12">
              <li className="w-full lg:w-1/3 flex flex-col items-center justify-center text-gray-200 gap-6 lg:px-12">
                <Image priority width={360} height={360} src={"/assets/svg/login.svg"} className="h-32 w-auto ml-6 opacity-55" alt="" />
                <span className='flex flex-col items-center justify-center text-center'>
                  <p className="leading-tight mb-2 font-cocogoose font-semibold uppercase text-gray-800">{t('home.how-to.cards.obj1.title')}</p>
                  <p className="w-2/3 text-xs text-center font-cocogoose text-gray-600">{t('home.how-to.cards.obj1.subtitle')}</p>
                </span>
              </li>
              <li className="w-full lg:w-1/3 flex flex-col items-center justify-center text-gray-200 gap-6 lg:px-12">
                <Image priority width={360} height={360} src={"/assets/svg/finance.svg"} className="h-32 w-auto opacity-55" alt="" />
                <span className='flex flex-col items-center justify-center text-center'>
                  <p className="leading-tight mb-2 font-cocogoose font-semibold uppercase text-gray-800">{t('home.how-to.cards.obj2.title')}</p>
                  <p className="w-2/3 text-xs text-center font-cocogoose text-gray-600">{t('home.how-to.cards.obj2.subtitle')}</p>
                </span>
              </li>
              <li className="w-full lg:w-1/3 flex flex-col items-center justify-center text-gray-200 gap-6 lg:px-12">
                <Image priority width={360} height={360} src={"/assets/svg/money.svg"} className="h-32 w-auto opacity-55" alt="" />
                <span className='flex flex-col items-center justify-center text-center'>
                  <p className="leading-tight mb-2 font-cocogoose font-semibold uppercase text-gray-800">{t('home.how-to.cards.obj3.title')}</p>
                  <p className="w-2/3 text-xs text-center font-cocogoose text-gray-600">{t('home.how-to.cards.obj3.subtitle')}</p>
                </span>
              </li>
            </ol>
          </div>
          <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
          <div className='w-full flex flex-col justify-start items-center my-12 lg:w-3/5 mx-auto'>
            <p className='text-sm lg:text-xl font-cocogoose font-semibold'>{t('home.video.title')}</p>
            <Video thumbnail={data?.thumbnail} url={data?.video} width={1800} height={1300} />
            <p className='w-11/12 lg:w-4/5 font-cocogoose text-xs lg:text-sm leading-tight text-center font-semibold'>{t('home.video.description')}​</p>
          </div>
          <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
          <div className='w-11/12 lg:w-3/4 h-auto flex items-center justify-center mx-auto lg:my-24'>
            <div className="flex flex-col rounded-md bg-gray-50 shadow-lg text-surface shadow-secondary-1 md:flex-row">
              <Image priority width={1440} height={880} src={"/assets/images/background04.webp"} style={{ WebkitMaskImage: 'linear-gradient(to left, transparent 0%, black 20%)', maskImage: 'linear-gradient(to left, transparent 0%, black 20%)' }} className="h-64 w-auto rounded-t-lg object-cover rounded-s-md" alt="" />
              <div className="flex flex-col justify-start p-6">
                <p className="mb-2 text-xl font-cocogoose font-semibold">{t('home.credit.title')}</p><br />
                <p className="w-full lg:w-4/5 mb-4 text-xs font-cocogoose leading-none lg:leading-tight text-justify">
                  {t('home.credit.paragraph1')}<span className='font-bold font-bankprinter text-lg'>1.4%</span> {t('home.credit.paragraph2')}
                </p><br />
                <p className="text-xs font-semibold font-cocogoose">
                  {t('home.credit.paragraph3')}
                </p>
              </div>
            </div>
          </div>
          <Math />
          <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-25" />
          <div className="w-full h-auto flex flex-row justify-center items-start md:items-center gap-x-32 px-12 md:-ml-16">
            <a href="https://url.hk/i/es/b5e44" className="hidden md:flex w-1/2 items-center justify-end"><Image priority width={1400} height={395} src={"/assets/images/redotpay01.webp"} className="w-1/2 object-fill shadow-2xl -rotate-6 transition-all duration-700" alt="" /></a>
            <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center md:items-start md:justify-start font-cocogoose">
              <p className="font-semibold text-2xl md:text-base mb-2">Tarjeta Redotpay</p>
              <p className="w-full md:w-2/3 text-[0.65rem] text-justify leading-3">Aprovecha las ventajas de la tarjeta Redotpay
              Con la tarjeta prepagada virtual y física Redotpay, convierte tus criptomonedas en dinero fiduciario para realizar retiros en cajeros automáticos y pagos en cualquier establecimiento a nivel mundial. Disfruta de la libertad financiera y de las facilidades de uso que ofrece. ¡Es el momento de la descentralización!</p>
              <a href="https://url.hk/i/es/b5e44" className="w-full md:w-2/3 flex items-center justify-end mt-6"><Image priority width={1400} height={395} src={"/assets/images/redotpay00.webp"} className="w-full object-fill shadow-2xl transition-all duration-700" alt="" /></a>
            </div>
          </div>
          <hr className="lg:my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
          <div className='relative w-full h-60 lg:h-96 flex flex-row lg:mt-12'>
            <Image priority width={1800} height={1300} src={"/assets/images/background01.webp"} className="hidden lg:block absolute top-0 right-0 w-auto h-96 object-contain" alt="" />
            <Image priority width={1800} height={1300} src={"/assets/images/background02.webp"} className="block lg:hidden absolute top-0 right-0 w-auto h-96 object-contain" alt="" />
            <div className='w-full hidden lg:block lg:w-1/2'>-</div>
            <div className='w-full lg:w-1/2 p-8 lg:p-2 flex flex-col justify-center items-start z-10'>
              <div className='flex flex-row items-center justify-center gap-x-2'>
                <p className='font-cocogoose text-lg lg:text-2xl font-semibold'>{t('home.support.title')}</p><br />
                <WhatsappButton name={t('home.support.buton')} phoneNumber={data?.phone} message={t('home.support.help-message')} />
              </div>
              <p className='w-3/4 lg:w-1/2 font-cocogoose text-xs text-justify text-[0.55rem] sm:text-xs mt-6'>{t('home.support.description')}</p>
            </div>
          </div>
          <Footer />
          <WhatsappPlugin />
        </main>
      </Suspense>
    </SessionProvider>
  );
}
