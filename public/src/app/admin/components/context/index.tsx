import React, { Suspense } from 'react';

import { GrMoney } from "react-icons/gr";
import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";



export default function Page() {
  return (
    <section>
      <div className="flex flex-wrap -mx-3 mt-4">
        <div className="w-1/2 max-w-full px-3 mb-2 flex-none lg:mb-0 lg:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-md rounded-2xl bg-clip-border">
            <div className="flex-auto p-5">
              <div className="w-full flex flex-row justify-between gap-2">
                <div className='flex flex-col gap-1 justify-center items-start'>
                  <p className="mb-0 font-cocogoose uppercase font-semibold leading-normal text-sm">Total</p>
                  <p className='text-xs font-cocogoose hidden lg:block'>Saldo disponible </p>
                  <p className="mb-0 text-xl font-creatodisplay block lg:hidden">$53,000</p>
                </div>
                <div className="flex flex-row items-center gap-x-2 px-2 text-right basis-1/3 lg:ml-0">
                  <p className="mb-0 text-4xl font-creatodisplay hidden lg:block">$53,000</p>
                  <div className="inline-block w-12 h-12 rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
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
              <div className="w-full flex flex-row justify-between gap-2">
                <div className='flex flex-col gap-1 justify-center items-start'>
                  <p className="mb-0 font-cocogoose uppercase font-semibold leading-normal text-sm">Interes</p>
                  <p className='text-xs font-cocogoose hidden lg:block'>Efectivo Anual</p>
                  <p className="mb-0 text-xl font-creatodisplay block lg:hidden">36.53%</p>
                </div>
                <div className="flex flex-row items-center gap-x-2 px-2 text-right basis-1/3 lg:ml-0">
                  <p className="mb-0 text-4xl font-creatodisplay hidden lg:block">36.53%</p>
                  <div className="inline-block w-12 h-12 rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
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
              <div className="w-full flex flex-row justify-between gap-2">
                <div className='flex flex-col gap-1 justify-center items-start'>
                  <p className="mb-0 font-cocogoose uppercase font-semibold leading-normal text-sm">Abonos</p>
                  <p className='text-xs font-cocogoose hidden lg:block'>Valor abonado diario</p>
                  <p className="mb-0 text-xl font-creatodisplay block lg:hidden">$8.32</p>

                </div>
                <div className="flex flex-row items-center gap-x-2 px-2 text-right basis-1/3 lg:ml-0">
                  <p className="mb-0 text-4xl font-creatodisplay hidden lg:block">$8.32</p>
                  <div className="inline-block w-12 h-12 rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
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
              <div className="w-full flex flex-row justify-between gap-2">
                <div className='flex flex-col gap-1 justify-center items-start'>
                  <p className="mb-0 font-cocogoose uppercase font-semibold leading-normal text-sm">Historico</p>
                  <p className='text-xs font-cocogoose hidden lg:block'>Initereses obtenidos</p>
                  <p className="mb-0 text-xl font-creatodisplay block lg:hidden">$3,000</p>
                </div>
                <div className="flex flex-row items-center gap-x-2 px-2 text-right basis-1/3 lg:ml-0">
                  <p className="mb-0 text-4xl font-creatodisplay hidden lg:block">$3,000</p>
                  <div className="inline-block w-12 h-12 rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
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
}

