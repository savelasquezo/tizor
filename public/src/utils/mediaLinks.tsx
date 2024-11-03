// SocialLinks.tsx
import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaTelegramPlane, FaYoutube, FaBloggerB } from "react-icons/fa";
import { PiPlaceholder } from "react-icons/pi";

const linkIcons: { [key: string]: JSX.Element } = {
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  youtube: <FaYoutube />,
  tiktok: <FaTiktok />,
  whatsapp: <FaWhatsapp />,
  telegram: <FaTelegramPlane />,
  blogger: <FaBloggerB />
};

interface SocialLinksProps {
  links: { id: string; name: string; link: string }[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ links }) => {
  return (
    <div className='w-full flex flex-row items-center justify-start gap-x-2.5 lg:gap-x-4 mb-20 lg:my-0'>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-auto h-10 flex items-center justify-center text-center opacity-90 hover:opacity-100 bg-gray-600 text-white px-3 py-2 font-xl rounded-full transition-opacity duration-300"
        >
          <span className='mt-0 flex items-center justify-center lg:block'>
            {linkIcons[link.name] || <PiPlaceholder />}
          </span>
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
