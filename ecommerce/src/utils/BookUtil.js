export function getDiscountBook(book) {
  if (!book) {
    return 0;
  }
  let discount = 0;
  if (book.discount && book.discountBegin && book.discountEnd) {
    const beginDate = new Date(book.discountBegin);
    const endDate = new Date(book.discountEnd);
    if (Date.now() >= beginDate.getTime() && Date.now() <= endDate.getTime()) {
      discount = book.discount;
    }
  }
  return discount;
}
