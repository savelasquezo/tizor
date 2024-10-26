import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/utils/i18next';
import Image from 'next/image';

import { Input } from "@nextui-org/react";
import { MdQrCode2 } from "react-icons/md";

const InvestmentSimulator: React.FC = () => {
  const { t } = useLanguage();

  const [amount, setAmount] = useState<number>(1000);
  const [months, setMonths] = useState<number>(12);
  const [interest, setInterest] = useState<number>(14);

  const handleKeyDown = (event: any) => {
    if (!['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
    }
  };

  const calculateCompoundInterest = (principal: number, annualRate: number, time: number) => {
    const r = annualRate/1200;
    return principal * Math.pow(1 + r, time);
  };

  const total = calculateCompoundInterest(amount, interest, months);

  return (
    <section className='flex flex-row items-start justify-center px-32'>
      <div className='w-1/2 flex flex-col items-start justify-start px-24 py-8 mx-auto mt-8'>
        <div className='flex flex-col items-start justify-center'>
          <p className='font-cocogoose text-2xl font-semibold my-6 text-blue-950'>Simulador de Inversiones</p>
          <p className='font-cocogoose text-xs text-gray-800 text-justify'>Ahorrar con nosotros es fácil y sin complicaciones. Abre tu cuenta y empieza a disfrutar de los intereses más altos del mercado, todo desde donde quieras. Si nos necesitas, siempre estaremos aquí para apoyarte.</p>
        </div>
        <div className='flex flex-row items-start justify-center gap-x-12 py-8'>
          <Input 
            type="number" 
            name='amount' 
            variant={'underlined'} 
            label="Inversión" 
            onChange={(e) => setAmount(Number(e.target.value))} 
            onKeyDown={handleKeyDown} 
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
            onKeyDown={handleKeyDown} 
            min={3} 
            max={36} 
            step={3} 
          />
          <Input 
            type="text" 
            name='interest' 
            variant={'underlined'} 
            label="Interés (E.A)" 
            value={`${interest}%`} 
            onChange={(e) => setInterest(Number(e.target.value.replace('%', '')))} 
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
        <div className='w-full flex items-center justify-center flex-row gap-x-6'>
          <p className='w-3/4 font-cocogoose text-[0.55rem] text-gray-800 text-justify'>
            La simulación del CDT T-Bank te muestra un cálculo estimado del valor de tu inversión, el plazo y la tasa vigente al momento de la consulta. Recuerda que esta información es solo referencial y no constituye una oferta comercial. Informes
            <span className='font-semibold cursor-pointer ml-1'>Términos & Condiciones</span>
          </p>
          <div className='w-1/4'>
            <button type="button" disabled className="flex justify-center items-center bg-gray-800 h-10 w-full text-white p-2 shadow-sm rounded-sm focus:bg-red-800 hover:bg-red-900 transition-colors duration-700">Solicitar</button>
          </div>
        </div>
      </div>
      <div className='w-2/5 flex items-start justify-start -translate-x-16'>
        <Image priority width={1800} height={1300} src={"/assets/images/background05.png"} className="w-auto h-[30rem] object-contain" alt="" />
      </div>
    </section>
  );
};

export default InvestmentSimulator;
