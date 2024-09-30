import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/utils/i18next';
import { reloadSession } from '@/app/api/auth/[...nextauth]/session';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import { NextResponse } from 'next/server';
import CircleLoader from 'react-spinners/CircleLoader';

import { Slider } from "@nextui-org/slider";

import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { TbSquareRoundedPercentage } from "react-icons/tb";
import { MdOutlineFactCheck } from "react-icons/md";

import { nextSite } from '@/utils/next-site';
import { formatNumber } from "@/utils/formatNumber";

import { SessionAuthenticated, InvestmentInfo } from '@/lib/types/types';


const Investment: React.FC<SessionAuthenticated> = ({ session }) => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stepAmount = Math.floor(Number(session.user.balance)/100)*10;
  const [fixAmount, setfixAmount] = useState<number>(stepAmount);
  const [amount, setAmount] = useState<number>(stepAmount*10);
  const [months, setMonths] = useState<number>(12);
  const [investment, setInvestment] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [mathAmount, setMathAmount] = useState(false);
  const mathInterest = (months: number): number => {
    const minInterest = data?.min_interest;
    const maxInterest = data?.max_interest;
    return minInterest * Math.exp((Math.log(maxInterest / minInterest) / 36) * months);
  };

  const mathExpected = (): number => {
    const interest = mathInterest(months) / 100;
    const expectedBalance = amount * Math.pow(1 + (interest /12), 12 * (months/12));
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
    filledTickets.push({ uuid: '', amount: 0, interest: 0, accumulated: null, date_joined: '', date_target: '', voucher: '', state: ''});
  }

  const onSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="w-full h-full">
      <div className="w-full h-72 space-y-4">
        <div className='w-full flex flex-row'>
          <button onClick={() => switchModal('add')} className={`text-gray-100 font-cocogoose rounded-sm px-2 py-1 inline-flex text-xs uppercase font-semibold transition duration-300 mr-2 ${activeTab === 'add' ? 'bg-violet-700 hover:bg-violet-900' : 'bg-violet-400'}`}>Invertir</button>
          <button onClick={() => switchModal('lst')} className={`text-gray-100 font-cocogoose rounded-sm px-2 py-1 inline-flex text-xs uppercase font-semibold transition duration-300 mr-2 ${activeTab === 'lst' ? 'bg-gray-700 hover:bg-gray-900' : 'bg-gray-400'}`}>Historial</button>
        </div>
        <form className={`${activeTab === 'add' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Slider label="Saldo" hideValue={!mathAmount} step={fixAmount} minValue={fixAmount} maxValue={fixAmount*10} defaultValue={fixAmount} showSteps={true} isDisabled={registrationSuccess} size="sm" color="primary"
              onChange={(value: number | number[]) => {if (Array.isArray(value)) {setAmount(value[0]);} else {setAmount(value);}}}/>
            <Slider label="Temporalidad" step={3} minValue={6} maxValue={36} defaultValue={12} showSteps={true} isDisabled={registrationSuccess} size="sm" color="primary"
              onChange={(value: number | number[]) => {if (Array.isArray(value)) {setMonths(value[0]);} else {setMonths(value);}}}/>
          </div>
          <div className="text-center">
            <p className="mt-2 text-gray-900 text-xs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a feugiat arcu. Sed condimentum ultrices tristique. Duis quis tortor id justo tincidunt mollis. Cras euismod erat eu felis bibendum.
            </p>
            <div className='h-full w-full flex flex-row justify-between items-center rounded-sm my-2 pl-2 rounded-r-md border-2 bg-yellow-50 border-gray-200'>
              <div className='flex flex-col items-start justify-center py-1'>
                <p className='flex flex-row justify-start items-center gap-x-2'>
                  <span className='text-gray-500 text-sm'><IoWalletOutline /></span>
                  <span className='text-gray-800 font-bankprinter text-xs'>Total: {mathAmount ? `${mathExpected().toFixed(2)}` : '--'}</span>
                </p>
                <p className='flex flex-row justify-start items-center gap-x-2'>
                  <span className='text-gray-500 text-sm'><TbSquareRoundedPercentage /></span>
                  <span className='text-gray-800 font-bankprinter text-xs'>Interes: {mathInterest(months).toFixed(2)}% (E.A)</span>
                </p>
              </div>
              {!registrationSuccess ? (
                loading ? (<button className="h-14 w-10 flex justify-center items-center bg-violet-800 text-white p-2 shadow-sm rounded-r-md"><CircleLoader loading={loading} size={14} color="#ffff" /></button>) : (
                  <button type="button" onClick={(e) => onSubmit(e)} className="h-14 w-10 flex justify-center font-cocogoose items-center bg-violet-600 text-white p-2 shadow-sm rounded-r-md focus:bg-violet-700 hover:bg-violet-800 transition-colors duration-700"><MdOutlineFactCheck/></button>
                )) : (<p className="h-14 w-32 flex justify-center items-center bg-gray-600 text-white p-2 shadow-sm rounded-r-md">{investment}</p>
              )}
            </div>
            <div className='flex items-center justify-center text-xs h-10 my-4 border-t-1 border-gray-400'>
              {registrationSuccess && <p className="text-green-900 font-semibold font-cocogoose text-[0.65rem] mt-3">¡Felicidades! Has generado tu factura con éxito. Ahora, solo resta realizar el envío de las USDT a la dirección de wallet indicada. ¡Gracias por tu confianza!</p>}
              {error && <p className="text-red-600 font-semibold font-carvingsoft text-sm mt-3 uppercase">{error}</p>}
              {!registrationSuccess && !error && <p className="text-gray-900 mt-3">¿Necesitas ayuda? {data?.email ?? 'support@webmaster.com'}</p>}
            </div>
          </div>
        </form>
        <section className={`w-full h-full ${activeTab === 'lst' ? 'block animate-fade-in animate__animated animate__fadeIn' : 'hidden animate-fade-out animate__animated animate__fadeOut'}`}>
          {tickets.length > 0 ? (
            <div>
              <table className="min-w-full text-center text-sm font-light table-fixed">
                <thead className="font-medium text-gray-900">
                  <tr className="border-b-2 border-slate-400 font-cocogoose font-semibold uppercase text-xs">
                    <th scope="col" className="w-1/6 px-1 py-2">ID</th>
                    <th scope="col" className="w-1/6 px-1 py-2">Saldo</th>
                    <th scope="col" className="w-1/6 px-1 py-2">Interes</th>
                    <th scope="col" className="w-1/6 px-1 py-2">Acumulado</th>
                    <th scope="col" className="w-1/6 px-1 py-2">Fecha</th>
                    <th scope="col" className="w-1/6 px-1 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filledTickets.map((obj, index) => (
                    <tr key={index} className="border-b border-slate-300 uppercase text-xs text-gray-600 text-center align-middle h-8">
                      <td className="w-1/6 whitespace-nowrap px-1 py-2 font-bankprinter">{obj.voucher ? obj.voucher : ''}</td>
                      <td className="w-1/6 whitespace-nowrap px-1 py-2 font-bankprinter">{obj.amount ? formatNumber(obj.amount) : ''}</td>
                      <td className="w-1/6 whitespace-nowrap px-1 py-2 font-bankprinter">{obj.interest ? formatNumber(obj.interest)+'%' : ''}</td>
                      <td className="w-1/6 whitespace-nowrap px-1 py-2 font-bankprinter">{obj.accumulated !== null && obj.accumulated !== undefined ? formatNumber(obj.accumulated) : ''}</td>
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
                <p>¡Aun no has realizado ningun deposito!</p>
                <p>Agrega saldo a tu cuenta y empieza a generar intereses.</p>
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Investment;
