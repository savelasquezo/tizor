import { ChartOptions, ChartData } from 'chart.js';

export const chartData = (labels: string[], balanceData: number[]): ChartData<'line'> => ({
  labels,
  datasets: [
    {
      label: 'Total',
      data: balanceData,
      fill: true,
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.4,
    },
  ],
});

export const chartOptions = (isSmallScreen: boolean, balanceData: number[]): ChartOptions<'line'> => {
  if (balanceData.length === 0) {
    return {
      maintainAspectRatio: false,
      scales: {
        x: { display: false },
        y: {
          display: !isSmallScreen,
          beginAtZero: true,
          min: 0,
          max: 1000,
          ticks: { callback: () => '' },
        },
      },
      plugins: { legend: { display: true, position: 'bottom' } },
    };
  }

  const minY = Math.floor(Math.min(...balanceData));
  const maxY = Math.ceil(Math.max(...balanceData));
  const stepSize = Math.max(1, Math.ceil((maxY - minY) / 5));

  return {
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: {
        display: !isSmallScreen,
        beginAtZero: true,
        min: minY-stepSize,
        max: maxY+stepSize,
        ticks: {
          stepSize: stepSize,
          callback: (value) => Math.round(Number(value)),
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'white',
        callbacks: {
          label: ({ dataset: { label }, raw }) => `${label || ''}: ${raw}`,
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
        titleColor: '#111827',
      },

    },
  };
};
