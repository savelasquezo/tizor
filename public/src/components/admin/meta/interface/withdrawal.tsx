import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/utils/i18next';
import { reloadSession } from '@/app/api/auth/[...nextauth]/session';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { lowerCase } from 'lodash';
import { NextResponse } from 'next/server';
import CircleLoader from 'react-spinners/CircleLoader';

import { FiDollarSign } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa6";

import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";

import { nextSite } from '@/utils/next-site';
import { formatNumber } from "@/utils/formatNumber";

import { SessionAuthenticated, TicketInfo } from '@/lib/types/types';

const Withdrawal: React.FC<SessionAuthenticated> = ({ session }) => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [withdrawal, setWithdrawal] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [formData, setFormData] = useState({ amount: '' });
  const { amount } = formData;

  const [copySuccess, setCopySuccess] = useState(false);
  const handleCopyClick = () => {
    navigator.clipboard.writeText(data?.address)
    setCopySuccess(true);
  };

  const [activeTab, setActiveTab] = useState('add');
  const switchModal = (tab: string) => {
    fetchData(pageNumber + 1);
    setActiveTab(tab);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const TicketsPage = 5;

  const fetchData = useCallback(async (page: number = 1) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/request-withdrawal/`, {
        params: { page: page },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${session?.user?.accessToken}`,
        }
      });
      const { results, count } = response.data;
      setTickets(results || []);
      setPageCount(Math.ceil(count / TicketsPage));
    } catch (error) {
      console.error('There was an error with the network request:', error);
    }
  }, [session]);

  useEffect(() => {
    const fetchedSettings = nextSite();
    fetchData(pageNumber + 1);
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
  }, [session, pageNumber, fetchData]);

  const changePage = ({ selected }: { selected: number }) => { setPageNumber(selected); };
  const filledTickets = [...tickets];
  while (filledTickets.length < TicketsPage) {
    filledTickets.push({ address: '', voucher: '', amount: 0, date: '', state: '', });
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1500));
    const amountPattern = /^[1-9][0-9]+$/;
    if (!amountPattern.test(amount) || parseInt(amount, 0) < 1 || parseInt(amount, 0) > 100000000) {
      setError('¡Error! - Ingrese un valor Valido entre 1 - 100.000.00 USD');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/request-withdrawal/`,
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
        setWithdrawal(data.apiWithdrawal);
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
      <div className="w-full h-56 space-y-4">
        <div className='w-full flex flex-row'>
          <button onClick={() => switchModal('add')} className={`h-6 text-gray-100 font-cocogoose rounded-sm px-2 py-1 inline-flex text-xs uppercase font-semibold transition duration-300 mr-2 ${activeTab === 'add' ? 'bg-blue-700 hover:bg-blue-900' : 'bg-blue-400'}`}>{t('admin.meta.interface.withdrawal.tab1')}</button>
          <button onClick={() => switchModal('lst')} className={`h-6 text-gray-100 font-cocogoose rounded-sm px-2 py-1 inline-flex text-xs uppercase font-semibold transition duration-300 mr-2 ${activeTab === 'lst' ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-400'}`}>{t('admin.meta.interface.withdrawal.tab2')}</button>
        </div>
        <form className={`${activeTab === 'add' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
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
              placeholder={t('admin.meta.interface.withdrawal.placeholder')}
            />
            {!registrationSuccess ? (
              loading ? (<button className="flex justify-center items-center bg-blue-800 h-10 w-10 text-white p-2 shadow-sm rounded-r-md"><CircleLoader loading={loading} size={14} color="#ffff" /></button>) : (
                <button type="button" onClick={(e) => onSubmit(e)} className="flex justify-center items-center bg-blue-700 h-10 w-10 text-white p-2 shadow-sm rounded-r-md focus:bg-blue-800 hover:bg-blue-800 transition-colors duration-700"><FaMinus /></button>
              )) : (<p className="flex justify-center items-center bg-gray-600 h-10 w-32 text-white p-2 shadow-sm rounded-r-md">{withdrawal}</p>
            )}
          </div>
          <div className='w-full flex flex-row justify-between items-center rounded-sm my-2 p-2 border bg-yellow-50 border-blue-50'>
            <p className='flex flex-row justify-start items-center gap-x-2'>
              <span className='px-1 py-0-5 bg-white border-2 border-gray-400 font-semibold uppercase text-xs'>{session.user.network}</span>
              <span className='text-gray-800 font-bankprinter text-xs hidden sm:block'>{session.user.address}</span>
              <span className='text-gray-800 font-bankprinter text-xs block sm:hidden select-none'>{session.user.address ? `${session.user.address.slice(0, 10)}***${session.user.address.slice(-10)}` : ''}</span>
            </p>
            <span onClick={handleCopyClick} className={`cursor-pointer transition-colors duration-1000 ${copySuccess ? 'text-green-500' : ''}`}><FaRegCopy /></span>
          </div>
          <div className="text-center">
            <p className="mt-2 text-gray-800 text-[0.65rem] leading-none md:text-xs">{t('admin.meta.interface.withdrawal.description')}</p>
            <div className='flex items-center justify-center text-xs h-10 my-4 border-t-1 border-gray-400'>
              {registrationSuccess && <p className="text-green-900 font-semibold font-cocogoose text-[0.65rem] uppercase mt-3">
                {t('admin.meta.interface.withdrawal.message.success')}<br />{t('admin.meta.interface.withdrawal.message.information')}</p>}
              {error && <p className="text-red-600 font-semibold font-carvingsoft text-sm mt-3 uppercase">{error}</p>}
              {!registrationSuccess && !error && <p className="text-gray-900 mt-3">{t('admin.meta.interface.withdrawal.message.help')} {data?.email ?? 'support@webmaster.com'}</p>}
            </div>
          </div>
        </form>
        <section className={`w-full h-full ${activeTab === 'lst' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
          {tickets.length > 0 ? (
            <div>
              <table className="w-full text-center text-sm font-light table-fixed">
                <thead className="font-medium text-gray-900">
                  <tr className="border-b-2 border-slate-400 font-cocogoose font-semibold uppercase text-xs">
                    <th scope="col" className="w-1/3 sm:w-1/5 px-2 lg:px-6 py-1">{t('admin.meta.interface.withdrawal.table.th1')}</th>
                    <th scope="col" className="w-1/3 sm:w-1/5 px-2 lg:px-6 py-1 hidden lg:table-cell">{t('admin.meta.interface.withdrawal.table.th2')}</th>
                    <th scope="col" className="w-1/3 sm:w-1/5 px-2 lg:px-6 py-1 hidden sm:table-cell">{t('admin.meta.interface.withdrawal.table.th3')}</th>
                    <th scope="col" className="w-1/3 sm:w-1/5 px-2 lg:px-6 py-1">{t('admin.meta.interface.withdrawal.table.th4')}</th>
                    <th scope="col" className="w-1/3 sm:w-1/5 px-2 lg:px-6 py-1">{t('admin.meta.interface.withdrawal.table.th5')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filledTickets.map((obj, index) => (
                    <tr key={index} className="border-b border-slate-300 uppercase text-xs text-gray-600 text-center align-middle h-6">
                      <td className="w-1/3 sm:w-1/5 whitespace-nowrap px-2 lg:px-6 py-1 font-bankprinter">{obj.voucher ? obj.voucher : ''}</td>
                      <td className="w-1/3 sm:w-1/5 whitespace-nowrap px-2 lg:px-6 py-1 font-bankprinter hidden lg:table-cell">{obj.address ? obj.address : ''}</td>
                      <td className="w-1/3 sm:w-1/5 whitespace-nowrap px-2 lg:px-6 py-1 font-bankprinter hidden sm:table-cell">{obj.amount ? formatNumber(obj.amount) : ''}</td>
                      <td className="w-1/3 sm:w-1/5 whitespace-nowrap px-2 lg:px-6 py-1 font-bankprinter">{obj.date ? obj.date : ''}</td>
                      <td className="w-1/3 sm:w-1/5 whitespace-nowrap px-2 lg:px-6 py-1 font-bankprinter">{obj.state ? t(`admin.meta.interface.withdrawal.states.${lowerCase(obj.state)}`) : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='flex flex-row items-center justify-center'>
                <ReactPaginate
                  previousLabel={<MdNavigateBefore />}
                  nextLabel={<MdNavigateNext />}
                  breakLabel={'...'}
                  pageCount={pageCount}
                  marginPagesDisplayed={0}
                  pageRangeDisplayed={5}
                  onPageChange={changePage}
                  className={'absolute bottom-2 w-full flex flex-row items-center justify-center gap-x-2'}
                  pageClassName={'text-gray-700 rounded-full !px-3 !py-1 transition-colors duration-300'}
                  activeClassName={'text-blue-800 font-semibold rounded-full !px-3 !py-1 transition-colors duration-300'}
                  previousClassName={'absolute left-10 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition-colors duration-300'}
                  nextClassName={'absolute right-10 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition-colors duration-300'}
                />
              </div>
            </div>
          ) : (
            <div className='w-full h-full flex flex-col justify-start items-center'>
              <span className='text-center text-gray-800 mt-8 text-sm'>
                <p>{t('admin.meta.interface.withdrawal.table.information.alert')}</p>
                <p>{t('admin.meta.interface.withdrawal.table.information.message')}</p>
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Withdrawal;
