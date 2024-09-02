import React, { useState, useEffect, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import { useSession } from 'next-auth/react';

import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";

import { SessionAuthenticated, TransactionsInfo } from '@/lib/types/types';


export const fetchTransactions = async (accessToken: string, page: number = 1) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/fetch-transactions?page=${page}`, {
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
    return { results: [], count: 0 };
  }
}

const Logs: React.FC<SessionAuthenticated> = ({ session }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [tickets, setTickets] = useState<TransactionsInfo[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const TicketsPage = 5;

  const fetchData = React.useCallback(async (page: number = 1) => {
    if (session) {
      const accessToken = session?.user?.accessToken;
      try {
        const { results, count } = await fetchTransactions(accessToken, page);
        setTickets(results || []);
        setPageCount(Math.ceil(count / TicketsPage));
      } catch (error) {
        console.error('There was an error with the network request:', error);
      }
    }
  }, [session, TicketsPage]);

  useEffect(() => {
    fetchData(pageNumber + 1);
  }, [session, pageNumber, fetchData]);

  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };


  const filledTickets = [...tickets];
  while (filledTickets.length < TicketsPage) {
    filledTickets.push({
      id: 0,
      amount: 0,
      fee: 0,
      date: '',
      type: '',
      voucher: '',
      account: '',
    });
  }

  return (
    <section className='w-full lg:w-2/5 break-words bg-white shadow-md rounded-2xl bg-clip-border'>
      <div className="w-full h-full overflow-x-auto lg:overflow-y-hidden shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-blue-100">
            <tr>
              <th scope="col" className="px-6 py-5">Fecha</th>
              <th scope="col" className="px-6 py-5">Movimiento</th>
              <th scope="col" className="px-6 py-5">Volumen</th>
              <th scope="col" className="px-6 py-5">Costo</th>
              <th scope="col" className="px-6 py-5">Saldo</th>
              <th scope="col" className="px-6 py-5 text-center">Codigo</th>
            </tr>
          </thead>
          <tbody>
            {filledTickets.map((ticket, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  <p className='flex flex-row items-center justify-start gap-x-2'>
                    <span className={ticket.amount >= 0 ? 'text-green-700' : 'text-red-700'}>
                      {ticket.amount >= 0 ? <FaPlus /> : <FaMinus />}
                    </span>
                    <span>{ticket.date ? ticket.date : '-'}</span>
                  </p>
                </th>
                <td className="px-6 py-4">
                  {ticket.type ? ticket.type : '-'}
                </td>
                <td className="px-6 py-4">
                  {ticket.amount ? `$${ticket.amount.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4">
                  {ticket.fee ? `$${ticket.fee.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4">
                  $0.0
                </td>
                <td className="px-6 py-4 text-center">
                  {ticket.voucher ? ticket.voucher : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={<MdNavigateBefore />}
          nextLabel={<MdNavigateNext />}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={0}
          pageRangeDisplayed={5}
          onPageChange={changePage}
          className={'relative w-full h-16 flex flex-row items-center justify-center gap-x-2 px-8'}
          pageClassName={'text-gray-700 rounded-full !px-3 !py-1 transition-colors duration-300'}
          activeClassName={'text-blue-800 font-semibold rounded-full !px-3 !py-1 transition-colors duration-300'}
          previousClassName={'absolute left-5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition-colors duration-300'}
          nextClassName={'absolute right-5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition-colors duration-300'}
        />
      </div>
    </section>
  );
};

export default Logs;
