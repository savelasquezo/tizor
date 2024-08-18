import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useSession } from 'next-auth/react';
import { HistoryInfo } from '@/lib/types/types';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip } from 'chart.js';
import _ from 'lodash';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip);

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
        const sortedResults = results.sort((a: HistoryInfo, b: HistoryInfo) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setHistory(sortedResults || []);
        console.log("Información recibida:", sortedResults);
      } catch (error) {
        console.error('There was an error con la solicitud de red:', error);
      }
    }
  };

  // Función para reducir los datos utilizando Lodash
  const reduceData = (data: HistoryInfo[]) => {
    if (data.length > 20) {
      const firstData = data[0]; // Primer dato (más antiguo)
      const lastData = data[data.length - 1]; // Último dato (más reciente)
      const intermediateData = data.slice(1, -1); // Datos intermedios

      // Calculamos el número de puntos intermedios que queremos conservar
      const numberOfPointsToKeep = 18; // Deseamos mantener 18 puntos intermedios
      const step = Math.ceil(intermediateData.length / numberOfPointsToKeep);

      // Seleccionamos puntos representativos de los datos intermedios
      const downsampledData = _.map(_.range(0, intermediateData.length, step), index => intermediateData[index]);

      return [firstData, ...downsampledData, lastData]; // Reintegrar el primer y último dato
    }
    return data;
  };

  const reducedHistory = reduceData(history);

  const labels = reducedHistory.map(item => item.date);
  const balanceData = reducedHistory.map(item => item.balance);
  const historyData = reducedHistory.map(item => item.history);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total',
        data: balanceData,
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.4,
      },
      {
        label: 'Histórico',
        data: historyData,
        fill: true,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
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
              return ''; // Oculta el valor 0
            }
            return value;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'transparent',
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
        displayColors: false,
        titleFont: {
          family: 'Inter, sans-serif',
        },
        bodyFont: {
          family: 'Inter, sans-serif',
        },
        bodyColor: '#000',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 10,
        cornerRadius: 6,
        caretPadding: 10,
        usePointStyle: true,
        boxPadding: 8,
        caretSize: 8,
        backgroundColor: '#fff',
        titleColor: '#111827',
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
