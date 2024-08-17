import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

import { HistoryInfo } from '@/lib/types/types';
import { useSession } from 'next-auth/react';

import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend } from 'chart.js';
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Legend);

export const fetchHistory = async (accessToken: any) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/fetch-history`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${accessToken}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    return { results: {} };
  }
};

const History: React.FC = () => {
  const { data: session } = useSession();

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [history, setHistory] = useState<HistoryInfo[]>([]);

  useEffect(() => {
    fetchData();
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [session]);


  const fetchData = async () => {
    if (session) {
      const accessToken = session?.user?.accessToken;
      try {
        const results = await fetchHistory(accessToken);
        setHistory(results || {});
        console.log("Informacion")
        console.log(history)
      } catch (error) {
        console.error('There was an error with the network request:', error);
      }
    }
  };

  const data = {
    labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
    datasets: [
      {
        label: 'Total',
        data: [10000, 15000, 12000, 18000, 22000, 19000, 30000, 32000, 27000, 40000, 50000, 70000, 80000, 10000, 15000, 12000, 18000, 22000, 19000, 30000, 32000, 27000, 40000, 50000, 70000, 83440],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
      },
      {
        label: 'Historico',
        data: [5000, 10000, 7000, 9000, 14000, 10000, 18000, 20000, 17000, 25000, 30000, 40000, 50000, 5000, 10000, 7000, 9000, 14000, 10000, 18000, 20000, 17000, 25000, 30000, 40000, 50000],
        fill: true,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Permite que el gráfico se ajuste al tamaño del contenedor
    scales: {
      x: {
        display: false,
      },
      y: {
        display: !isSmallScreen,
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            if (value === 0) {
              return ''; // Retorna una cadena vacía para ocultar el 0
            }
            return value;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true, // Muestra la leyenda
        position: 'bottom' as const, // Posición de la leyenda, el tipo correcto es 'top' | 'left' | 'right' | 'bottom' | 'center' | 'chartArea'
      },
    },
  };

  return (
    <section className='w-full lg:w-2/5 h-full break-words bg-white shadow-md rounded-2xl bg-clip-border p-4'>
      <div className="relative h-auto lg:h-full">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}

export default History;