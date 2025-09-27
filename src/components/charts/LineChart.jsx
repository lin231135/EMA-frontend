// src/components/charts/LineChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';
import { useAuth } from '../../contexts/AuthContext';
import translations from '../../translations';

const LineChart = ({ title = "Gráfica de Líneas" }) => {
  const { lang } = useAuth();
  const t = translations[lang]?.charts || translations.es.charts;

  const options = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight',
      width: 3
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#374151'
      }
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      }
    },
    xaxis: {
      categories: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8']
    },
    yaxis: {
      title: {
        text: t.lineChart.yAxisTitle
      },
      min: 0,
      max: 100
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    },
    colors: ['#06B6D4', '#84CC16', '#F97316']
  };

  const series = [
    {
      name: t.lineChart.theoreticalEvaluations,
      data: [65, 72, 68, 75, 78, 82, 85, 88]
    },
    {
      name: t.lineChart.practicalEvaluations,
      data: [70, 75, 73, 78, 82, 85, 87, 90]
    },
    {
      name: t.lineChart.classParticipation,
      data: [80, 82, 85, 87, 88, 90, 92, 94]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default LineChart;