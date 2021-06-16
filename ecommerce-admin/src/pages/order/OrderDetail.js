import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBRow,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
  MDBBtn,
  MDBBadge,
  MDBInput,
} from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { actionGetBookIds, actionGetProfileUser, actionPutOrder } from '../../datas/redux/AdminAction';
import { formatPrice, formatFullDate } from '../../utils/Util';
import './OrderDetail.css';
import { OrderState, OrderStateMap, PaymentState, PaymentType } from '../../Constant';

class OrderDetailComponent extends React.Component {
  state = {
    columns: [
      {
        label: '',
        field: 'img',
      },
      {
        label: <span>Sản phẩm</span>,
        field: 'product',
      },
      {
        label: <span>Đơn vị</span>,
        field: 'price',
      },
      {
        label: <span>Trong kho</span>,
        field: 'store',
      },
      {
        label: <span>Số lượng</span>,
        field: 'qty',
      },
      {
        label: <span>Thành tiền</span>,
        field: 'subtotal',
      },
    ],
    draftNote: '',
    bookDetails: {},
    profileUser: undefined,
    hasEdit: false,
  };

  constructor(props) {
    super(props);
    this.state.draftNote = props.order.note;
  }

  handleChangeValue = (name) => (value) => {
    this.setState({ [name]: value });
  };

  handleChangeValueEvent = (name) => (e) => {
    this.setState({ [name]: e.target.value });
  };

  actionBack = () => {
    this.props.onBack && this.props.onBack(this.state.hasEdit);
  };

  handleGetOrderDetails = () => {
    const { order } = this.props;
    this.props.actionGetBookIds({ ids: order.details.map((detail) => detail.bookId) });
    order.userId && this.props.actionGetProfileUser({ id: order.userId });
  };

  handleUpdateNote = () => {
    const { order } = this.props;
    this.props.actionPutOrder({
      id: order.id,
      note: this.state.draftNote,
    });
  };

  handleUpdateState = (state) => () => {
    const { order } = this.props;
    this.props.actionPutOrder({
      id: order.id,
      state: state,
    });
    this.setState({ hasEdit: true });
  };

  handleDrop = () => {
    const { order } = this.props;
    this.props.actionPutOrder({
      id: order.id,
      state: OrderState.DROP,
      payState: order.payState === PaymentState.PAID ? PaymentState.REFUND : order.payState,
    });
    this.setState({ hasEdit: true });
  };

  handleDone = () => {
    const { order } = this.props;
    this.props.actionPutOrder({
      id: order.id,
      state: OrderState.DONE,
      payState: PaymentState.PAID,
    });
    this.setState({ hasEdit: true });
  };

  componentDidMount() {
    this.handleGetOrderDetails();
  }

  componentDidUpdate(prevProps) {
    const { bookDetails, profileUser, order } = this.props;
    if (prevProps.bookDetails !== bookDetails) {
      this.setState({
        bookDetails: bookDetails.data.reduce((prev, detail) => {
          prev[detail.id] = detail;
          return prev;
        }, {}),
      });
    }
    if (prevProps.profileUser !== profileUser) {
      this.setState({ profileUser: profileUser });
    }
    if (prevProps.order !== order) {
      this.setState({ draftNote: order.note });
    }
  }

  render() {
    const { columns, draftNote, bookDetails, profileUser } = this.state;
    const { order } = this.props;

    const rows = order.details.map((detail) => {
      return {
        img: (
          <Link to='#' className='d-inline-block'>
            <img
              src={bookDetails[detail.bookId] && bookDetails[detail.bookId].thumbImg1}
              alt=''
              className='img-fluid z-depth-0'
            />
          </Link>
        ),
        product: [
          <Link to='#' className='mt-3' key={new Date().getDate + 1}>
            <strong>{detail.name}</strong>
          </Link>,
        ],
        price: `${formatPrice(detail.price - detail.discount)}`,
        store: `${bookDetails[detail.bookId] && bookDetails[detail.bookId].quantity}`,
        qty: `${detail.quantity}`,
        subtotal: <strong>{formatPrice(detail.subTotal)}</strong>,
      };
    });
    rows.push({
      product: <strong>Tổng tiền</strong>,
      colspan: 3,
      qty: '1',
      subtotal: <strong>{formatPrice(order.totalOrder)}</strong>,
    });

    return (
      <React.Fragment>
        <MDBRow className='order-container'>
          <MDBCol sm='8' className='order-detail'>
            <MDBCard>
              {/* <MDBCardHeader className='grey lighten-4 order-detail-header'>CHI TIẾT ĐƠN HÀNG</MDBCardHeader> */}
              <MDBCardBody>
                <div className='fragment-header order-detail-header'>
                  <MDBBtn onClick={this.actionBack} className='button-back' flat>
                    <MDBIcon icon='arrow-left' />
                  </MDBBtn>
                  <span>CHI TIẾT ĐƠN HÀNG</span>
                </div>
                <table className='content mb-4'>
                  <tbody>
                    <tr>
                      <td className='label'>Mã đơn:</td>
                      <td className='value'>
                        <span style={{ fontWeight: 500, backgroundColor: '#b9f6ca' }}>#{order.id}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className='label'>Ngày đặt:</td>
                      <td className='value'>{formatFullDate(order.createdAt)}</td>
                    </tr>
                    <tr>
                      <td className='label'>Trạng thái:</td>
                      <td className='value'>
                        <span style={{ fontWeight: 500, backgroundColor: 'rgba(255, 235, 59, 0.7)' }}>
                          {OrderStateMap[order.state]}
                        </span>
                      </td>
                    </tr>
                    {order.state === OrderState.DROP && (
                      <tr>
                        <td className='label'>Thanh toán:</td>
                        <td className='value'>
                          {order.payState === PaymentState.PAID
                            ? 'đã thanh toán'
                            : order.payState === PaymentState.NONE
                            ? 'chưa thanh toán'
                            : 'đã hoàn trả'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* <div>Trạng thái đơn: đã đặt / đã xác thực / đang giao hàng / hoàn thành / hủy đơn</div> */}
                <MDBTable className='order-detail-table mb-5'>
                  <MDBTableHead className='font-weight-bold' columns={columns} />
                  <MDBTableBody rows={rows} />
                </MDBTable>
                {order.state !== OrderState.DROP && order.state > 0 && (
                  <React.Fragment>
                    <div className='order-action'>
                      <div className={`order-action-label${order.state === OrderState.CREATE ? ' active' : ''}`}>
                        <MDBIcon className='label-icon' icon='credit-card' />
                        <span>
                          {order.payType === PaymentType.ONLINE ? 'THANH TOÁN ONLINE' : 'THANH TOÁN TIỀN MẶT'}
                        </span>
                        {order.payState === PaymentState.PAID ? (
                          <MDBBadge pill className='ml-2'>
                            đã thanh toán
                          </MDBBadge>
                        ) : order.payState === PaymentState.NONE ? (
                          <MDBBadge pill className='ml-2' color='light'>
                            chưa thanh toán
                          </MDBBadge>
                        ) : (
                          <MDBBadge pill className='ml-2' color='light'>
                            đã hoàn trả
                          </MDBBadge>
                        )}
                        {order.state >= OrderState.CONFIRMED && (
                          <MDBBadge pill className='ml-2'>
                            đã xác nhận
                          </MDBBadge>
                        )}
                      </div>
                      {order.state < OrderState.CONFIRMED && (
                        <React.Fragment>
                          <MDBBtn onClick={this.handleUpdateState(OrderState.CONFIRMED)}>Xác nhận</MDBBtn>
                        </React.Fragment>
                      )}
                    </div>
                    <div className='order-action'>
                      <div className={`order-action-label${order.state === OrderState.CONFIRMED ? ' active' : ''}`}>
                        <MDBIcon className='label-icon' icon='truck' />
                        <span>GIAO HÀNG</span>
                        {order.state >= OrderState.SHIPPING && (
                          <MDBBadge pill className='ml-2'>
                            {order.state === OrderState.SHIPPING ? 'đang giao hàng' : 'đã giao hàng'}
                          </MDBBadge>
                        )}
                      </div>
                      {order.state < OrderState.SHIPPING && (
                        <React.Fragment>
                          <MDBBtn onClick={this.handleUpdateState(OrderState.SHIPPING)}>Giao hàng</MDBBtn>
                        </React.Fragment>
                      )}
                    </div>
                    <div className='order-action'>
                      <div className={`order-action-label${order.state === OrderState.SHIPPING ? ' active' : ''}`}>
                        <MDBIcon className='label-icon' icon='check-circle' />
                        <span>HOÀN THÀNH</span>
                        {order.state >= OrderState.DONE && (
                          <MDBBadge pill className='ml-2'>
                            <MDBIcon icon='check-circle' />
                          </MDBBadge>
                        )}
                      </div>
                      {order.state < OrderState.DONE && (
                        <React.Fragment>
                          <MDBBtn onClick={this.handleDrop} flat>
                            Hủy đơn
                          </MDBBtn>
                          <MDBBtn onClick={this.handleDone}>Hoàn thành</MDBBtn>
                        </React.Fragment>
                      )}
                    </div>
                  </React.Fragment>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol sm='4' className='customer-info'>
            <MDBCard>
              {/* <MDBCardHeader className='grey lighten-4 order-detail-header'>THÔNG TIN</MDBCardHeader> */}
              <MDBCardBody>
                <div className='customer-info-container'>
                  <h3 className='label'>Người đặt</h3>
                  <div className='content'>
                    <div>
                      <MDBIcon icon='user-alt' /> {profileUser ? profileUser.name : order.name}
                    </div>
                    <div>
                      <MDBIcon icon='envelope' /> {profileUser ? profileUser.email : order.email}
                    </div>
                    <div style={{ fontSize: 13, marginLeft: 23 }}>
                      {profileUser ? '(Đã có tài khoản)' : '(Không dùng tài khoản)'}
                    </div>
                    <div>
                      <MDBIcon icon='phone' /> {profileUser ? profileUser.phone : order.phone}
                    </div>
                  </div>
                </div>
                <div className='divider' style={{ marginBottom: 24 }} />
                <div className='customer-info-container'>
                  <h3 className='label'>Địa chỉ giao hàng</h3>
                  <div className='content'>
                    <div>
                      <MDBIcon icon='user-alt' /> {order.name}
                    </div>
                    <div>
                      <MDBIcon icon='phone' /> {order.phone}
                    </div>
                    <div>
                      <MDBIcon icon='map-marker-alt' /> {order.address}
                    </div>
                  </div>
                </div>
                <div className='divider' style={{ marginBottom: 24 }} />
                <div className='customer-info-container'>
                  <h3 className='label' style={{ marginBottom: 0 }}>
                    Ghi chú
                  </h3>
                  <div className='content'>
                    <MDBInput value={draftNote} onChange={this.handleChangeValueEvent('draftNote')} type='textarea' />
                  </div>
                  {draftNote !== order.note && (draftNote || order.note) && (
                    <div className='content-action'>
                      <MDBBtn onClick={this.handleUpdateNote}>Lưu</MDBBtn>
                    </div>
                  )}
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { action, success, doing, error, bookDetails, profileUser, order } = state.AdminReducer || {};
  return { action, success, doing, error, bookDetails, profileUser, order };
};
export const OrderDetail = connect(mapStateToProps, {
  actionGetBookIds,
  actionGetProfileUser,
  actionPutOrder,
})(withRouter(OrderDetailComponent));
