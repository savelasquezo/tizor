import React, { useState, useEffect, useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import {Input} from "@nextui-org/react";
import {DateInput} from "@nextui-org/date-input";

import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { MdQrCode2 } from "react-icons/md";

import { formatNumber } from "@/utils/formatNumber";
import { SessionAuthenticated, TransactionsInfo } from '@/lib/types/types';

export const fetchTransactions = async (accessToken: string, page: number = 1, filters: { voucher?: string; date?: string } = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...filters
    }).toString();

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/fetch-transactions?${queryParams}`, {
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
    return { results: [], count: 0 };
  }
}

const Logs: React.FC<SessionAuthenticated> = ({ session }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const [tickets, setTickets] = useState<TransactionsInfo[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [voucherFilter, setVoucherFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const TicketsPage = 10;

  const fetchData = React.useCallback(async (page: number = 1) => {
    if (session) {
      const accessToken = session?.user?.accessToken;
      try {
        const { results, count } = await fetchTransactions(accessToken, page, { voucher: voucherFilter, date: dateFilter });
        setTickets(results || []);
        setPageCount(Math.ceil(count / TicketsPage));
      } catch (error) {
        console.error('There was an error with the network request:', error);
      }
    }
  }, [session, TicketsPage, voucherFilter, dateFilter]);

  useEffect(() => {
    fetchData(pageNumber + 1);
    if (voucherFilter || dateFilter) {
      fetchData(1);
    }
  }, [session, pageNumber, voucherFilter, dateFilter, fetchData]);

  const changePage = ({ selected }: { selected: number }) => { setPageNumber(selected); };
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'voucher') setVoucherFilter(value);
    if (name === 'date') setDateFilter(value);
  };

  return (
    <section className='w-full lg:w-2/5 break-words bg-white shadow-md rounded-2xl bg-clip-border'>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-row gap-x-2 mb-4">
          <Input
            type="text"
            name="voucher"
            value={voucherFilter}
            onChange={handleFilterChange}
            placeholder="Ingresa Voucher"
            className="w-2/3"
            startContent={<MdQrCode2 className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>}
          />
          <input
            type="date"
            name="date"
            value={dateFilter}
            onChange={handleFilterChange}
            className="w-1/3 text-default-400 bg-gray-100 rounded-lg px-4 flex-shrink-0 focus:outline-none focus:ring-0"
          />
        </div>
        <div className="relative w-full h-full">
          <table className="min-w-full text-center text-sm font-light table-fixed">
            <thead className="font-medium text-gray-900">
              <tr className="border-b-2 border-slate-400 font-cocogoose font-semibold uppercase text-xs">
                <th scope="col" className="w-1/5 px-6 py-0.5">Voucher</th>
                <th scope="col" className="w-1/5 px-6 py-0.5">Valor</th>
                <th scope="col" className="w-1/5 px-6 py-0.5">Fecha</th>
                <th scope="col" className="w-1/5 px-6 py-0.5">Movimiento</th>
                <th scope="col" className="w-1/5 px-6 py-0.5">Estado</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="w-full border-b border-slate-300 uppercase text-xs text-gray-500 text-center align-middle h-6">
                  <td className="w-1/5 whitespace-nowrap px-6 py-0.5 font-bankprinter">{ticket.voucher}</td>
                  <td className="w-1/5 whitespace-nowrap px-6 py-0.5 font-bankprinter">{formatNumber(ticket.amount)}</td>
                  <td className="w-1/5 whitespace-nowrap px-6 py-0.5 font-bankprinter">{ticket.date}</td>
                  <td className="w-1/5 whitespace-nowrap px-6 py-0.5 font-bankprinter">{ticket.type}</td>
                  <td className="w-1/5 whitespace-nowrap px-6 py-0.5 font-bankprinter">{ticket.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='w-full flex flex-row items-center justify-center'>
            <ReactPaginate
              previousLabel={<MdNavigateBefore />}
              nextLabel={<MdNavigateNext />}
              breakLabel={'...'}
              pageCount={pageCount}
              onPageChange={changePage}
              className={'absolute bottom-12 w-full flex flex-row items-center justify-center gap-x-2'}
              pageClassName={'text-gray-700 rounded-full !px-3 !py-1 transition-colors duration-300'}
              activeClassName={'text-blue-800 font-semibold rounded-full !px-3 !py-1 transition-colors duration-300'}
              previousClassName={'absolute left-10 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition-colors duration-300'}
              nextClassName={'absolute right-10 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1 transition-colors duration-300'}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logs;
