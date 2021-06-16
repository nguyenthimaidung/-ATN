export const BaseURL = 'http://35.201.214.61:8080'; //'http://35.234.8.134:8080'; //'http://localhost:4000'; //
export const ImageURL = 'http://35.201.214.61:5555'; //'http://35.234.8.134:5555'; //'http://localhost:4000'; //

export const RouterUrl = {
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  HOME: '/home',
  CATEGORY: '/home/product/category',
  PRODUCT_DETAIL: '/home/product/detail',
  productDetail: (id) => `/home/product/detail?id=${id}`,
  WISHLIST: '/home/wishlist',
  CART: '/home/cart',
  CHECKOUT: '/home/cart/checkout',
  ORDER: '/home/order',
  PAYMENT_RETURN_URL: '/home/order/payment',
  INTRODUCE: '/about/introduce',
  PRIVACY: '/about/policy/privacy',
  DELIVERY: '/about/policy/delivery',
  PAYMENT: '/about/payment',
  RETURN_CHANGE: '/policy/return-change',
  GUIDE: '/about/guide',
  CONTACT: '/about/contact',
};

// 'https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png'
export const DEFAULT_AVATAR =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKQqyHXqBbyhS2IlebguQzlBJ3zYxsZG3KA&usqp=CAU';

export const PaymentType = {
  CASH: 0,
  ONLINE: 1,
};

export const PaymentTypeMap = {
  [PaymentType.CASH]: 'Tiền mặt',
  [PaymentType.ONLINE]: 'Online',
};

export const PaymentState = {
  NONE: 0,
  PAID: 1,
  REFUND: 2,
};

export const PaymentStateMap = {
  [PaymentState.NONE]: 'Chưa thanh toán',
  [PaymentState.PAID]: 'Đã thanh toán',
  [PaymentState.REFUND]: 'Đã hoàn trả',
};

export const OrderState = {
  DRAFT: 0,
  CREATE: 1,
  CONFIRMED: 2,
  SHIPPING: 3,
  DONE: 4,
  DROP: 101,
};

export const OrderStateMap = {
  [OrderState.DROP]: 'Đã hủy',
  [OrderState.DRAFT]: 0,
  [OrderState.CREATE]: 'Đã đặt',
  [OrderState.CONFIRMED]: 'Đã xác nhận',
  [OrderState.SHIPPING]: 'Đang giao hàng',
  [OrderState.DONE]: 'Hoàn thành',
};
