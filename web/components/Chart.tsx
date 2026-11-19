'use client';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';

// Register the needed Chart.js components once (client side)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

export interface ChartProps {
  /** Title shown above the chart */
  title?: string;
  /** Labels for the X‑axis */
  labels: string[];
  /** Datasets – see Chart.js docs for the full shape */
  datasets: any[];
  /** Chart type; defaults to "bar" */
  type?: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  /** Additional Chart.js options */
  options?: any;
}

// Simple wrapper that forwards props to react‑chartjs‑2
export default function Chart({ title, labels, datasets, type = 'bar', options }: ChartProps) {
  const data = {
    labels,
    datasets: datasets.map((ds) => ({
      // Ensure every dataset has a background / border colour – fallback to primary token
      backgroundColor: ds.backgroundColor ?? 'var(--color-primary)',
      borderColor: ds.borderColor ?? 'var(--color-primary-deep)',
      ...ds,
    })),
  };

  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: !!title, text: title },
    },
  };

  return <ReactChart type={type} data={data} options={{ ...defaultOptions, ...options }} />;
}
