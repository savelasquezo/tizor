'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { useLanguage } from '@/utils/i18next';
import { nextSite } from '@/utils/next-site';
import WhatsappButton from '@/utils/whatsapp-button';

import { Input } from "@nextui-org/react";
import { MdQrCode2 } from "react-icons/md";


const InvestmentSimulator: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  const [amount, setAmount] = useState<number>(0);
  const [months, setMonths] = useState<number>(3);
  const [interest, setInterest] = useState<number>(14);

  const mathInterest = (months: number) => {
    const minRate = data?.min_interest || 12;
    const maxRate = data?.max_interest || 24;
    return minRate + ((maxRate - minRate) * (months - 3)) / (33);
  };

  const total = amount * Math.pow(1 + (interest / 1200), months);

  useEffect(() => {
    setInterest(mathInterest(months));
  }, [months]);

  useEffect(() => {
    const fetchedSettings = nextSite();
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
  }, []);

  return (
    <section className='relative w-full flex flex-col lg:flex-row items-start justify-center px-4 lg:px-32'>
      <div className='w-full lg:w-1/2 flex flex-col items-start justify-start px-4 lg:px-24 py-8 mx-auto mt-8 z-10'>
        <div className='flex flex-col items-start justify-center'>
          <p className='font-cocogoose text-center lg:text-start text-2xl font-semibold my-6 text-blue-950'>{t('home.math.title')}</p>
          <p className='font-cocogoose text-[0.65rem] lg:text-xs text-gray-800 text-justify'>{t('home.math.paragraph1')}</p>
        </div>
        <div className='w-full flex flex-col lg:flex-row items-start justify-center gap-8 py-8'>
          <div className='w-full lg:w-1/2 flex flex-row gap-x-4'>
            <Input
              type="number"
              name='amount'
              variant={'underlined'}
              label={t('home.math.calc.label1')}
              onChange={(e) => setAmount(Number(e.target.value))}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                  e.preventDefault();
                }
              }}
              min={100}
              max={100000}
              step={100}
            />
            <Input
              type="number"
              name='months'
              variant={'underlined'}
              label={t('home.math.calc.label2')}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMonths(value > 36 ? 36 : value);
              }}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                  e.preventDefault();
                }
              }}
              min={3}
              max={36}
              step={3}
              defaultValue={'3'}
            />
          </div>
          <div className='w-full lg:w-1/2 flex flex-row gap-x-4'>
            <Input
              type="text"
              name='interest'
              variant={'underlined'}
              label={t('home.math.calc.label3')}
              value={`${interest.toFixed(2)}%`}
              isDisabled
              style={{ color: 'black', fontWeight: 'bold' }}
              className="max-w-xs"
              startContent={
                <MdQrCode2 className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
            <Input
              type="text"
              name='total'
              variant={'underlined'}
              label={t('home.math.calc.label4')}
              value={`$ ${total.toFixed(2)}`}
              isDisabled
              style={{ color: 'black', fontWeight: 'bold' }}
              className="max-w-xs"
              startContent={
                <MdQrCode2 className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
              }
            />
          </div>
        </div>
        <div className='w-full flex flex-col lg:flex-row items-center justify-center gap-6'>
          <p className='w-full lg:w-3/4 font-cocogoose text-[0.55rem] text-gray-800 text-justify'>{t('home.math.paragraph2')}<a href='/terms-and-conditions' className='font-semibold mx-1'>{t('about-us.services.title.terms-and-conditions')}</a></p>
          <div className='w-full lg:w-1/4'>
            <WhatsappButton name={t('home.math.buton')} phoneNumber={data?.phone} message={t('home.math.investment-message')} />
          </div>
        </div>
      </div>
      <div className='absolute lg:static w-full lg:w-2/5 flex items-center justify-center lg:items-start lg:justify-start lg:-translate-x-16 opacity-5 lg:opacity-100 grayscale lg:grayscale-0'>
        <Image priority width={540} height={470} src={"/assets/images/background03.webp"} className="w-auto h-[30rem] object-contain" alt="" />
      </div>
    </section>
  );
};

export default InvestmentSimulator;
