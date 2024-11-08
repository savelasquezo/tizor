import React from 'react';

const WhatsappButton: React.FC<{ name: string, phoneNumber: string; message: string }> = ({ name, phoneNumber, message }) => {
  const formattedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${formattedMessage}`;

  return (
    <a className="flex justify-center items-center bg-gray-800 h-10 w-auto max-w-0.5 text-white p-2 shadow-sm rounded-sm px-6 font-cocogoose text-xs uppercase" href={url} target="_blank" rel="noopener noreferrer" >{name}</a>

  );
};



export default WhatsappButton;
