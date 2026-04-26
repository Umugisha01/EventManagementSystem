import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

export const RevenueChart = () => {
  const data = {
    labels: ['VIP', 'Regular', 'General', 'VVIP'],
    datasets: [
      {
        label: 'Revenue by Seat Type (RWF)',
        data: [5000000, 3450000, 2750000, 1250000],
        backgroundColor: [
          '#FFD700', // VIP Gold
          '#10B981', // Regular Green
          '#3B82F6', // General Blue
          '#D4AF37', // VVIP Gold
        ],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666' } },
      x: { grid: { display: false }, ticks: { color: '#666' } },
    },
  };

  return <Bar data={data} options={options} />;
};

export const OccupancyChart = () => {
  const data = {
    labels: ['Occupied', 'Available'],
    datasets: [
      {
        data: [84, 16],
        backgroundColor: ['#D4AF37', 'rgba(255,255,255,0.05)'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    cutout: '80%',
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="relative">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold">84%</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Occupancy</span>
      </div>
    </div>
  );
};

export const AttendanceLineChart = () => {
  const data = {
    labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    datasets: [
      {
        fill: true,
        label: 'Checked In',
        data: [150, 480, 890, 1100, 1150, 1180],
        borderColor: '#D4AF37',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { display: false },
      x: { grid: { display: false }, ticks: { color: '#666' } },
    },
  };

  return <Line data={data} options={options} />;
};
