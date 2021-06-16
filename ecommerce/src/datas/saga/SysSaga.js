import { takeLatest } from 'redux-saga/effects';
import { callApi } from '../CallApi';
import { ApiUrls, SortBookBy } from '../ApiUrls';
import { Call } from '../redux/AppAction';
import {
  ACTION_GET_CATEGORIES,
  ACTION_GET_ALL_CATEGORIES,
  ACTION_GET_POPULAR_BOOKS,
  ACTION_GET_BEST_SELLERS_BOOK,
  ACTION_SEARCH_BOOK,
  ACTION_GET_SOME_AUTHORS,
  ACTION_GET_RECOMMEND_BOOKS,
  ACTION_GET_BOOK,
  ACTION_GET_COMMENT,
  ACTION_GET_PAGE,
  ACTION_POST_COMMENT,
} from '../redux/SysAction';

function removeEmptyField(obj) {
  for (const key in obj) {
    if (obj[key] === undefined || (typeof obj[key] === 'string' && obj[key] !== null && obj[key].trim() === '')) {
      delete obj[key];
    }
  }
}

function* getCategories(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_CATEGORIES);
  });
}

function* getAllCategories(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_ALL_CATEGORIES);
  });
}

function* getPopularBooks(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_SEARCH_BOOK, {
      sortBy: SortBookBy.POPULAR,
      take: 6,
    });
  });
}

function* getBestSellersBook(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_SEARCH_BOOK, {
      sortBy: SortBookBy.BEST_SELLERS,
      take: 1,
    });
  });
}

function* getSomeAuthors(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_SOME_AUTHOR, {
      params: action.payload,
    });
  });
}

function* searchBooks(action) {
  yield Call(action, () => {
    removeEmptyField(action.payload)
    return callApi.axiosInstance.post(ApiUrls.POST_SEARCH_BOOK, action.payload);
  });
}

function* getBook(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_BOOK.replace('{id}', action.payload.id));
  });
}

function* getComments(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_COMMENT, {
      params: action.payload,
    });
  });
}

function* postComment(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_COMMENT, action.payload);
  });
}

function* getRecommendBooks(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_RECOMMEND_BOOKS, {
      params: action.payload,
    });
  });
}

function* getPage(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_PAGE, {
      params: action.payload,
    });
  });
}

export function* watchSysAction() {
  yield takeLatest(ACTION_GET_CATEGORIES, getCategories);
  yield takeLatest(ACTION_GET_ALL_CATEGORIES, getAllCategories);
  yield takeLatest(ACTION_GET_POPULAR_BOOKS, getPopularBooks);
  yield takeLatest(ACTION_GET_BEST_SELLERS_BOOK, getBestSellersBook);
  yield takeLatest(ACTION_GET_SOME_AUTHORS, getSomeAuthors);
  yield takeLatest(ACTION_SEARCH_BOOK, searchBooks);
  yield takeLatest(ACTION_GET_BOOK, getBook);
  yield takeLatest(ACTION_GET_COMMENT, getComments);
  yield takeLatest(ACTION_POST_COMMENT, postComment);
  yield takeLatest(ACTION_GET_RECOMMEND_BOOKS, getRecommendBooks);
  yield takeLatest(ACTION_GET_PAGE, getPage);
}
