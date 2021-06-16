import { MDBBtn, MDBCol, MDBIcon, MDBRow, MDBDropdownItem } from 'mdbreact';
import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import './CartPopup.css';
import { Navigate } from '../../utils/Navigate';
import { RouterUrl } from '../../Constant';
import { connect } from 'react-redux';
import { actionRemoveCartItem } from '../../datas/redux/UserAction';
import { getDiscountBook } from '../../utils/BookUtil';
import { formatPrice, prepareImgUrl } from '../../utils/Util';

class CartQuickViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.gotoCart = Navigate.goTo(RouterUrl.CART).bind(this);
    this.gotoCheckout = Navigate.goTo(RouterUrl.CHECKOUT).bind(this);
  }

  removeCartItem = (bookId) => () => {
    const { actionRemoveCartItem } = this.props;
    actionRemoveCartItem({ bookId });
  };

  renderProduct(products) {
    return products.map((row) => {
      const { bookId, quantity } = row;
      const { thumbImg1, name, price } = row.book || {};
      const discount = getDiscountBook(row.book);

      return (
        <div key={`cart_popup_${bookId}`} className='d-flex'>
          <Link to={RouterUrl.productDetail(bookId)} className='product-img'>
            <img width='720' height='1040' src={prepareImgUrl(thumbImg1)} className='main-image' alt='' />
          </Link>
          <div className='flex-fill product-name'>
            <Link to={RouterUrl.productDetail(bookId)}>{name}</Link>
            <div className='product-price'>
              {quantity} x <span>{formatPrice(price - discount)}</span>
            </div>
          </div>
          <div className='d-flex'>
            <MDBBtn onClick={this.removeCartItem(bookId)} flat className='button-remove'>
              <MDBIcon far icon='trash-alt' />
            </MDBBtn>
          </div>
        </div>
      );
    });
  }

  render() {
    const { cart } = this.props;
    const data = (cart && cart.detail) || [];
    return (
      <React.Fragment>
        <div className='cart-quick-view'>
          <div className='scrollbar cart-quick-view-content'>{this.renderProduct(data)}</div>
          <div className='cart-quick-view-bottom'>
            <div className='d-flex total-price'>
              <div>TỔNG TIỀN</div>
              <div>{formatPrice(cart && cart.total)}</div>
            </div>
            <MDBRow>
              <MDBCol>
                <MDBDropdownItem tag='div' className='dropdown-item-block bg-transparent'>
                  <MDBBtn className='button-default w-100' style={{ height: 40 }} onClick={this.gotoCart}>
                    GIỎ HÀNG
                  </MDBBtn>
                </MDBDropdownItem>
              </MDBCol>
              <MDBCol>
                <MDBDropdownItem tag='div' className='dropdown-item-block bg-transparent'>
                  <MDBBtn
                    disabled={data.length === 0}
                    className='button-default w-100'
                    style={{ height: 40 }}
                    onClick={this.gotoCheckout}
                  >
                    THANH TOÁN
                  </MDBBtn>
                </MDBDropdownItem>
              </MDBCol>
            </MDBRow>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { cart } = state.UserReducer || {};
  return { cart };
};
export const CartQuickView = connect(mapStateToProps, {
  actionRemoveCartItem,
})(withRouter(CartQuickViewComponent));
