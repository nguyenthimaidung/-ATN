import React from 'react';
import { Line } from 'react-chartjs-2';
import { backgroundColors, borderColors } from '../../Constant';

export const LineChart = (props) => {
  const { bookSold } = props;

  const options = {
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
        },
        // {
        //   type: 'linear',
        //   display: true,
        //   position: 'right',
        //   id: 'y-axis-2',
        //   gridLines: {
        //     drawOnArea: false,
        //   },
        // },
      ],
    },
  };

  const data = {
    labels: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ],
    datasets: [
      {
        label: 'Tổng sách đã bán',
        data: [],
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y-axis-1',
      },
      // {
      //   label: 'Thể loại: ',
      //   data: [],
      //   fill: false,
      //   backgroundColor: 'rgb(54, 162, 235)',
      //   borderColor: 'rgba(54, 162, 235, 0.2)',
      //   yAxisID: 'y-axis-1',
      // },
    ],
  };

  // const bookDataMap = new Map();

  // function setDataMap(book, month) {
  //   if (!bookDataMap.has(`${book.id}`)) {
  //     bookDataMap.set(`${book.id}`, {
  //       label: book.name,
  //       data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  //       fill: false,
  //       backgroundColor: 'rgb(54, 162, 235)',
  //       borderColor: 'rgba(54, 162, 235, 0.2)',
  //       yAxisID: 'y-axis-1',
  //     });
  //   }
  //   const bookData = bookDataMap.get(`${book.id}`);
  //   bookData.data[month - 1] = (book.totalSold && +book.totalSold) || 0;
  // }

  // bookSold &&
  //   bookSold.forEach((month) => {
  //     month.books.forEach((book) => {
  //       setDataMap(book, month.month);
  //     });
  //   });

  const categoryDataMap = new Map();

  let idx = 0;
  function setDataMap(category, month) {
    if (!categoryDataMap.has(`${category.id}`)) {
      categoryDataMap.set(`${category.id}`, {
        label: `Thể loại: ${category.name}`,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        fill: false,
        backgroundColor: borderColors[idx],
        borderColor: backgroundColors[idx],
        yAxisID: 'y-axis-1',
      });
      idx = (idx + 1) % 12;
    }
    const categoryData = categoryDataMap.get(`${category.id}`);
    categoryData.data[month - 1] = (category.totalSold && +category.totalSold) || 0;
  }

  bookSold &&
    bookSold.forEach((month) => {
      month.categories.forEach((category) => {
        setDataMap(category, month.month);
      });
    });

  bookSold &&
    bookSold.forEach((month) => {
      data.datasets[0].data.push(month.total);
    });

  data.datasets = [...data.datasets, ...categoryDataMap.values()];

  return (
    <React.Fragment>
      <Line
        data={data}
        options={options}
        onElementsClick={(e) => {
          if (e[0]) {
            const month = e[0]._index + 1;
            console.log('month', month);
          }
        }}
      />
    </React.Fragment>
  );
};
