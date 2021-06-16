import {
  ACTION_GET_CATEGORIES,
  ACTION_GET_POPULAR_BOOKS,
  ACTION_GET_BEST_SELLERS_BOOK,
  ACTION_SEARCH_BOOK,
  ACTION_GET_SOME_AUTHORS,
  ACTION_GET_RAMDOM_TAGS,
  ACTION_GET_BOOK,
  ACTION_GET_COMMENT,
  ACTION_GET_RECOMMEND_BOOKS,
  ACTION_GET_PAGE,
  ACTION_POST_COMMENT,
  ACTION_GET_ALL_CATEGORIES,
} from './SysAction';
import { actionStart, actionOK } from './AppAction';

const sysState = {
  categories: undefined,
  allCategories: undefined,

  // web site info
  systemInfo: undefined,

  // home page
  popularBooks: undefined,
  bestSellerBooks: undefined,

  // recommend book
  recommendBooks: undefined,

  // search book
  books: undefined,
  pagination: undefined,

  authors: undefined,
  tags: undefined,

  // book
  book: undefined,
  // comment
  comment: undefined,
  comments: undefined,
  commentPagination: undefined,

  dynamicPage: undefined,
};

const actionHandle = {
  // get category
  [actionOK(ACTION_GET_CATEGORIES)]: (state, payload) => {
    return { ...state, categories: payload.data };
  },
  // get all category
  [actionOK(ACTION_GET_ALL_CATEGORIES)]: (state, payload) => {
    return { ...state, allCategories: payload.data };
  },

  // get popular books
  [actionOK(ACTION_GET_POPULAR_BOOKS)]: (state, payload) => {
    return { ...state, popularBooks: payload.data };
  },

  // get best sellers book
  [actionOK(ACTION_GET_BEST_SELLERS_BOOK)]: (state, payload) => {
    return { ...state, bestSellerBooks: payload.data };
  },

  // recommend book
  [actionOK(ACTION_SEARCH_BOOK)]: (state, payload) => {
    return { ...state, books: payload.data, pagination: payload.pagination };
  },

  // search book
  [actionOK(ACTION_SEARCH_BOOK)]: (state, payload) => {
    return { ...state, books: payload.data, pagination: payload.pagination };
  },

  // get recommend book
  [actionOK(ACTION_GET_RECOMMEND_BOOKS)]: (state, payload) => {
    return { ...state, recommendBooks: payload.data };
  },

  // get book
  [actionOK(ACTION_GET_BOOK)]: (state, payload) => {
    return { ...state, book: payload.data };
  },

  // get comment book
  [actionOK(ACTION_GET_COMMENT)]: (state, payload) => {
    return { ...state, comments: payload.data, commentPagination: payload.pagination };
  },

  // post commet book
  [actionOK(ACTION_POST_COMMENT)]: (state, payload) => {
    return { ...state, comment: payload.data };
  },

  // get random authors
  [actionOK(ACTION_GET_SOME_AUTHORS)]: (state, payload) => {
    return { ...state, authors: payload.data };
  },

  // get random tags
  [actionOK(ACTION_GET_RAMDOM_TAGS)]: (state, payload) => {
    return { ...state, tags: payload.data };
  },

  // get dynamic page
  [actionStart(ACTION_GET_PAGE)]: (state) => {
    return { ...state, dynamicPage: undefined };
  },
  [actionOK(ACTION_GET_PAGE)]: (state, payload) => {
    return { ...state, dynamicPage: payload.data };
  },
};

export const SysReducer = (state = sysState, action) => {
  const { type, payload } = action;
  const handle = actionHandle[type];
  return handle ? handle(state, payload) : state;
};
