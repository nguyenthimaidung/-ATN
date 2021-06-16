export const SortBookBy = {
  DEFAULT: 0,
  POPULAR: 1,
  BEST_RATE: 2,
  BEST_SELLERS: 3,
  PRICE_INCREASE: 4,
  PRICE_DECREASE: 5,
};

export const ApiUrls = {
  POST_SIGNIN: 'api/admin/signin',
  POST_SIGNUP: 'api/admin/signup',

  GET_PROFILE: 'api/admin/profile',
  POST_PROFILE: 'api/admin/profile',
  POST_UPLOAD_AVATAR: 'api/upload/avatar',

  GET_PROFILE_USER: 'api/data/user/profile',

  GET_COMMENT: 'api/comment',

  GET_DATA_ACCOUNT: 'api/data/account',

  GET_DATA_CATEGORY: 'api/data/category',
  POST_CATEGORY: 'api/data/category',
  PUT_CATEGORY: 'api/data/category/{id}',
  DEL_CATEGORY: 'api/data/category/{id}',

  GET_DATA_AUTHOR: 'api/data/author',
  POST_AUTHOR: 'api/data/author',
  PUT_AUTHOR: 'api/data/author/{id}',
  DEL_AUTHOR: 'api/data/author/{id}',

  GET_DATA_BOOK: 'api/data/search/book',
  GET_ALL_DATA_BOOK: 'api/data/books',
  GET_BOOK: 'api/data/book/{id}',
  POST_BOOK: 'api/data/book',
  PUT_BOOK: 'api/data/book/{id}',
  DEL_BOOK: 'api/data/book/{id}',

  GET_DATA_ORDER: 'api/data/order',
  PUT_ORDER: 'api/data/order/{id}',

  GET_PAGE: 'api/page',
  PATCH_PAGE: 'api/data/page',

  GET_STATISTICS: 'api/data/statistics',
  GET_STATISTICS_REVENUE: 'api/data/statistics/revenue',
};
