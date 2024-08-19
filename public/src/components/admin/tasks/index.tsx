import React from 'react';

import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaTelegramPlane, FaYoutube, FaBloggerB } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";

import { SessionInfo } from '@/lib/types/types';

interface Task {
  id: number;
  name: string;
  description: string;
  percentage: string;
  completed: boolean;
}

const tasks: Task[] = [
  { id: 1, name: 'TizorMiner', description: 'Invita a alguien a unirse a la plataforma', percentage: '0.50', completed: true },
  { id: 2, name: 'Master Influencer', description: 'Haz una publicación en tus redes sociales sobre la plataforma', percentage: '0.25', completed: false },
  { id: 3, name: 'Blogero Experto', description: 'Envia un comentario desde nuestro blog', percentage: '0.25', completed: true },
  { id: 4, name: 'Youtuber', description: 'Mira un video de publicidad en la plataforma', percentage: '0.25', completed: true },
  { id: 5, name: 'Inversor Inteligente', description: 'Manten la inversion en Holding', percentage: '0.25', completed: false }
];



const Tasks: React.FC<SessionInfo> = ({ session }) => {
  return (
    <section className='w-full lg:w-3/5 flex flex-col-reverse lg:flex-row items-center justify-between break-words bg-white shadow-md rounded-2xl bg-clip-border py-1 lg:px-2 lg:pt-3 lg:pb-8'>
      <div className='w-full lg:w-1/2 h-full flex flex-col items-center lg:items-start lg:justify-between px-4 py-1'>
        <div className='hidden lg:flex flex-col items-start justify-start gap-y-4'>
          <p className='text-[0.65rem] text-justify leading-tight font-cocogoose'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a feugiat arcu. Sed condimentum ultrices tristique. Duis quis tortor id justo tincidunt mollis. Cras euismod erat eu felis bibendum, non fringilla lacus lacinia. Phasellus varius erat quis euismod molestie. Pellentesque non dolor nec arcu porta fringilla. Suspendisse interdum maximus mauris ac maximus.</p>
          <div className='w-full bg-blue-100 h-12 flex items-center justify-between rounded-sm px-4 border-2 border-blue-50'>
            <p className='text-sm'>{process.env.NEXT_PUBLIC_APP_API_URL}/?singup=True&uuid=WERf234</p>
            <button><FaRegCopy/></button>
          </div>
          <p className='text-[0.65rem] text-justify leading-tight font-cocogoose'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a feugiat arcu. Sed condimentum ultrices tristique. Duis quis tortor id justo tincidunt mollis.</p>
        </div>
        <div className='w-full flex flex-row items-center justify-center lg:justify-start gap-x-2.5 lg:gap-x-4 my-6 lg:my-0'>
          <button className="w-auto h-10 flex items-center justify-center text-center opacity-90 hover:opacity-100 bg-blue-600 text-white px-3 py-2 font-xl rounded-full transition-opacity duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><FaFacebookF/></span>
          </button>
          <button className="w-auto h-10 flex items-center justify-center text-center opacity-90 hover:opacity-100 bg-pink-500 text-white px-3 py-2 font-2xl rounded-full transition-opacity duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><FaInstagram/></span>
          </button>
          <button className="w-auto h-10 flex items-center justify-center text-center opacity-90 hover:opacity-100 bg-red-600 text-white px-3 py-2 font-xl rounded-full transition-opacity duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><FaYoutube/></span>
          </button>
          <button className="w-auto h-10 flex items-center justify-center text-center opacity-90 hover:opacity-100 bg-gray-950 text-white px-3 py-2 font-xl rounded-full transition-opacity duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><FaTiktok/></span>
          </button>
          <button className="w-auto h-10 flex items-center justify-center text-center opacity-90 hover:opacity-100 bg-green-500 text-white px-3 py-2 font-xl rounded-full transition-opacity duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><FaWhatsapp/></span>
          </button>
          <button className="w-auto h-10 flex items-center justify-center text-center opacity-90 hover:opacity-100 bg-blue-500 text-white px-3 py-2 font-xl rounded-full transition-opacity duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><FaTelegramPlane/></span>
          </button>
          <button className="w-auto h-10 flex items-center justify-center text-center opacity-90 hover:opacity-100 bg-purple-700 text-white px-3 py-2 font-xl rounded-full transition-opacity duration-300">
            <span className='mt-0 flex items-center justify-center lg:block'><FaBloggerB/></span>
          </button>
          <span className='w-full h-auto hidden lg:flex items-end justify-end'>
            <img src={"/assets/images/logo0.webp"} className="h-auto w-auto object-fit self-start z-10" alt="" />
          </span> 
        </div>
      </div>
      <div className='w-full lg:w-1/2 mt-4 lg:mt-0 px-4'>
        <div className='block lg:hidden pt-1 pb-4 mb-2'>
          <p className='text-[0.55rem] text-center font-cocogoose'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a feugiat arcu. Sed condimentum ultrices tristique. Duis quis tortor id justo tincidunt mollis. Cras euismod erat eu felis bibendum, non fringilla lacus lacinia. Phasellus varius erat quis euismod molestie. Pellentesque non dolor nec arcu porta fringilla. Suspendisse interdum maximus mauris ac maximus.</p>
          <div className='w-full bg-blue-100 h-12 flex items-center justify-between rounded-sm px-4 border-2 border-blue-50 my-4'>
            <p className='text-[0.60rem]'>{process.env.NEXT_PUBLIC_APP_API_URL}/?singup=True&uuid=WERf234</p>
            <button><FaRegCopy/></button>
          </div>
          <p className='text-[0.55rem] text-center leading-tight font-cocogoose'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a feugiat arcu. Sed condimentum ultrices tristique. Duis quis tortor id justo tincidunt mollis.</p>
        </div>
        <ul className='space-y-2'>
          {tasks.map(task => (
            <li
              key={task.id}
              className={`py-2 px-4 rounded ${
                task.completed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              <div className='flex items-center justify-between leading-none'>
                <div className='flex flex-col leading-none'>
                  <strong className='text-[0.65rem] font-cocogoose uppercase'>{task.name}</strong>
                  <span className='text-xs'>{task.description}</span>
                </div>
                <span className='font-bold'>+{task.percentage}%</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Tasks;
