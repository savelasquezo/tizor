import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { NextResponse } from 'next/server';
import CircleLoader from 'react-spinners/CircleLoader';

import { FiDollarSign } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { FaMinus, FaRegCopy } from "react-icons/fa6";

import { nextSite } from '@/utils/next-site';
import { SessionAuthenticated } from '@/lib/types/types';

const remFunds: React.FC<SessionAuthenticated> = ({ session  }) => {
    const [data, setData] = useState<{ [key: string]: any } | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const [invoice, setInvoice] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
    const [formData, setFormData] = useState({amount: ''});
    const {amount} = formData;

    const [copySuccess, setCopySuccess] = useState(false);
    const handleCopyClick = () => {
      navigator.clipboard.writeText(data?.address)
      setCopySuccess(true);
    };

    useEffect(() => {
      const fetchedSettings = nextSite();
      if (fetchedSettings) {
        setData(fetchedSettings);
      }
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
  
      await new Promise(resolve => setTimeout(resolve, 1500));
      const amountPattern = /^[1-9][0-9]+$/;
      if (!amountPattern.test(amount) || parseInt(amount, 0) < 100 || parseInt(amount, 0) > 100000000) {
        setError('¡Error - Ingrese un valor Valido entre 10 USD & 100.000 USD!');
        setLoading(false);
        return;
      }
  
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/request-invoice/`,
          { amount },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `JWT ${session?.user?.accessToken}`,
            },
          }
        );
        const data = res.data;
        if (!data.error) {
          setInvoice(data.apiInvoice);
          setRegistrationSuccess(true);
        }
      } catch (error) {
        setError('There was an error with the network request');
        NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
      }
      setLoading(false);
    };

  return (
    <div className="w-full h-full">
      <form className="w-full h-full space-y-4">
        <p className="text-start text-lg font-semibold font-cocogoose text-gray-800">Transferir Fondos</p>
        <div className="relative h-full flex items-center rounded-md border border-gray-400">
          <FiDollarSign className="absolute left-3 text-green-950" />
          <input
            className="w-full h-10 bg-white-400 pl-10 pr-3 text-gray-800 border-none rounded-md focus:bg-yellow-50 outline-none transition-colors duration-300"
            type="number"
            name="amount"
            value={amount}
            onChange={onChange}
            min="10000"
            max="20000000"
            pattern="[0-9]*"
            required
            readOnly={registrationSuccess}
            placeholder="Ingrese el monto"
          />
          {!registrationSuccess ? (
            loading ? (<button className="flex justify-center items-center bg-red-800 h-10 w-10 text-white p-2 shadow-sm rounded-r-md"><CircleLoader loading={loading} size={14} color="#ffff" /></button>) : (
              <button type="button" onClick={(e) => onSubmit(e)} className="flex justify-center items-center bg-red-600 h-10 w-10 text-white p-2 shadow-sm rounded-r-md focus:bg-red-700 hover:bg-red-800 transition-colors duration-700"><FaMinus/></button>
            )) : (<p className="flex justify-center items-center bg-gray-600 h-10 w-32 text-white p-2 shadow-sm rounded-r-md">{invoice}</p>
          )}
        </div>
        <div className='w-full flex flex-row justify-between items-center rounded-sm my-2 p-2 border bg-yellow-50 border-blue-50'>
          <p className='flex flex-row justify-start items-center gap-x-2'>
            <span className='text-gray-500 text-sm'><IoWalletOutline /></span>
            <span className='text-gray-800 font-bankprinter text-xs'>{session.user.wallet}</span>
          </p>
          <span onClick={handleCopyClick} className={`cursor-pointer transition-colors duration-1000 ${copySuccess ? 'text-green-500' : ''}`}><FaRegCopy /></span>
        </div>
        <div className="text-center">
          <p className="mt-2 text-gray-900 text-xs">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a feugiat arcu. Sed condimentum ultrices tristique. Duis quis tortor id justo tincidunt mollis. Cras euismod erat eu felis bibendum.
          </p>
          <div className='flex items-center justify-center text-xs h-10 my-4 border-t-1 border-gray-400'>
            {registrationSuccess && <p className="text-green-900 font-semibold font-cocogoose text-[0.65rem] mt-3">¡Felicidades! Has generado tu factura con éxito. Ahora, solo resta realizar el envío de las USDT a la dirección de wallet indicada. ¡Gracias por tu confianza!</p>}
            {!registrationSuccess && !error && <p className="text-gray-900 mt-3">¿Necesitas ayuda? {data?.email ?? 'support@webmaster.com'}
            {error && <p className="text-red-600 mt-3">{error}</p>}
            </p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default remFunds;
