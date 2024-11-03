'use client';
import React, { useState, useEffect } from 'react';

import { nextSite } from '@/utils/next-site';
import { useLanguage } from '@/utils/i18next';
import { WhatsappPlugin } from "@/utils/whatsapp-plugin";

import Header from '@/components/home/header/index';
import Footer from '@/components/home/footer/index';

import { Card, CardFooter, Image, Button } from "@nextui-org/react";

const LegalPage: React.FC = () => {
  const [data, setData] = useState<{ [key: string]: any } | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchedSettings = nextSite();
    if (fetchedSettings) {
      setData(fetchedSettings);
    }
  }, []);

  return (
    <main className="relative bg-white w-full h-auto overflow-x-hidden font-cocogoose">
      <Header />
      <section className='w-4/5 flex flex-col p-12 mx-auto'>
        <div className='flex flex-col gap-y-2 p-8'>
          <div className='w-full flex flex-row justify-between gap-x-6'>
            <div className='w-2/3 flex flex-col justify-start items-start gap-y-4'>
              <p className='text-lg uppercase font-bold text-start'>Terminos & Condiciones</p>
              <p className='w-5/6 text-xs text-justify'>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi congue pharetra eros, eget rutrum nibh porttitor id. Quisque vestibulum arcu a tempus lobortis. Vivamus sit amet malesuada mauris. Nullam nec elit in diam imperdiet venenatis quis at orci. In et congue risus, eget ullamcorper velit. Donec neque augue, ultrices ac faucibus non, tincidunt ac metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ultricies scelerisque porttitor. Vivamus sed leo suscipit neque ullamcorper sodales. Aenean sodales bibendum cursus.</span><br /><br />
                <span>Cras velit ante, egestas sed facilisis a, volutpat vel eros. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi fringilla lorem ut sem feugiat mattis in et enim. Maecenas vestibulum sagittis nunc vitae aliquam. Suspendisse molestie leo nec dolor placerat, in iaculis est molestie. Nullam fermentum viverra eleifend. Phasellus ullamcorper eu lacus at ultricies. Proin vel gravida tortor. Pellentesque non est venenatis felis ultricies consequat. Aenean ullamcorper nisl vitae felis lacinia dignissim. Maecenas ornare odio eu lectus scelerisque malesuada. Duis dignissim dui a blandit vulputate. Vivamus feugiat mattis sapien, at pellentesque ipsum rhoncus et. Maecenas sodales felis arcu, fermentum mollis arcu cursus et. Pellentesque dignissim a urna ut tempus. Vivamus vehicula, metus vestibulum mattis gravida, sem nibh scelerisque ante, vitae ultricies metus risus sed mi.</span><br /><br />
                <span>Nullam laoreet semper lacus, sed sagittis justo vestibulum ut. Nulla condimentum, nibh in condimentum dapibus, ante lacus vehicula sapien, nec accumsan enim mauris vel risus. Pellentesque vitae posuere augue. In laoreet pretium tortor, convallis convallis dui dapibus nec.</span><br /><br />
              </p>
            </div>
            <div className='w-1/3 flex items-start justify-start scale-125'><Image width={370} height={360} src={"/assets/images/figure03.jpg"} className="object-contain" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" /></div>
          </div><br />
          <p className='w-full flex flex-col justify-center items-end mx-auto text-xs text-justify'>
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi congue pharetra eros, eget rutrum nibh porttitor id. Quisque vestibulum arcu a tempus lobortis. Vivamus sit amet malesuada mauris. Nullam nec elit in diam imperdiet venenatis quis at orci. In et congue risus, eget ullamcorper velit. Donec neque augue, ultrices ac faucibus non, tincidunt ac metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ultricies scelerisque porttitor. Vivamus sed leo suscipit neque ullamcorper sodales. Aenean sodales bibendum cursus.</span>
          </p>
        </div>
        <div className='flex flex-col gap-y-2 p-8'>
          <div className='w-full flex flex-row-reverse justify-between gap-x-6'>
            <div className='w-2/3 flex flex-col justify-start items-start gap-y-4 ml-12'>
              <p className='text-xs text-justify'>
                <span>- Ut vulputate tincidunt nunc mattis sagittis. Suspendisse condimentum placerat egestas. Integer lectus orci, bibendum a luctus vitae, laoreet sed erat. Vestibulum dictum arcu enim, non bibendum lorem feugiat et. </span><br /><br />
                <span>- Ut vulputate tincidunt nunc mattis sagittis. Suspendisse condimentum placerat egestas. Integer lectus orci, bibendum a luctus vitae, laoreet sed erat. Vestibulum dictum arcu enim, non bibendum lorem feugiat et. </span><br /><br />
                <span>- Ut vulputate tincidunt nunc mattis sagittis. Suspendisse condimentum placerat egestas. Integer lectus orci, bibendum a luctus vitae, laoreet sed erat. Vestibulum dictum arcu enim, non bibendum lorem feugiat et. </span><br /><br />
                <span>- Ut vulputate tincidunt nunc mattis sagittis. Suspendisse condimentum placerat egestas. Integer lectus orci, bibendum a luctus vitae, laoreet sed erat. Vestibulum dictum arcu enim, non bibendum lorem feugiat et. </span><br /><br />
                <span>- Ut vulputate tincidunt nunc mattis sagittis. Suspendisse condimentum placerat egestas. Integer lectus orci, bibendum a luctus vitae, laoreet sed erat. Vestibulum dictum arcu enim, non bibendum lorem feugiat et. </span><br /><br />
                <span>- Ut vulputate tincidunt nunc mattis sagittis. Suspendisse condimentum placerat egestas. Integer lectus orci, bibendum a luctus vitae, laoreet sed erat. Vestibulum dictum arcu enim, non bibendum lorem feugiat et. </span><br /><br />
                <span>- Ut vulputate tincidunt nunc mattis sagittis. Suspendisse condimentum placerat egestas. Integer lectus orci, bibendum a luctus vitae, laoreet sed erat. Vestibulum dictum arcu enim, non bibendum lorem feugiat et. </span><br /><br />
                <span>- Ut vulputate tincidunt nunc mattis sagittis. Suspendisse condimentum placerat egestas. Integer lectus orci, bibendum a luctus vitae, laoreet sed erat. Vestibulum dictum arcu enim, non bibendum lorem feugiat et. </span><br /><br />
              </p>
            </div>
            <div className='w-1/3 flex items-start justify-start scale-125'><Image width={370} height={360} src={"/assets/images/figure04.jpg"} className="object-contain ml-12" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%)', maskImage: 'linear-gradient(to top, transparent 0%, black 20%)' }} alt="" /></div>
          </div><br />
          <p className='w-full flex flex-col justify-center items-start mx-auto text-xs text-justify'>
            <span className='text-lg font-semibold'>Aviso Legal</span><br />
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi congue pharetra eros, eget rutrum nibh porttitor id. Quisque vestibulum arcu a tempus lobortis. Vivamus sit amet malesuada mauris. Nullam nec elit in diam imperdiet venenatis quis at orci. In et congue risus, eget ullamcorper velit. Donec neque augue, ultrices ac faucibus non, tincidunt ac metus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ultricies scelerisque porttitor. Vivamus sed leo suscipit neque ullamcorper sodales. Aenean sodales bibendum cursus.</span>
          </p>
        </div>
      </section>
      <Footer />
      <WhatsappPlugin />
    </main >
  );
};

export default LegalPage;
