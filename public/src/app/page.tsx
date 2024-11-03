'use client';

import React, { useState, useEffect, Suspense } from "react";
import { SessionProvider } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';

import { SiteType } from '@/lib/types/types';
import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';
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
                <p className='font-cocogoose text-2xl font-semibold'>Cuenta de Ahorros</p>
                <p className='font-cocogoose text-[0.55rem] lg:text-xs font-semibold'>ver crecer tu dinero como nunca antes lo has visto</p>
              </div>
              <div className='max-w-[22rem] lg:max-w-[38rem] w-full bg-gray-800 px-8 py-12 rounded-tl-[5rem] rounded-br-[5rem] font-gilroy text-white'>
                <p className='text-7xl font-semibold'>{data?.max_interest ?? '--'}%<span className='text-lg'> E.A.</span></p><br />
                <ul className='list-disc pl-6 md:pl-12 text-lg'>
                  <li className='font-thin text-sm lg:text-lg'>Sin comisiones ni cuota de manejo</li>
                  <li className='font-thin text-sm lg:text-lg'>Dinero siempre disponible</li>
                  <li className='font-thin text-sm lg:text-lg'>Inversiones desde 1$</li>
                </ul>
              </div>
              <div className='flex flex-col lg:flex-col'>
                <p className='w-full sm:w-[90%] lg:w-2/3 mt-4 lg:mt-10 font-cocogoose text-[0.65rem] lg:text-xs text-start lg:text-justify leading-none lg:leading-snug'>
                  Ahorrar de forma sencilla es posible con T-Bank. Abre tu cuenta y comienza a gestionar tus ahorros desde cualquier lugar. Haz crecer tu dinero dia a dia con nosotros.
                  <span className='ml-2 font-semibold cursor-pointer'>Mira Nuestras Tasas de Interes</span>
                </p>
              </div>
            </div>
            <div className='hidden sm:w-4/5 lg:w-3/5 items-start justify-start sm:flex !pointer-events-none !select-none'>
              <Image priority width={800} height={1300} src={"/assets/images/image00.png"} className="h-full w-auto object-fit scale-125" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" />
            </div>
          </section>
          <hr className="h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 lg:my-12" />
          <div className="w-full flex flex-col items-center justify-center mx-auto px-8 lg:px-24 py-4">
            <p className='font-cocogoose text-2xl font-semibold my-2 text-blue-950 text-center'>¿Como funciona T-Bank?</p>
            <p className='lg:w-1/2 mb-20 text-center font-cocogoose text-[0.65rem] lg:text-xs text-gray-800'>Ahorrar con nosotros es fácil y sin complicaciones. Abre tu cuenta y empieza a disfrutar de los intereses más altos del mercado, todo desde donde quieras. Si nos necesitas, siempre estaremos aquí para apoyarte.</p>
            <ol className="w-full flex flex-col lg:flex-row items-center justify-center gap-12">
              <li className="w-full lg:w-1/3 flex flex-col items-center justify-center text-gray-200 gap-6 lg:px-12">
                <Image priority width={360} height={360} src={"/assets/svg/login.svg"} className="h-32 w-auto ml-6 opacity-55" alt="" />
                <span className='flex flex-col items-center justify-center text-center'>
                  <p className="leading-tight mb-2 font-cocogoose font-semibold uppercase text-gray-800">Incribirse</p>
                  <p className="w-2/3 text-xs text-center font-cocogoose text-gray-600">Crea tu cuenta y completa la verificación de identidad de manera rápida y segura.</p>
                </span>
              </li>
              <li className="w-full lg:w-1/3 flex flex-col items-center justify-center text-gray-200 gap-6 lg:px-12">
                <Image priority width={360} height={360} src={"/assets/svg/finance.svg"} className="h-32 w-auto opacity-55" alt="" />
                <span className='flex flex-col items-center justify-center text-center'>
                  <p className="leading-tight mb-2 font-cocogoose font-semibold uppercase text-gray-800">Invertir</p>
                  <p className="w-2/3 text-xs text-center font-cocogoose text-gray-600">Depósita fácilmente criptomonedas, mira nuestro instructivo si nunca lo has intentado</p>
                </span>
              </li>
              <li className="w-full lg:w-1/3 flex flex-col items-center justify-center text-gray-200 gap-6 lg:px-12">
                <Image priority width={360} height={360} src={"/assets/svg/money.svg"} className="h-32 w-auto opacity-55" alt="" />
                <span className='flex flex-col items-center justify-center text-center'>
                  <p className="leading-tight mb-2 font-cocogoose font-semibold uppercase text-gray-800">Ahorrar</p>
                  <p className="w-2/3 text-xs text-center font-cocogoose text-gray-600">Disfruta de la rentabilidad superior que ofrecemos. ¡Haz crecer tus inversiones!</p>
                </span>
              </li>
            </ol>
          </div>
          <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
          <div className='w-full flex flex-col justify-start items-center my-12 lg:w-3/5 mx-auto'>
            <p className='text-sm lg:text-xl font-cocogoose font-semibold'>¡Haz que tu dinero trabaje para ti de verdad!</p>
            <Video thumbnail={data?.thumbnail} url={data?.video} width={1800} height={1300} />
            <p className='w-11/12 lg:w-4/5 font-cocogoose text-xs lg:text-sm leading-tight text-center font-semibold'>Tendemos a ser cautelosos, especialmente en temas de dinero, pero también disfrutamos compartir lo que nos da seguridad y nos resulta beneficioso.​</p>
          </div>
          <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
          <div className='w-11/12 lg:w-3/4 h-auto flex items-center justify-center mx-auto lg:my-24'>
            <div className="flex flex-col rounded-md bg-gray-50 shadow-lg text-surface shadow-secondary-1 md:flex-row">
              <Image priority width={1440} height={880} src={"/assets/images/background07.jpg"} style={{ WebkitMaskImage: 'linear-gradient(to left, transparent 0%, black 20%)', maskImage: 'linear-gradient(to left, transparent 0%, black 20%)' }} className="h-64 w-auto rounded-t-lg object-cover rounded-s-md" alt="" />
              <div className="flex flex-col justify-start p-6">
                <p className="mb-2 text-xl font-cocogoose font-semibold">Lineas de Credito</p><br />
                <p className="w-full lg:w-4/5 mb-4 text-xs font-cocogoose leading-none lg:leading-tight text-justify">
                  Acceder a nuestras líneas de crédito es una excelente manera de hacer realidad tus metas, ya sea para proyectos personales o necesidades imprevistas.
                  Con una tasa de interés de <span className='font-bold font-bankprinter text-lg'>1.4%</span> mensual, te ofrecemos una de las mejores opciones del mercado, diseñada para brindarte respaldo y confianza en cada paso.
                </p><br />
                <p className="text-xs font-semibold font-cocogoose">
                  ¡Conoce nuestras condiciones especiales y empieza a alcanzar tus objetivos hoy mismo!
                </p>
              </div>
            </div>
          </div>
          <Math />
          <hr className="lg:my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
          <div className='relative w-full h-60 lg:h-96 flex flex-row lg:mt-12'>
            <Image priority width={1800} height={1300} src={"/assets/images/background02.png"} className="hidden lg:block absolute top-0 right-0 w-auto h-96 object-contain" alt="" />
            <Image priority width={1800} height={1300} src={"/assets/images/background04.png"} className="block lg:hidden absolute top-0 right-0 w-auto h-96 object-contain" alt="" />
            <div className='w-full hidden lg:block lg:w-1/2'>-</div>
            <div className='w-full lg:w-1/2 p-8 lg:p-2 flex flex-col justify-center items-start z-10'>
              <div className='flex flex-row items-center justify-center gap-x-2'>
                <p className='font-cocogoose text-lg lg:text-2xl font-semibold'>¿Necesitas ayuda?</p><br />
                <Button radius="full" className='bg-gray-800 text-white font-cocogoose text-[0.65rem] lg:text-xs'>
                  Soporte Tecnico
                </Button>
              </div>
              <p className='w-3/4 lg:w-1/2 font-cocogoose text-xs text-justify text-[0.55rem] sm:text-xs mt-6'>Nuestro principal objetivo es facilitarte la vida. Por eso, si necesitas asistencia, solo tienes que presionar un botón.</p>
            </div>
          </div>
          <Footer />
          <WhatsappPlugin />
        </main>
      </Suspense>
    </SessionProvider>
  );
}
