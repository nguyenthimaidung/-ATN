export const BaseURL = 'http://35.201.214.61:8080'; //'http://35.234.8.134:8080'; //'http://localhost:4000'; //

export const RouterUrl = {
  SIGN_IN: '/signin',
  HOME: '/data/dashboard',
  DASHBOARD: '/data/dashboard',
  ORDER: '/data/order',
  ACCOUNT: '/data/account',
  BOOK: '/data/book',
  IMPORT_BOOK: '/data/import/book',
  CATEGORY: '/data/category',
  AUTHOR: '/data/author',
  SALE: '/data/sale',
  STATISTIC_SOLD: '/data/statistic/sold',
  INTRODUCE: '/about/introduce',
  PRIVACY: '/about/policy/privacy',
  DELIVERY: '/about/policy/delivery',
  PAYMENT: '/about/payment',
  RETURN_CHANGE: '/policy/return-change',
  GUIDE: '/about/guide',
  CONTACT: '/about/contact',
};

export const backgroundColors = [
  'rgba(3, 169, 244, 0.3)',
  'rgba(244, 67, 54, 0.3)',
  'rgba(233, 30, 99, 0.3)',
  'rgba(156, 39, 176, 0.3)',
  'rgba(63, 81, 181, 0.3)',
  'rgba(0, 188, 212, 0.3)',
  'rgba(0, 150, 136, 0.3)',
  'rgba(76, 175, 80, 0.3)',
  'rgba(205, 220, 57, 0.3)',
  'rgba(255, 235, 59, 0.3)',
  'rgba(255, 152, 0, 0.3)',
  'rgba(121, 85, 72, 0.3)',
  // 'rgba(255, 99, 132, 0.2)',
  // 'rgba(54, 162, 235, 0.2)',
  // 'rgba(255, 206, 86, 0.2)',
  // 'rgba(75, 192, 192, 0.2)',
  // 'rgba(153, 102, 255, 0.2)',
];

export const borderColors = [
  'rgba(3, 169, 244, 0.7)',
  'rgba(244, 67, 54, 0.7)',
  'rgba(233, 30, 99, 0.7)',
  'rgba(156, 39, 176, 0.7)',
  'rgba(63, 81, 181, 0.7)',
  'rgba(0, 188, 212, 0.7)',
  'rgba(0, 150, 136, 0.7)',
  'rgba(76, 175, 80, 0.7)',
  'rgba(205, 220, 57, 0.7)',
  'rgba(255, 235, 59, 0.7)',
  'rgba(255, 152, 0, 0.7)',
  'rgba(121, 85, 72, 0.7)',
  // 'rgba(255,99,132,1)',
  // 'rgba(54, 162, 235, 1)',
  // 'rgba(255, 206, 86, 1)',
  // 'rgba(75, 192, 192, 1)',
  // 'rgba(153, 102, 255, 1)',
];

export const CkFinderUrl = 'http://35.201.214.61:5555'; //'http://35.234.8.134:5555'; //'http://localhost:8080'; //

export const editorConfiguration = {
  // table: {
  //   contentToolbar: [
  //     'tableColumn',
  //     'tableRow',
  //     'mergeTableCells',
  //     'tableProperties',
  //     'tableCellProperties'
  //   ]
  // }
  ckfinder: {
    // Upload the images to the server using the CKFinder QuickUpload command.

    uploadUrl: `${CkFinderUrl}/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json`,

    // Define the CKFinder configuration (if necessary).
    options: {
      resourceType: 'Images',
      filebrowserBrowseUrl: '/ckfinder/ckfinder.html',
      filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
      filebrowserUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
      filebrowserImageUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
    },
    filebrowserBrowseUrl: '/ckfinder/ckfinder.html',
    filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html?type=Images',
    filebrowserUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
    filebrowserImageUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',

    openerMethod: 'popup',
  },
};

// 'https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png'
export const DEFAULT_AVATAR =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrKQqyHXqBbyhS2IlebguQzlBJ3zYxsZG3KA&usqp=CAU';

export const Actions = {
  LIST: 'LIST',
  VIEW: 'VIEW',
  ADD: 'ADD',
  EDIT: 'EDIT',
  DEL: 'DEL',
};

export const PaymentType = {
  CASH: 0,
  ONLINE: 1,
};

export const PaymentState = {
  NONE: 0,
  PAID: 1,
  REFUND: 2,
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
