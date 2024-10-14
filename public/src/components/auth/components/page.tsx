import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@nextui-org/react";

import AuthModal from "@/components/auth/components/authModal";
import LoginModal from "@/components/auth/components/loginModal";
import RegisterModal from "@/components/auth/components/registerModal";
import ForgotPasswordModal from "@/components/auth/components/ForgotPasswordModal";
import ForgotPasswordConfirmModal from "@/components/auth/components/ForgotPasswordConfirmModal";
import { SessionAuth } from '@/lib/types/types';

import { AiOutlineClose, AiFillLock, AiFillUnlock } from 'react-icons/ai'
import { FaUser, FaPowerOff } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";


const Auth: React.FC<SessionAuth> = ({ session }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [closingModal, setClosingModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const updateForgotPasswordModalState = (value: boolean): void => {
    setShowForgotPasswordModal(value);
  };

  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (searchParams.get('login')) {
      setShowModal(true);
      setActiveTab('login');
    }
    if (searchParams.get('singup')) {
      setShowModal(true);
      setActiveTab('singup');
    }
    if (searchParams.get('auth')) {
      setShowModal(true);
      setActiveTab('auth');
    }
    if (searchParams.get('forgot_password_confirm')) {
      setShowModal(true);
      setShowForgotPasswordModal(true);
      setActiveTab('forgot_password_confirm');
    }

  }, [searchParams]);

  const openModal = (tab: string) => {
    setShowModal(true);
    setActiveTab(tab);
  };

  const closeModal = () => {
    setClosingModal(true);
    setTimeout(() => {
      setShowModal(false);
      setClosingModal(false);
      router.push('/');
    }, 500);
  };

  return (
    <main className="inline-flex">
      {session && session?.user ? (
        <div className='flex flex-row items-center gap-x-2 sm:gap-x-0'>
          <a href="/admin"><button className="py-2 px-6 text-sm font-semibold font-cocogoose hidden sm:inline">Administrar</button></a>
          <a href="/admin"><Button isIconOnly color="default" className="!bg-gray-100 flex sm:hidden" aria-label=""><MdOutlineDashboard /></Button></a>
          <button onClick={() => { signOut(); }} className='py-2 px-6 text-sm font-semibold font-cocogoose hidden sm:inline'>Salir</button>
          <Button onClick={() => { signOut(); }} isIconOnly color="default" className="!bg-gray-100 flex sm:hidden" aria-label=""><FaPowerOff /></Button>
        </div>
      ) : (
        <div className='flex flex-row items-center'>
          <button onClick={() => openModal('login')} className='py-2 px-6 text-sm font-semibold font-cocogoose hidden lg:flex'>Ingresar</button>
          <button onClick={() => openModal('singup')} className='py-2 px-6 text-sm font-semibold font-cocogoose hidden sm:inline'>Inscribirse</button>
          <Button onClick={() => openModal('singup')} isIconOnly color="default" className="!bg-gray-100 flex sm:hidden" aria-label=""><FaUser /></Button>
        </div>
      )}
      {showModal && (
        <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-full transition bg-opacity-50 bg-gray-900 backdrop-blur-sm ${closingModal ? "animate-fade-out animate__animated animate__fadeOut" : "animate-fade-in animate__animated animate__fadeIn"}`}>
          <div className="bg-white w-11/12 h-2/3 max-w-xl max-h-[50lvh] flex justify-start items-center rounded-lg leading-normal md:w-3/5 lg:w-1/2 lg:h-3/5 xl:h-4/5">
            <div className="relative w-full h-full p-6">
              <button onClick={closeModal} className='absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-700 transition-colors duration-300' ><AiOutlineClose /></button>
              <div className={`flex flex-row w-full items-center ${activeTab === 'auth' ? 'hidden' : ''}`}>
                <button onClick={() => openModal('login')} className={`text-gray-800 rounded-md px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'login' ? 'bg-gray-800 hover:bg-gray-900 text-white' : ''}`}>Ingresar</button>
                <button onClick={() => openModal('singup')} className={`text-gray-800 rounded-md px-4 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'singup' ? 'bg-gray-800 hover:bg-gray-900 text-white' : ''}`}>Inscribirse</button>
                {showForgotPasswordModal ? (
                  <button onClick={() => openModal('forgot_password_confirm')} className={`text-gray-600 rounded-md px-2 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'forgot_password_confirm' ? 'bg-gray-800 hover:bg-gray-900 text-white' : ''}`}><AiFillUnlock /></button>
                ) : (
                  <button onClick={() => openModal('forgot-password')} className={`text-gray-600 rounded-md px-2 py-1 inline-flex text-sm font-semibold transition duration-300 mr-2 ${activeTab === 'forgot-password' ? 'bg-gray-800 hover:bg-gray-900 text-white' : ''}`}><AiFillLock /></button>
                )}
              </div>
              <div style={{ display: activeTab === 'login' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'login' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'singup' ? 'hidden' : ''}`}>
                <LoginModal closeModal={closeModal} />
                <div className="text-start items-center inline-flex gap-x-2 font-cocogoose">
                  <p className="text-xs text-gray-900 font-semibold">¿no tienes una cuenta?</p>
                  <button onClick={() => openModal('singup')} className="cursor-pointer text-xs font-semibold text-red-500 hover:text-pink-600 transition-colors duration-300 -mt-1">Inscribete</button>
                </div><br /><button onClick={() => openModal('forgot-password')} className="hover:underline font-cocogoose font-semibold text-xs text-blue-500">¿Olvidaste la contraseña?</button>
              </div>
              <div style={{ display: activeTab === 'singup' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'singup' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'login' ? 'hidden' : ''}`}>
                <RegisterModal closeModal={closeModal} />
                <div className="text-start items-center inline-flex gap-x-2 font-cocogoose">
                  <p className="text-xs text-gray-900 font-semibold">¿Ya tienes una cuenta?</p>
                  <button onClick={() => openModal('login')} className="cursor-pointer text-xs font-semibold text-red-500 hover:text-pink-600 transition-colors duration-300 -mt-1">Ingresar</button>
                </div>
              </div>
              <div style={{ display: activeTab === 'forgot-password' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'forgot-password' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'login' ? 'hidden' : ''}`}>
                <ForgotPasswordModal closeModal={closeModal} />
                <div className="text-start items-center inline-flex gap-x-2 font-cocogoose">
                  <p className="text-xs text-gray-900 font-semibold">¿Ya tienes una cuenta?</p>
                  <button onClick={() => openModal('login')} className="cursor-pointer text-xs font-semibold text-red-500 hover:text-pink-600 transition-colors duration-300 -mt-1">Ingresar</button>
                </div>
              </div>
              <div style={{ display: activeTab === 'forgot_password_confirm' ? 'block' : 'none' }} className={`h-full my-4 ${activeTab === 'forgot_password_confirm' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'} ${activeTab === 'login' ? 'hidden' : ''}`}>
                <ForgotPasswordConfirmModal closeModal={closeModal} updateForgotPasswordModalState={updateForgotPasswordModalState} />
                <div className="text-start items-center inline-flex gap-x-2 font-cocogoose">
                  <p className="text-xs text-gray-900 font-semibold">¿Ya tienes una cuenta?</p>
                  <button onClick={() => openModal('login')} className="cursor-pointer text-xs font-semibold text-red-500 hover:text-pink-600 transition-colors duration-300 -mt-1">Ingresar</button>
                </div>
              </div>
              <div style={{ display: activeTab === 'auth' ? 'block' : 'none' }} className={`w-full h-full my-4 ${activeTab === 'auth' ? 'animate-fade-in animate__animated animate__fadeIn' : 'animate-fade-out animate__animated animate__fadeOut'}`}>
                <AuthModal closeModal={closeModal} />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Auth
