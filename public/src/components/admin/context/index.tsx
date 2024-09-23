import React from 'react';
import { GrMoney } from "react-icons/gr";
import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";

import { formatNumber } from "@/utils/formatNumber";
import { SessionAuthenticated } from '@/lib/types/types';

const Context: React.FC<SessionAuthenticated> = ({ session }) => {
  const dailyAmount = Math.floor(((session?.user?.balance ?? 0) * (Math.pow(1 + (session?.user?.interest ?? 0) / 100, 1 / 365) - 1)) * 100) / 100;
  
  return (
    <section className="h-full w-full">
      <div className='flex flex-wrap -mx-3 mt-4'>
        <div className="w-1/2 max-w-full px-3 mb-2 flex-none lg:mb-0 lg:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-md rounded-2xl bg-clip-border">
            <div className="flex-auto p-5">
              <div className="w-full flex flex-row justify-between">
                <div className='flex flex-col gap-1 justify-center items-start'>
                  <p className="mb-0 font-cocogoose uppercase font-semibold leading-normal text-xs lg:text-base">Saldo</p>
                  <p className='text-xs font-cocogoose hidden lg:block'>Total disponible </p>
                  <p className="mb-0 text-sm md:text-xl font-creatodisplay block lg:hidden">${formatNumber(session?.user?.balance ?? 0, 0)}</p>
                </div>
                <div className="flex flex-row items-center text-right gap-4">
                  <p className="mb-0 text-4xl font-creatodisplay hidden lg:block">${formatNumber(session?.user?.balance ?? 0, 2)}</p>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                    <span className="leading-none text-lg relative left-3.5 top-3.5 text-gray-200 text-center"><GrMoney/></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 max-w-full px-3 mb-2 flex-none lg:mb-0 lg:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-md rounded-2xl bg-clip-border">
            <div className="flex-auto p-5">
              <div className="w-full flex flex-row justify-between">
                <div className='flex flex-col gap-1 justify-center items-start'>
                  <p className="mb-0 font-cocogoose uppercase font-semibold leading-normal text-xs lg:text-base">Interes</p>
                  <p className='text-xs font-cocogoose hidden lg:block'>Efectivo Anual </p>
                  <p className="mb-0 text-sm md:text-xl font-creatodisplay block lg:hidden">{session.user.interest}%</p>
                </div>
                <div className="flex flex-row items-center text-right gap-4">
                  <p className="mb-0 text-4xl font-creatodisplay hidden lg:block">{session.user.interest}%</p>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                    <span className="leading-none text-lg relative left-3.5 top-3.5 text-gray-200 text-center"><GiReceiveMoney/></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 max-w-full px-3 mb-2 flex-none lg:mb-0 lg:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-md rounded-2xl bg-clip-border">
            <div className="flex-auto p-5">
              <div className="w-full flex flex-row justify-between">
                <div className='flex flex-col gap-1 justify-center items-start'>
                  <p className="mb-0 font-cocogoose uppercase font-semibold leading-normal text-xs lg:text-base">Abonos</p>
                  <p className='text-xs font-cocogoose hidden lg:block'>Interes diario </p>
                  <p className="mb-0 text-sm md:text-xl font-creatodisplay block lg:hidden">${formatNumber(dailyAmount)}</p>
                </div>
                <div className="flex flex-row items-center text-right gap-4">
                  <p className="mb-0 text-4xl font-creatodisplay hidden lg:block">${formatNumber(dailyAmount)}</p>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                    <span className="leading-none text-lg relative left-3.5 top-3.5 text-gray-200 text-center"><GiTakeMyMoney/></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 max-w-full px-3 mb-2 flex-none lg:mb-0 lg:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-md rounded-2xl bg-clip-border">
            <div className="flex-auto p-5">
              <div className="w-full flex flex-row justify-between">
                <div className='flex flex-col gap-1 justify-center items-start'>
                  <p className="mb-0 font-cocogoose uppercase font-semibold leading-normal text-xs lg:text-base">Total</p>
                  <p className='text-xs font-cocogoose hidden lg:block'>Intereses obtenidos</p>                  
                  <p className="mb-0 text-sm md:text-xl font-creatodisplay block lg:hidden">${formatNumber(session.user.profit)}</p>
                </div>
                <div className="flex flex-row items-center text-right gap-4">
                  <p className="mb-0 text-4xl font-creatodisplay hidden lg:block">${formatNumber(session.user.profit)}</p>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                    <span className="leading-none text-lg relative left-3.5 top-3.5 text-gray-200 text-center"><MdAttachMoney/></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Context;
