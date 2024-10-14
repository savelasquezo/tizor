import React, { useState } from 'react';
import { NextResponse } from 'next/server';
import { useRouter, useSearchParams } from 'next/navigation';
import CircleLoader from 'react-spinners/CircleLoader';
import { ForgotPasswordConfirmInfo } from '@/lib/types/types';
import { Input } from "@nextui-org/react";

import { FiLock } from 'react-icons/fi'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

const ForgotPasswordConfirmModal: React.FC<ForgotPasswordConfirmInfo> = ({ closeModal, updateForgotPasswordModalState }) => {

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
        setSuccess('¡Contraseña Actualizada!');
        NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });
      }

    } catch (error) {
      setChangePasswordSuccess(false);
      setError('¡Error al Actualizar! Inténtalo Nuevamente!');
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
          <button className="h-10 bg-green-700 text-white font-semibold rounded-sm py-2 px-4 w-full text-sm text-center uppercase"
            onClick={() => { closeModal(); router.push('/'); }}>
            Actualizado
          </button>
        ) : (
          loading ? (
            <button type="button" className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-sm py-2 px-4 w-full text-center flex items-center justify-center">
              <CircleLoader loading={loading} size={25} color="#ffff" />
            </button>
          ) : (
            <button type="submit" className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-sm py-2 px-4 w-full font-cocogoose text-xs text-center uppercase">Restablecer</button>
          )
        )}
      </form>
      {success && (<div className="text-lime-400 text-sm mt-2">{success}</div>)}
      {error && (<div className="text-red-400 text-sm mt-2">{error}</div>)}
      {!error && !success && (<div className="text-gray-400 text-xs mt-2 h-6">¿Necesitas ayuda? support@tizorbank.com</div>)}
    </div>
  );
};

export default ForgotPasswordConfirmModal;