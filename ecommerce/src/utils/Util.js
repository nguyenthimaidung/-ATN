import { BaseURL, ImageURL } from '../Constant';
const moment = require('moment');

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function formatPrice(value) {
  if (!value) {
    return 0;
  }
  return formatter.format(value);
}

export function formatFullDate(value) {
  const date = moment(value);
  moment.locale();
  return date.format('DD MMMM YYYY HH:mm');
}

export function prepareAvatarUrl(value, init) {
  return value ? `${BaseURL}/${value}` : init;
}

export function prepareImgUrl(value, init) {
  if (value && value.startsWith('http')) {
    return value;
  }
  return value ? `${ImageURL}/${value}` : init;
}

export function prepareContent(content) {
  if (content) {
    return content.replace(/(<img.*? src=")(.*?)(".*?>)/g, `$1${ImageURL}$2$3`);
  }
  return content;
}
