'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import Context from '@/components/admin/context/index';
import Meta from '@/components/admin/meta/index';
import Logs from '@/components/admin/logs/index';
import History from '@/components/admin/history/index';
import Tasks from '@/components/admin/tasks/index';

const AdminPage: React.FC = () => {
  const { data: session } = useSession();

  return (
    <main className='w-screen h-screen overflow-x-hidden bg-gray-100 pb-12 lg:pb-0'>
      <nav className='w-full h-16 flex flex-row items-center justify-between bg-white shadow-sm px-8 py-1'>
        <Link href="#" className="inline-flex text-center justify-center items-center">
          <img src={"/assets/images/logo0.webp"} className="h-12 w-auto object-fit self-start mr-4 z-10" alt="Logo" />
        </Link>
        <div className='flex flex-row items-center justify-center gap-x-4'>
          <a href='' className='font-cocogoose font-semibold text-sm uppercase'>Home</a>
          <a href='' className='font-cocogoose font-semibold text-sm uppercase'>Admin</a>
          <a href='' className='font-cocogoose font-semibold text-sm uppercase'>Salir</a>
        </div>
      </nav>
      <section className='w-full h-auto flex flex-col px-6 gap-y-6'>
        <Context session={session} />
        <div className='w-full h-auto lg:h-96 flex flex-col lg:flex-row gap-4'>
          <Meta session={session} />
          <Logs session={session} />
        </div>
        <div className='w-full h-auto lg:h-72 flex flex-col lg:flex-row gap-4'>
          <Tasks session={session} />
          <History session={session} />
        </div>
      </section>
    </main>
  );
};

export default AdminPage;
