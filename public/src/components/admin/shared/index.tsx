import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/utils/i18next';
import axios from 'axios';

import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaTelegramPlane, FaYoutube, FaBloggerB } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import Image from 'next/image';

import { nextSite } from '@/utils/next-site';
import { formatNumber } from "@/utils/formatNumber";
import { SessionAuthenticated, AccountReferedInfo } from '@/lib/types/types';


const linkIcons: { [key: string]: JSX.Element } = {
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  youtube: <FaYoutube />,
  tiktok: <FaTiktok />,
  whatsapp: <FaWhatsapp />,
  telegram: <FaTelegramPlane />,
  blogger: <FaBloggerB />
};

const Shared: React.FC<SessionAuthenticated> = ({ session }) => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  const [copySuccess, setCopySuccess] = useState(false);
  const handleCopyClick = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_API_URL}/?singup=True&uuid=${session.user.uuid}`)
    setCopySuccess(true);
  };

  const [tickets, setTickets] = useState<AccountReferedInfo[]>([]);
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/fetch-referred/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${session?.user?.accessToken}`,
        }
      });
      const { results, count } = response.data;
      setTickets(results || []);
    } catch (error) {
      console.error('There was an error with the network request:', error);
    }
  }, [session]);

  useEffect(() => {
    const fetchedSettings = nextSite();
    fetchData();
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
  }, [session, fetchData]);

  const filledTickets = [...tickets];
  while (filledTickets.length < 5) {
    filledTickets.push({ username: '', balance: 0, date_joined: '', });
  }

  return (
    <section className='w-full lg:w-3/5 flex flex-col-reverse lg:flex-row items-center justify-between break-words bg-white shadow-md rounded-2xl bg-clip-border py-1 lg:px-2 lg:pt-3 lg:pb-8'>
      <div className='w-full lg:w-1/2 h-full flex flex-col items-center lg:items-start lg:justify-between px-4 py-1'>
        <div className='hidden lg:flex flex-col items-start justify-start gap-y-4'>
          <p className='text-[0.65rem] text-justify leading-tight font-cocogoose'>{t('shared.description')}</p>
          <div className='w-full bg-blue-100 h-12 flex items-center justify-between rounded-sm px-4 border-2 border-blue-50'>
            <p className='text-sm'>{process.env.NEXT_PUBLIC_APP_API_URL}/?singup=True&uuid={session.user.uuid}</p>
            <span onClick={handleCopyClick} className={`cursor-pointer transition-colors duration-1000 ${copySuccess ? 'text-green-500' : ''}`}><FaRegCopy /></span>
          </div>
          <p className='text-[0.65rem] text-justify leading-tight font-cocogoose'>{t('shared.information')}</p>
        </div>
        <div className='w-full flex flex-row items-center justify-center lg:justify-start gap-x-2.5 lg:gap-x-4 my-6 lg:my-0'>
          {data?.links?.map((link: any) => (
            <a key={link.id} href={link.link || '#'} target="_blank" rel="noopener noreferrer" className={`w-auto h-10 flex items-center justify-center text-center opacity-90 hover:opacity-100 bg-gray-600 text-white px-3 py-2 font-xl rounded-full transition-opacity duration-300`}>
              <span className='mt-0 flex items-center justify-center lg:block'>
                {linkIcons[link.name] || <FaRegCopy />}
              </span>
            </a>
          ))}
          <span className='w-full h-auto hidden lg:flex items-end justify-end'>
            <Image priority width={360} height={130} src={"/assets/images/logo0.webp"} className="h-10 w-auto object-fit self-start z-10" alt="" />
          </span> 
        </div>
      </div>
      <div className='h-full w-full lg:w-1/2 mt-4 lg:mt-0 px-4'>
        <div className='block lg:hidden pt-1 pb-4 mb-2'>
          <p className='text-[0.55rem] text-center font-cocogoose'>{t('shared.description')}</p>
          <div className='w-full bg-blue-100 h-12 flex items-center justify-between rounded-sm px-4 border-2 border-blue-50 my-4'>
            <p className='text-[0.60rem]'>{process.env.NEXT_PUBLIC_APP_API_URL}/?singup=True&uuid=WERf234</p>
            <span onClick={handleCopyClick} className={`cursor-pointer transition-colors duration-1000 ${copySuccess ? 'text-green-500' : ''}`}><FaRegCopy /></span>
          </div>
          <p className='text-[0.55rem] text-center leading-tight font-cocogoose'>{t('shared.information')}</p>
        </div>
        <section className="w-full h-full">
          {filledTickets.length > 0 ? (
            <div>
              <table className="min-w-full text-center text-sm font-light">
                <thead className="font-medium text-gray-900">
                  <tr className="border-b-2 border-slate-400 font-cocogoose font-semibold uppercase text-xs">
                    <th scope="col" className=" px-6 py-2">{t('shared.table.th1')}</th>
                    <th scope="col" className=" px-6 py-2">{t('shared.table.th2')}</th>
                    <th scope="col" className=" px-6 py-2">{t('shared.table.th3')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filledTickets.map((obj, index) => (
                    <tr key={index} className="border-b border-slate-300 text-sm text-gray-600 text-center align-middle h-10">
                      <td className="whitespace-nowrap px-6 py-2 font-cocogoose text-xs">{obj.username ? obj.username : ''}</td>
                      <td className="whitespace-nowrap px-6 py-2">{obj.balance ? formatNumber(obj.balance) : ''}</td>
                      <td className="whitespace-nowrap px-6 py-2">{obj.date_joined ? obj.date_joined : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='w-full h-full flex flex-col justify-start items-center'>
              <span className='text-center text-gray-800 mt-8 text-sm'>
                <p>¡Aun no has realizado ningun deposito!</p>
                <p>Agrega saldo a tu cuenta y empieza a generar intereses.</p>
              </span>
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default Shared;
