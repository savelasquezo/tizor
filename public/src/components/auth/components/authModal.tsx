'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { NextResponse } from 'next/server';

import { useLanguage } from '@/utils/i18next';
import { ModalFunction } from '@/lib/types/types';

import CircleLoader from 'react-spinners/CircleLoader';

const AuthModal: React.FC<ModalFunction> = ({ closeModal }) => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [uid, setUID] = useState('');
  const { t } = useLanguage();

  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const uidParam = searchParams.get('uid');

    if (tokenParam !== null) {
      setToken(tokenParam);
    }

    if (uidParam !== null) {
      setUID(uidParam);
    }
  }, [searchParams]);

  const activateAccount = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/auth/users/activation/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid,
            token,
          }),
        });
      if (res.status === 204) {
        setActivated(true);
        NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });
      }

    } catch (error) {
      return NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });

    } finally {
      setLoading(false);
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/?login=True');
    }
  };

  return (
    <div className="w-full h-full sha">
      <div className="relative w-full h-full flex flex-col items-start justify-start">
        <div className="flex flex-col items-start justify-start p-6">
          <p className="text-start text-lg text-gray-800 font-cocogoose">{t('home.header.auth.message.welcome')}</p><br />
          <p className="text-sm text-gray-800 font-thin text-justify">{t('home.header.auth.message.welcome-paragraph')}</p>
        </div>
        <div className="absolute bottom-10 w-full px-4 ">
          {activated ? (<p className="h-10 bg-green-700 text-white font-semibold font-cocogoose text-xs rounded-sm py-2 px-4 w-full text-center flex items-center justify-center">{t('home.header.auth.message.activated')}</p>
          ) : (loading ? (<button type="button" className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-sm py-2 px-4 w-full text-center flex items-center justify-center"><CircleLoader loading={loading} size={25} color="#ffff" /></button>
            ) : (<button type="button" onClick={activateAccount} className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-sm py-2 px-4 w-full font-cocogoose text-xs text-center uppercase">{t('home.header.auth.message.activate')}</button>))
          }
        </div>
      </div>
    </div>
  );
};

export default AuthModal