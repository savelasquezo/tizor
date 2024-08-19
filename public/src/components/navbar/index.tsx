import React, { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

import Auth from '@/components/auth/components/page';

export default function Page() {
  const { data: session } = useSession();
  return (
    <nav className="fixed top-0 left-0 w-full bg-transparent h-14 z-30 py-4 px-8">
      <div className="flex flex-row justify-between items-center">
        <Link href="#" className="inline-flex text-center justify-center items-center">
          <Image priority width={360} height={130} src={"/assets/images/logo0.webp"} className="h-12 w-auto object-fit self-start mr-4 z-10" alt="" />
        </Link>
        <Suspense fallback={null}>
          <Auth session={session} />
        </Suspense>
      </div>
    </nav>
  );
}


