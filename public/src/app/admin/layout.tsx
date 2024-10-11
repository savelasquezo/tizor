'use client';

import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { I18next } from '@/utils/i18next';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <Suspense fallback={null}>
        <I18next>
          {children}
        </I18next>
      </Suspense>
    </SessionProvider>
  );
};

export default AdminLayout;
