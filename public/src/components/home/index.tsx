import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@nextui-org/react";

import Auth from '@/components/auth/index'
import Video from '@/components/home/video'

import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';

import { FaUserPlus } from "react-icons/fa";



export default function Hero() {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { data: session } = useSession();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchedSettings = nextSite();
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
  }, [session]);

  return (
    <main className='bg-white relative'>
      <header className='h-24 sm:h-32 flex items-center z-30 w-full'>
        <div className='container mx-auto px-6 flex items-center justify-between'>
          <div className='uppercase text-gray-800 font-black text-3xl'>
            <Image priority width={360} height={130} src={"/assets/images/tbank01.webp"} className="h-16 w-auto object-fit self-start mr-4 z-10" alt="" />
          </div>
          <div className='flex flex-row items-center justify-end'>
            <nav className='text-gray-800 text-lg lg:flex items-center'>
              <a href="#" className='py-2 px-6 text-sm font-semibold font-cocogoose hidden lg:flex'>T-Bank</a>
              <a href="#" className='py-2 px-6 text-sm font-semibold font-cocogoose hidden lg:flex'>CDT</a>
              <Auth />
            </nav>
          </div>
        </div>
      </header>
      <div className=''>
        <div className='w-11/12 container flex flex-row justify-center items-center mx-auto px-6 py-16'>
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
              <p className='w-full sm:w-[90%] lg:w-2/3 mt-4 lg:mt-10 font-cocogoose text-xs text-justify leading-none lg:leading-snug'>
                Ahorrar de forma sencilla es posible con T-Bank. Abre tu cuenta y comienza a gestionar tus ahorros desde cualquier lugar. Haz crecer tu dinero dia a dia con nosotros.
                <span className='ml-2 font-semibold cursor-pointer'>Mira Nuestras Tasas de Interes</span>
              </p>
            </div>
          </div>
          <div className='hidden sm:w-4/5 lg:w-3/5 items-start justify-start sm:flex pointer-events-none select-none'>
            <Image priority width={800} height={1300} src={"/assets/images/image00.png"} className="h-full w-auto object-fit scale-125" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" />
          </div>
        </div>
      </div>
      <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
      <div className="w-full flex flex-col items-center justify-center mx-auto px-24 py-4">
        <p>¿Como funciona T-Bank?</p>
        <ol className="w-full flex items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0 rtl:space-x-reverse">
          <li className="flex flex-col items-center justify-center text-gray-500 space-x-2.5 rtl:space-x-reverse">
            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
              1
            </span>
            <span>
              <h3 className="font-medium leading-tight">Company info</h3>
              <p className="text-sm">Step details here</p>
            </span>
          </li>
          <li className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
              2
            </span>
            <span>
              <h3 className="font-medium leading-tight">Company info</h3>
              <p className="text-sm">Step details here</p>
            </span>
          </li>
          <li className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
              3
            </span>
            <span>
              <h3 className="font-medium leading-tight">Payment info</h3>
              <p className="text-sm">Step details here</p>
            </span>
          </li>
        </ol>
      </div>

      <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
      <div className='w-full h-full flex flex-col justify-start items-center my-12'>
        <p>T-Bank</p>
        <Video thumbnail={data?.thumbnail ?? '--'} url={data?.video ?? '--'} />
        <p className='w-11/12 lg:w-1/2 font-cocogoose text-xs lg:text-sm leading-tight text-center font-semibold'>Tendemos a ser cautelosos, especialmente en temas de dinero, pero también disfrutamos compartir lo que nos da seguridad y nos resulta beneficioso.​</p>
      </div>
      <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
      <div className='relative w-full h-96 flex flex-row my-12'>
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
    </main >
  );
}




