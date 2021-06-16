import React from 'react';
import { Breadcrumb } from '../Breadcrumb';
import {
  MDBContainer,
  MDBTooltip,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBIcon,
} from 'mdbreact';
import './Order.css';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
  actionGetOrder,
  actionGetOrders,
  actionDropOrder,
  ACTION_DROP_ORDER,
  ACTION_GET_ORDER,
} from '../../datas/redux/UserAction';
import { Link } from 'react-router-dom';
import { OrderState, PaymentStateMap, PaymentTypeMap, RouterUrl } from '../../Constant';
import { formatFullDate, formatPrice } from '../../utils/Util';
import { OrderStateMap } from '../../Constant';

export class OrderComponent extends React.Component {
  state = {
    draftId: undefined,
    draftEmail: undefined,
    draftPhone: undefined,

    isOpenFindOrder: false,
    errorFindMessage: undefined,

    isOpenDetail: false,
    curOrder: undefined,

    columns: [
      {
        label: <span>MÃ ĐƠN</span>,
        field: 'id',
      },
      {
        label: <span>ĐỊA CHỈ GIAO HÀNG</span>,
        field: 'address',
      },
      {
        label: <span>NGÀY ĐẶT</span>,
        field: 'date',
      },
      {
        label: <span>TỔNG TIỀN</span>,
        field: 'total',
      },
      {
        label: <span>TRẠNG THÁI</span>,
        field: 'state',
      },
      {
        label: '',
        field: 'action',
      },
    ],
  };

  handleChangeValue = (name) => (value) => {
    this.setState({ [name]: value });
  };

  handleGetOrder = () => {
    const { draftId, draftEmail, draftPhone } = this.state;
    this.setState({ errorFindMessage: undefined });
    this.props.actionGetOrder({ id: draftId, email: draftEmail, phone: draftPhone });
  };

  handleGetOrders = () => {
    this.props.actionGetOrders({ page: 0, take: 10000 });
  };

  handleDropOrder = (order) => () => {
    this.props.actionDropOrder({ id: order.id, email: order.email, phone: order.phone });
  };

  showFindOrder = () => {
    this.setState({ isOpenFindOrder: true });
  };

  showDetailOrder = (order) => () => {
    this.setState({ curOrder: order, isOpenDetail: true });
  };

  actionBack = () => {
    this.setState({ isOpenDetail: false });
  };

  componentDidMount() {
    const { token } = this.props;
    if (token) {
      this.handleGetOrders();
    }
  }

  componentDidUpdate(prevProps) {
    const { action, success, doing, error, token, order, actionGetOrder } = this.props;
    if (
      prevProps.action !== action ||
      prevProps.success !== success ||
      prevProps.doing !== doing ||
      prevProps.error !== error
    ) {
      if (action === ACTION_DROP_ORDER && success && !doing && !error) {
        if (token) {
          this.handleGetOrders();
        } else if (order) {
          actionGetOrder({ id: order.id, email: order.email, phone: order.phone });
        }
        this.setState({ isOpenDetail: false });
      }
      if (action === ACTION_GET_ORDER && !success && !doing && error) {
        this.setState({ errorFindMessage: error.message });
      }
    }
  }

  render() {
    const rows = [];
    const {
      columns,
      isOpenFindOrder,
      draftId,
      draftEmail,
      draftPhone,
      errorFindMessage,
      curOrder,
      isOpenDetail,
    } = this.state;
    const { token, orders, order } = this.props;

    const datas = (orders && orders.data) || (order && [order]);

    datas &&
      datas.map((row) => {
        return rows.push({
          id: (
            <Link to='#' onClick={this.showDetailOrder(row)} className='mt-3' key={new Date().getDate + 1}>
              <strong>#{row.id}</strong>
            </Link>
          ),
          address: <span>{row.address}</span>,
          date: <span>{formatFullDate(row.createdAt)}</span>,
          total: `${formatPrice(row.totalOrder)}`,
          state: `${OrderStateMap[row.state]}`,
          action: row.state !== OrderState.DROP && row.state < OrderState.DONE && (
            <MDBTooltip placement='top'>
              <MDBBtn onClick={this.handleDropOrder(row)} className='button-default'>
                HỦY ĐƠN
              </MDBBtn>
              <span>Drop order</span>
            </MDBTooltip>
          ),
        });
      });
    if (rows.length === 0) {
      rows.push({
        button: token ? (
          <span>
            Bạn chưa có đơn hàng nào.{' '}
            <Link to={RouterUrl.CATEGORY} style={{ color: '#f86d72' }}>
              Shop now!
            </Link>
          </span>
        ) : (
          <span>
            Vui lòng đăng nhập để hiển thị danh sách đơn của bạn.{' '}
            <Link to={RouterUrl.SIGN_IN} style={{ color: '#f86d72' }}>
              Đăng nhập!
            </Link>
            <br />
            Hoặc{' '}
            <Link onClick={this.showFindOrder} to='#' style={{ color: '#f86d72' }}>
              nhập mã đơn hàng
            </Link>{' '}
            của bạn để theo dõi.
          </span>
        ),
        colspan: 5,
      });
    }

    return (
      <React.Fragment>
        <Breadcrumb />
        <MDBContainer>
          {!token && isOpenFindOrder && (
            <div className='find-order-container'>
              <div className='find-order-lable'>TÌM ĐƠN HÀNG</div>
              {errorFindMessage && <p className='error-message'>{errorFindMessage}</p>}
              <MDBRow>
                <MDBCol>
                  <MDBInput value={draftId} getValue={this.handleChangeValue('draftId')} label='Mã đơn' type='text' />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    value={draftEmail}
                    getValue={this.handleChangeValue('draftEmail')}
                    label='Email'
                    type='text'
                  />
                </MDBCol>
                <MDBCol>
                  <MDBInput
                    value={draftPhone}
                    getValue={this.handleChangeValue('draftPhone')}
                    label='Số điện thoại'
                    type='text'
                  />
                </MDBCol>
                <MDBBtn onClick={this.handleGetOrder} className='button-default button-search'>
                  Tìm kiếm
                </MDBBtn>
              </MDBRow>
            </div>
          )}

          {isOpenDetail && curOrder && (
            <MDBRow className='checkout order-detail'>
              <MDBCol xl='7' md='12' xs='12'>
                <h3 className='title'>
                  <MDBBtn onClick={this.actionBack} className='button-back' flat>
                    <MDBIcon icon='arrow-left' />
                  </MDBBtn>
                  <span>Thông Tin Đơn Hàng #{curOrder.id}</span>
                </h3>
                <div className='checkout-review-order'>
                  <table>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {curOrder.details &&
                        curOrder.details.map((row) => {
                          const { quantity } = row;
                          const { name, subTotal } = row || {};
                          return (
                            <tr key={`item_${row.bookId}`} className='cart_item'>
                              <td className='product-name'>
                                {name} × {quantity}
                              </td>
                              <td className='product-total'>
                                <span>{formatPrice(subTotal)}</span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                    <tfoot>
                      <tr className='cart-subtotal'>
                        <th>Tổng phụ</th>
                        <td className='product-total'>
                          <span>{formatPrice(curOrder.totalOrder)}</span>
                        </td>
                      </tr>
                      <tr>
                        <th>Giao hàng</th>
                        <td>
                          <div>Miễn phí giao hàng</div>
                        </td>
                      </tr>

                      <tr className='order-total'>
                        <th>Tổng tiền</th>
                        <td>
                          <span className='price'>{formatPrice(curOrder.totalOrder)}</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </MDBCol>
              <MDBCol xl='5' md='12' xs='12'>
                <div className='checkout-order-info'>
                  <h3 className='title'>Đơn Hàng {OrderStateMap[curOrder.state]}</h3>
                  <table>
                    <tbody>
                      <tr>
                        <th>Người nhận:</th>
                        <td>
                          <strong>{curOrder.name}</strong>
                        </td>
                      </tr>
                      <tr>
                        <th>Email liên hệ:</th>
                        <td>{curOrder.email}</td>
                      </tr>
                      <tr>
                        <th>Số điện thoại:</th>
                        <td>{curOrder.phone}</td>
                      </tr>
                      <tr>
                        <th>Giao tới:</th>
                        <td>{curOrder.address}</td>
                      </tr>
                      <tr>
                        <th>Thanh toán:</th>
                        <td>{PaymentTypeMap[curOrder.payType] + ', ' + PaymentStateMap[curOrder.payState]}</td>
                      </tr>
                      <tr>
                        <th>Ghi chú:</th>
                        <td>{curOrder.note}</td>
                      </tr>
                    </tbody>
                  </table>
                  {curOrder.state !== OrderState.DROP && curOrder.state !== OrderState.DONE && (
                    <MDBBtn
                      className='button-default w-100'
                      onClick={this.handleDropOrder(curOrder)}
                      style={{ marginTop: 40 }}
                    >
                      Hủy Đơn
                    </MDBBtn>
                  )}
                </div>
              </MDBCol>
            </MDBRow>
          )}

          {!isOpenDetail && (
            <MDBTable className='order-table'>
              <MDBTableHead className='font-weight-bold' color='grey lighten-4' columns={columns} />
              <MDBTableBody rows={rows} />
            </MDBTable>
          )}
        </MDBContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { token, order, orders, action, success, doing, error } = state.UserReducer || {};
  return { token, order, orders, action, success, doing, error };
};
export const Order = connect(mapStateToProps, {
  actionGetOrder,
  actionGetOrders,
  actionDropOrder,
})(withRouter(OrderComponent));
