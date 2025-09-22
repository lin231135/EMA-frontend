// src/components/charts/ColumnChart.jsx
import React from 'react';
import Chart from 'react-apexcharts';

const ColumnChart = ({ title = "Gráfica de Columnas" }) => {
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
      categories: ['Piano', 'Violín', 'Guitarra', 'Canto', 'Batería', 'Flauta', 'Saxofón']
    },
    yaxis: {
      title: {
        text: 'Número de Estudiantes'
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
      name: 'Nivel Básico',
      data: [25, 18, 32, 15, 12, 8, 6]
    },
    {
      name: 'Nivel Intermedio',
      data: [18, 15, 22, 12, 8, 5, 4]
    },
    {
      name: 'Nivel Avanzado',
      data: [12, 8, 15, 8, 5, 3, 2]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ColumnChart;