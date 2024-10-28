import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/utils/i18next';
import Image from 'next/image';
import { nextSite } from '@/utils/next-site';
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
    return minRate + ((maxRate - minRate) * (months - 3))/(33);
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
          <p className='font-cocogoose text-center lg:text-start text-2xl font-semibold my-6 text-blue-950'>Simulador de Inversiones</p>
          <p className='font-cocogoose text-[0.65rem] lg:text-xs text-gray-800 text-justify'>Ahorrar con nosotros es fácil y sin complicaciones. Abre tu cuenta y empieza a disfrutar de los intereses más altos del mercado, todo desde donde quieras. Si nos necesitas, siempre estaremos aquí para apoyarte.</p>
        </div>
        <div className='w-full flex flex-col lg:flex-row items-start justify-center gap-8 py-8'>
          <div className='w-full lg:w-1/2 flex flex-row gap-x-4'>
            <Input
              type="number"
              name='amount'
              variant={'underlined'}
              label="Inversión"
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
              label="Temporalidad"
              onChange={(e) => setMonths(Number(e.target.value))}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMonths(value > 36 ? 36 : value); // Limita el valor máximo a 36
              }}
              min={3}
              max={36}
              step={3}
            />
          </div>
          <div className='w-full lg:w-1/2 flex flex-row gap-x-4'>
            <Input
              type="text"
              name='interest'
              variant={'underlined'}
              label="Interés (E.A)"
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
              label="$ Total"
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
          <p className='w-full lg:w-3/4 font-cocogoose text-[0.55rem] text-gray-800 text-justify'>
            La simulación del Staking T-Bank te muestra un cálculo estimado del valor de tu inversión, el plazo y la tasa vigente al momento de la consulta. Recuerda que esta información es solo referencial y no constituye una oferta comercial. Informes
            <span className='font-semibold cursor-pointer ml-1'>Términos & Condiciones</span>
          </p>
          <div className='w-full lg:w-1/4'>
            <button type="button" disabled className="flex justify-center items-center bg-gray-800 h-10 w-full text-white p-2 shadow-sm rounded-sm focus:bg-red-800 hover:bg-red-900 transition-colors duration-700">Solicitar</button>
          </div>
        </div>
      </div>
      <div className='absolute lg:static w-full lg:w-2/5 flex items-start justify-start lg:-translate-x-16 opacity-5 lg:opacity-100 grayscale lg:grayscale-0'>
        <Image priority width={1800} height={1300} src={"/assets/images/background05.png"} className="w-auto h-[30rem] object-contain" alt="" />
      </div>
    </section>
  );
};

export default InvestmentSimulator;
