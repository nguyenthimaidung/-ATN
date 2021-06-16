import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import './BestSellingBook.css';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { actionGetBestSellersBook } from '../../datas/redux/SysAction';
import { actionAddToCart } from '../../datas/redux/UserAction';
import { formatPrice, prepareImgUrl } from '../../utils/Util';
import { getDiscountBook } from '../../utils/BookUtil';
import { RouterUrl } from '../../Constant';

class BestSellingBookComponent extends React.Component {
  componentDidMount() {
    const { actionGetBestSellersBook } = this.props;
    actionGetBestSellersBook();
  }

  addToCart = (bookId) => () => {
    const { actionAddToCart } = this.props;
    actionAddToCart({ bookId });
  };

  render() {
    const { bestSellerBooks, cart, cartLoadingId } = this.props;
    const detail = (cart && cart.detail) || [];
    const book = bestSellerBooks && bestSellerBooks[0];
    const isInCart = book && detail && detail.find((item) => item.bookId === book.id);
    const discount = getDiscountBook(book);

    return (
      <React.Fragment>
        <MDBContainer className='best-selling-book-container widget-banner-product'>
          <MDBRow>
            <MDBCol className='col-lg-2/5' md='12'>
              <h3 className='title-banner'>Sách bán chạy nhất</h3>
              <div className='products-content'>
                {book && (
                  <React.Fragment>
                    <h3 className='product-title'>
                      <Link to={RouterUrl.productDetail(book.id)}>{book.name}</Link>
                    </h3>
                    <div className='list-author'>
                      by{' '}
                      <span className='item-author'>
                        <a href='#!'>{book.authors && book.authors[0] && book.authors[0].name}</a>
                      </span>
                    </div>
                    <div className='product-price'>
                      <span className='currency-price'>
                        {discount !== 0 && <span className='discount-price'>{formatPrice(book.price)}</span>}
                        {formatPrice(book.price - discount)}
                      </span>
                    </div>
                    <div className='product-description'>{book.shortDescription}</div>
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
                  </React.Fragment>
                )}
              </div>
            </MDBCol>
            <MDBCol className='col-lg-3/5' md='12'>
              {book && (
                <a href='#!'>
                  <img src={prepareImgUrl(book.coverImage)} alt='' />
                </a>
              )}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (State) => {
  const { bestSellerBooks } = State.SysReducer || {};
  const { token, cart, cartLoadingId } = State.UserReducer || {};
  return { token, bestSellerBooks, cart, cartLoadingId };
};
export const BestSellingBook = connect(mapStateToProps, {
  actionGetBestSellersBook,
  actionAddToCart,
})(withRouter(BestSellingBookComponent));
