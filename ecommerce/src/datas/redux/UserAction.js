export const ACTION_SIGN_IN = 'ACTION_SIGN_IN';
export const ACTION_VERIFY_CODE = 'ACTION_VERIFY_CODE';
export const ACTION_RESEND_VERIFY_CODE = 'ACTION_RESEND_VERIFY_CODE';
export const ACTION_SIGN_OUT = 'ACTION_SIGN_OUT';
export const ACTION_SIGN_UP = 'ACTION_SIGN_UP';

export const ACTION_GET_WISHLIST = 'ACTION_GET_WISHLIST';
export const ACTION_PUT_WISHLIST = 'ACTION_PUT_WISHLIST';
export const ACTION_TOGGLE_WISHLIST_ITEM = 'ACTION_TOGGLE_WISHLIST_ITEM';

export const ACTION_GET_CART = 'ACTION_GET_CART';
export const ACTION_PUT_CART = 'ACTION_PUT_CART';
export const ACTION_ADD_TO_CART = 'ACTION_ADD_TO_CART';
export const ACTION_REMOVE_CART_ITEM = 'ACTION_REMOVE_CART_ITEM';

export const ACTION_UPLOAD_AVATAR = 'ACTION_UPLOAD_AVATAR';
export const ACTION_GET_PROFILE = 'ACTION_GET_PROFILE';
export const ACTION_UPDATE_PROFILE = 'ACTION_UPDATE_PROFILE';

export const ACTION_DRAFT_ORDER = 'ACTION_DRAFT_ORDER';
export const ACTION_RESEND_VERIFY_ORDER = 'ACTION_RESEND_VERIFY_ORDER';
export const ACTION_CONFIRM_CREATE_ORDER = 'ACTION_CONFIRM_CREATE_ORDER';
export const ACTION_COMPLETE_CHECKOUT = 'ACTION_COMPLETE_CHECKOUT';
export const ACTION_CHECK_PAYMENT_RETURNURL = 'ACTION_CHECK_PAYMENT_RETURNURL';

export const ACTION_GET_ORDERS = 'ACTION_GET_ORDERS';
export const ACTION_GET_ORDER = 'ACTION_GET_ORDER';
export const ACTION_DROP_ORDER = 'ACTION_DROP_ORDER';

export const actionSignIn = ({ email, password }) => ({
  type: ACTION_SIGN_IN,
  payload: { email, password },
});

export const actionVerifyCode = ({ accountId, verifyCode }) => ({
  type: ACTION_VERIFY_CODE,
  payload: { accountId, verifyCode },
});

export const actionResendVerifyCode = ({ accountId }) => ({
  type: ACTION_RESEND_VERIFY_CODE,
  payload: { accountId },
});

export const actionSignUp = ({ name, email, password }) => ({
  type: ACTION_SIGN_UP,
  payload: { name, email, password },
});

export const actionSignOut = () => ({
  type: ACTION_SIGN_OUT,
  payload: {},
});

export const actionGetWishlist = () => ({
  type: ACTION_GET_WISHLIST,
  payload: {},
});

export const actionPutWishlist = ({ bookIds = [] }) => ({
  type: ACTION_PUT_WISHLIST,
  payload: { bookIds },
});

export const actionToggleWishlistItem = ({ bookId }) => ({
  type: ACTION_TOGGLE_WISHLIST_ITEM,
  payload: { bookId },
});

export const actionGetCart = () => ({
  type: ACTION_GET_CART,
  payload: {},
});

export const actionPutCart = ({ details = [] }) => ({
  type: ACTION_PUT_CART,
  payload: { details },
});

export const actionAddToCart = ({ bookId }) => ({
  type: ACTION_ADD_TO_CART,
  payload: { bookId },
});

export const actionRemoveCartItem = ({ bookId }) => ({
  type: ACTION_REMOVE_CART_ITEM,
  payload: { bookId },
});

export const actionGetProfile = () => ({
  type: ACTION_GET_PROFILE,
  payload: {},
});

export const actionUpdateProfile = ({ name, phone, address }) => ({
  type: ACTION_UPDATE_PROFILE,
  payload: { name, phone, address },
});

export const actionUploadAvatar = ({ file }) => ({
  type: ACTION_UPLOAD_AVATAR,
  payload: { file },
});

export const actiondraftOrder = ({
  payType = 0,
  details = [{ bookId: 0, quantity: 0 }],
  id = undefined,
  name = undefined,
  phone = undefined,
  email = undefined,
  address = undefined,
  note = undefined,
}) => ({
  type: ACTION_DRAFT_ORDER,
  payload: { details, id, payType, name, phone, email, address, note },
});

export const actionResendVerifyOrder = ({ orderId }) => ({
  type: ACTION_RESEND_VERIFY_ORDER,
  payload: { orderId },
});

export const actionConfirmCreateOrder = ({ orderId, verifyCode }) => ({
  type: ACTION_CONFIRM_CREATE_ORDER,
  payload: { orderId, verifyCode },
});

export const actionCompleteCheckout = () => ({
  type: ACTION_COMPLETE_CHECKOUT,
  payload: {},
});

export const actionCheckPaymentReturnUrl = ({ query }) => ({
  type: ACTION_CHECK_PAYMENT_RETURNURL,
  payload: { query },
});

export const actionGetOrders = ({ page, take }) => ({
  type: ACTION_GET_ORDERS,
  payload: { page, take },
});

export const actionGetOrder = ({ id, email, phone }) => ({
  type: ACTION_GET_ORDER,
  payload: { id, email, phone },
});

export const actionDropOrder = ({ id, email, phone }) => ({
  type: ACTION_DROP_ORDER,
  payload: { id, email, phone },
});
