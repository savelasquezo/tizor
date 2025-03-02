"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// @ts-ignore
import WhatsAppWidget from "react-whatsapp-chat-widget";
import "react-whatsapp-chat-widget/index.css";

import { useLanguage } from '@/utils/i18next';
import { nextSite } from '@/utils/next-site';


export function WhatsappPlugin() {
    const [data, setData] = useState<{ [key: string]: any } | null>(null);
    const { data: session } = useSession();
    const { t } = useLanguage();

    useEffect(() => {
        const fetchedSettings = nextSite();
        if (fetchedSettings) {
          setData(fetchedSettings);
        }
      }, [session]);

	return (
		<WhatsAppWidget
            phoneNo={`${data?.phone}`}
            position="rigth"
            widgetWidth="360px"
            widgetWidthMobile="360px"
            autoOpen={true}
            autoOpenTimer={35000}
            messageBox={false}
            //messageBoxTxt="Hola Tizor, Necesito Informacion"
            iconSize="50"
            iconColor="white"
            iconBgColor="#25d366"
            headerIcon={`favicon.ico`}
            headerIconColor="black"
            headerTxtColor="white"
            headerBgColor="#1f2937"
            headerTitle="Tizorbot"
            headerCaption="Online"
            bodyBgColor="#ECE5DD"
            chatPersonName="Tizorbot"
            chatMessage={
              <>{t('home.widget-whatsapp.title')} 👋 <br />
                {t('home.widget-whatsapp.subtitle')}<br /> 
                <a className='text-gray-800 font-semibold font-cocogoose' href="/help-and-tutorials">{t('home.widget-whatsapp.help')}</a>
              </>
            }
            footerBgColor="#999"
            placeholder="Escribe un Mensaje"
            btnBgColor="#1f2937"
            btnTxt={<span className='font-cocogoose uppercase text-xs'>{t('home.widget-whatsapp.button')}</span>}
            btnTxtColor="white"
            style={{ border: 'none !important'}}
		/>
	);
};
