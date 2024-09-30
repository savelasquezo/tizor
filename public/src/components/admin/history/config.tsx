import { ChartOptions, ChartData } from 'chart.js';

export const chartData = (labels: string[], balanceData: number[], historyData: number[]): ChartData<'line'> => ({
  labels: labels,
  datasets: [
    {
      label: 'Total',
      data: balanceData,
      fill: true,
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
      tension: 0.4,
    }
    /*{
      label: 'Histórico',
      data: historyData,
      fill: true,
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      tension: 0.4,
    },*/
  ],
});

export const chartOptions = (isSmallScreen: boolean): ChartOptions<'line'> => ({
  maintainAspectRatio: false,
  scales: {
    x: {
      display: false,
    },
    y: {
      display: !isSmallScreen,
      beginAtZero: true,
      ticks: {
        callback: function (value: any) {
          if (value === 0) {
            return '';
          }
          return value;
        },
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom', // Aquí no es necesario usar 'as const'
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'transparent',
      callbacks: {
        label: function (context: any) {
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
      titleColor: '#111827',
    },
  },
});
