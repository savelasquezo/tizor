'use client';

import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';


const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </SessionProvider>
  );
};

export default AdminLayout;