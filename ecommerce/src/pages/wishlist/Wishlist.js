import React from 'react';
import { Breadcrumb } from '../Breadcrumb';
import { MDBContainer, MDBTooltip, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdbreact';
import './Wishlist.css';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { actionAddToCart, actionGetWishlist, actionPutWishlist } from '../../datas/redux/UserAction';
import { Link } from 'react-router-dom';
import { RouterUrl } from '../../Constant';
import { getDiscountBook } from '../../utils/BookUtil';
import { formatPrice, prepareImgUrl } from '../../utils/Util';

export class WishlistComponent extends React.Component {
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
        label: <span>TRẠNG THÁI</span>,
        field: 'qty',
      },
      {
        label: '',
        field: 'addTocart',
      },
    ],
  };

  componentDidMount() {
    const { actionGetWishlist } = this.props;
    actionGetWishlist();
  }

  removeItem = (bookId) => () => {
    const { wishlist = [], actionPutWishlist } = this.props;
    actionPutWishlist({ bookIds: wishlist.filter((item) => item.id !== bookId).map((item) => ({ id: item.id })) });
  };

  addTocart = (bookId) => () => {
    const { actionAddToCart } = this.props;
    actionAddToCart({ bookId });
  };

  render() {
    const rows = [];
    const { columns } = this.state;
    const { token, wishlist } = this.props;

    wishlist.map((row) => {
      const discount = getDiscountBook(row);
      return rows.push({
        button: (
          <MDBTooltip placement='top'>
            <MDBBtn onClick={this.removeItem(row.id)} flat>
              X
            </MDBBtn>
            <span>Remove item</span>
          </MDBTooltip>
        ),
        img: (
          <Link to={RouterUrl.productDetail(row.id)} className='d-inline-block'>
            <img src={prepareImgUrl(row.thumbImg1)} alt='' className='img-fluid z-depth-0' />
          </Link>
        ),
        product: [
          <Link to={RouterUrl.productDetail(row.id)} className='mt-3' key={new Date().getDate + 1}>
            <strong>{row.name}</strong>
          </Link>,
        ],
        // color: row.color,
        price: `${formatPrice(row.price - discount)}`,
        qty:
          row.quantity > 0 ? (
            <span className='wishlist-in-stock'>Còn hàng</span>
          ) : (
            <span className='wishlist-out-of-stock'>Hết hàng</span>
          ),
        // amount: <strong>${row.qty * row.price}</strong>,
        addTocart:
          row.quantity > 0 ? (
            <MDBTooltip placement='top'>
              <MDBBtn onClick={this.addTocart(row.id)} className='button-default'>
                THÊM VÀO GIỎ
              </MDBBtn>
              <span>Add to cart</span>
            </MDBTooltip>
          ) : (
            ''
          ),
      });
    });
    if (rows.length === 0) {
      rows.push({
        button: token ? (
          <span>
            Bạn chưa thêm sản phầm nào.{' '}
            <Link to={RouterUrl.CATEGORY} style={{ color: '#f86d72' }}>
              Shop now!
            </Link>
          </span>
        ) : (
          <span>
            Vui lòng đăng nhập để thêm sản phầm vào danh sách của bạn.{' '}
            <Link to={RouterUrl.SIGN_IN} style={{ color: '#f86d72' }}>
              Đăng nhập!
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
          <MDBTable className='product-table'>
            <MDBTableHead className='font-weight-bold' color='grey lighten-4' columns={columns} />
            <MDBTableBody rows={rows} />
          </MDBTable>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { token, wishlist } = state.UserReducer || {};
  return { token, wishlist };
};
export const Wishlist = connect(mapStateToProps, {
  actionGetWishlist,
  actionPutWishlist,
  actionAddToCart,
})(withRouter(WishlistComponent));
