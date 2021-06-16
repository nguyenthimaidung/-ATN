export const ACTION_SIGN_IN = 'ACTION_SIGN_IN';
export const ACTION_SIGN_OUT = 'ACTION_SIGN_OUT';
export const ACTION_SIGN_UP = 'ACTION_SIGN_UP';

export const ACTION_UPLOAD_AVATAR = 'ACTION_UPLOAD_AVATAR';
export const ACTION_GET_PROFILE = 'ACTION_GET_PROFILE';
export const ACTION_UPDATE_PROFILE = 'ACTION_UPDATE_PROFILE';

export const ACTION_SET_TAKE = 'ACTION_SET_TAKE';

export const ACTION_GET_DATA_ACCOUNT = 'ACTION_GET_DATA_ACCOUNT';
export const ACTION_UPDATE_ACCOUNT = 'ACTION_UPDATE_ACCOUNT';

export const ACTION_GET_PROFILE_USER = 'ACTION_GET_PROFILE_USER';

export const ACTION_GET_DATA_CATEGORY = 'ACTION_GET_DATA_CATEGORY';
export const ACTION_POST_CATEGORY = 'ACTION_POST_CATEGORY';
export const ACTION_PUT_CATEGORY = 'ACTION_PUT_CATEGORY';
export const ACTION_DEL_CATEGORY = 'ACTION_DEL_CATEGORY';

export const ACTION_GET_DATA_ORDER = 'ACTION_GET_DATA_ORDER';
export const ACTION_SET_ORDER = 'ACTION_SET_ORDER';
export const ACTION_PUT_ORDER = 'ACTION_PUT_ORDER';

export const ACTION_GET_DATA_AUTHOR = 'ACTION_GET_DATA_AUTHOR';
export const ACTION_POST_AUTHOR = 'ACTION_POST_AUTHOR';
export const ACTION_PUT_AUTHOR = 'ACTION_PUT_AUTHOR';
export const ACTION_DEL_AUTHOR = 'ACTION_DEL_AUTHOR';

export const ACTION_GET_DATA_BOOK = 'ACTION_GET_DATA_BOOK';
export const ACTION_GET_BOOKS = 'ACTION_GET_BOOKS';
export const ACTION_GET_ALL_DATA_BOOK = 'ACTION_GET_ALL_DATA_BOOK';
export const ACTION_POST_BOOK = 'ACTION_POST_BOOK';
export const ACTION_PUT_BOOK = 'ACTION_PUT_BOOK';
export const ACTION_DEL_BOOK = 'ACTION_DEL_BOOK';
export const ACTION_UPDATE_QUANTITY_BOOKS = 'ACTION_UPDATE_QUANTITY_BOOKS';

export const ACTION_GET_PAGE = 'ACTION_GET_PAGE';
export const ACTION_PATCH_PAGE = 'ACTION_PATCH_PAGE';

export const ACTION_GET_STATISTICS = 'ACTION_GET_STATISTICS';
export const ACTION_GET_STATISTICS_REVENUE = 'ACTION_GET_STATISTICS_REVENUE';

export const actionSignIn = ({ email, password }) => ({
  type: ACTION_SIGN_IN,
  payload: { email, password },
});

export const actionSignUp = ({ name, email, password }) => ({
  type: ACTION_SIGN_UP,
  payload: { name, email, password },
});

export const actionSignOut = () => ({
  type: ACTION_SIGN_OUT,
  payload: {},
});

export const actionGetProfile = () => ({
  type: ACTION_GET_PROFILE,
  payload: {},
});

export const actionUpdateProfile = ({ name, phone, address }) => ({
  type: ACTION_UPDATE_PROFILE,
  payload: { name, phone, address },
});

export const actionGetProfileUser = ({ id }) => ({
  type: ACTION_GET_PROFILE_USER,
  payload: { id },
});

export const actionUploadAvatar = ({ file }) => ({
  type: ACTION_UPLOAD_AVATAR,
  payload: { file },
});

export const actionSetTake = ({ take }) => ({
  type: ACTION_SET_TAKE,
  payload: { take },
});

export const actionGetAccounts = ({ page, take, id, search, type, state }) => ({
  type: ACTION_GET_DATA_ACCOUNT,
  payload: { page, take, id, search, type, state },
});

export const actionGetCategories = () => ({
  type: ACTION_GET_DATA_CATEGORY,
  payload: {},
});

export const actionPostCategory = ({ name, parentId = null }) => ({
  type: ACTION_POST_CATEGORY,
  payload: { name, parentId },
});

export const actionPutCategory = ({ id, name, parentId = null }) => ({
  type: ACTION_PUT_CATEGORY,
  payload: { id, name, parentId },
});

export const actionDelCategory = ({ id }) => ({
  type: ACTION_DEL_CATEGORY,
  payload: { id },
});

export const actionGetAllBook = () => ({
  type: ACTION_GET_ALL_DATA_BOOK,
  payload: {},
});

export const actionGetBooks = ({
  page,
  take,
  search,
  minPrice,
  maxPrice,
  isDiscounting,
  categoryIds,
  authorIds,
  sortBy,
}) => ({
  type: ACTION_GET_DATA_BOOK,
  payload: { page, take, search, minPrice, maxPrice, isDiscounting, categoryIds, authorIds, sortBy },
});

export const actionGetBookIds = ({ ids = [] }) => ({
  type: ACTION_GET_BOOKS,
  payload: { ids },
});

export const actionPostBook = ({
  thumbImg1,
  thumbImg2,
  thumbImg3,
  thumbImg4,
  thumbImg5,
  coverImage,
  isbn,
  name,
  shortDescription,
  description,
  quantity,
  price,
  discount,
  discountBegin,
  discountEnd,
  categoryIds,
  authorIds,
}) => ({
  type: ACTION_POST_BOOK,
  payload: {
    thumbImg1,
    thumbImg2,
    thumbImg3,
    thumbImg4,
    thumbImg5,
    coverImage,
    isbn,
    name,
    shortDescription,
    description,
    quantity,
    price,
    discount,
    discountBegin,
    discountEnd,
    categoryIds,
    authorIds,
  },
});

export const actionUpdateQuantityBooks = ({ updates = [] }) => ({
  type: ACTION_UPDATE_QUANTITY_BOOKS,
  payload: { updates },
});

export const actionPutBook = ({
  id,
  thumbImg1,
  thumbImg2,
  thumbImg3,
  thumbImg4,
  thumbImg5,
  coverImage,
  isbn,
  name,
  shortDescription,
  description,
  quantity,
  price,
  discount,
  discountBegin,
  discountEnd,
  categoryIds,
  authorIds,
}) => ({
  type: ACTION_PUT_BOOK,
  payload: {
    id,
    thumbImg1,
    thumbImg2,
    thumbImg3,
    thumbImg4,
    thumbImg5,
    coverImage,
    isbn,
    name,
    shortDescription,
    description,
    quantity,
    price,
    discount,
    discountBegin,
    discountEnd,
    categoryIds,
    authorIds,
  },
});

export const actionDelBook = ({ id }) => ({
  type: ACTION_DEL_BOOK,
  payload: { id },
});

export const actionGetAuthors = ({ page, take, search }) => ({
  type: ACTION_GET_DATA_AUTHOR,
  payload: { page, take, search },
});

export const actionPostAuthor = ({ name, avatar, address, shortDescription, description, birth, gender }) => ({
  type: ACTION_POST_AUTHOR,
  payload: { name, avatar, address, shortDescription, description, birth, gender },
});

export const actionPutAuthor = ({ id, name, avatar, address, shortDescription, description, birth, gender }) => ({
  type: ACTION_PUT_AUTHOR,
  payload: { id, name, avatar, address, shortDescription, description, birth, gender },
});

export const actionDelAuthor = ({ id }) => ({
  type: ACTION_DEL_AUTHOR,
  payload: { id },
});

export const actionGetOrders = ({ page, take, userId, search, fromDate, toDate, state, payState, payType }) => ({
  type: ACTION_GET_DATA_ORDER,
  payload: { page, take, userId, search, fromDate, toDate, state, payState, payType },
});

export const actionSetOrder = ({ order }) => ({
  type: ACTION_SET_ORDER,
  payload: order,
});

export const actionPutOrder = ({ id, state, payState, payType, name, phone, email, address, note }) => ({
  type: ACTION_PUT_ORDER,
  payload: { id, state, payState, payType, name, phone, email, address, note },
});

export const actionGetPage = ({ path }) => ({
  type: ACTION_GET_PAGE,
  payload: { path },
});

export const actionPatchPage = ({ path, content }) => ({
  type: ACTION_PATCH_PAGE,
  payload: { path, content },
});

export const actionGetStatistics = () => ({
  type: ACTION_GET_STATISTICS,
  payload: {},
});

export const actionGetStatisticsRevenue = ({ fromDate, toDate, timeType }) => ({
  type: ACTION_GET_STATISTICS_REVENUE,
  payload: { fromDate, toDate, timeType },
});
