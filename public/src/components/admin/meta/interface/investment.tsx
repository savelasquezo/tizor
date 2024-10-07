import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/utils/i18next';
import { reloadSession } from '@/app/api/auth/[...nextauth]/session';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import { NextResponse } from 'next/server';
import CircleLoader from 'react-spinners/CircleLoader';



import { Slider } from "@nextui-org/slider";


import { FaUnlock } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { MdQrCode2 } from "react-icons/md";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { MdOutlineFactCheck } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";


import { nextSite } from '@/utils/next-site';
import { formatNumber } from "@/utils/formatNumber";

import { SessionAuthenticated, InvestmentInfo } from '@/lib/types/types';


const Investment: React.FC<SessionAuthenticated> = ({ session }) => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stepAmount = Math.floor(Number(session.user.balance) / 100) * 10;
  const [fixAmount, setfixAmount] = useState<number>(stepAmount);
  const [amount, setAmount] = useState<number>(stepAmount * 10);
  const [months, setMonths] = useState<number>(12);
  const [investment, setInvestment] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const [voucherFilter, setVoucherFilter] = useState<string>('');
  const [filteredTicket, setFilteredTicket] = useState<InvestmentInfo | null>(null);

  const [mathAmount, setMathAmount] = useState(false);
  const mathInterest = (months: number): number => {
    const minInterest = data?.min_interest;
    const maxInterest = data?.max_interest;
    return minInterest * Math.exp((Math.log(maxInterest / minInterest) / 36) * months);
  };

  const mathExpected = (): number => {
    const interest = mathInterest(months) / 100;
    const expectedBalance = amount * Math.pow(1 + (interest / 12), 12 * (months / 12));
    return expectedBalance;
  };

  const [activeTab, setActiveTab] = useState('add');
  const switchModal = (tab: string) => {
    fetchData(pageNumber + 1);
    setActiveTab(tab);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const [tickets, setTickets] = useState<InvestmentInfo[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const TicketsPage = 5;

  const fetchData = useCallback(async (page: number = 1) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/request-investment/`, {
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
      if (session.user.balance > 100) {
        setMathAmount(true)
      }

    }
  }, [session, pageNumber, fetchData]);

  const changePage = ({ selected }: { selected: number }) => { setPageNumber(selected); };
  const filledTickets = [...tickets];
  while (filledTickets.length < TicketsPage) {
    filledTickets.push({ uuid: '', amount: 0, interest: 0, accumulated: 0, date_joined: '', date_target: '', voucher: '', state: '' });
  }

  const onSubmitInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      setfixAmount(stepAmount)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/request-investment/`,
        { amount, months },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${session?.user?.accessToken}`,
          },
        }
      );
      const data = res.data;
      if (!data.error) {
        setInvestment(data.apiInvestment);
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

  const onSubmitRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/refund-investment/`,
        { voucher: voucherFilter },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${session?.user?.accessToken}`,
          },
        }
      );
      const data = res.data;
      if (!data.error) {
        setRefundSuccess(true);
        reloadSession();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'There was an error with the network request';
      setError(errorMessage);
      NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
    }
    setLoading(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'voucher') {
      setVoucherFilter(value);
      const foundTicket = tickets.find(ticket => ticket.voucher === value && ticket.state === 'active');
      setFilteredTicket(foundTicket || null);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-72 space-y-4">
        <div className='w-full flex flex-row items-center'>
          <button onClick={() => switchModal('add')} className={`h-6 text-gray-100 font-cocogoose rounded-sm px-2 py-1 inline-flex text-xs uppercase font-semibold transition duration-300 mr-2 ${activeTab === 'add' ? 'bg-violet-700 hover:bg-violet-900' : 'bg-violet-400'}`}>{t('meta.interface.investment.tab1')}</button>
          <button onClick={() => switchModal('lst')} className={`h-6 text-gray-100 font-cocogoose rounded-sm px-2 py-1 inline-flex text-xs uppercase font-semibold transition duration-300 mr-2 ${activeTab === 'lst' ? 'bg-gray-700 hover:bg-gray-900' : 'bg-gray-400'}`}>{t('meta.interface.investment.tab2')}</button>
          <button onClick={() => switchModal('del')} className={`h-6 text-gray-100 font-cocogoose rounded-md px-2 py-1 inline-flex text-xs uppercase font-semibold transition duration-300 mr-2 ${activeTab === 'del' ? 'bg-red-700 hover:bg-red-900' : 'bg-red-300'}`}><FaUnlock /></button>
        </div>
        <form className={`${activeTab === 'add' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Slider label={t('meta.interface.investment.label.invest')} hideValue={!mathAmount} step={fixAmount} minValue={fixAmount} maxValue={fixAmount * 10} defaultValue={fixAmount} showSteps={true} isDisabled={registrationSuccess} size="sm" color="primary"
              onChange={(value: number | number[]) => { if (Array.isArray(value)) { setAmount(value[0]); } else { setAmount(value); } }} />
            <Slider label={t('meta.interface.investment.label.temporality')} step={3} minValue={6} maxValue={36} defaultValue={12} showSteps={true} isDisabled={registrationSuccess} size="sm" color="primary"
              onChange={(value: number | number[]) => { if (Array.isArray(value)) { setMonths(value[0]); } else { setMonths(value); } }} />
          </div>
          <div className="text-center">
            <p className="mt-2 text-gray-900 text-xs">{t('meta.interface.investment.description')}</p>
            <div className='h-full w-full flex flex-row justify-between items-center rounded-sm my-2 pl-2 rounded-r-md border-2 bg-yellow-50 border-gray-200'>
              <div className='flex flex-col items-start justify-center py-1'>
                <p className='flex flex-row justify-start items-center gap-x-2'>
                  <span className='text-gray-500 text-sm'><IoWalletOutline /></span>
                  <span className='text-gray-800 font-bankprinter text-xs'>{t('meta.interface.investment.results.total')}: {mathAmount ? `${mathExpected().toFixed(2)}` : '--'}</span>
                </p>
                <p className='flex flex-row justify-start items-center gap-x-2'>
                  <span className='text-gray-500 text-sm'><TbSquareRoundedPercentage /></span>
                  <span className='text-gray-800 font-bankprinter text-xs'>{t('meta.interface.investment.results.interest')}: {mathInterest(months).toFixed(2)}% (E.A)</span>
                </p>
              </div>
              {!registrationSuccess ? (
                loading ? (<button className="h-14 w-10 flex justify-center items-center bg-violet-800 text-white p-2 shadow-sm rounded-r-md"><CircleLoader loading={loading} size={14} color="#ffff" /></button>) : (
                  <button type="button" onClick={(e) => onSubmitInvestment(e)} className="h-14 w-10 flex justify-center font-cocogoose items-center bg-violet-600 text-white p-2 shadow-sm rounded-r-md focus:bg-violet-700 hover:bg-violet-800 transition-colors duration-700"><MdOutlineFactCheck /></button>
                )) : (<p className="h-14 w-32 flex justify-center items-center bg-gray-600 text-white p-2 shadow-sm rounded-r-md">{investment}</p>
              )}
            </div>
            <div className='flex items-center justify-center text-xs h-10 my-4 border-t-1 border-gray-400'>
              {registrationSuccess && <p className="text-green-900 font-semibold font-cocogoose text-[0.65rem] mt-3">
                {t('meta.interface.investment.message.success')}<br />{t('meta.interface.investment.message.information')}</p>}
              {error && <p className="text-red-600 font-semibold font-carvingsoft text-sm mt-3 uppercase">{error}</p>}
              {!registrationSuccess && !error && <p className="text-gray-900 mt-3">{t('meta.interface.investment.message.help')} {data?.email ?? 'support@webmaster.com'}</p>}
            </div>
          </div>
        </form>
        <section className={`w-full h-full ${activeTab === 'lst' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
          {tickets.length > 0 ? (
            <div>
              <table className="min-w-full text-center text-sm font-light table-fixed">
                <thead className="font-medium text-gray-900">
                  <tr className="border-b-2 border-slate-400 font-cocogoose font-semibold uppercase text-xs">
                    <th scope="col" className="w-1/6 px-1 py-2">{t('meta.interface.investment.table.th1')}</th>
                    <th scope="col" className="w-1/6 px-1 py-2">{t('meta.interface.investment.table.th2')}</th>
                    <th scope="col" className="w-1/6 px-1 py-2 hidden lg:table-cell">{t('meta.interface.investment.table.th3')}</th>
                    <th scope="col" className="w-1/6 px-1 py-2 hidden lg:table-cell">{t('meta.interface.investment.table.th4')}</th>
                    <th scope="col" className="w-1/6 px-1 py-2">{t('meta.interface.investment.table.th5')}</th>
                    <th scope="col" className="w-1/6 px-1 py-2">{t('meta.interface.investment.table.th6')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filledTickets.map((obj, index) => (
                    <tr key={index} className="border-b border-slate-300 uppercase text-xs text-gray-600 text-center align-middle h-8">
                      <td className="w-1/6 whitespace-nowrap px-1 py-2 font-bankprinter">{obj.voucher ? obj.voucher : ''}</td>
                      <td className="w-1/6 whitespace-nowrap px-1 py-2 font-bankprinter">{obj.amount ? formatNumber(obj.amount) : ''}</td>
                      <td className="w-1/6 whitespace-nowrap px-1 py-2 font-bankprinter hidden lg:table-cell">{obj.interest ? formatNumber(obj.interest) + '%' : ''}</td>
                      <td className="w-1/6 whitespace-nowrap px-1 py-2 font-bankprinter hidden lg:table-cell">{obj.accumulated ? formatNumber(obj.accumulated) : ''}</td>
                      <td className="w-1/6 whitespace-nowrap px-1 py-2 font-bankprinter">{obj.date_target ? obj.date_target : ''}</td>
                      <td className="w-1/6 whitespace-nowrap px-1 py-2 font-bankprinter">{obj.state ? obj.state : ''}</td>
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
                <p>{t('meta.interface.investment.table.information.alert')}</p>
                <p>{t('meta.interface.investment.table.information.message')}</p>
              </span>
            </div>
          )}
        </section>
        <form className={`${activeTab === 'del' ? 'block animate-fade-in' : 'hidden'}`}>
          <div className="relative h-full flex items-center rounded-md border border-gray-400">
            <MdQrCode2 className="absolute left-3 text-green-950" />
            <input
              className="w-full h-10 bg-white-400 pl-10 pr-3 text-gray-800 border-none rounded-md focus:bg-yellow-50 outline-none transition-colors duration-300"
              type="text"
              name="voucher"
              value={voucherFilter}
              onChange={handleFilterChange}
              required
              placeholder="Ingrese código del voucher"
            />
            {!refundSuccess ? (
              loading ? (<button className="flex justify-center items-center bg-red-800 h-10 w-10 text-white p-2 shadow-sm rounded-r-md"><CircleLoader loading={loading} size={14} color="#ffff" /></button>) : (
                !filteredTicket ? (<button className="flex justify-center items-center bg-red-300 h-10 w-10 text-white p-2 shadow-sm rounded-r-md transition-colors duration-700"><AiTwotoneDelete /></button>) : (
                  <button type="button" onClick={(e) => onSubmitRefund(e)} className="flex justify-center items-center bg-red-700 h-10 w-10 text-white p-2 shadow-sm rounded-r-md focus:bg-red-800 hover:bg-red-900 transition-colors duration-700"><AiTwotoneDelete /></button>
                ))) : (<p className="flex justify-center items-center bg-gray-600 h-10 w-32 text-white p-2 shadow-sm rounded-r-md"><FaCheck/></p>
            )}
          </div>
          {filteredTicket ? (
            <div className='w-full h-full flex flex-col gap-y-2'>
              <p className="mt-2 text-gray-900 text-xs text-justify">{t('meta.interface.investment.unlock.information')}</p>
              <div className='h-24 w-full flex flex-row justify-between items-center rounded-sm my-1 px-2 rounded-r-md border-2 bg-yellow-50 border-gray-200'>
                <div className='w-full flex flex-col items-start justify-center'>
                  <p className='w-full flex flex-row justify-between items-center'>
                    <p className='flex flex-row justify-start items-center'>
                      <span className='text-gray-500 text-sm'><IoWalletOutline /></span>
                      <span className='text-gray-800 font-bankprinter text-xs ml-2'>{t('meta.interface.investment.results.invest')}: {formatNumber(filteredTicket.amount)} ({filteredTicket.interest ? formatNumber(filteredTicket.interest) + '%' : '--'})</span>
                    </p>
                    <p className='text-end text-gray-800 font-bankprinter text-xs mr-1'>{filteredTicket.date_target}</p>
                  </p>
                  <p className='flex flex-row justify-start items-center gap-x-2'>
                    <span className='text-gray-500 text-sm'><TbSquareRoundedPercentage /></span>
                    <span className='text-gray-800 font-bankprinter text-xs'>{t('meta.interface.investment.results.interest')}: {formatNumber(filteredTicket.accumulated)}</span>
                  </p>
                  <br />
                  <p className='flex flex-row justify-start items-center gap-x-2 -mt-4'>
                    <span className='text-gray-500 text-sm'><TbSquareRoundedPercentage /></span>
                    <span className='text-gray-800 font-bankprinter text-xs'>{t('meta.interface.investment.results.settlement')}: {formatNumber(filteredTicket.accumulated * 0.3)}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-y-2'>
              <p className="mt-2 text-gray-900 text-xs text-justify">{t('meta.interface.investment.unlock.description.txt1')}</p>
              <p className="mt-2 text-gray-900 text-xs text-justify">{t('meta.interface.investment.unlock.description.txt2')}</p>
            </div>
          )}
        </form>
      </div >
    </div >
  );
};

export default Investment;
