// src/components/charts/AreaChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const AreaChart = ({ title = "Gráfica de Área" }) => {
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
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    },
    yaxis: {
      title: {
        text: 'Valores'
      }
    },
    colors: ['#3B82F6', '#10B981']
  };

  const series = [
    {
      name: 'Estudiantes Activos',
      data: [45, 52, 38, 45, 67, 73, 85, 78, 82, 95, 88, 92]
    },
    {
      name: 'Nuevos Registros',
      data: [12, 18, 15, 22, 28, 35, 42, 38, 45, 48, 52, 58]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default AreaChart;