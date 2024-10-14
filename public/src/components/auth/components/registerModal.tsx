import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { NextResponse } from 'next/server';

import Image from 'next/image';
import CircleLoader from 'react-spinners/CircleLoader';
import { ModalFunction } from '@/lib/types/types';

import { AiOutlineUser } from 'react-icons/ai'
import { CiMail } from 'react-icons/ci'
import { FiLock } from 'react-icons/fi'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { IoWalletOutline } from "react-icons/io5";

import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";




const RegisterModal: React.FC<ModalFunction> = ({ closeModal }) => {
  const searchParams = useSearchParams();
  const [infoRefered, setInfoRefered] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    address: '',
    password: '',
  });

  const { email, username, address, password } = formData;

  useEffect(() => {
    if (searchParams.get('uuid')) {
      setInfoRefered(true);
    }
  }, [searchParams]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (e: React.FormEvent) => {
    const re_password = password;
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));
    const usernamePattern = /^[a-zA-Z0-9]+$/;
    if (!usernamePattern.test(username)) {
      setError('¡Email invalido! Unicamente Alfanuméricos');
      setLoading(false);
      return;
    } else {
      setError('');
    }

    const emailPattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (!emailPattern.test(email)) {
      setError('¡Email invalido! example@domain.com');
      setLoading(false);
      return;
    } else {
      setError('');
    }

    const ref = searchParams.get('uuid') ?? 'N/A';
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/auth/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          address,
          ref,
          password,
          re_password
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        const errorMessage = data?.detail || 'There was an error with the network request';
        return setError(errorMessage);
      }
      setRegistrationSuccess(true);
      setSuccess("¡Enviamos un correo electrónico de verificación.! ");
      NextResponse.json({ success: 'The request has been processed successfully.' }, { status: 200 });

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'There was an error with the network request';
      setError(errorMessage);
      NextResponse.json({ error: 'There was an error with the network request' }, { status: 500 });

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="">
      <form method="POST" onSubmit={onSubmit} className="relative flex flex-col gap-y-4 p-2">
        <Input
          label=""
          type="text"
          name="username"
          value={username}
          required
          variant="underlined"
          onChange={(e) => onChange(e)}
          placeholder="Usuario"
          labelPlacement="outside"
          className="w-full"
          startContent={<AiOutlineUser className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
          readOnly={registrationSuccess}
        />
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
        <Input
          label=""
          type="text"
          name="address"
          value={address}
          required
          variant="underlined"
          onChange={(e) => onChange(e)}
          placeholder="Wallet"
          labelPlacement="outside"
          className="w-full"
          startContent={<IoWalletOutline className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
          pattern="^[a-zA-Z0-9]+$"
          readOnly={registrationSuccess}
        />
        <Input
          label=""
          type={isVisible ? "text" : "password"}
          name="password"
          value={password}
          required
          variant="underlined"
          onChange={(e) => onChange(e)}
          placeholder=""
          labelPlacement="outside"
          className="w-full"
          startContent={<FiLock className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
          readOnly={registrationSuccess}
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
        {registrationSuccess ? (
          <p onClick={closeModal} className="h-10 bg-green-700 text-white font-semibold rounded-sm py-2 px-4 w-full text-sm text-center uppercase">
            Verificar email
          </p>
        ) : (
          loading ? (
            <button type="button" className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-sm py-2 px-4 w-full text-center flex items-center justify-center">
              <CircleLoader loading={loading} size={25} color="#ffff" />
            </button>
          ) : (
            <button type="submit" className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-sm py-2 px-4 w-full font-cocogoose text-xs text-center uppercase">Inscribirse</button>
          )
        )}
      </form>
      {success && (<div className="text-lime-700 text-xs md:text-sm mt-0 md:mt-2">{success}</div>)}
      {error && (<div className="text-red-800 text-xs md:text-sm mt-0 md:mt-2">{error}</div>)}
      {!error && !success && (<div className="text-gray-800 text-sm mt-2 h-6">¿Necesitas ayuda? support@tizorbank.com</div>)}
    </div>
  );
};

export default RegisterModal