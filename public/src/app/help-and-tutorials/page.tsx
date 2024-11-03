'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';
import { WhatsappPlugin } from "@/utils/whatsapp-plugin";


import Header from '@/components/home/header/index';
import Footer from '@/components/home/footer/index';
import Video from '@/components/home/video'

import { Accordion, AccordionItem } from "@nextui-org/react";
import {NextIconAcordion} from '@/app/help-and-tutorials/icons/nextorg-acordion';
import { ImQuestion } from "react-icons/im";


const HelpPage: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  const [faqs, setFaqs] = useState<{ id: number; question: string; answer: string }[]>([]);
  useEffect(() => {
    const fetchedSettings = nextSite();
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/site/fetch-faqs/`);
        const activeFaqs = response.data.results.filter((faq: any) => faq.is_active);
        setFaqs(activeFaqs);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <main className="relative bg-white w-full h-auto overflow-x-hidden font-cocogoose">
      <Header />
      <section className='w-4/5 flex flex-col p-12 mx-auto'>
        <div className="w-full mx-auto text-center mb-12">
          <div className="w-full flex flex-col items-center justify-start gap-y-4 text-3xl font-bold leading-tight text-gray-800 sm:text-4xl lg:text-3xl font-cocogoose">
            <h2>¿Preguntas Frecuentes?</h2>
            <p className='w-3/4 text-xs'>Explora nuestra sección de Preguntas Frecuentes para resolver tus dudas rápidamente. Encuentra respuestas detalladas a las consultas más comunes sobre el uso de la plataforma, funcionalidades, soporte y mucho más. ¡Empieza aquí y aprovecha todos los recursos que hemos preparado para ti!</p>
          </div>
        </div>
        <Accordion selectionMode="multiple" variant="splitted">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} aria-label={faq.question} title={faq.question} startContent={<ImQuestion className="!shadow-md" />} indicator={<NextIconAcordion/>}>
              <p className='text-xs py-4'>{faq.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
        <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
        <div className="w-full mx-auto text-center">
          <div className="w-full flex flex-col items-center justify-start gap-y-4 text-3xl font-bold leading-tight text-gray-800 sm:text-4xl lg:text-3xl font-cocogoose">
            <h2>Tutoriales</h2>
            <p className='w-3/4 text-xs'>Aprende a navegar y utilizar cada herramienta de la plataforma con nuestros tutoriales y guías detalladas. Desde lo más básico hasta las funciones avanzadas, estos recursos te mostrarán paso a paso cómo optimizar tu experiencia, gestionar tus actividades y aprovechar al máximo cada característica para alcanzar tus objetivos.</p>
          </div>
          <div className='w-full flex flex-row'>
            <Video thumbnail={data?.tutorial_thumbnail_1} url={data?.tutorial_1} width={1200} height={600} />
            <Video thumbnail={data?.tutorial_thumbnail_2} url={data?.tutorial_2} width={1200} height={600} />
          </div>
        </div>
        <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
      </section>
      <Footer />
      <WhatsappPlugin />
    </main >
  );
};

export default HelpPage;
