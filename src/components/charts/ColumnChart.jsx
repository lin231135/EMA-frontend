// src/components/charts/ColumnChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';
import { useAuth } from '../../contexts/AuthContext';
import translations from '../../translations';

const ColumnChart = ({ title = "Gráfica de Columnas" }) => {
  const { lang } = useAuth();
  const t = translations[lang]?.charts || translations.es.charts;

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
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
    xaxis: {
      categories: t.columnChart.categories
    },
    yaxis: {
      title: {
        text: t.columnChart.yAxisTitle
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " estudiantes"
        }
      }
    },
    colors: ['#8B5CF6', '#F59E0B', '#EF4444']
  };

  const series = [
    {
      name: t.columnChart.levels.basic,
      data: [8, 6, 4, 5]
    },
    {
      name: t.columnChart.levels.intermediate,
      data: [4, 3, 2, 2]
    },
    {
      name: t.columnChart.levels.advanced,
      data: [2, 1, 0, 0]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ColumnChart;