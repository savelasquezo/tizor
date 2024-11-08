'use client';
import React, { useState, useEffect } from 'react';

import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';
import { WhatsappPlugin } from "@/utils/whatsapp-plugin";

import Header from '@/components/home/header/index';
import Footer from '@/components/home/footer/index';

import { Image } from "@nextui-org/react";
import { FaLongArrowAltRight } from "react-icons/fa";


const LegalPage: React.FC = () => {
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
      <section className='w-full lg:w-4/5 flex flex-col p-4 lg:p-12 mx-auto'>
        <div className='flex flex-col gap-y-2 pb-0 lg:p-8'>
          <div className='w-full lg:flex lg:flex-row lg:justify-between lg:gap-x-6 lg:mb-6'>
            <div className='w-full lg:w-2/3 flex flex-col justify-start items-start gap-y-4'>
              <p className='text-base lg:text-lg uppercase font-bold text-start'>{t('terms-and-conditions.terms-conditions.title')}</p>
              <p className='w-full lg:w-5/6 text-[0.65rem] lg:text-xs leading-3 lg:leading-5 text-justify'>
                <span>{t('terms-and-conditions.terms-conditions.paragraph1')}</span>
                <span className='font-carvingsoft text-sm mx-1'>{data?.max_interest}%</span>
                <span>{t('terms-and-conditions.terms-conditions.paragraph2')}</span>
                <span className='font-carvingsoft text-sm mx-1'>{data?.ref}%</span>
                <span>{t('terms-and-conditions.terms-conditions.paragraph3')}</span><br /><br />
                <span className='font-semibold'>{t('terms-and-conditions.terms-conditions.items.obj1.title')}</span><FaLongArrowAltRight className='mx-1 inline-flex' />
                <span>{t('terms-and-conditions.terms-conditions.items.obj1.paragraph1')}</span>
                <span>{t('terms-and-conditions.terms-conditions.items.obj1.paragraph2')}</span>
                <span className='font-carvingsoft text-sm mx-1'>{data?.unlock}%</span>
                <span>{t('terms-and-conditions.terms-conditions.items.obj1.paragraph3')}</span>
              </p>
            </div>
            <div className='w-1/3 scale-125 hidden lg:flex lg:items-start lg:justify-start'>
              <Image width={370} height={360} src={"/assets/images/figure02.webp"} className="object-contain" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" />
            </div>
          </div><br />
          <p className='w-full text-[0.65rem] lg:text-xs leading-3 lg:leading-5 text-justify'>
            <span className='font-semibold'>{t('terms-and-conditions.terms-conditions.items.obj2.title')}</span><FaLongArrowAltRight className='mx-1 inline-flex' />
            <span>{t('terms-and-conditions.terms-conditions.items.obj2.paragraph1')}</span>
            <span className='font-carvingsoft text-sm mx-1'>{data?.ref}%</span>
            <span>{t('terms-and-conditions.terms-conditions.items.obj2.paragraph2')}</span>
          </p>
          <p className='w-full text-[0.65rem] lg:text-xs leading-3 lg:leading-5 text-justify'>
            <span className='font-semibold'>{t('terms-and-conditions.terms-conditions.items.obj3.title')}</span><FaLongArrowAltRight className='mx-1 inline-flex' />
            <span>{t('terms-and-conditions.terms-conditions.items.obj3.paragraph1')}</span>
            <span>{t('terms-and-conditions.terms-conditions.items.obj3.paragraph2')}</span>
          </p><br />
        </div>
        <div className='flex flex-col gap-y-2 pt-0 lg:p-8'>
          <div className='w-full lg:flex lg:flex-row-reverse lg:justify-between lg:gap-x-6'>
            <div className='w-full lg:w-2/3 flex flex-col justify-start items-start gap-y-4 lg:ml-12'>
              <p className='w-full text-[0.65rem] lg:text-xs leading-3 lg:leading-5 text-justify'>
                <span className='font-semibold'>{t('terms-and-conditions.terms-conditions.items.obj4.title')}</span><FaLongArrowAltRight className='mx-1 inline-flex' />
                <span>{t('terms-and-conditions.terms-conditions.items.obj4.paragraph1')}</span>
              </p>
              <p className='w-full text-[0.65rem] lg:text-xs leading-3 lg:leading-5 text-justify'>
                <span className='font-semibold'>{t('terms-and-conditions.terms-conditions.items.obj5.title')}</span><FaLongArrowAltRight className='mx-1 inline-flex' />
                <span>{t('terms-and-conditions.terms-conditions.items.obj5.paragraph1')}</span>
              </p>
              <p className='w-full text-[0.65rem] lg:text-xs leading-3 lg:leading-5 text-justify'>
                <span className='font-semibold'>{t('terms-and-conditions.terms-conditions.items.obj6.title')}</span><FaLongArrowAltRight className='mx-1 inline-flex' />
                <span>{t('terms-and-conditions.terms-conditions.items.obj6.paragraph1')}</span>
                <span>{t('terms-and-conditions.terms-conditions.items.obj6.paragraph2')}</span>
                <span>{t('terms-and-conditions.terms-conditions.items.obj6.paragraph3')}</span>
              </p>
              <p className='w-full text-[0.65rem] lg:text-xs leading-3 lg:leading-5 text-justify'>
                <span className='font-semibold'>{t('terms-and-conditions.terms-conditions.items.obj7.title')}</span><FaLongArrowAltRight className='mx-1 inline-flex' />
                <span>{t('terms-and-conditions.terms-conditions.items.obj7.paragraph1')}</span>
                <span>{t('terms-and-conditions.terms-conditions.items.obj7.paragraph2')}</span>
              </p>
            </div>
            <div className='w-1/3 scale-100 hidden lg:flex lg:items-start lg:justify-start'><Image width={370} height={360} src={"/assets/images/figure03.webp"} className="object-contain ml-12" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" /></div>
          </div><br />
          <p className='w-full flex flex-col justify-center items-start mx-auto leading-3 lg:leading-5 text-justify'>
            <span className='text-base lg:text-lg font-semibold'>{t('terms-and-conditions.legal.title')}</span><br />
            <span className='text-[0.65rem] lg:text-xs'>{t('terms-and-conditions.legal.description')}</span>
          </p>
        </div>
      </section>
      <Footer />
      <WhatsappPlugin />
    </main >
  );
};

export default LegalPage;
