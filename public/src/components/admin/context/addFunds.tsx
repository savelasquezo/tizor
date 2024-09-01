import React, { useState } from 'react';
import Image from 'next/image';

import { NextResponse } from 'next/server';
import CircleLoader from 'react-spinners/CircleLoader';

import { FiDollarSign } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa6";


import { FaPlus } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";

import { SessionAuthModal } from '@/lib/types/types';

const addFunds: React.FC<SessionAuthModal> = ({ closeModal, session  }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    const [invoice, setInvoice] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
    const [formData, setFormData] = useState({amount: ''});
    const {amount} = formData;
  
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setSuccess('');
      setError('');
  
      await new Promise(resolve => setTimeout(resolve, 1500));
      const amountPattern = /^[1-9][0-9]+$/;
      if (!amountPattern.test(amount) || parseInt(amount, 0) < 10000 || parseInt(amount, 0) > 20000000) {
        setError('¡Error - Ingrese un valor Valido entre 10 USD & 100.000 USD!');
        setLoading(false);
        return;
      }
  
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/request-invoice/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({    
            amount,
          }),
        });
        const data = await res.json();
        if (!data.error) {
          setInvoice(data.apiInvoice);
          setRegistrationSuccess(true);
          setSuccess('¡Facturacion Exitosa!');
        }
      } catch (error) {
        NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
      }
      
      setLoading(false);
    };

  return (
    <div className="w-full h-full">
      <form className="w-full h-full space-y-4">
        <p className="text-start text-lg font-semibold font-cocogoose text-gray-800">Agregar Fondos</p>
        <div className="relative h-full flex items-center rounded-md border border-gray-300">
          <FiDollarSign className="absolute left-3 text-gray-500" />
          <input
            className="w-full h-10 bg-white-400 pl-10 pr-3 text-gray-700 border-none rounded-md focus:ring-2 focus:ring-blue-500"
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
            loading ? (<button className="bg-green-800 h-10 text-white p-2 shadow-sm rounded-r-md"><CircleLoader loading={loading} size={14} color="#ffff" /></button>) : (
              <button type="button" onClick={(e) => onSubmit(e)} className="bg-blue-600 h-10 text-white p-2 shadow-sm rounded-r-md hover:bg-blue-700"><FaPlus/></button>
            )) : (<button className="bg-green-600 h-10 text-white p-2 shadow-sm rounded-r-md"><FaCheck/></button>
          )}
        </div>
        <div className='w-full flex flex-row justify-between items-center rounded-sm my-2 p-2 border bg-yellow-50 border-blue-50'>
          <p className='flex flex-row justify-start items-center gap-x-2'>
            <span className='text-gray-500 text-sm'><IoWalletOutline /></span>
            <span className='text-gray-800 font-bankprinter text-xs'>{session.user.email}</span>
          </p>
          <button><FaRegCopy /></button>
        </div>
        <div className="text-center">
          <p className="mt-2 text-gray-600 text-xs">
            La actualización de tu saldo puede experimentar una breve demora antes de reflejarse en tu cuenta.
          </p>
          <div className='text-xs my-4'>
            {success && <p className="text-green-600">{success}</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!error && !success && <p className="text-gray-900">¿Necesitas ayuda? support@pajoytours.com</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default addFunds;
