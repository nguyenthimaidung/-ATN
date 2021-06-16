import https from 'https';
import FormData from 'form-data';
import axios from 'axios';
import { LocalKeys, LocalStorage } from '../utils/LocalStorage';
import { BaseURL } from '../Constant';

const TAG = 'CallApi';

export const CallApiErrorCodes = {
  TIMEOUT: 'TIMEOUT',
  EMPTY_RESPONSE: 'EMPTY_RESPONSE',
};

export class CallApiError {
  errorCode;
  message;

  constructor(data) {
    this.errorCode = data.errorCode;
    this.message = data.message;
  }
}

export class CallApi {
  name;
  axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  });

  constructor({ name = 'default', baseURL = 'http://localhost:4000' }) {
    this.name = name;
    this.axiosInstance.defaults.baseURL = baseURL;
    this.axiosInstance.interceptors.request.use((config) => {
      if (config.data instanceof FormData) {
        Object.assign(config.headers, { 'Content-Type': 'multipart/form-data' });
      }
      return config;
    });
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const { status, data, message, pagination } = response.data;
        return { status, message, data, pagination };
      },
      (err) => {
        if (!!err.isAxiosError && !err.response) {
          console.error(
            TAG,
            'Timeout',
            err.config.method,
            err.config.url,
            err.config.params,
            err.config.data instanceof FormData ? undefined : err.config.data
          );
          throw new CallApiError({ errorCode: CallApiErrorCodes.TIMEOUT });
        }
        if (err.response && err.response.data) {
          const { status, message, errorCode, data } = err.response.data;
          // eslint-disable-next-line no-throw-literal
          throw { status, message, errorCode, data };
        }
        console.log(err);
        // console.error(
        //   TAG,
        //   'Empty response',
        //   err.config.method,
        //   err.config.url,
        //   err.config.params,
        //   err.config.data instanceof FormData ? undefined : err.config.data,
        //   err.response
        // );
        throw new CallApiError({ errorCode: CallApiErrorCodes.EMPTY_RESPONSE });
      }
    );
    this.setContentType('application/json;charset=UTF-8');
    const token = LocalStorage.get(LocalKeys.ACCESS_TOKEN);
    token && this.setAuthorization(token);
  }

  setContentType(contentType) {
    this.axiosInstance.defaults.headers.common['Content-Type'] = contentType;
  }

  setAuthorization(authToken) {
    this.axiosInstance.defaults.headers.common['Authorization'] = authToken ? 'Bearer ' + authToken : undefined;
  }

  static formData(data) {
    const form = new FormData();
    for (const key in data) {
      form.append(key, data[key]);
    }
    return form;
  }
}

export const callApi = new CallApi({ baseURL: BaseURL });
