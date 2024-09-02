import React, { useEffect, useState, useCallback } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { SlPencil } from "react-icons/sl";

import { MdLibraryAdd } from "react-icons/md";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import { MdOutlineMail } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import {AiOutlineClose} from 'react-icons/ai';



import { SessionAuthenticated } from '@/lib/types/types';

import AddFunds from '@/components/admin/meta/interface/addFunds';
import RemFunds from '@/components/admin/meta/interface/remFunds';

export const fetchTransactions = async (accessToken: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/fetch-transactions`, {
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

  const [activeTab, setActiveTab] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [closingModal, setClosingModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const results = await fetchTransactions(session.user.accessToken);
      setPercentage(results.profit || 0);
    } catch (error) {
      console.error('There was an error with the network request:', error);
    }
  }, [session.user.accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (tab: string) => {
    setShowModal(true);
    setActiveTab(tab);
  };

  const closeModal = () => {
      setClosingModal(true);
      setTimeout(() => {
        setShowModal(false);
        setClosingModal(false);
      }, 500);
  };

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
          <button onClick={() => openModal('add')} className="w-full lg:w-1/3 h-10 text-center lg:flex lg:flex-row lg:items-center lg:justify-start lg:gap-x-1 bg-green-600 hover:bg-green-800 text-white px-2 lg:px-6 py-2 text-xl rounded-md transition-colors duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><MdLibraryAdd /></span>
            <span className='hidden lg:block font-cocogoose uppercase text-xs font-semibold'>Agregar</span>
          </button>
          <button onClick={() => openModal('rem')} className="w-full lg:w-1/3 h-10 text-center lg:flex lg:flex-row lg:items-center lg:justify-start lg:gap-x-1 bg-blue-600 hover:bg-blue-800 text-white px-2 lg:px-6 py-2 text-xl rounded-md transition-colors duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><FaMoneyBillTransfer /></span>
            <span className='hidden lg:block font-cocogoose uppercase text-xs font-semibold'>Transferir</span>
          </button>
          <button onClick={() => openModal('bck')} className="w-full lg:w-1/3 h-10 lg:flex lg:flex-row lg:items-center lg:justify-start lg:gap-x-1 bg-yellow-600 hover:bg-yellow-700 text-white px-2 lg:px-6 py-2 text-xl rounded-md transition-colors duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><TbReport /></span>
            <span className='hidden lg:block font-cocogoose uppercase text-xs font-semibold'>Invertir</span>
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
      {showModal && (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition bg-opacity-50 bg-gray-900 backdrop-blur-sm z-40 ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
            <div className={`relative w-11/12 sm:w-3/5 md:w-3/5 lg:w-2/5 max-w-[40rem] bg-gray-50 rounded-lg p-6 lg:pb-2`}>
              <button onClick={closeModal} className='absolute z-10 top-4 right-4 text-xl text-gray-400 hover:text-gray-600 transition-colors duration-300' ><AiOutlineClose /></button>
                <div className={`h-full my-4 ${activeTab === 'add' ? 'block' : 'hidden'}`}>
                  <AddFunds session={session} />
                </div>
                <div className={`h-full my-4 ${activeTab === 'rem' ? 'block' : 'hidden'}`}>
                  <RemFunds session={session} />
                </div>
                <div className={`h-full my-4 ${activeTab === 'wallet' ? 'block' : 'hidden'}`}>
                  <p>Hola</p>
                </div>
            </div>
          </div>
        )}
    </section>
  );
};

export default Meta;