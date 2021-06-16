export const SortBookBy = {
  DEFAULT: 0,
  POPULAR: 1,
  BEST_RATE: 2,
  BEST_SELLERS: 3,
  PRICE_INCREASE: 4,
  PRICE_DECREASE: 5,
};

export const ApiUrls = {
  POST_SIGNIN: 'api/user/signin',

  POST_VERIFY_CODE: '/api/account/verifyemail',
  POST_RESEND_VERIFY_CODE: '/api/account/resendverifyemail',

  POST_SIGNUP: 'api/user/signup',

  GET_PROFILE: 'api/user/profile',
  POST_PROFILE: 'api/user/profile',
  POST_UPLOAD_AVATAR: 'api/upload/avatar',

  GET_CATEGORIES: 'api/categories',
  GET_ALL_CATEGORIES: 'api/data/category',

  GET_PROFILE_USER: 'api/account/profile',

  GET_WISHLIST: 'api/user/wishlist',
  PUT_WISHLIST: 'api/user/wishlist',

  GET_CART: 'api/user/cart',
  PUT_CART: 'api/user/cart',

  POST_SEARCH_BOOK: 'api/search/book',
  GET_BOOK: 'api/book/{id}',

  GET_COMMENT: 'api/comment',
  POST_COMMENT: 'api/comment',

  GET_RECOMMEND_BOOKS: '/api/book/recommend',

  GET_SOME_AUTHOR: 'api/author/some',

  POST_DRAFT_ORDER: 'api/order',
  POST_RESEND_VERIFY_ORDER: 'api/order/resendverifyorder/{id}',
  POST_CONFIRM_CREATE_ORDER: 'api/order/confirm',
  GET_CHECK_PAYMENT_RETURNURL: 'api/payment/vnpay/check/url',

  GET_PAGE: 'api/page',

  GET_ORDERS: 'api/order',
  GET_ORDER: 'api/order/{id}',
  POST_DROP_ORDER: 'api/order/drop/{id}',
};
