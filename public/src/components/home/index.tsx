import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@nextui-org/react";

import Auth from '@/components/auth/index'
import Video from '@/components/home/video'
import Math from '@/components/home/math'

import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';
import { formatNumber } from "@/utils/formatNumber";
import { WhatsappPlugin } from "@/utils/whatsapp-plugin";

import { PiPlaceholder } from "react-icons/pi";


import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaTelegramPlane, FaYoutube, FaBloggerB } from "react-icons/fa";

const linkIcons: { [key: string]: JSX.Element } = {
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  youtube: <FaYoutube />,
  tiktok: <FaTiktok />,
  whatsapp: <FaWhatsapp />,
  telegram: <FaTelegramPlane />,
  blogger: <FaBloggerB />
};


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
              <a href="#" className='py-2 px-6 text-sm font-semibold font-cocogoose hidden lg:flex'>Staking</a>
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
              <p className='w-full sm:w-[90%] lg:w-2/3 mt-4 lg:mt-10 font-cocogoose text-[0.65rem] lg:text-xs text-start lg:text-justify leading-none lg:leading-snug'>
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
      <div className='w-full h-full flex flex-col justify-start items-center my-12'>
        <p className='text-sm lg:text-xl font-cocogoose font-semibold'>¡Haz que tu dinero trabaje para ti de verdad!</p>
        <Video thumbnail={data?.thumbnail} url={data?.video} />
        <p className='w-11/12 lg:w-1/2 font-cocogoose text-xs lg:text-sm leading-tight text-center font-semibold'>Tendemos a ser cautelosos, especialmente en temas de dinero, pero también disfrutamos compartir lo que nos da seguridad y nos resulta beneficioso.​</p>
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
      <footer className="relative bg-gray-900 pt-8 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap text-left lg:text-left">
            <div className="w-full lg:w-6/12 px-4">
              <h4 className="text-3xl fonat-semibold text-gray-300 font-cocogoose">T-Bank</h4>
              <h5 className="text-sm mt-0 my-4 text-gray-400 font-cocogoose">
                ¡Haz que tu dinero trabaje para ti de verdad!
              </h5>
              <div className="mt-6 lg:mb-0 mb-6">
              <div className='w-full flex flex-row items-center justify-start gap-x-2.5 lg:gap-x-4 mb-20 lg:my-0'>
                {data?.links?.map((link: any) => (
                  <a key={link.id} href={link.link || '#'} target="_blank" rel="noopener noreferrer" className={`w-auto h-10 flex items-center justify-center text-center opacity-90 hover:opacity-100 bg-gray-600 text-white px-3 py-2 font-xl rounded-full transition-opacity duration-300`}>
                    <span className='mt-0 flex items-center justify-center lg:block'>
                      {linkIcons[link.name] || <PiPlaceholder />}
                    </span>
                  </a>
                ))}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="flex flex-wrap items-start mb-6 gap-y-12">
                <div className="w-full lg:w-4/12 px-4 ml-auto">
                  <span className="block uppercase text-gray-200 text-sm font-semibold mb-2">T-Bank</span>
                  <ul className="list-unstyled">
                    <li>
                      <a className="text-gray-400 hover:text-gray-200 font-semibold block pb-2 text-sm" href="https://www.creative-tim.com/presentation?ref=njs-profile">¿Quienes Somos?</a>
                    </li>
                    <li>
                      <a className="text-gray-400 hover:text-gray-200 font-semibold block pb-2 text-sm" href="https://www.creative-tim.com/bootstrap-themes/free?ref=njs-profile">Soporte</a>
                    </li>
                  </ul>
                </div>
                <div className="w-full lg:w-4/12 px-4 ml-auto">
                  <span className="block uppercase text-gray-200 text-sm font-semibold mb-2">Servicios</span>
                  <ul className="list-unstyled">
                    <li>
                      <a className="text-gray-400 hover:text-gray-200 font-semibold block pb-2 text-sm" href="https://blog.creative-tim.com?ref=njs-profile">Cuenta de Ahorros</a>
                    </li>
                    <li>
                      <a className="text-gray-400 hover:text-gray-200 font-semibold block pb-2 text-sm" href="https://www.github.com/creativetimofficial?ref=njs-profile">Inversiones</a>
                    </li>
                    <li>
                      <a className="text-gray-400 hover:text-gray-200 font-semibold block pb-2 text-sm" href="https://www.creative-tim.com/bootstrap-themes/free?ref=njs-profile">Lineas de Credito</a>
                    </li>
                  </ul>
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <span className="block uppercase text-gray-200 text-sm font-semibold mb-2">Enlaces</span>
                  <ul className="list-unstyled">
                    <li>
                      <a className="text-gray-400 hover:text-gray-200 font-semibold block pb-2 text-sm" href="https://creative-tim.com/terms?ref=njs-profile">Terminos & Condiciones</a>
                    </li>
                    <li>
                      <a className="text-gray-400 hover:text-gray-200 font-semibold block pb-2 text-sm" href="https://creative-tim.com/privacy?ref=njs-profile">Aviso Legal</a>
                    </li>
                    <li>
                      <a className="text-gray-400 hover:text-gray-200 font-semibold block pb-2 text-sm" href="https://creative-tim.com/contact-us?ref=njs-profile">Contactanos</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <hr className="my-6 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-gray-200 font-semibold py-1">
                Copyright © <span id="get-current-year">2024</span><span className="text-gray-200 hover:text-gray-200"/> Tizorbank
              </div>
            </div>
          </div>
        </div>
      </footer>
      <WhatsappPlugin />
    </main >
  );
}







