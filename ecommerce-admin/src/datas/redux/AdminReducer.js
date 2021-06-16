import {
  ACTION_SIGN_IN,
  ACTION_SIGN_OUT,
  ACTION_SIGN_UP,
  ACTION_UPLOAD_AVATAR,
  ACTION_UPDATE_PROFILE,
  ACTION_GET_PROFILE,
  ACTION_SET_TAKE,
  ACTION_GET_DATA_ACCOUNT,
  ACTION_GET_DATA_CATEGORY,
  ACTION_POST_CATEGORY,
  ACTION_DEL_CATEGORY,
  ACTION_PUT_CATEGORY,
  ACTION_GET_DATA_AUTHOR,
  ACTION_POST_AUTHOR,
  ACTION_PUT_AUTHOR,
  ACTION_DEL_AUTHOR,
  ACTION_GET_DATA_BOOK,
  ACTION_POST_BOOK,
  ACTION_PUT_BOOK,
  ACTION_DEL_BOOK,
  ACTION_GET_DATA_ORDER,
  ACTION_GET_BOOKS,
  ACTION_GET_PROFILE_USER,
  ACTION_PUT_ORDER,
  ACTION_SET_ORDER,
  ACTION_GET_PAGE,
  ACTION_PATCH_PAGE,
  ACTION_GET_ALL_DATA_BOOK,
  ACTION_UPDATE_QUANTITY_BOOKS,
  ACTION_GET_STATISTICS,
  ACTION_GET_STATISTICS_REVENUE,
} from './AdminAction';
import { actionOK, actionEnd, actionError, actionStart, ACTION_RESET_SUCCESS } from './AppAction';
import { LocalKeys, LocalStorage } from '../../utils/LocalStorage';
import { callApi } from '../CallApi';

const adminState = {
  id: undefined,
  name: undefined,
  email: undefined,
  phone: undefined,
  avatar: undefined,
  type: undefined,
  state: undefined,
  token: LocalStorage.get(LocalKeys.ACCESS_TOKEN) || undefined,

  action: undefined,
  error: undefined,
  success: false,
  doing: false,

  take: 10,

  dashboardInfo: undefined,

  accounts: undefined,

  orders: undefined,
  order: undefined,

  categories: undefined,
  delCategoryId: undefined,

  books: undefined,
  allBooks: undefined,

  bookDetails: undefined,
  profileUser: undefined,

  authors: undefined,

  dynamicPage: undefined,

  statistics: undefined,
  statisticsRevenue: undefined,
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
    return { ...state, ...successState, ...payload.data.user, token: payload.data.token };
  },
  [actionError(ACTION_SIGN_IN)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_SIGN_IN)]: (state) => {
    return { ...state, ...endState };
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
    callApi.setAuthorization(undefined);
    return { ...adminState, token: undefined };
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

  // get user profile
  [actionStart(ACTION_GET_PROFILE_USER)]: (state, payload) => {
    return { ...state, profileUser: undefined };
  },
  [actionOK(ACTION_GET_PROFILE_USER)]: (state, payload) => {
    return { ...state, profileUser: payload.data };
  },

  // set take
  [ACTION_SET_TAKE]: (state, payload) => {
    return { ...state, ...payload };
  },

  // get data account
  [actionOK(ACTION_GET_DATA_ACCOUNT)]: (state, payload) => {
    return { ...state, accounts: { data: payload.data, pagination: payload.pagination } };
  },

  // get data category
  [actionOK(ACTION_GET_DATA_CATEGORY)]: (state, payload) => {
    return { ...state, categories: { data: payload.data } };
  },

  // post category
  [actionOK(ACTION_POST_CATEGORY)]: (state, payload) => {
    const datas = [...state.categories.data];
    datas.push(payload.data);
    return { ...state, categories: { data: datas } };
  },

  // put category
  [actionOK(ACTION_PUT_CATEGORY)]: (state, payload) => {
    const datas = [...state.categories.data];
    const idx = datas.findIndex((item) => item.id === payload.data.id);
    idx !== -1 && (datas[idx] = payload.data);
    console.log(datas);
    return { ...state, categories: { data: datas } };
  },

  // del category
  [actionStart(ACTION_DEL_CATEGORY)]: (state, payload) => {
    return { ...state, delCategoryId: payload.id };
  },
  [actionOK(ACTION_DEL_CATEGORY)]: (state) => {
    const datas = [
      ...state.categories.data
        .filter((item) => item.id !== state.delCategoryId)
        .map((item) => {
          if (item.parentId === state.delCategoryId) {
            item.parentId = null;
          }
          return item;
        }),
    ];
    return { ...state, categories: { data: datas } };
  },

  // get data author
  [actionOK(ACTION_GET_DATA_AUTHOR)]: (state, payload) => {
    return { ...state, authors: { data: payload.data, pagination: payload.pagination } };
  },

  // post author
  [actionStart(ACTION_POST_AUTHOR)]: (state) => {
    return { ...state, ...startState(ACTION_POST_AUTHOR) };
  },
  [actionOK(ACTION_POST_AUTHOR)]: (state) => {
    return { ...state, ...successState };
  },
  [actionError(ACTION_POST_AUTHOR)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_POST_AUTHOR)]: (state) => {
    return { ...state, ...endState };
  },

  // put author
  [actionStart(ACTION_PUT_AUTHOR)]: (state) => {
    return { ...state, ...startState(ACTION_PUT_AUTHOR) };
  },
  [actionOK(ACTION_PUT_AUTHOR)]: (state) => {
    return { ...state, ...successState };
  },
  [actionError(ACTION_PUT_AUTHOR)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_PUT_AUTHOR)]: (state) => {
    return { ...state, ...endState };
  },

  // del author
  [actionStart(ACTION_DEL_AUTHOR)]: (state) => {
    return { ...state, ...startState(ACTION_DEL_AUTHOR) };
  },
  [actionOK(ACTION_DEL_AUTHOR)]: (state) => {
    return { ...state, ...successState };
  },
  [actionError(ACTION_DEL_AUTHOR)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_DEL_AUTHOR)]: (state) => {
    return { ...state, ...endState };
  },

  // get data book
  [actionOK(ACTION_GET_DATA_BOOK)]: (state, payload) => {
    return { ...state, books: { data: payload.data, pagination: payload.pagination } };
  },
  // get all data book
  [actionOK(ACTION_GET_ALL_DATA_BOOK)]: (state, payload) => {
    return { ...state, allBooks: { data: payload.data, pagination: payload.pagination } };
  },
  // get book details
  [actionOK(ACTION_GET_BOOKS)]: (state, payloads) => {
    return { ...state, bookDetails: { data: payloads.map((payload) => payload.data) } };
  },

  // update quantity book
  [actionStart(ACTION_UPDATE_QUANTITY_BOOKS)]: (state) => {
    return { ...state, ...startState(ACTION_UPDATE_QUANTITY_BOOKS) };
  },
  [actionOK(ACTION_UPDATE_QUANTITY_BOOKS)]: (state) => {
    return { ...state, ...successState };
  },
  [actionError(ACTION_UPDATE_QUANTITY_BOOKS)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_UPDATE_QUANTITY_BOOKS)]: (state) => {
    return { ...state, ...endState };
  },

  // post book
  [actionStart(ACTION_POST_BOOK)]: (state) => {
    return { ...state, ...startState(ACTION_POST_BOOK) };
  },
  [actionOK(ACTION_POST_BOOK)]: (state) => {
    return { ...state, ...successState };
  },
  [actionError(ACTION_POST_BOOK)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_POST_BOOK)]: (state) => {
    return { ...state, ...endState };
  },

  // put book
  [actionStart(ACTION_PUT_BOOK)]: (state) => {
    return { ...state, ...startState(ACTION_PUT_BOOK) };
  },
  [actionOK(ACTION_PUT_BOOK)]: (state) => {
    return { ...state, ...successState };
  },
  [actionError(ACTION_PUT_BOOK)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_PUT_BOOK)]: (state) => {
    return { ...state, ...endState };
  },

  // del book
  [actionStart(ACTION_DEL_BOOK)]: (state) => {
    return { ...state, ...startState(ACTION_DEL_BOOK) };
  },
  [actionOK(ACTION_DEL_BOOK)]: (state) => {
    return { ...state, ...successState };
  },
  [actionError(ACTION_DEL_BOOK)]: (state, payload) => {
    return { ...state, ...errorState, error: payload };
  },
  [actionEnd(ACTION_DEL_BOOK)]: (state) => {
    return { ...state, ...endState };
  },

  // get data order
  [actionOK(ACTION_GET_DATA_ORDER)]: (state, payload) => {
    return { ...state, orders: { data: payload.data, pagination: payload.pagination } };
  },
  // set order
  [ACTION_SET_ORDER]: (state, payload) => {
    return { ...state, order: payload };
  },
  // put order
  [actionOK(ACTION_PUT_ORDER)]: (state, payload) => {
    return { ...state, order: payload.data };
  },

  // get dynamic page
  [actionStart(ACTION_GET_PAGE)]: (state) => {
    return { ...state, dynamicPage: undefined };
  },
  [actionOK(ACTION_GET_PAGE)]: (state, payload) => {
    return { ...state, dynamicPage: payload.data };
  },
  [actionOK(ACTION_PATCH_PAGE)]: (state, payload) => {
    return { ...state, dynamicPage: payload.data };
  },

  // get statistics
  [actionOK(ACTION_GET_STATISTICS)]: (state, payload) => {
    return { ...state, statistics: payload.data };
  },
  [actionOK(ACTION_GET_STATISTICS_REVENUE)]: (state, payload) => {
    return { ...state, statisticsRevenue: payload.data };
  },
};

export const AdminReducer = (state = adminState, action) => {
  const { type, payload } = action;
  const handle = actionHandle[type];
  return handle ? handle(state, payload) : state;
};
