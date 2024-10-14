import React, { useState } from "react";
import { getSession, signIn } from 'next-auth/react';
import CircleLoader from 'react-spinners/CircleLoader';

import { ModalFunction } from '@/lib/types/types';

import { Input } from "@nextui-org/react";

import { CiMail } from 'react-icons/ci'
import { FiLock } from 'react-icons/fi'
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";



const LoginModal: React.FC<ModalFunction> = ({ closeModal }) => {
    const nextSite = JSON.parse(localStorage.getItem('nextsite.data') || '{}');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        const res = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password
        });
    
        const session = await getSession();
        if (!res?.error && session) {
            setLoading(false);
            setRegistrationSuccess(true);
    
            setTimeout(() => {
                closeModal();
                window.location.href = '/admin';
            }, 2000);
        } else {
            if (res?.error) {
                setError(res.error);
            }
            setLoading(false);
        }
    };
    

    return (
        <div className="container">
            <form method="POST" onSubmit={onSubmit} className="flex flex-col gap-y-4 p-2">
                <Input
                    label=""
                    type="email"
                    name="email"
                    value={email}
                    required
                    variant="underlined"
                    onChange={(e) => onChange(e)}
                    placeholder="you@example.com"
                    labelPlacement="outside"
                    className="w-full"
                    startContent={<CiMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
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
                    <p onClick={closeModal} className="h-10 bg-green-700 text-white font-semibold rounded-sm py-2 px-4 w-full text-sm flex items-center justify-center transition-all duration-300">
                        <CircleLoader loading={!loading} size={25} color="#ffff" />
                    </p>
                ) : (
                    loading ? (
                        <button type="button" className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-sm py-2 px-4 w-full text-center flex items-center justify-center transition-all duration-300">
                            <CircleLoader loading={loading} size={25} color="#ffff" />
                        </button>
                    ) : (
                        <button type="submit" className="h-10 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-sm py-2 px-4 w-full font-cocogoose text-xs text-center uppercase">Ingresar</button>
                    )
                )}
            </form>
            {error && (<div className="text-red-800 font-semibold font-cocogoose text-[0.65rem] md:text-xs mt-0 md:mt-2">{error}</div>)}
            {!error && (<div className="text-gray-600 font-semibold font-cocogoose text-[0.65rem] md:text-xs mt-0 md:mt-2">¿Necesitas ayuda? {nextSite.email}</div>)}
        </div>
    );
};

export default LoginModal