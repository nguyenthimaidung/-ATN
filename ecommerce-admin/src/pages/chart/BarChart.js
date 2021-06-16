import React from 'react';
import { Bar } from 'react-chartjs-2';
import { backgroundColors, borderColors } from '../../Constant';

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    xAxes: [
      {
        barPercentage: 1,
        gridLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          fontColor: '#7e8591',
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          fontColor: '#7e8591',
        },
      },
    ],
  },
  legend: {
    labels: {
      fontColor: '#7e8591',
      fontSize: 16,
    },
  },
};

export const BarChart = (props) => {
  const { dataset } = props;
  const barChartData = {
    labels: [],
    datasets: [
      {
        label: 'Doanh thu',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  };
  let idx = 0;
  dataset.forEach((data) => {
    barChartData.labels.push(data.label);
    barChartData.datasets[0].data.push(data.value);
    barChartData.datasets[0].backgroundColor.push(backgroundColors[idx]);
    barChartData.datasets[0].borderColor.push(borderColors[idx]);
    idx = (idx + 1) % 12;
  });
  return (
    <React.Fragment>
      <Bar data={barChartData} options={barChartOptions} height={150} />
    </React.Fragment>
  );
};
