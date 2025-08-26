import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Common chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8
    }
  }
};

// Color palettes
const colorPalettes = {
  primary: [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(245, 158, 11, 0.8)',   // Yellow
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)'    // Pink
  ],
  borders: [
    'rgba(255, 255, 255, 0)'
  ]
};

// Bar Chart Component
export const BarChart = ({ data, title, height = 300, options = {} }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: data.datasets?.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || colorPalettes.primary[index % colorPalettes.primary.length],
      borderColor: dataset.borderColor || colorPalettes.borders[index % colorPalettes.borders.length],
      borderWidth: 1,
      borderRadius: 4
    })) || []
  };

  const chartOptions = {
    ...commonOptions,
    ...options,
    plugins: {
      ...commonOptions.plugins,
      ...options.plugins,
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold' },
        padding: 20
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: { size: 12 }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div style={{ height }}>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

// Line Chart Component
export const LineChart = ({ data, title, height = 300, options = {} }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: data.datasets?.map((dataset, index) => ({
      ...dataset,
      borderColor: dataset.borderColor || colorPalettes.borders[index % colorPalettes.borders.length],
      backgroundColor: dataset.backgroundColor || colorPalettes.primary[index % colorPalettes.primary.length],
      fill: dataset.fill !== undefined ? dataset.fill : false,
      tension: 0.4,
      pointBackgroundColor: dataset.borderColor || colorPalettes.borders[index % colorPalettes.borders.length],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    })) || []
  };

  const chartOptions = {
    ...commonOptions,
    ...options,
    plugins: {
      ...commonOptions.plugins,
      ...options.plugins,
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold' },
        padding: 20
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: { size: 12 }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

// Doughnut Chart Component
export const DoughnutChart = ({ data, title, height = 300, options = {} }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: data.datasets?.map(dataset => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || colorPalettes.primary,
      borderColor: dataset.borderColor || colorPalettes.borders,
      borderWidth: 2
    })) || []
  };

  const chartOptions = {
    ...commonOptions,
    ...options,
    plugins: {
      ...commonOptions.plugins,
      ...options.plugins,
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold' },
        padding: 20
      }
    },
    cutout: '60%'
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
};

// Pie Chart Component
export const PieChart = ({ data, title, height = 300, options = {} }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: data.datasets?.map(dataset => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || colorPalettes.primary,
      borderColor: dataset.borderColor || colorPalettes.borders,
      borderWidth: 2
    })) || []
  };

  const chartOptions = {
    ...commonOptions,
    ...options,
    plugins: {
      ...commonOptions.plugins,
      ...options.plugins,
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold' },
        padding: 20
      }
    }
  };

  return (
    <div style={{ height }}>
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

// Area Chart (Line chart with fill)
export const AreaChart = ({ data, title, height = 300, options = {} }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: data.datasets?.map((dataset, index) => ({
      ...dataset,
      borderColor: dataset.borderColor || colorPalettes.borders[index % colorPalettes.borders.length],
      backgroundColor: dataset.backgroundColor || colorPalettes.primary[index % colorPalettes.primary.length],
      fill: true,
      tension: 0.4,
      pointBackgroundColor: dataset.borderColor || colorPalettes.borders[index % colorPalettes.borders.length],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    })) || []
  };

  const chartOptions = {
    ...commonOptions,
    ...options,
    plugins: {
      ...commonOptions.plugins,
      ...options.plugins,
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold' },
        padding: 20
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: { size: 12 }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: { size: 12 }
        }
      }
    }
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

// Chart Container Component
export const ChartContainer = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
};

export default {
  BarChart,
  LineChart,
  DoughnutChart,
  PieChart,
  AreaChart,
  ChartContainer
};