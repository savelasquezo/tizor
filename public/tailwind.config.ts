import {nextui} from '@nextui-org/theme';
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/lib/esm/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bankprinter: ['BankPrinter', 'sans-serif'],
        creatodisplay: ['CreatoDisplay', 'sans-serif'],
        cocogoose: ['Cocogoose', 'sans-serif'],
        carvingsoft: ['CarvingSoft', 'sans-serif'],
        gilroy: ['Gilroy', 'sans-serif'],
      },
      backgroundImage: {
        'image02': "url('/assets/images/background02.png')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        base01: '#2b235a',
        base02: '#212529',
      },
    },
  },
  plugins: [nextui()]}

export default config


