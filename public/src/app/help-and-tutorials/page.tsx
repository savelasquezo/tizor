'use client';
import React, { useState, useEffect } from 'react';

import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';
import { WhatsappPlugin } from "@/utils/whatsapp-plugin";


import Header from '@/components/home/header/index';
import Footer from '@/components/home/footer/index';
import Video from '@/components/home/video'

import { Accordion, AccordionItem } from "@nextui-org/react";
import { NextIconAcordion } from '@/app/help-and-tutorials/icons/nextorg-acordion';
import { ImQuestion } from "react-icons/im";


const HelpPage: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchedSettings = nextSite();
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
  }, []);

  return (
    <main className="relative bg-white w-full h-auto overflow-x-hidden font-cocogoose">
      <Header />
      <section className='w-full lg:w-4/5 flex flex-col p-4 py-12 lg:p-12 mx-auto'>
        <div className="w-full mx-auto text-center mb-12">
          <div className="w-full flex flex-col items-center justify-start gap-y-4 text-3xl font-bold text-gray-800 sm:text-4xl lg:text-3xl font-cocogoose">
            <h2 className='text-lg sm:text-3xl lg:text-4xl'>{t('help-and-tutorials.faqs.title.title')}</h2>
            <p className='w-full lg:w-3/4 text-[0.65rem] lg:text-xs leading-3 lg:leading-tight'>{t('help-and-tutorials.faqs.title.subtitle')}</p>
          </div>
        </div>
        <Accordion fullWidth selectionMode="multiple" variant="splitted">
          <AccordionItem key={"1"} aria-label={t('help-and-tutorials.faqs.list.faq1.question')} title={<span className='text-sm sm:text-base lg:text-lg'>{t('help-and-tutorials.faqs.list.faq1.question')}</span>} startContent={<ImQuestion className="!shadow-md" />} indicator={<NextIconAcordion />}>
            <p className='text-[0.65rem] lg:text-xs p-2 lg:py-4'>{t('help-and-tutorials.faqs.list.faq1.answer')}</p>
          </AccordionItem>
          <AccordionItem key={"2"} aria-label={t('help-and-tutorials.faqs.list.faq2.question')} title={<span className='text-sm sm:text-base lg:text-lg'>{t('help-and-tutorials.faqs.list.faq2.question')}</span>} startContent={<ImQuestion className="!shadow-md" />} indicator={<NextIconAcordion />}>
            <p className='text-[0.65rem] lg:text-xs py-4'>{t('help-and-tutorials.faqs.list.faq2.answer')}</p>
          </AccordionItem>
          <AccordionItem key={"3"} aria-label={t('help-and-tutorials.faqs.list.faq3.question')} title={<span className='text-sm sm:text-base lg:text-lg'>{t('help-and-tutorials.faqs.list.faq3.question')}</span>} startContent={<ImQuestion className="!shadow-md" />} indicator={<NextIconAcordion />}>
            <p className='text-[0.65rem] lg:text-xs py-4'>{t('help-and-tutorials.faqs.list.faq3.answer')}</p>
          </AccordionItem>
          <AccordionItem key={"4"} aria-label={t('help-and-tutorials.faqs.list.faq4.question')} title={<span className='text-sm sm:text-base lg:text-lg'>{t('help-and-tutorials.faqs.list.faq4.question')}</span>} startContent={<ImQuestion className="!shadow-md" />} indicator={<NextIconAcordion />}>
            <p className='text-[0.65rem] lg:text-xs py-4'>{t('help-and-tutorials.faqs.list.faq4.answer')}</p>
          </AccordionItem>
          <AccordionItem key={"5"} aria-label={t('help-and-tutorials.faqs.list.faq5.question')} title={<span className='text-sm sm:text-base lg:text-lg'>{t('help-and-tutorials.faqs.list.faq5.question')}</span>} startContent={<ImQuestion className="!shadow-md" />} indicator={<NextIconAcordion />}>
            <p className='text-[0.65rem] lg:text-xs py-4'>{t('help-and-tutorials.faqs.list.faq5.answer')}</p>
          </AccordionItem>
        </Accordion>
        <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
        <div className="w-full mx-auto text-center">
          <div className="w-full flex flex-col items-center justify-start gap-y-4 text-3xl font-bold leading-tight text-gray-800 sm:text-4xl lg:text-3xl font-cocogoose">
            <h2>{t('help-and-tutorials.tutorials.title.title')}</h2>
            <p className='w-full lg:w-3/4 text-[0.65rem] lg:text-xs leading-3 lg:leading-5'>{t('help-and-tutorials.tutorials.title.subtitle')}</p>
          </div>
          <div className='w-full flex flex-col lg:flex-row'>
            <div className='w-full lg:w-1/2 flex flex-col justify-center items-center'>
              <Video thumbnail={data?.tutorial_thumbnail_1} url={data?.tutorial_1} width={1200} height={600} />
              <div className='flex flex-col lg:gap-y-2 -mt-2'>
                <p className='font-semibold'>{t('help-and-tutorials.tutorials.gallery.video1.title')}</p>
                <p className='text-xs'>{t('help-and-tutorials.tutorials.gallery.video1.subtitle')}</p>
              </div>
            </div>
            <div className='w-full lg:w-1/2 flex flex-col justify-center items-center'>
              <Video thumbnail={data?.tutorial_thumbnail_2} url={data?.tutorial_2} width={1200} height={600} />
              <div className='flex flex-col lg:gap-y-2 -mt-2'>
                <p className='font-semibold'>{t('help-and-tutorials.tutorials.gallery.video2.title')}</p>
                <p className='text-xs'>{t('help-and-tutorials.tutorials.gallery.video2.subtitle')}</p>
              </div>
            </div>
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
