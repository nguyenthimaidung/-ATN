import React from 'react';
import ReactDOM from 'react-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './assets/css/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { AppSaga } from './datas/saga/AppSaga';
import { AppReducer } from './datas/redux/AppReducer';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/content-styles.css';
require('moment/locale/vi');

const sagaMiddleware = createSagaMiddleware();
const store = createStore(AppReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(AppSaga);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
