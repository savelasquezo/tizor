'use client';

import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';

import { I18next } from '@/utils/i18next';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <I18next>
          {children}
        </I18next>
      </Suspense>
    </SessionProvider>
  );
};

export default AdminLayout;