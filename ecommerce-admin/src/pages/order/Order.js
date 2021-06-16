import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBSelect,
  MDBInput,
  MDBTable,
  MDBIcon,
  MDBDatePicker,
  MDBBtn,
  MDBTooltip,
} from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Actions } from '../../Constant';
import { actionGetOrders, actionSetOrder, actionSetTake } from '../../datas/redux/AdminAction';
import { endOfDay, formatPrice, getTakeOptions, startOfDay } from '../../utils/Util';
import { Pagination } from '../Pagination';
import './Order.css';
import { OrderDetail } from './OrderDetail';
import { PaymentType, PaymentState, OrderState } from '../../Constant';
import { actionResetSucces } from '../../datas/redux/AppAction';

class OrderComponent extends React.Component {
  state = {
    page: 0,
    draftSearch: '',
    draftFromDate: null,
    draftToDate: null,
    draftState: '',
    draftPayState: '',
    draftPayType: '',
    // action data
    doAction: Actions.LIST,
    // doData: undefined,
    // view data
    takeOptions: [],
    stateOptions: [
      { text: 'Tất cả', value: '', checked: true },
      { text: 'Đã đặt', value: '1', checked: false },
      { text: 'Đã xác nhận', value: '2', checked: false },
      { text: 'Đang giao hàng', value: '3', checked: false },
      { text: 'Hoàn thành', value: '4', checked: false },
      { text: 'Đã hủy', value: '-1', checked: false },
    ],
    payStateOptions: [
      { text: 'Tất cả', value: '', checked: true },
      { text: 'Chưa thanh toán', value: '0', checked: false },
      { text: 'Đã thanh toán', value: '1', checked: false },
      { text: 'Hoàn trả', value: '2', checked: false },
    ],
    payTypeOptions: [
      { text: 'Mọi hình thức', value: '', checked: true },
      { text: 'Tiền mặt', value: '0', checked: false },
      { text: 'Online', value: '1', checked: false },
    ],
  };

  constructor(props) {
    super(props);
    const { take } = props;
    this.state.takeOptions = getTakeOptions(take);
  }

  handleChangeValue = (name) => (value) => {
    this.setState({ [name]: value });
  };

  handleChangeSelectValue = (name) => (value) => {
    this.setState({ [name]: value[0] });
  };

  handleSetFomDate = (value) => {
    if (value !== this.state.draftFromDate) {
      this.setState({ draftFromDate: startOfDay(value) });
    }
  };

  handleSetToDate = (value) => {
    if (value !== this.state.draftToDate) {
      this.setState({ draftToDate: endOfDay(value) });
    }
  };

  handleChangeTake = (value) => {
    const { actionSetTake } = this.props;
    actionSetTake({ take: +value[0] });
  };

  handleGetOrder = (e) => {
    e && e.preventDefault && e.preventDefault();
    const { draftSearch, draftFromDate, draftToDate, draftState, draftPayState, draftPayType, page } = this.state;
    const { take, actionGetOrders } = this.props;
    actionGetOrders({
      page: page || 0,
      take,
      search: draftSearch,
      fromDate: draftFromDate,
      toDate: draftToDate,
      state: draftState,
      payState: draftPayState,
      payType: draftPayType,
    });
  };

  handleSelectPage = (value) => {
    this.setState({ page: value }, this.handleGetOrder);
  };

  openEdit = (order) => () => {
    this.props.actionResetSucces();
    this.props.actionSetOrder({ order: order });
    this.setState({ doAction: Actions.EDIT });
  };

  closeForm = (isNeedRefresh) => {
    if (isNeedRefresh) {
      this.setState({ doAction: Actions.LIST, page: 0 }, this.handleGetOrder);
    } else {
      this.setState({ doAction: Actions.LIST });
    }
  };

  refreshData = (action) => () => {
    if (action === Actions.EDIT || action === Actions.DEL) {
      this.setState({ doAction: Actions.LIST }, this.handleGetOrder);
    }
  };

  componentDidMount() {
    this.handleGetOrder();
  }

  componentDidUpdate(prevProps) {
    const { take } = this.props;
    if (prevProps.take !== take) {
      this.setState({ page: 0, takeOptions: getTakeOptions(take) }, this.handleGetOrder);
    }

    const { orders } = this.props;
    if (prevProps.orders !== orders) {
      if (orders && orders.data && orders.data.length === 0 && orders.pagination.page > 0) {
        this.handleSelectPage(orders.pagination.page - 1);
      }
    }
  }

  render() {
    const {
      draftSearch,
      draftFromDate,
      draftToDate,
      takeOptions,
      stateOptions,
      payTypeOptions,
      payStateOptions,

      doAction,
      // doData,
    } = this.state;
    const { orders } = this.props;

    return (
      <MDBContainer fluid>
        {doAction === Actions.LIST ? (
          <React.Fragment>
            <section className='mb-5'>
              <MDBCard className='dashboard-card'>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol lg='12' md='12'>
                      <div className='d-flex'>
                        <MDBInput
                          value={draftSearch}
                          getValue={this.handleChangeValue('draftSearch')}
                          containerClass='flex-grow-1'
                          type='text'
                          label='Tìm kiếm'
                        />
                        <MDBBtn onClick={this.handleGetOrder} className='button-search'>
                          <i className='search-icon'></i>
                        </MDBBtn>
                      </div>
                    </MDBCol>
                    <MDBCol lg='4' md='4'>
                      <MDBRow>
                        <MDBCol md='12' xs='6'>
                          <MDBSelect
                            getValue={this.handleChangeSelectValue('draftState')}
                            options={stateOptions}
                            label='Trạng thái'
                          />
                        </MDBCol>
                        <MDBCol md='12' xs='6'>
                          <MDBSelect
                            getValue={this.handleChangeTake}
                            options={takeOptions}
                            className='mt-md-0'
                            label='Hiển thị'
                          />
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>

                    <MDBCol lg='8' md='8'>
                      <MDBRow>
                        <MDBCol lg='6' md='6'>
                          <MDBSelect
                            getValue={this.handleChangeSelectValue('draftPayType')}
                            options={payTypeOptions}
                            label='Thanh toán'
                          />
                        </MDBCol>
                        <MDBCol lg='6' md='6'>
                          <MDBSelect
                            getValue={this.handleChangeSelectValue('draftPayState')}
                            options={payStateOptions}
                            label='Tình trạng thanh toán'
                          />
                        </MDBCol>
                        <MDBCol md='6' xs='6'>
                          <div className='date-picker-w-100 mt-md-0'>
                            <span className={`label ${draftFromDate !== null ? 'active' : ''}`}>Từ ngày</span>
                            <MDBDatePicker getValue={this.handleSetFomDate} value={draftFromDate} valueDefault={null} />
                          </div>
                        </MDBCol>
                        <MDBCol md='6' xs='6'>
                          <div className='date-picker-w-100 mt-md-0'>
                            <span className={`label ${draftToDate !== null ? 'active' : ''}`}>Đến ngày</span>
                            <MDBDatePicker getValue={this.handleSetToDate} value={draftToDate} valueDefault={null} />
                          </div>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </section>

            <section className='mb-5'>
              <MDBCard className='dashboard-card'>
                <MDBCardBody>
                  <MDBTable responsive hover className='data-table'>
                    <thead>
                      <tr>
                        {/* <th>
                          <input className='form-check-input' type='checkbox' id='checkbox' />
                          <label htmlFor='checkbox' className='form-check-label mr-2 label-table d-table' />
                        </th> */}
                        <th className='th-lg'>
                          <div>
                            <span>Mã đơn</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Tên khách</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>SĐT</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Email</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Tổng tiền</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Trạng thái</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        {/* <th className='th-lg'>
                          <div>
                            <span>Thanh toán</span>
                            <MDBIcon icon='sort' />
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Địa chỉ</span>
                            <MDBIcon icon='sort' />
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Ghi chú</span>
                            <MDBIcon icon='sort' />
                          </div>
                        </th> */}
                      </tr>
                    </thead>

                    <tbody>
                      {orders &&
                        orders.data &&
                        orders.data.map((order) => {
                          const payState =
                            order.payState === PaymentState.PAID
                              ? ' paid'
                              : order.payState === PaymentState.REFUND
                              ? ' refund'
                              : '';
                          const payStateName =
                            order.payState === PaymentState.PAID
                              ? 'Đã thanh toán'
                              : order.payState === PaymentState.REFUND
                              ? 'Hoàn trả'
                              : 'Chưa thanh toán';
                          return (
                            <tr key={`order_${order.id}`}>
                              {/* <th scope='row'>
                                <input className='form-check-input' type='checkbox' id='checkbox1' />
                                <label htmlFor='checkbox1' className='label-table' />
                              </th> */}
                              <td>
                                <span onClick={this.openEdit(order)} className='link-id'>
                                  #{order.id}
                                </span>
                              </td>
                              <td>{order.name}</td>
                              <td>{order.phone}</td>
                              <td>{order.email}</td>
                              <td>{formatPrice(order.totalOrder)}</td>
                              <td>
                                <div className='state-container'>
                                  <span className='order-state'>
                                    {order.state === OrderState.CREATE ? (
                                      <MDBTooltip domElement tag='span' material sm placement='top'>
                                        <span>
                                          <MDBIcon icon='cart-plus' />
                                        </span>
                                        <span>Đã đặt</span>
                                      </MDBTooltip>
                                    ) : order.state === OrderState.CONFIRMED ? (
                                      <MDBTooltip domElement tag='span' material sm placement='top'>
                                        <span>
                                          <MDBIcon icon='check-double' />
                                        </span>
                                        <span>Đã xác nhận</span>
                                      </MDBTooltip>
                                    ) : order.state === OrderState.SHIPPING ? (
                                      <MDBTooltip domElement tag='span' material sm placement='top'>
                                        <span>
                                          <MDBIcon icon='shipping-fast' />
                                        </span>
                                        <span>Đang giao hàng</span>
                                      </MDBTooltip>
                                    ) : order.state === OrderState.DONE ? (
                                      <MDBTooltip domElement tag='span' material sm placement='top'>
                                        <span>
                                          <MDBIcon icon='check-circle' />
                                        </span>
                                        <span>Hoàn thành</span>
                                      </MDBTooltip>
                                    ) : order.state === OrderState.DROP ? (
                                      <MDBTooltip domElement tag='span' material sm placement='top'>
                                        <span>
                                          <MDBIcon icon='trash' />
                                        </span>
                                        <span>Đã hủy</span>
                                      </MDBTooltip>
                                    ) : undefined}
                                  </span>

                                  <span className='order-pay-state'>
                                    {order.payType === PaymentType.ONLINE ? (
                                      <MDBTooltip domElement tag='span' material sm placement='top'>
                                        <span>
                                          <MDBIcon className={`pay-online${payState}`} far icon='credit-card' />
                                        </span>
                                        <span>Online, {payStateName}</span>
                                      </MDBTooltip>
                                    ) : (
                                      <MDBTooltip domElement tag='span' material sm placement='top'>
                                        <span>
                                          <MDBIcon className={`pay-cash${payState}`} icon='hand-holding-usd' />
                                        </span>
                                        <span>Tiền mặt, {payStateName}</span>
                                      </MDBTooltip>
                                    )}
                                  </span>
                                </div>
                              </td>
                              {/* <td>{order.address}</td>
                              <td>{order.note}</td> */}
                            </tr>
                          );
                        })}
                    </tbody>
                  </MDBTable>

                  <div className='mt-3 d-flex justify-content-center'>
                    <Pagination pagination={orders && orders.pagination} getValue={this.handleSelectPage} />
                  </div>
                </MDBCardBody>
              </MDBCard>
            </section>
          </React.Fragment>
        ) : (
          <section className='mb-5'>
            <OrderDetail onBack={this.closeForm} />
          </section>
        )}
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { take, orders } = state.AdminReducer || {};
  return { take, orders };
};
export const Order = connect(mapStateToProps, {
  actionGetOrders,
  actionSetOrder,
  actionSetTake,
  actionResetSucces,
})(withRouter(OrderComponent));
