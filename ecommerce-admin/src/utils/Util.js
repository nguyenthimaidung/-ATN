import { BaseURL } from '../Constant';

const moment = require('moment');
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function fromToNextYear(ofYear) {
  const date = ofYear ? moment(`${ofYear}-01-01 00:00:00`, 'YYYY-MM-HH hh:mm') : moment();
  return {
    fromDate: date.startOf('year').toDate(),
    toDate: date.endOf('year').toDate(),
  };
}

export function startOfDay(date) {
  return moment(date).startOf('date').toDate();
}

export function endOfDay(date) {
  return moment(date).endOf('date').toDate();
}

export function startOfMonth(date) {
  return moment(date).startOf('month').toDate();
}

export function endOfMonth(date) {
  return moment(date).endOf('month').toDate();
}

export function startOfYear(date) {
  return moment(date).startOf('year').toDate();
}

export function endOfYear(date) {
  return moment(date).endOf('year').toDate();
}

export function formatPrice(value) {
  if (!value) {
    return 0;
  }
  return formatter.format(value);
}

export function formatDate(value) {
  const date = moment(value);
  moment.locale();
  return date.format('DD MMMM, YYYY');
}

export function formatFullDate(value) {
  const date = moment(value);
  moment.locale();
  return date.format('DD MMMM YYYY HH:mm');
}

export function prepareAvatarUrl(value, init) {
  return value ? `${BaseURL}/${value}` : init;
}

export function getTakeOptions(taked) {
  return [
    {
      text: '1',
      value: '1',
      checked: taked === 1,
    },
    {
      text: '10',
      value: '10',
      checked: taked === 10,
    },
    {
      text: '20',
      value: '20',
      checked: taked === 20,
    },
    {
      text: '50',
      value: '50',
      checked: taked === 50,
    },
    {
      text: '100',
      value: '100',
      checked: taked === 100,
    },
  ];
}
