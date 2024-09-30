import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/utils/i18next';
import { reloadSession } from '@/app/api/auth/[...nextauth]/session';
import axios from 'axios';

import { NextResponse } from 'next/server';
import CircleLoader from 'react-spinners/CircleLoader';

import { MdOutlineMail } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

import { nextSite } from '@/utils/next-site';
import { SessionAuthenticated, TicketInfo } from '@/lib/types/types';


const UpdateInfo: React.FC<SessionAuthenticated> = ({ session }) => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [formData, setFormData] = useState({ address: '' });
  const { address } = formData;

  useEffect(() => {
    const fetchedSettings = nextSite();
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
  }, [session]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/update-account/`,
        { address },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${session?.user?.accessToken}`,
          },
        }
      );
      const data = res.data;
      if (!data.error) {
        setRegistrationSuccess(true);
        reloadSession();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'There was an error with the network request';
      setError(errorMessage);
      NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-auto space-y-4">
        <form className='w-full h-full'>
          <p className='text-gray-900 font-cocogoose text-start font-semibold my-4'>{t('meta.interface.updateInfo.title')}</p>
          <div className="relative flex items-center rounded-md border border-gray-400">
            <MdOutlineMail className="absolute left-3 text-green-950" />
            <input
              className="w-full h-10 bg-white-400 pl-10 pr-3 text-gray-800 border-none rounded-md focus:bg-yellow-50 outline-none transition-colors duration-300"
              type="text"
              name="address"
              value={address}
              onChange={onChange}
              required
              readOnly={registrationSuccess}
              placeholder={session.user.address}
            />
            {!registrationSuccess ? (

              loading ? (<button className="flex justify-center items-center bg-gray-800 h-10 w-10 text-white p-2 shadow-sm rounded-r-md"><CircleLoader loading={loading} size={14} color="#ffff" /></button>) : (
                <button type="button" onClick={(e) => onSubmit(e)} className="flex justify-center items-center bg-gray-700 h-10 w-10 text-white p-2 shadow-sm rounded-r-md focus:bg-gray-800 hover:bg-gray-900 transition-colors duration-700"><FaCheck /></button>
              )) : (<p className="flex justify-center items-center bg-gray-600 h-10 w-32 text-white p-2 shadow-sm rounded-r-md">OK</p>
            )}
          </div>
          <p className="mt-2 text-gray-900 text-xs text-center">{t('meta.interface.updateInfo.description')}</p>
          <div className='flex items-center justify-center text-xs h-10 my-4 border-t-1 border-gray-400 text-center'>
            {registrationSuccess && <p className="text-green-900 font-semibold font-cocogoose text-[0.65rem] mt-3">{t('meta.interface.updateInfo.message.success')}</p>}
            {error && <p className="text-red-600 font-semibold font-carvingsoft text-sm mt-3 uppercase">{error}</p>}
            {!registrationSuccess && !error && <p className="text-gray-900 mt-3">{t('meta.interface.updateInfo.message.information')} {data?.email ?? 'support@webmaster.com'}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateInfo;
