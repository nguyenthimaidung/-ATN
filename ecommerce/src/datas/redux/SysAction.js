export const ACTION_GET_CATEGORIES = 'ACTION_GET_CATEGORIES';
export const ACTION_GET_ALL_CATEGORIES = 'ACTION_GET_ALL_CATEGORIES';

export const ACTION_GET_POPULAR_BOOKS = 'ACTION_GET_POPULAR_BOOKS';
export const ACTION_GET_BEST_SELLERS_BOOK = 'ACTION_GET_BEST_SELLERS_BOOK';

export const ACTION_SEARCH_BOOK = 'ACTION_SEARCH_BOOK';
export const ACTION_GET_BOOK = 'ACTION_GET_BOOK';

export const ACTION_GET_RECOMMEND_BOOKS = 'ACTION_GET_RECOMMEND_BOOKS';
export const ACTION_GET_SOME_AUTHORS = 'ACTION_GET_SOME_AUTHORS';
export const ACTION_GET_RAMDOM_TAGS = 'ACTION_GET_RAMDOM_TAGS';

export const ACTION_GET_COMMENT = 'ACTION_GET_COMMENT';
export const ACTION_POST_COMMENT = 'ACTION_POST_COMMENT';

export const ACTION_GET_PAGE = 'ACTION_GET_PAGE';

export const actionGetCategories = () => ({
  type: ACTION_GET_CATEGORIES,
  payload: {},
});

export const actionGetAllCategories = () => ({
  type: ACTION_GET_ALL_CATEGORIES,
  payload: {},
});

export const actionGetPopularBooks = () => ({
  type: ACTION_GET_POPULAR_BOOKS,
  payload: {},
});

export const actionGetBestSellersBook = () => ({
  type: ACTION_GET_BEST_SELLERS_BOOK,
  payload: {},
});

export const actionGetSomeAuthors = ({ take = 6 }) => ({
  type: ACTION_GET_SOME_AUTHORS,
  payload: { take },
});

export const actionGetRamdomTags = () => ({
  type: ACTION_GET_RAMDOM_TAGS,
  payload: {},
});

export const actionSearchBook = ({
  page = 0,
  take = 0,
  name = undefined,
  minPrice = 0,
  maxPrice = 1000000000,
  isDiscounting = undefined,
  categoryIds = undefined,
  authorIds = undefined,
  sortBy = 0,
}) => ({
  type: ACTION_SEARCH_BOOK,
  payload: { page, take, name, minPrice, maxPrice, isDiscounting, categoryIds, authorIds, sortBy },
});

export const actionGetBook = ({ id }) => ({
  type: ACTION_GET_BOOK,
  payload: { id },
});

export const actionGetComment = ({ bookId, page, take }) => ({
  type: ACTION_GET_COMMENT,
  payload: { bookId, page, take },
});

export const actionPostComment = ({ name, phone, email, rate, bookId, content }) => ({
  type: ACTION_POST_COMMENT,
  payload: { name, phone, email, rate, bookId, content },
});

export const actionGetRecommendBooks = ({ id = undefined, take = 6 }) => ({
  type: ACTION_GET_RECOMMEND_BOOKS,
  payload: { id, take },
});

export const actionGetPage = ({ path }) => ({
  type: ACTION_GET_PAGE,
  payload: { path },
});
