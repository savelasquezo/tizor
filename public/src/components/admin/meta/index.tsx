import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { SlPencil } from "react-icons/sl";

import { MdLibraryAdd } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { IoIosLock, IoIosUnlock } from "react-icons/io";

import { MdOutlineMail } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";


import { SessionAuthenticated } from '@/lib/types/types';

export const fetchTransactions = async (accessToken: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/fetch-transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('Server responded with an error');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { percentage: 0 };
  }
}

const Meta: React.FC<SessionAuthenticated> = ({ session }) => {
  const [percentage, setPercentage] = useState(0);

  const fetchData = async () => {
    try {
      const results = await fetchTransactions(session.user.accessToken);
      setPercentage(results.profit || 0);
    } catch (error) {
      console.error('There was an error with the network request:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  return (
    <section className='w-full lg:w-3/5 flex flex-col-reverse lg:flex-row items-center justify-between break-words bg-white shadow-md rounded-2xl bg-clip-border py-1 lg:px-2 lg:pt-3 lg:pb-8'>
      <div className='w-full lg:w-2/3 h-full flex flex-col items-center lg:items-start lg:justify-between px-4 lg:pt-8'>
        <div className='w-full hidden lg:flex flex-col items-start justify-start gap-y-4'>
          <p className='text-[0.65rem] text-justify leading-tight font-cocogoose'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a feugiat arcu. Sed condimentum ultrices tristique. Duis quis tortor id justo tincidunt mollis. Cras euismod erat eu felis bibendum, non fringilla lacus lacinia. Phasellus varius erat quis euismod molestie. Pellentesque non dolor nec arcu porta fringilla. Suspendisse interdum maximus mauris ac maximus.</p>
          <div className='w-full flex flex-row justify-between items-center rounded-sm my-4 p-4 border bg-yellow-50 border-blue-50'>
            <div className='flex flex-col items-start justify-start'>
              <p className='flex flex-row justify-start items-center gap-x-2'>
                <span className='text-gray-500 text-sm'><MdOutlineMail /></span>
                <span className='text-gray-800 font-bankprinter text-xs'>{session.user.email}</span>
              </p>
              <p className='flex flex-row justify-start items-center gap-x-2'>
                <span className='text-gray-500 text-sm'><IoWalletOutline /></span>
                <span className='text-gray-800 font-bankprinter text-xs'>{session.user.wallet}</span>
              </p>
            </div>
            <button><SlPencil /></button>
          </div>
          <p className='text-[0.65rem] text-start leading-tight font-cocogoose'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a feugiat arcu. Sed condimentum ultrices tristique. Duis quis tortor id justo tincidunt mollis.</p>
        </div>
        <div className='w-full flex flex-row items-center justify-center lg:justify-start gap-x-4 my-6 lg:my-0'>
          <button className="w-full lg:w-1/3 h-10 text-center lg:flex lg:flex-row lg:items-center lg:justify-start lg:gap-x-1 bg-green-600 hover:bg-green-800 text-white px-2 lg:px-6 py-2 text-xl rounded-md transition-colors duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><MdLibraryAdd /></span>
            <span className='hidden lg:block font-cocogoose uppercase text-xs font-semibold'>Agregar</span>
          </button>
          <button className="w-full lg:w-1/3 h-10 text-center lg:flex lg:flex-row lg:items-center lg:justify-start lg:gap-x-1 bg-blue-600 hover:bg-blue-800 text-white px-2 lg:px-6 py-2 text-xl rounded-md transition-colors duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><FaMoneyBillTransfer /></span>
            <span className='hidden lg:block font-cocogoose uppercase text-xs font-semibold'>Transferir</span>
          </button>
          <button className="w-full lg:w-1/3 h-10 lg:flex lg:flex-row lg:items-center lg:justify-start lg:gap-x-1 bg-gray-700 hover:bg-gray-800 text-white px-2 lg:px-6 py-2 text-xl rounded-md transition-colors duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><TbReport /></span>
            <span className='hidden lg:block font-cocogoose uppercase text-xs font-semibold'>Historial</span>
          </button>
          <button className="w-full lg:w-1/12 h-10 lg:flex lg:flex-row lg:items-center lg:justify-center lg:gap-x-1 bg-yellow-600 hover:bg-yellow-800 text-white px-2 lg:px-6 py-2 text-xl rounded-md transition-colors duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><IoIosLock /></span>
          </button>
        </div>
      </div>
      <div className='w-full lg:max-w-80 h-auto p-0 lg:mt-8 px-4'>
        <div className='block lg:hidden py-4 mb-2'>
          <p className='text-[0.55rem] text-center font-cocogoose'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a feugiat arcu. Sed condimentum ultrices tristique. Duis quis tortor id justo tincidunt mollis. Cras euismod erat eu felis bibendum, non fringilla lacus lacinia. Phasellus varius erat quis euismod molestie. Pellentesque non dolor nec arcu porta fringilla. Suspendisse interdum maximus mauris ac maximus.</p>
        </div>
        <div className='w-full h-full lg:-ml-6'>
          <CircularProgressbar value={percentage} text={`${percentage}%`} />
        </div>
      </div>
    </section>
  );
};

export default Meta;