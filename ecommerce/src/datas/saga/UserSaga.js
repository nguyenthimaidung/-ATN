import { takeLatest } from 'redux-saga/effects';
import { callApi } from '../CallApi';
import { ApiUrls } from '../ApiUrls';
import { Call } from '../redux/AppAction';
import {
  ACTION_SIGN_IN,
  ACTION_SIGN_UP,
  ACTION_UPDATE_PROFILE,
  ACTION_UPLOAD_AVATAR,
  ACTION_VERIFY_CODE,
  ACTION_RESEND_VERIFY_CODE,
  ACTION_GET_WISHLIST,
  ACTION_PUT_WISHLIST,
  ACTION_GET_CART,
  ACTION_PUT_CART,
  ACTION_GET_PROFILE,
  ACTION_DRAFT_ORDER,
  ACTION_CONFIRM_CREATE_ORDER,
  ACTION_RESEND_VERIFY_ORDER,
  ACTION_CHECK_PAYMENT_RETURNURL,
  ACTION_GET_ORDER,
  ACTION_GET_ORDERS,
  ACTION_DROP_ORDER,
} from '../redux/UserAction';

function* signIn(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_SIGNIN, action.payload);
  });
}

function* verifyCode(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_VERIFY_CODE, action.payload);
  });
}

function* resendVerifyCode(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_RESEND_VERIFY_CODE, action.payload);
  });
}

function* signUp(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_SIGNUP, action.payload);
  });
}

function* getWishlist(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_WISHLIST);
  });
}

function* putWishlist(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.put(ApiUrls.PUT_WISHLIST, action.payload);
  });
}

function* getCart(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_CART);
  });
}

function* putCart(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.put(ApiUrls.PUT_CART, action.payload);
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

function* uploadAvatar(action) {
  yield Call(action, () => {
    const formdata = new FormData();
    formdata.append('file', action.payload.file);
    return callApi.axiosInstance.post(ApiUrls.POST_UPLOAD_AVATAR, formdata);
  });
}

function* draftOrder(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_DRAFT_ORDER, action.payload);
  });
}

function* resendVerifyOrder(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_RESEND_VERIFY_ORDER.replace('{id}', action.payload.orderId));
  });
}

function* confirmCreateOrder(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.post(ApiUrls.POST_CONFIRM_CREATE_ORDER, action.payload);
  });
}

function* checkPaymentReturnUrl(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_CHECK_PAYMENT_RETURNURL + action.payload.query);
  });
}

function* getOrders(action) {
  yield Call(action, () => {
    return callApi.axiosInstance.get(ApiUrls.GET_ORDERS, {
      params: action.payload,
    });
  });
}

function* getOrder(action) {
  yield Call(action, () => {
    const { id, ...data } = action.payload;
    return callApi.axiosInstance.get(ApiUrls.GET_ORDER.replace('{id}', id), {
      params: data,
    });
  });
}

function* dropOrder(action) {
  yield Call(action, () => {
    const { id, ...data } = action.payload;
    return callApi.axiosInstance.post(ApiUrls.POST_DROP_ORDER.replace('{id}', id), data);
  });
}

export function* watchUserAction() {
  yield takeLatest(ACTION_SIGN_IN, signIn);
  yield takeLatest(ACTION_VERIFY_CODE, verifyCode);
  yield takeLatest(ACTION_RESEND_VERIFY_CODE, resendVerifyCode);
  yield takeLatest(ACTION_SIGN_UP, signUp);

  yield takeLatest(ACTION_GET_WISHLIST, getWishlist);
  yield takeLatest(ACTION_PUT_WISHLIST, putWishlist);
  yield takeLatest(ACTION_GET_CART, getCart);
  yield takeLatest(ACTION_PUT_CART, putCart);

  yield takeLatest(ACTION_GET_PROFILE, getProfile);
  yield takeLatest(ACTION_UPDATE_PROFILE, updateProfile);
  yield takeLatest(ACTION_UPLOAD_AVATAR, uploadAvatar);

  yield takeLatest(ACTION_DRAFT_ORDER, draftOrder);
  yield takeLatest(ACTION_RESEND_VERIFY_ORDER, resendVerifyOrder);
  yield takeLatest(ACTION_CONFIRM_CREATE_ORDER, confirmCreateOrder);
  yield takeLatest(ACTION_CHECK_PAYMENT_RETURNURL, checkPaymentReturnUrl);

  yield takeLatest(ACTION_GET_ORDERS, getOrders);
  yield takeLatest(ACTION_GET_ORDER, getOrder);
  yield takeLatest(ACTION_DROP_ORDER, dropOrder);
}
