import {nextui} from '@nextui-org/theme';
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/lib/esm/**/*.js",
    "./node_modules/@nextui-org/theme/dist/components/(button|modal|ripple|spinner).js"
  ],
  theme: {
    extend: {
      fontFamily: {
        bankprinter: ['BankPrinter', 'sans-serif'],
        creatodisplay: ['CreatoDisplay', 'sans-serif'],
        cocogoose: ['Cocogoose', 'sans-serif']
      },
      backgroundImage: {
        'background-image01': "url('/assets/demo/background01.webp')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        tizor0: '#2b235a',
        tizor1: '#F20C60',
        tizor2: '#13F2DC',
        tizor3: '#F2E30C',
        tizor4: '#650000',
      },
    },
  },
  plugins: [nextui()]}

export default config


