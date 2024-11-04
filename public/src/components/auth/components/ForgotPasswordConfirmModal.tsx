'use client';

import React, { useState } from 'react';
import { NextResponse } from 'next/server';
import { useRouter, useSearchParams } from 'next/navigation';

import { useLanguage } from '@/utils/i18next';
import { ForgotPasswordConfirmInfo } from '@/lib/types/types';

import CircleLoader from 'react-spinners/CircleLoader';
import { Input } from "@nextui-org/react";
import { FiLock } from 'react-icons/fi'
import { IoEye, IoEyeOff } from "react-icons/io5";


const ForgotPasswordConfirmModal: React.FC<ForgotPasswordConfirmInfo> = ({ closeModal, updateForgotPasswordModalState }) => {
  const nextSite = JSON.parse(localStorage.getItem('nextsite.data') || '{}');
  const { t } = useLanguage();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: '',
  });

  const { new_password, re_new_password } = formData;
  const onChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');



    if (new_password !== re_new_password) {
      setError('¡Contraseñas Inconsistentes!');
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/auth/users/reset_password_confirm/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid,
            token,
            new_password,
            re_new_password,
          }),
        });

      if (res.ok) {
        setChangePasswordSuccess(true);
        updateForgotPasswordModalState(false);
        setError(`${t('home.header.auth.success.restore-success')}`);
        NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });
      }

    } catch (error) {
      setChangePasswordSuccess(false);
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
          type={isVisible ? "text" : "password"}
          name="new_password"
          value={new_password}
          required
          variant="underlined"
          onChange={(e) => onChange(e)}
          placeholder=""
          labelPlacement="outside"
          className="w-full"
          startContent={<FiLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
          readOnly={changePasswordSuccess}
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
              {isVisible ? (
                <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <IoEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }

        />
        <Input
          label=""
          type={isVisible ? "text" : "password"}
          name="re_new_password"
          value={re_new_password}
          required
          variant="underlined"
          onChange={(e) => onChange(e)}
          placeholder=""
          labelPlacement="outside"
          className="w-full"
          startContent={<FiLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
          readOnly={changePasswordSuccess}
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
              {isVisible ? (
                <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <IoEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
        />
        {changePasswordSuccess ? (
          <button onClick={() => { closeModal(); router.push('/'); }} className="h-10 bg-green-700 text-white font-semibold rounded-sm py-2 px-4 w-full text-sm text-center uppercase">{t('home.header.auth.message.updated')}</button>
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

export default ForgotPasswordConfirmModal;