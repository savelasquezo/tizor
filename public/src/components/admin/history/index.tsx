import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { HistoryInfo } from '@/lib/types/types';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip } from 'chart.js';
import _ from 'lodash';

import { chartData, chartOptions } from '@/components/admin/history/config';
import { SessionAuthenticated } from '@/lib/types/types';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip);

export const fetchHistory = async (accessToken: any) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/app/v1/src/fetch-history`, {
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

const History: React.FC<SessionAuthenticated> = ({ session }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [history, setHistory] = useState<HistoryInfo[]>([]);

  const fetchData = useCallback(async () => {
    if (session) {
      const accessToken = session?.user?.accessToken;
      try {
        const results = await fetchHistory(accessToken);
        const sortedResults = results.sort((a: HistoryInfo, b: HistoryInfo) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setHistory(sortedResults || []);
      } catch (error) {
        console.error('There was an error con la solicitud de red:', error);
      }
    }
  }, [session]);

  useEffect(() => {
    fetchData();
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [fetchData, session]);


  const reduceData = (data: HistoryInfo[]) => {
    if (data.length > 20) {
      const firstData = data[0];
      const lastData = data[data.length - 1];
      const intermediateData = data.slice(1, -1);


      const numberOfPointsToKeep = 18;
      const step = Math.ceil(intermediateData.length / numberOfPointsToKeep);
      const downsampledData = _.map(_.range(0, intermediateData.length, step), index => intermediateData[index]);
      return [firstData, ...downsampledData, lastData];
    }
    return data;
  };

  const reducedHistory = reduceData(history);

  const labels = reducedHistory.map(item => item.date);
  const balanceData = reducedHistory.map(item => item.balance);
  const historyData = reducedHistory.map(item => item.history);

  const data = chartData(labels, balanceData, historyData);
  const options = chartOptions(isSmallScreen);


  return (
    <section className='w-full lg:w-2/5 h-full break-words bg-white shadow-md rounded-2xl bg-clip-border p-4'>
      <div className="relative h-auto lg:h-full">
        <Line data={data} options={options} />
      </div>
    </section>
  );
};

export default History;

