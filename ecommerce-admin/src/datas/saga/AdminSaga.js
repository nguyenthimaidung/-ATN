import { takeLatest } from 'redux-saga/effects';
import { callApi } from '../CallApi';
import { ApiUrls } from '../ApiUrls';
import { Call } from '../redux/AppAction';
import {
  ACTION_SIGN_IN,
  ACTION_SIGN_UP,
  ACTION_UPDATE_PROFILE,
  ACTION_UPLOAD_AVATAR,
  ACTION_GET_PROFILE,
  ACTION_GET_DATA_ACCOUNT,
  ACTION_GET_DATA_CATEGORY,
  ACTION_GET_DATA_BOOK,
  ACTION_GET_BOOKS,
  ACTION_GET_DATA_AUTHOR,
  ACTION_GET_DATA_ORDER,
  ACTION_POST_CATEGORY,
  ACTION_PUT_CATEGORY,
  ACTION_DEL_CATEGORY,
  ACTION_POST_AUTHOR,
  ACTION_PUT_AUTHOR,
  ACTION_DEL_AUTHOR,
  ACTION_POST_BOOK,
  ACTION_PUT_BOOK,
  ACTION_DEL_BOOK,
  ACTION_GET_PROFILE_USER,
  ACTION_PUT_ORDER,
  ACTION_GET_PAGE,
  ACTION_PATCH_PAGE,
  ACTION_GET_ALL_DATA_BOOK,
  ACTION_UPDATE_QUANTITY_BOOKS,
  ACTION_GET_STATISTICS_REVENUE,
  ACTION_GET_STATISTICS,
} from '../redux/AdminAction';

function removeEmptyField(obj) {
  for (const key in obj) {
    if (obj[key] === undefined || (typeof obj[key] === 'string' && obj[key] !== null && obj[key].trim() === '')) {
      delete obj[key];
    }
  }
}

function* signIn(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_SIGNIN, action.payload);
  });
}

function* signUp(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_SIGNUP, action.payload);
  });
}

function* getProfile(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_PROFILE);
  });
}

function* updateProfile(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.put(ApiUrls.POST_PROFILE, action.payload);
  });
}

function* getProfileUser(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_PROFILE_USER, {
      params: action.payload,
    });
  });
}

function* uploadAvatar(action) {
  yield Call(action, () => {
    const formdata = new FormData();
    formdata.append('file', action.payload.file);
    return callApi.axiosInstance.post(ApiUrls.POST_UPLOAD_AVATAR, formdata);
  });
}

function* getDataAccount(action) {
  yield Call(action, () => {
    removeEmptyField(action.payload);
    return callApi.axiosInstance.get(ApiUrls.GET_DATA_ACCOUNT, {
      params: action.payload,
    });
  });
}

function* getDataCategory(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_DATA_CATEGORY);
  });
}

function* postCategory(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_CATEGORY, action.payload);
  });
}

function* putCategory(action) {
  yield Call(action, () => {
    const { id, ...data } = action.payload;
    return callApi.axiosInstance.put(ApiUrls.PUT_CATEGORY.replace('{id}', action.payload.id), data);
  });
}

function* delCategory(action) {
  yield Call(action, () => {
    const id = action.payload.id;
    return callApi.axiosInstance.delete(ApiUrls.DEL_CATEGORY.replace('{id}', id));
  });
}

function* getAllBook(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_ALL_DATA_BOOK);
  });
}

function* getDataBook(action) {
  yield Call(action, () => {
    removeEmptyField(action.payload);
    return callApi.axiosInstance.post(ApiUrls.GET_DATA_BOOK, action.payload);
  });
}

function* postBook(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_BOOK, action.payload);
  });
}

function* putBook(action) {
  yield Call(action, () => {
    const { id, ...data } = action.payload;
    return callApi.axiosInstance.put(ApiUrls.PUT_BOOK.replace('{id}', id), data);
  });
}

function* updateQuantityBooks(action) {
  yield Call(action, () => {
    return Promise.all(
      action.payload.updates.map(async (update) => {
        return callApi.axiosInstance.put(ApiUrls.PUT_BOOK.replace('{id}', update.id), {
          quantity: update.quantity,
        });
      })
    );
  });
}

function* delBook(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.delete(ApiUrls.DEL_BOOK.replace('{id}', action.payload.id));
  });
}

function* getDataAuthor(action) {
  yield Call(action, () => {
    removeEmptyField(action.payload);
    return callApi.axiosInstance.get(ApiUrls.GET_DATA_AUTHOR, {
      params: action.payload,
    });
  });
}

function* postAuthor(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_AUTHOR, action.payload);
  });
}

function* putAuthor(action) {
  yield Call(action, () => {
    const { id, ...data } = action.payload;
    return callApi.axiosInstance.put(ApiUrls.PUT_AUTHOR.replace('{id}', id), data);
  });
}

function* delAuthor(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.delete(ApiUrls.DEL_AUTHOR.replace('{id}', action.payload.id));
  });
}

function* getBooks(action) {
  yield Call(action, () => {
    return Promise.all(
      action.payload.ids.map(async (id) => {
        return callApi.axiosInstance.get(ApiUrls.GET_BOOK.replace('{id}', id));
      })
    );
  });
}

function* getDataOrder(action) {
  yield Call(action, () => {
    removeEmptyField(action.payload);
    return callApi.axiosInstance.get(ApiUrls.GET_DATA_ORDER, {
      params: action.payload,
    });
  });
}

function* putOrder(action) {
  yield Call(action, () => {
    const { id, ...data } = action.payload;
    return callApi.axiosInstance.put(ApiUrls.PUT_ORDER.replace('{id}', id), data);
  });
}

function* getPage(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_PAGE, {
      params: action.payload,
    });
  });
}

function* patchPage(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.patch(ApiUrls.PATCH_PAGE, action.payload);
  });
}

function* getStatistics(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_STATISTICS);
  });
}

function* getStatisticsRevenue(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_STATISTICS_REVENUE, {
      params: action.payload,
    });
  });
}

export function* watchAdminAction() {
  yield takeLatest(ACTION_SIGN_IN, signIn);
  yield takeLatest(ACTION_SIGN_UP, signUp);

  yield takeLatest(ACTION_GET_PROFILE, getProfile);
  yield takeLatest(ACTION_UPDATE_PROFILE, updateProfile);
  yield takeLatest(ACTION_UPLOAD_AVATAR, uploadAvatar);

  yield takeLatest(ACTION_GET_PROFILE_USER, getProfileUser);

  yield takeLatest(ACTION_GET_DATA_ACCOUNT, getDataAccount);

  yield takeLatest(ACTION_GET_DATA_CATEGORY, getDataCategory);
  yield takeLatest(ACTION_POST_CATEGORY, postCategory);
  yield takeLatest(ACTION_PUT_CATEGORY, putCategory);
  yield takeLatest(ACTION_DEL_CATEGORY, delCategory);

  yield takeLatest(ACTION_GET_DATA_BOOK, getDataBook);
  yield takeLatest(ACTION_GET_ALL_DATA_BOOK, getAllBook);
  yield takeLatest(ACTION_GET_BOOKS, getBooks);
  yield takeLatest(ACTION_POST_BOOK, postBook);
  yield takeLatest(ACTION_PUT_BOOK, putBook);
  yield takeLatest(ACTION_DEL_BOOK, delBook);
  yield takeLatest(ACTION_UPDATE_QUANTITY_BOOKS, updateQuantityBooks);

  yield takeLatest(ACTION_GET_DATA_AUTHOR, getDataAuthor);
  yield takeLatest(ACTION_POST_AUTHOR, postAuthor);
  yield takeLatest(ACTION_PUT_AUTHOR, putAuthor);
  yield takeLatest(ACTION_DEL_AUTHOR, delAuthor);

  yield takeLatest(ACTION_GET_DATA_ORDER, getDataOrder);
  yield takeLatest(ACTION_PUT_ORDER, putOrder);

  yield takeLatest(ACTION_GET_PAGE, getPage);
  yield takeLatest(ACTION_PATCH_PAGE, patchPage);

  yield takeLatest(ACTION_GET_STATISTICS, getStatistics);
  yield takeLatest(ACTION_GET_STATISTICS_REVENUE, getStatisticsRevenue);
}
