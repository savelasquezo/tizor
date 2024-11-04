'use client';

import React, { useState, useEffect } from "react";

import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';

import SocialLinks from '@/utils/mediaLinks';

export default function Footer() {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchedSettings = nextSite();
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
  }, []);

  return (
    <footer className="relative bg-gray-900 pt-8 pb-6 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start justify-between text-left lg:text-left">
          <div className="w-full lg:w-6/12 px-4">
            <h4 className="text-3xl fonat-semibold text-gray-300 font-cocogoose">T-Bank</h4>
            <h5 className="text-sm mt-0 my-4 text-gray-400 font-cocogoose">
              {t('home.footer.paragraph1')}
            </h5>
          </div>
          <div className="mb-0 lg:my-6">
            {data?.links && <SocialLinks links={data.links} />}
          </div>
        </div>
        <hr className="mb-6 lg:my-6 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
        <div className="w-full md:w-4/12 px-4 mx-auto text-center">
          <div className="text-sm text-gray-200 font-semibold py-1">
            Copyright © <span className="font-carvingsoft">2024</span><span className="text-gray-200 hover:text-gray-200" /> Tizorbank
          </div>
        </div>
      </div>
    </footer>
  );
}







