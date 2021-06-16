import { MDBBtn, MDBCol, MDBContainer, MDBNotification, MDBRow, toast } from 'mdbreact';
import React from 'react';
import './PopularBook.css';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { actionGetPopularBooks } from '../../datas/redux/SysAction';
import { actionToggleWishlistItem, actionAddToCart } from '../../datas/redux/UserAction';
import { RouterUrl } from '../../Constant';
import { formatPrice, prepareImgUrl } from '../../utils/Util';
import { getDiscountBook } from '../../utils/BookUtil';

class PopularBookComponent extends React.Component {
  componentDidMount() {
    const { actionGetPopularBooks } = this.props;
    actionGetPopularBooks();
  }

  toggleWishlistItem = (bookId) => () => {
    const { token, actionToggleWishlistItem } = this.props;
    if (!token) {
      toast.info(
        <MDBNotification
          iconClassName='deep-orange-text'
          icon='bell'
          show
          fade
          title='CHÀO BẠN'
          message='Vui lòng đăng nhập để thêm sản phầm vào danh sách của bạn.'
          text='just now'
        />,
        {
          closeButton: false,
        }
      );
    } else {
      actionToggleWishlistItem({ bookId });
    }
  };

  addToCart = (bookId) => () => {
    const { actionAddToCart } = this.props;
    actionAddToCart({ bookId });
  };

  render() {
    const { cart, wishlist, popularBooks, wishlistLoadingId, cartLoadingId } = this.props;
    const detail = (cart && cart.detail) || [];

    return (
      <React.Fragment>
        <MDBContainer className='popular-container rgba-grey-slight'>
          <div className='popular-title'>
            <h2>Sách Phổ Biến</h2>
          </div>
          <div className='popular-content'>
            <div className='popular-product-view'>
              <MDBRow>
                {popularBooks &&
                  popularBooks.length > 0 &&
                  popularBooks.map((book) => {
                    const isInWishlist = wishlist && wishlist.find((item) => item.id === book.id);
                    const isInCart = detail && detail.find((item) => item.bookId === book.id);
                    const discount = getDiscountBook(book);
                    return (
                      <MDBCol key={`popular_book_${book.id}`} sm='12' md='6' lg='6' xl='4'>
                        <div className='item-product'>
                          <div className='products-entry clearfix product-wapper'>
                            <div className='products-thumb'>
                              <div className='product-thumb-hover'>
                                <a href='#!'>
                                  <img
                                    width='720'
                                    height='1040'
                                    src={prepareImgUrl(book.thumbImg1)}
                                    className='main-image'
                                    alt=''
                                  />
                                  <img
                                    width='720'
                                    height='1040'
                                    src={prepareImgUrl(book.thumbImg2 || book.thumbImg1)}
                                    className='hover-image back'
                                    alt=''
                                  />
                                </a>
                              </div>
                              <div className='product-button'>
                                {/* <div className='product-quickview' /> */}
                                <div
                                  onClick={this.toggleWishlistItem(book.id)}
                                  className={`product-add-to-wishlist ${
                                    wishlistLoadingId === book.id ? 'loading' : ''
                                  } ${isInWishlist ? 'added' : ''}`}
                                />
                              </div>
                            </div>
                            <div className='products-content'>
                              <h3 className='product-title'>
                                <Link to={RouterUrl.productDetail(book.id)}>{book.name}</Link>
                              </h3>
                              <div className='list-author'>
                                by{' '}
                                <span className='item-author'>
                                  <a href='#!'>{book.authors && book.authors[0] && book.authors[0].name}</a>
                                </span>
                              </div>
                              {book.rateAvg !== null && (
                                <div className='rating'>
                                  <div className='star-rating'>
                                    <span style={{ width: `${Math.floor(book.rateAvg * 20)}%` }} />
                                  </div>
                                </div>
                              )}
                              <span className='price'>
                                <span className='currency-price'>
                                  {discount !== 0 && <span className='discount-price'>{formatPrice(book.price)}</span>}
                                  {formatPrice(book.price - discount)}
                                </span>
                              </span>
                              <div className='product-button'>
                                <MDBBtn
                                  onClick={this.addToCart(book.id)}
                                  disabled={
                                    book.quantity === 0 ||
                                    cartLoadingId === book.id ||
                                    (isInCart && isInCart.quantity >= book.quantity)
                                  }
                                  className='button-default product_add_to_cart'
                                >
                                  <div className={`button-container ${cartLoadingId === book.id ? 'doing' : ''}`}>
                                    <span className='text-content'>{isInCart ? 'Đã thêm' : 'Thêm Vào Giỏ'}</span>
                                    <span className='loading' />
                                  </div>
                                </MDBBtn>
                              </div>
                            </div>
                          </div>
                        </div>
                      </MDBCol>
                    );
                  })}
              </MDBRow>
            </div>
          </div>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (State) => {
  const { popularBooks } = State.SysReducer || {};
  const { token, cart, wishlist, wishlistLoadingId, cartLoadingId } = State.UserReducer || {};
  return { token, cart, wishlist, popularBooks, wishlistLoadingId, cartLoadingId };
};
export const PopularBook = connect(mapStateToProps, {
  actionGetPopularBooks,
  actionAddToCart,
  actionToggleWishlistItem,
})(withRouter(PopularBookComponent));
