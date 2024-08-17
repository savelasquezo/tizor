'use client';

import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';

import Context from '@/app/admin/components/context/index';
import Meta from '@/app/admin/components/meta/index';
import Logs from '@/app/admin/components/logs/index';
import History from '@/app/admin/components/history/index';
import Tasks from '@/app/admin/components/tasks/index';

const indexAdmin: React.FC = () => {
  return (
    <SessionProvider >
      <Suspense fallback={null}>
        <main className='w-screen h-screen overflow-x-hidden bg-gray-100 pb-12 lg:pb-0'>
          <nav className='w-full h-16 flex flex-row items-center justify-between bg-white shadow-sm px-8 py-1'>
            <Link href="#" className="inline-flex text-center justify-center items-center">
              <img src={"/assets/images/logo0.webp"} className="h-12 w-auto object-fit self-start mr-4 z-10" alt="" />
            </Link>
            <div className='flex flex-row items-center justify-center gap-x-4'>
              <a href='' className='font-cocogoose font-semibold text-sm uppercase'>Home</a>
              <a href='' className='font-cocogoose font-semibold text-sm uppercase'>Admin</a>
              <a href='' className='font-cocogoose font-semibold text-sm uppercase'>Salir</a>
            </div>
          </nav>
          <section className='w-full h-auto flex flex-col px-6 gap-y-6'>
            <Context/> 
            <div className='w-full h-auto lg:h-96 flex flex-col lg:flex-row gap-4'>
              <Meta/>
              <Logs/>
            </div>
            <div className='w-full h-auto lg:h-72 flex flex-col lg:flex-row gap-4'>
              <Tasks/>
              <History/>
            </div>
          </section>
        </main>
      </Suspense>
    </SessionProvider>
  );
};

export default indexAdmin;