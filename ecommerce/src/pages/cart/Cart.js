import React from 'react';
import { Breadcrumb } from '../Breadcrumb';
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
  MDBTooltip,
  MDBBtn,
  MDBRow,
  MDBCol,
} from 'mdbreact';
import './Cart.css';
import { withRouter } from 'react-router';
import { Navigate } from '../../utils/Navigate';
import { RouterUrl } from '../../Constant';
import { connect } from 'react-redux';
import { actionGetCart, actionPutCart } from '../../datas/redux/UserAction';
import { Link } from 'react-router-dom';
import { getDiscountBook } from '../../utils/BookUtil';
import { formatPrice, prepareImgUrl } from '../../utils/Util';

class CartComponent extends React.Component {
  state = {
    columns: [
      {
        label: '',
        field: 'button',
      },
      {
        label: '',
        field: 'img',
      },
      {
        label: <span>TÊN SẢN PHẨM</span>,
        field: 'product',
      },
      {
        label: <span>ĐƠN VỊ</span>,
        field: 'price',
      },
      {
        label: <span>SỐ LƯỢNG</span>,
        field: 'qty',
      },
      {
        label: <span>THÀNH TIỀN</span>,
        field: 'subtotal',
      },
    ],
    data: undefined,
    isEdited: false,

    updateTimeouts: {},
  };

  constructor(props) {
    super(props);
    this.goToCheckout = Navigate.goTo(RouterUrl.CHECKOUT).bind(this);
  }

  getQuantity = (bookId) => {
    const { data } = this.state;
    const item = data.find((item) => item.bookId === bookId);
    return item && item.quantity;
  };

  updateQuantity = (bookId, maxValue) => (value) => {
    const { updateTimeouts, data } = this.state;
    const item = data.find((item) => item.bookId === bookId);
    item.quantity = value;
    this.setState({ data, isEdited: true });

    clearTimeout(updateTimeouts[bookId]);
    updateTimeouts[bookId] = setTimeout(() => {
      const { data } = this.state;
      const item = data.find((item) => item.bookId === bookId);
      item.quantity = +(value <= 0 ? 1 : value > maxValue ? maxValue : value);
      this.setState({ data, isEdited: true });
    }, 1000);
  };

  componentDidMount() {
    const { actionGetCart } = this.props;
    actionGetCart();
    this.resetCart();
  }

  updateCart = () => {
    const { data = [] } = this.state;
    const { actionPutCart } = this.props;
    actionPutCart({ details: data });
  };

  deleteBook = (bookId) => () => {
    const { data = [] } = this.state;
    this.setState({ data: data.filter((item) => item.bookId !== bookId), isEdited: true });
  };

  resetCart = () => {
    const { cart } = this.props;
    const data = (cart && cart.detail) || [];
    this.setState({
      data: data.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      })),
      isEdited: false,
    });
  };

  componentDidUpdate(prevProps) {
    const { cart } = this.props;
    if (prevProps.cart !== cart) {
      const data = (cart && cart.detail) || [];
      this.setState({
        data: data.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
        isEdited: false,
      });
    }
  }

  render() {
    const rows = [];
    const { columns, data = [], isEdited } = this.state;
    const { cart } = this.props;
    const { detail = [] } = cart || {};

    let total = 0;

    detail
      .filter((row) => data.find((item) => item.bookId === row.bookId))
      .map((row) => {
        const { thumbImg1, name, price, quantity: maxQuantity } = row.book || {};
        const quantity = this.getQuantity(row.bookId);
        const discount = getDiscountBook(row.book);

        const subTotal = (price - discount) * quantity;
        total += subTotal;
        return rows.push({
          button: (
            <MDBTooltip placement='top'>
              <MDBBtn onClick={this.deleteBook(row.bookId)} flat>
                X
              </MDBBtn>
              <span>Remove item</span>
            </MDBTooltip>
          ),
          img: (
            <Link to={RouterUrl.productDetail(row.bookId)} className='d-inline-block'>
              <img src={prepareImgUrl(thumbImg1)} alt='' className='img-fluid z-depth-0' />
            </Link>
          ),
          product: [
            <Link to={RouterUrl.productDetail(row.bookId)} className='mt-3' key={new Date().getDate + 1}>
              <strong>{name}</strong>
            </Link>,
          ],
          price: `${formatPrice(price - discount)}`,
          qty: (
            <MDBInput
              type='number'
              getValue={this.updateQuantity(row.bookId, maxQuantity)}
              value={quantity}
              className='form-control'
              style={{ width: '60px' }}
            />
          ),
          subtotal: <strong>{formatPrice(subTotal)}</strong>,
        });
      });
    if (rows.length > 0 || isEdited) {
      rows.push({
        button: (
          <React.Fragment>
            <MDBBtn disabled={!isEdited} onClick={this.updateCart} className='button-default'>
              CẬP NHẬT
            </MDBBtn>
            <MDBBtn disabled={!isEdited} onClick={this.resetCart} className='button-default ml-4'>
              KHÔI PHỤC
            </MDBBtn>
          </React.Fragment>
        ),
        colspan: 6,
      });
    }
    if (rows.length === 0) {
      rows.push({
        button: (
          <span>
            Bạn chưa thêm sản phầm nào.{' '}
            <Link to={RouterUrl.CATEGORY} style={{ color: '#f86d72' }}>
              Shop now!
            </Link>
          </span>
        ),
        colspan: 6,
      });
    }

    return (
      <React.Fragment>
        <Breadcrumb />
        <MDBContainer>
          <MDBRow className='cart-detail'>
            <MDBCol xl='8' md='12' xs='12'>
              <MDBTable className='product-table'>
                <MDBTableHead className='font-weight-bold' color='grey lighten-4' columns={columns} />
                <MDBTableBody rows={rows} />
              </MDBTable>
            </MDBCol>
            <MDBCol xl='4' md='12' xs='12'>
              <div className='cart-total'>
                <div className='grey lighten-4 cart-total-header'>TỔNG GIỎ HÀNG</div>
                <table cellSpacing='0'>
                  <tbody>
                    <tr className='cart-subtotal'>
                      <th>Sản phẩm</th>
                      <td>
                        <span>{formatPrice(total)}</span>
                      </td>
                    </tr>

                    <tr className='shipping'>
                      <th>Giao hàng</th>
                      <td>
                        <div>Miễn phí giao hàng</div>
                      </td>
                    </tr>

                    <tr className='order-total'>
                      <th>Tổng tiền</th>
                      <td>
                        <span className='price'>{formatPrice(total)}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <MDBBtn disabled={total === 0} onClick={this.goToCheckout} className='button-default w-100'>
                THANH TOÁN
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { cart } = state.UserReducer || {};
  return { cart };
};
export const Cart = connect(mapStateToProps, {
  actionGetCart,
  actionPutCart,
})(withRouter(CartComponent));
