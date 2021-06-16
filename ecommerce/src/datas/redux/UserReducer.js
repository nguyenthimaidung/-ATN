import {
  ACTION_SIGN_IN,
  ACTION_VERIFY_CODE,
  ACTION_RESEND_VERIFY_CODE,
  ACTION_UPLOAD_AVATAR,
  ACTION_UPDATE_PROFILE,
  ACTION_SIGN_OUT,
  ACTION_SIGN_UP,
  ACTION_GET_WISHLIST,
  ACTION_GET_CART,
  ACTION_PUT_CART,
  ACTION_PUT_WISHLIST,
  ACTION_ADD_TO_CART,
  ACTION_REMOVE_CART_ITEM,
  ACTION_TOGGLE_WISHLIST_ITEM,
  ACTION_GET_PROFILE,
  ACTION_DRAFT_ORDER,
  ACTION_CONFIRM_CREATE_ORDER,
  ACTION_COMPLETE_CHECKOUT,
  ACTION_CHECK_PAYMENT_RETURNURL,
  ACTION_GET_ORDERS,
  ACTION_GET_ORDER,
  ACTION_DROP_ORDER,
} from './UserAction';
import { actionOK, actionEnd, actionError, actionStart, ACTION_RESET_SUCCESS } from './AppAction';
import { LocalKeys, LocalStorage } from '../../utils/LocalStorage';
import { callApi } from '../CallApi';
import { endTawkToChat } from '../../pages/TawkTo';

const userState = {
  id: undefined,
  name: undefined,
  email: undefined,
  phone: undefined,
  address: undefined,
  avatar: undefined,
  type: undefined,
  state: undefined,
  token: LocalStorage.get(LocalKeys.ACCESS_TOKEN) || undefined,

  cart: undefined,
  draftPutCart: undefined,
  wishlist: [],
  draftPutWishlist: undefined,

  // item cart, wishlist loadingId
  cartLoadingId: undefined,
  wishlistLoadingId: undefined,

  action: undefined,
  error: undefined,
  success: false,
  doing: false,

  draftOrder: undefined,
  createdOrder: undefined,
  paymentUrl: undefined,

  orderResult: undefined,

  orders: undefined,
  order: undefined,
};

const startState = (action) => ({
  action: action,
  doing: true,
  success: false,
});
const errorState = {
  success: false,
};
const successState = {
  success: true,
};
const endState = {
  doing: false,
};

const actionHandle = {
  [ACTION_RESET_SUCCESS]: (state) => {
    return { ...state, action: undefined, error: undefined, success: false, doing: false };
  },

  // sign in
  [actionStart(ACTION_SIGN_IN)]: (state) => {
    return { ...state, ...startState(ACTION_SIGN_IN) };
  },
  [actionOK(ACTION_SIGN_IN)]: (state, payload) => {
    LocalStorage.set(LocalKeys.ACCESS_TOKEN, payload.data.token);
    callApi.setAuthorization(payload.data.token);
    endTawkToChat();
    return { ...state, ...successState, ...payload.data.user, token: payload.data.token };
  },
  [actionError(ACTION_SIGN_IN)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_SIGN_IN)]: (state) => {
    return { ...state, ...endState };
  },

  // verify code
  [actionStart(ACTION_VERIFY_CODE)]: (state) => {
    return { ...state, ...startState(ACTION_VERIFY_CODE) };
  },
  [actionOK(ACTION_VERIFY_CODE)]: (state, payload) => {
    LocalStorage.set(LocalKeys.ACCESS_TOKEN, payload.data.token);
    callApi.setAuthorization(payload.data.token);
    return { ...state, ...successState, ...payload.data.user, token: payload.data.token };
  },
  [actionError(ACTION_VERIFY_CODE)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_VERIFY_CODE)]: (state) => {
    return { ...state, ...endState };
  },

  // resend verify code
  [actionOK(ACTION_RESEND_VERIFY_CODE)]: (state) => {
    return { ...state, error: undefined };
  },
  [actionError(ACTION_RESEND_VERIFY_CODE)]: (state, payload) => {
    return { ...state, error: payload };
  },

  // sign up
  [actionStart(ACTION_SIGN_UP)]: (state) => {
    return { ...state, ...startState(ACTION_SIGN_UP) };
  },
  [actionOK(ACTION_SIGN_UP)]: (state, payload) => {
    return { ...state, ...successState, ...payload.data };
  },
  [actionError(ACTION_SIGN_UP)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_SIGN_UP)]: (state) => {
    return { ...state, ...endState };
  },

  // sign out
  [ACTION_SIGN_OUT]: () => {
    LocalStorage.clear();
    endTawkToChat();
    callApi.setAuthorization(undefined);
    return { ...userState, token: undefined };
  },

  // get wishlist
  [actionOK(ACTION_GET_WISHLIST)]: (state, payload) => {
    return { ...state, wishlist: payload.data };
  },
  [actionError(ACTION_GET_WISHLIST)]: (state, payload) => {
    return { ...state, wishlist: [] };
  },

  // put wishlist
  [actionStart(ACTION_PUT_WISHLIST)]: (state) => {
    return { ...state, ...startState(ACTION_PUT_WISHLIST) };
  },
  [actionOK(ACTION_PUT_WISHLIST)]: (state, payload) => {
    return { ...state, ...successState, wishlist: payload.data };
  },
  [actionError(ACTION_PUT_WISHLIST)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_PUT_WISHLIST)]: (state) => {
    return { ...state, ...endState, draftPutWishlist: undefined, wishlistLoadingId: undefined };
  },

  // toggle wishlist item
  [ACTION_TOGGLE_WISHLIST_ITEM]: (state, payload) => {
    const { wishlist = [] } = state;
    const { bookId } = payload;

    if (wishlist.find((item) => item.id === bookId)) {
      state.draftPutWishlist = wishlist.filter((item) => item.id !== bookId).map((item) => ({ id: item.id }));
    } else {
      state.draftPutWishlist = [...wishlist.map((item) => ({ id: item.id })), { id: bookId }];
    }
    return { ...state, wishlistLoadingId: bookId };
  },

  // get cart
  [actionOK(ACTION_GET_CART)]: (state, payload) => {
    return { ...state, cart: payload.data };
  },
  [actionError(ACTION_PUT_CART)]: (state) => {
    return { ...state, cart: undefined };
  },

  // put cart
  [actionStart(ACTION_PUT_CART)]: (state) => {
    return { ...state, ...startState(ACTION_PUT_CART) };
  },
  [actionOK(ACTION_PUT_CART)]: (state, payload) => {
    return { ...state, ...successState, cart: payload.data };
  },
  [actionError(ACTION_PUT_CART)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_PUT_CART)]: (state) => {
    return { ...state, ...endState, draftPutCart: undefined, cartLoadingId: undefined };
  },

  // add cart item
  [ACTION_ADD_TO_CART]: (state, payload) => {
    const { cart, wishlist = [] } = state;
    const { bookId } = payload;
    let isAdded = false;
    const data = (cart && cart.detail) || [];
    const details = data.map((item) => {
      if (bookId === item.bookId) {
        isAdded = true;
      }
      return {
        bookId: item.bookId,
        quantity: isAdded ? item.quantity + 1 : item.quantity,
      };
    });
    if (!isAdded) {
      details.push({
        bookId: bookId,
        quantity: 1,
      });
    }

    if (wishlist.find((item) => item.id === bookId)) {
      state.draftPutWishlist = wishlist.filter((item) => item.id !== bookId).map((item) => ({ id: item.id }));
    }

    return { ...state, draftPutCart: details, cartLoadingId: bookId };
  },

  // remove cart item
  [ACTION_REMOVE_CART_ITEM]: (state, payload) => {
    const { cart } = state;
    const { bookId } = payload;

    const data = (cart && cart.detail) || [];

    const details = data
      .filter((item) => item.bookId !== bookId)
      .map((item) => {
        return {
          bookId: item.bookId,
          quantity: item.quantity,
        };
      });

    return { ...state, draftPutCart: details, cartLoadingId: bookId };
  },

  // upload avatar
  [actionOK(ACTION_UPLOAD_AVATAR)]: (state, payload) => {
    return { ...state, ...payload.data };
  },
  // get profile
  [actionOK(ACTION_GET_PROFILE)]: (state, payload) => {
    return { ...state, ...payload.data };
  },
  // update profile
  [actionOK(ACTION_UPDATE_PROFILE)]: (state, payload) => {
    return { ...state, ...payload.data };
  },

  // draft order
  [actionStart(ACTION_DRAFT_ORDER)]: (state) => {
    return { ...state, ...startState(ACTION_DRAFT_ORDER) };
  },
  [actionOK(ACTION_DRAFT_ORDER)]: (state, payload) => {
    return { ...state, ...successState, draftOrder: payload.data };
  },
  [actionError(ACTION_DRAFT_ORDER)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_DRAFT_ORDER)]: (state) => {
    return { ...state, ...endState };
  },

  // confirm create order
  [actionStart(ACTION_CONFIRM_CREATE_ORDER)]: (state, payload) => {
    return {
      ...state,
      ...startState(ACTION_CONFIRM_CREATE_ORDER),
      createdOrder: undefined,
      paymentUrl: undefined,
    };
  },
  [actionOK(ACTION_CONFIRM_CREATE_ORDER)]: (state, payload) => {
    return {
      ...state,
      ...successState,
      cart: undefined,
      draftPutCart: undefined,
      draftOrder: undefined,
      createdOrder: payload.data.order,
      paymentUrl: payload.data.paymentUrl,
    };
  },
  [actionError(ACTION_CONFIRM_CREATE_ORDER)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_CONFIRM_CREATE_ORDER)]: (state, payload) => {
    return { ...state, ...endState };
  },

  // reset checkout
  [ACTION_COMPLETE_CHECKOUT]: (state, payload) => {
    return {
      ...state,
      createdOrder: undefined,
      paymentUrl: undefined,
    };
  },

  // check payment return url
  [actionStart(ACTION_CHECK_PAYMENT_RETURNURL)]: (state) => {
    return { ...state, ...startState(ACTION_CHECK_PAYMENT_RETURNURL) };
  },
  [actionOK(ACTION_CHECK_PAYMENT_RETURNURL)]: (state, payload) => {
    return { ...state, ...successState, orderResult: payload.data };
  },
  [actionError(ACTION_CHECK_PAYMENT_RETURNURL)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_CHECK_PAYMENT_RETURNURL)]: (state) => {
    return { ...state, ...endState };
  },

  // get orders
  [actionOK(ACTION_GET_ORDERS)]: (state, payload) => {
    return { ...state, orders: { data: payload.data, pagination: payload.pagination } };
  },

  // get order
  [actionStart(ACTION_GET_ORDER)]: (state) => {
    return { ...state, ...startState(ACTION_GET_ORDER) };
  },
  [actionOK(ACTION_GET_ORDER)]: (state, payload) => {
    return { ...state, order: payload.data };
  },
  [actionError(ACTION_GET_ORDER)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_GET_ORDER)]: (state) => {
    return { ...state, ...endState };
  },

  // drop order
  [actionStart(ACTION_DROP_ORDER)]: (state) => {
    return { ...state, ...startState(ACTION_DROP_ORDER) };
  },
  [actionOK(ACTION_DROP_ORDER)]: (state) => {
    return { ...state, ...successState };
  },
  [actionError(ACTION_DROP_ORDER)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_DROP_ORDER)]: (state) => {
    return { ...state, ...endState };
  },
};

export const UserReducer = (state = userState, action) => {
  const { type, payload } = action;
  const handle = actionHandle[type];
  return handle ? handle(state, payload) : state;
};
