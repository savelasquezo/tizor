'use client';

import React, { useState } from 'react';
import { NextResponse } from 'next/server';

import { useLanguage } from '@/utils/i18next';
import { ModalFunction } from '@/lib/types/types';

import CircleLoader from 'react-spinners/CircleLoader';
import { Input } from "@nextui-org/react";
import { CiMail } from 'react-icons/ci'

const ForgotPasswordModal: React.FC<ModalFunction> = ({ closeModal }) => {
  const nextSite = JSON.parse(localStorage.getItem('nextsite.data') || '{}');
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/auth/users/reset_password/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        });

      if (res.status !== 200) {
        return setError(`${t('home.header.auth.error.email-notfound')}`);
      }
      setRegistrationSuccess(true);
      setSuccess(`${t('home.header.auth.success.restore-send-email')}`);
      NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });

    } catch (error) {
      setError(`${t('home.header.auth.error.restore-failed')}`);
      NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form method="POST" onSubmit={onSubmit} className="flex flex-col gap-y-4 p-2">
        <Input
          label=""
          type="email"
          name="email"
          value={email}
          required
          variant="underlined"
          onChange={(e) => onChange(e)}
          placeholder="example@email.com"
          labelPlacement="outside"
          className="w-full"
          startContent={<CiMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
          pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"
          readOnly={registrationSuccess}
        />
        {registrationSuccess ? (
          <p onClick={closeModal} className="h-10 bg-green-700 text-white font-semibold rounded-sm py-2 px-4 w-full text-sm text-center uppercase">{t('home.header.auth.message.verify-email')}</p>
          ) : (loading ? (<button type="button" className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-sm py-2 px-4 w-full text-center flex items-center justify-center"><CircleLoader loading={loading} size={25} color="#ffff" /></button>
            ) : (<button type="submit" className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-sm py-2 px-4 w-full font-cocogoose text-xs text-center uppercase">{t('home.header.auth.restore')}</button>)
          )
        }
      </form>
      {success && (<div className="text-lime-700 font-semibold font-cocogoose text-[0.65rem] md:text-xs mt-0 md:mt-2">{success}</div>)}
      {error && (<div className="text-red-800 font-semibold font-cocogoose text-[0.65rem] md:text-xs mt-0 md:mt-2">{error}</div>)}
      {!error && !success && (<div className="text-gray-600 font-semibold font-cocogoose text-[0.65rem] md:text-xs mt-0 md:mt-2">{t('home.header.auth.message.need-help')} {nextSite.email}</div>)}
    </div>
  );
};

export default ForgotPasswordModal;