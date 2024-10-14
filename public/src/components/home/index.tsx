import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import Auth from '@/components/auth/index'

import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';

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
    <main className='bg-white relative overflow-hidden h-screen'>
      <header className='h-24 sm:h-32 flex items-center z-30 w-full'>
        <div className='container mx-auto px-6 flex items-center justify-between'>
          <div className='uppercase text-gray-800 font-black text-3xl'>
            <Image priority width={360} height={130} src={"/assets/images/tbank01.webp"} className="h-16 w-auto object-fit self-start mr-4 z-10" alt="" />
          </div>
          <div className='flex flex-row items-center justify-end'>
            <nav className='text-gray-800 text-lg lg:flex items-center'>
              <a href="#" className='py-2 px-6 text-sm font-semibold font-cocogoose hidden lg:flex'>T-Bank</a>
              <a href="#" className='py-2 px-6 text-sm font-semibold font-cocogoose hidden lg:flex'>CDT</a>
              <Auth/>
            </nav>
          </div>
        </div>
      </header>
      <div className='bg-white overflow-hidden'>
        <div className='w-11/12 lg:w-2/3 container flex flex-row justify-center items-center mx-auto px-6 py-16'>
          <div className='w-full h-full flex flex-col items-center justify-start gap-y-4 -mt-[2rem] lg:-mt-[6rem]'>
            <div className='flex flex-col text-center'>
              <p className='font-cocogoose text-2xl font-semibold'>Cuenta de Ahorros</p>
              <p className='font-cocogoose text-xs font-semibold'>ver crecer tu dinero como nunca antes lo has visto</p>
            </div>
            <div className='max-w-lg w-full bg-gray-800 px-8 py-12 rounded-tl-[5rem] rounded-br-[5rem] font-gilroy text-white'>
              <p className='text-7xl font-semibold'>{data?.max_interest ?? '--'}%<span className='text-lg'> E.A.</span></p><br />
              <ul className='list-disc pl-6 md:pl-12 text-lg'>
                <li className='font-thin text-sm lg:text-base'>Sin comisiones ni cuota de manejo</li>
                <li className='font-thin text-sm lg:text-base'>Dinero siempre disponible</li>
                <li className='font-thin text-sm lg:text-base'>Inversiones desde 1$</li>
              </ul>
            </div>
            <p className='w-full mt-4 lg:mt-10 font-cocogoose text-xs text-justify'>
              Ahorrar de forma sencilla es posible con T-Bank. Abre tu cuenta y comienza a gestionar tus ahorros desde cualquier lugar. Haz crecer tu dinero dia a dia con nosotros.
              <span className='ml-2 font-semibold cursor-pointer'>Mira Nuestras Tasas de Interes</span>
            </p>
          </div>
          <div className='w-1/2 hidden items-start justify-start lg:flex'>
            <Image priority width={800} height={1300} src={"/assets/images/image05.png"} className="h-auto w-96 object-fit" style={{WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)'}} alt=""/>
          </div>
        </div>
      </div>
    </main >
  );
}


