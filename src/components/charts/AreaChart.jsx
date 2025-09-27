// src/components/charts/AreaChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';
import { useAuth } from '../../contexts/AuthContext';
import translations from '../../translations';

const AreaChart = ({ title = "Gráfica de Área" }) => {
  const { lang } = useAuth();
  const t = translations[lang]?.charts || translations.es.charts;

  // Generate months from January to current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11 (September = 8)
  const monthsES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthsEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = lang === 'es' ? monthsES : monthsEN;
  const currentMonths = months.slice(0, currentMonth + 1); // From Jan to current month

  const options = {
    chart: {
      type: 'area',
      height: 350,
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
      curve: 'smooth'
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
    subtitle: {
      text: 'Datos de ejemplo',
      align: 'left'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: currentMonths
    },
    yaxis: {
      title: {
        text: t.areaChart.yAxisTitle
      }
    },
    colors: ['#3B82F6', '#10B981']
  };

  // Generate data arrays based on current month
  const generateDataUpToCurrentMonth = (fullYearData) => {
    return fullYearData.slice(0, currentMonth + 1);
  };

  const series = [
    {
      name: t.areaChart.activeStudents,
      data: generateDataUpToCurrentMonth([15, 16, 18, 19, 20, 21, 22, 23, 25])
    },
    {
      name: t.areaChart.newRegistrations,
      data: generateDataUpToCurrentMonth([2, 1, 2, 1, 1, 1, 1, 1, 2])
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default AreaChart;