'use client';
import React, { useState, useEffect } from 'react';

import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';
import { WhatsappPlugin } from "@/utils/whatsapp-plugin";

import Header from '@/components/home/header/index';
import Footer from '@/components/home/footer/index';

import { Card, CardFooter, Image } from "@nextui-org/react";

const AboutPage: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const handleClick = (obj: string) => {
    setSelectedCard(prev => (prev === obj ? null : obj));
  };

  useEffect(() => {
    const fetchedSettings = nextSite();
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
  }, []);

  return (
    <main className="relative bg-white w-full h-auto overflow-x-hidden">
      <Header />
      <section className='w-full h-full'>
        <div
          className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-r from-green-50/50 via-teal-50 to-green-50/50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
          <h1 className="mx-auto max-w-4xl font-display font-bold tracking-normal text-white-300 text-gray-300">
            <span className="relative whitespace-nowrap text-white-600 text-gray-300 font-cocogoose text-3xl sm:text-5xl uppercase opacity-80">Innovando<br />Ahorro e nversiónes</span><br />
            <span className="relative whitespace-nowrap text-orange-500 dark:text-orange-300 text-5xl sm:text-7xl">
              <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute top-2/3 left-0 h-[0.58em] w-full fill-orange-500 dark:fill-orange-300/60" preserveAspectRatio="none">
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.780 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.540-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.810 23.239-7.825 27.934-10.149 28.304-14.005 .417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
              <span className="relative">T-Bank</span>
            </span>
          </h1>
          <h2 className="mx-auto mt-12 text-xs max-w-xl text-gray-300 leading-7 font-cocogoose">
            Nuestra plataforma innovadora se centra en el ahorro en criptomonedas y ofrece opciones de staking que permiten a nuestros usuarios obtener rendimientos atractivos. Invertimos en una bolsa descentralizada y en minería de criptomonedas, lo que nos permite generar retornos superiores.
          </h2>
        </div>
        <div className='flex flex-row gap-y-6 p-8 mt-8'>
          <div className='w-1/2 flex flex-col justify-center items-end font-cocogoose gap-y-4 ml-8'>
            <p className='w-2/3 text-lg uppercase font-bold text-start'>¿Quienes Somos?</p>
            <p className='w-2/3 text-xs text-justify'>
              <span>En T-bank, somos un grupo de inversionistas apasionados por la revolución que la descentralización del dinero puede traer al mundo financiero. Creemos firmemente que eliminar intermediarios es clave para empoderar a nuestros clientes, permitiéndoles maximizar el rendimiento de sus capitales.</span><br /><br />
              <span>Nuestra plataforma innovadora se centra en el ahorro en criptomonedas y ofrece opciones de staking que permiten a nuestros usuarios obtener rendimientos atractivos. Invertimos en una bolsa descentralizada y en minería de criptomonedas, lo que nos permite generar retornos superiores y trasladarlos a nuestros clientes.</span><br /><br />
              <span className='font-semibold'>Invierte de manera inteligente y ve cómo tu dinero crece.</span>
            </p>
          </div>
          <div className='w-1/2 flex items-center justify-start scale-125 pl-40'><Image width={370} height={360} src={"/assets/images/figure02.jpg"} className="object-contain" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" /></div>
        </div>
        <hr className="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
        <div className="w-full flex flex-col items-center justify-center mx-auto px-8 lg:px-24 py-4 my-12">
          <p className='font-cocogoose text-2xl font-semibold my-2 text-blue-950 text-center uppercase'>Servicios</p>
          <p className='lg:w-1/2 mb-20 text-center font-cocogoose text-[0.65rem] lg:text-xs text-gray-800'>Ahorrar con nosotros es fácil y sin complicaciones. Abre tu cuenta y empieza a disfrutar de los intereses más altos del mercado, todo desde donde quieras. Si nos necesitas, siempre estaremos aquí para apoyarte. aplican <a href='/terms-and-conditions' className='font-semibold'>Terminos & Condiciones</a></p>
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 py-12 !overflow-hidden">
            <Card isFooterBlurred radius="lg" className={`border-none ${selectedCard === "1" ? "scale-105" : "scale-100"}`}>
              <Image onClick={() => handleClick("1")} width={320} height={360} src="https://javilinares.com/wp-content/uploads/2024/04/Imagen18-2-1024x631.jpg" className="object-cover" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" />
              <CardFooter className="justify-between before:bg-black border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="flex justify-center items-center p-2 text-sm text-gray-800 font-cocogoose font-bold group-hover:text-gray-200">Cuenta de Ahorros</p>
              </CardFooter>
            </Card>
            <Card isFooterBlurred radius="lg" className={`border-none ${selectedCard === "2" ? "scale-105" : "scale-100"}`}>
              <Image onClick={() => handleClick("2")} width={320} height={360} src="https://em.bank/wp-content/uploads/2024/05/how-to-open-a-business-bank-account-in-europe.jpg" className="object-cover" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" />
              <CardFooter className="justify-between before:bg-black border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="flex justify-center items-center p-2 text-sm text-gray-800 font-cocogoose font-bold">Lineas de Credito</p>
              </CardFooter>
            </Card>
            <Card isFooterBlurred radius="lg" className={`border-none ${selectedCard === "3" ? "scale-105" : "scale-100"}`}>
              <Image onClick={() => handleClick("3")} width={320} height={360} src="https://media.licdn.com/dms/image/v2/D5612AQFZhJ6wQ9dOcg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1713208448771?e=1735776000&v=beta&t=jF1NFi1dyp7EZGiyVXR2-G3j543pH4QCw75GjtYZE6k" className="object-cover" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" />
              <CardFooter className="justify-between before:bg-black border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                <p className="flex justify-center items-center p-2 text-sm text-gray-800 font-cocogoose font-bold">Inversiones</p>
              </CardFooter>
            </Card>
          </div>
          <div className='w-2/3 h-28 border font-cocogoose border-gray-100 text-gray-800 shadow-md rounded-3xl my-4'>
            {!selectedCard ? (
              <div className='w-full h-full flex flex-col items-center justify-center font-semibold opacity-75'>
                <span>¡Haz que tu dinero trabaje para ti de verdad!</span>
              </div>
            ) : (
              selectedCard === "1" ? (
                <div className='flex flex-col justify-start items-start py-4 px-6'>
                  <p className='text-sm font-bold'>Cuenta de Ahorros</p>
                  <p className='text-xs'>Ofrecemos una cuenta de ahorros que te permite ganar hasta un <span className='font-bankprinter text-base'>{data?.min_interest}%</span> Efectivo Anual, brindándote la libertad de acceder a tus fondos en cualquier momento sin cargos extra. Es la opción perfecta para quienes buscan una alternativa rentable y segura para sus ahorros, sin las complicaciones de tarifas adicionales.</p>
                </div>
              ) : (
                selectedCard === "2" ? (
                  <div className='flex flex-col justify-start items-start py-4 px-6'>
                    <p className='text-sm font-bold'>Lineas de Credito</p>
                    <p className='text-xs'>Accede a nuestras líneas de crédito con un interés competitivo de solo <span className='font-bankprinter text-base'>1.4%</span> mensual y montos de hasta <span className='font-bankprinter text-base'>$10.000 USD</span>. Te brindamos una opción flexible y accesible para financiar tus proyectos o necesidades personales. Disfruta de condiciones claras, pagos manejables y la tranquilidad de contar con el respaldo que necesitas para alcanzar tus metas.</p>
                  </div>
                ) : (
                  selectedCard === "3" ? (
                    <div className='flex flex-col justify-start items-start py-4 px-6'>
                      <p className='text-sm font-bold'>Inversiones</p>
                      <p className='text-xs'>Invierte de manera inteligente bloqueando tu saldo en staking y obtén hasta un <span className='font-bankprinter text-base'>{data?.max_interest}%</span> Efectivo Anual. Con esta estrategia de inversión a plazo definido, tu dinero gana mientras tú disfrutas de tranquilidad y rendimiento asegurado</p>
                    </div>
                  ) : null
                )))
            }
          </div>
        </div>
        <hr className="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
      </section>
      <Footer />
      <WhatsappPlugin />
    </main >
  );
};

export default AboutPage;
