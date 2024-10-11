import React, { useState } from "react";
import { getSession, signIn } from 'next-auth/react';
import CircleLoader from 'react-spinners/CircleLoader';

import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

import { CiMail } from 'react-icons/ci'
import { FiLock } from 'react-icons/fi'

import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { FaArrowRightFromBracket } from "react-icons/fa6";

const SmartLogin: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        console.log(email)
        console.log(password)
        await new Promise(resolve => setTimeout(resolve, 1000));
        const res = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
        });

        
        const session = await getSession();
        if (!res?.error && session) {
            setLoading(false);
        } else {
            if (res?.error) {
                console.log(res.error)
                setError(res.error);
            }
            setLoading(false);
        }
    };

    const isSubmitDisabled = !email || !password;

    return (
        <div>
            <form method="POST" onSubmit={onSubmit} className="flex flex-row items-center justify-center gap-x-2">
                <Input
                    label=""
                    type="email"
                    name="email"
                    value={email}
                    required
                    onChange={(e) => onChange(e)}
                    placeholder="you@example.com"
                    labelPlacement="outside"
                    startContent={<CiMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                />
                <Input
                    label=""
                    type={isVisible ? "text" : "password"}
                    name="password"
                    labelPlacement="outside"
                    placeholder="****"
                    value={password}
                    required
                    onChange={(e) => onChange(e)}
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
                    className="max-w-xs"
                />
                {loading ? (
                    <Button type="submit" isIconOnly isDisabled color="default" className="!bg-gray-200" aria-label="">
                        <CircleLoader loading={loading} size={16} color="#374151" />
                    </Button>
                ) : (
                    <Button type="submit" isIconOnly isDisabled={isSubmitDisabled} color="default" className="!bg-gray-100" aria-label="">
                        <FaArrowRightFromBracket />
                    </Button>
                )}
            </form>
        </div>
    );
};

export default SmartLogin;
