import React from 'react';
import { Breadcrumb } from '../Breadcrumb';
import { MDBContainer, MDBInput, MDBBtn, MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import './Checkout.css';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { getDiscountBook } from '../../utils/BookUtil';
import { formatPrice } from '../../utils/Util';
import {
  actionCompleteCheckout,
  actionConfirmCreateOrder,
  actiondraftOrder,
  ACTION_DRAFT_ORDER,
  ACTION_CONFIRM_CREATE_ORDER,
} from '../../datas/redux/UserAction';
import { PaymentType, RouterUrl } from '../../Constant';
import { validateName, validateNotEmpty, validateEmail, combineValidate } from '../../utils/Validate';
import { actionResendVerifyOrder } from '../../datas/redux/UserAction';
import { actionResetSucces } from '../../datas/redux/AppAction';

class CheckoutComponent extends React.Component {
  state = {
    paymentType: PaymentType.CASH,
    draftName: '',
    draftPhone: '',
    draftEmail: '',
    draftAddress: '',
    draftNote: '',

    draftVerifyCode: '',
    // isOpenModal: false,
    isMustVerifyEmail: false,
    message: undefined,
  };

  constructor(props) {
    super(props);
    this.validateName = validateName('draftName').bind(this);
    this.validateEmail = validateEmail('draftEmail').bind(this);
    this.validatePhone = validateNotEmpty('draftPhone').bind(this);
    this.validateAddress = validateNotEmpty('draftAddress').bind(this);
  }

  isInputValid = () => {
    return combineValidate(this.validateName, this.validateEmail, this.validatePhone, this.validateAddress);
  };

  // toggleModal = () => {
  //   this.setState((prevState) => ({ isOpenModal: !prevState.isOpenModal }));
  // };

  handleChangeValue = (fieldName) => (value) => {
    this.setState({ [fieldName]: value, message: undefined });
  };

  handerChangePaymentType = (type) => () => {
    this.setState({ paymentType: type });
  };

  draftOrder = () => {
    const { paymentType, draftName, draftPhone, draftEmail, draftAddress, draftNote } = this.state;
    const { draftOrder, cart, actiondraftOrder } = this.props;
    const { detail = [] } = cart || {};
    if (detail.length > 0) {
      if (!this.isInputValid()) {
        this.setState({ message: 'Vui lòng điền thông tin chính xác' });
        return;
      }
      const details = detail.map((item) => ({ bookId: item.bookId, quantity: item.quantity }));
      this.setState({ isMustVerifyEmail: false });
      actiondraftOrder({
        id: draftOrder && draftOrder.id,
        payType: paymentType,
        name: draftName,
        phone: draftPhone,
        email: draftEmail,
        address: draftAddress,
        note: draftNote,
        details: details,
      });
    }
  };

  confirmCreateOrder = () => {
    const { draftVerifyCode } = this.state;
    const { token, draftOrder, actionConfirmCreateOrder } = this.props;
    actionConfirmCreateOrder({ orderId: draftOrder.id, verifyCode: token ? undefined : draftVerifyCode });
  };

  resendVerifyOrder = () => {
    const { draftOrder, actionResendVerifyOrder } = this.props;
    actionResendVerifyOrder({ orderId: draftOrder.id });
  };

  componentDidMount() {
    const { name, phone, email, address, actionResetSucces } = this.props;
    this.setState({
      draftName: name || '',
      draftPhone: phone || '',
      draftEmail: email || '',
      draftAddress: address || '',
    });
    actionResetSucces();
  }

  componentDidUpdate(prevProps) {
    const { draftOrder, name, phone, email, address, paymentUrl } = this.props;
    if (
      prevProps.name !== name ||
      prevProps.phone !== phone ||
      prevProps.email !== email ||
      prevProps.address !== address
    ) {
      this.setState({
        draftName: name || '',
        draftPhone: phone || '',
        draftEmail: email || '',
        draftAddress: address || '',
      });
    }
    if (prevProps.draftOrder !== draftOrder) {
      if (draftOrder) {
        if (!draftOrder.userId) {
          // must verifyEmail
          this.setState({ isMustVerifyEmail: true });
        } else {
          // auto confirm
          this.confirmCreateOrder();
        }
        this.setState({ message: undefined });
      }
    }
    if (prevProps.paymentUrl !== paymentUrl && paymentUrl) {
      window.location = paymentUrl;
    }
  }

  componentWillUnmount() {
    const { actionCompleteCheckout } = this.props;
    actionCompleteCheckout();
  }

  render() {
    const {
      paymentType,
      draftName,
      draftPhone,
      draftEmail,
      draftAddress,
      draftNote,
      draftVerifyCode,
      // isOpenModal,
      isMustVerifyEmail,
      message,
    } = this.state;
    const { action, error, cart, token, createdOrder } = this.props;
    const { detail = [] } = cart || {};

    let total = 0;

    return (
      <React.Fragment>
        <Breadcrumb />
        <MDBContainer>
          <MDBRow className='checkout'>
            <MDBCol xl='7' md='12' xs='12'>
              <h3 className='title'>Đơn Hàng Của Bạn</h3>
              <div className='checkout-review-order'>
                <table>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {createdOrder
                      ? createdOrder.details.map((row) => {
                          const { quantity } = row;
                          const { name, subTotal } = row || {};
                          total += subTotal;
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
                        })
                      : detail &&
                        detail.map((row) => {
                          const { quantity } = row;
                          const { name, price } = row.book || {};
                          const discount = getDiscountBook(row.book);

                          const subTotal = (price - discount) * quantity;
                          total += subTotal;

                          return (
                            <tr key={`item_${row.book.id}`} className='cart_item'>
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
                        <span>{formatPrice(total)}</span>
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
                        <span className='price'>{formatPrice(total)}</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </MDBCol>
            <MDBCol xl='5' md='12' xs='12'>
              <div className={`checkout-form ${isMustVerifyEmail ? 'verify-email' : 'order-info'}`}>
                {createdOrder && createdOrder.payType === PaymentType.CASH ? (
                  <div className='checkout-result'>
                    <h3 className='title text-center green-text'>
                      <MDBIcon size='9x' far icon='check-circle' />
                    </h3>
                    <h4 className='title text-center'>Đặt hàng thành công</h4>
                    <div className='text-center'>
                      Đơn hàng của bạn đã được hệ thống ghi nhận! <Link to={RouterUrl.HOME}>Về trang chủ</Link>.
                    </div>
                  </div>
                ) : (
                  <React.Fragment>
                    <div className='checkout-order-info'>
                      <h3 className='title'>Chi Tiết Thanh Toán</h3>
                      <MDBInput
                        value={draftName}
                        getValue={this.handleChangeValue('draftName')}
                        type='text'
                        label='Họ tên *'
                        className={this.validateName()}
                      >
                        <div className='invalid-feedback'>Vui lòng nhập tên hợp lệ.</div>
                      </MDBInput>
                      <MDBInput
                        value={draftPhone}
                        getValue={this.handleChangeValue('draftPhone')}
                        type='text'
                        label='Số điện thoại *'
                        className={this.validatePhone(true)}
                      >
                        <div className='invalid-feedback'>Vui lòng nhập số điện thoại hợp lệ.</div>
                      </MDBInput>
                      <MDBInput
                        value={draftEmail}
                        getValue={this.handleChangeValue('draftEmail')}
                        type='email'
                        label='Email *'
                        className={this.validateEmail()}
                      >
                        <div className='invalid-feedback'>Vui lòng nhập email hợp lệ.</div>
                      </MDBInput>
                      <MDBInput
                        value={draftAddress}
                        getValue={this.handleChangeValue('draftAddress')}
                        type='text'
                        label='Địa chỉ *'
                        className={this.validateAddress(true)}
                      >
                        <div className='invalid-feedback'>Vui lòng nhập địa chỉ hợp lệ.</div>
                      </MDBInput>
                      <MDBInput
                        value={draftNote}
                        getValue={this.handleChangeValue('draftNote')}
                        type='text'
                        label='Ghi chú thêm'
                      />
                      <MDBInput
                        checked={paymentType === PaymentType.ONLINE}
                        onChange={this.handerChangePaymentType(PaymentType.ONLINE)}
                        gap
                        id='vnpay'
                        type='radio'
                        label='Thanh toán qua VNPay'
                      />
                      <MDBInput
                        checked={paymentType === PaymentType.CASH}
                        onChange={this.handerChangePaymentType(PaymentType.CASH)}
                        gap
                        id='cash'
                        type='radio'
                        label='Thanh toán lúc nhận hàng'
                      />
                      {((error && action === ACTION_DRAFT_ORDER) || message) && (
                        <p className='text-left mt-2 red-text'>{(error && error.message) || message}.</p>
                      )}
                      <MDBBtn
                        disabled={total === 0}
                        className='button-default w-100'
                        onClick={this.draftOrder}
                        style={{ marginTop: 40 }}
                      >
                        {!token ? 'ĐẶT HÀNG' : paymentType === PaymentType.ONLINE ? 'TỚI THANH TOÁN' : 'ĐẶT HÀNG'}
                      </MDBBtn>
                    </div>
                    {!token && (
                      <div className='checkout-verify-email'>
                        <h3 className='title'>Xác nhận email đặt hàng</h3>
                        <MDBInput
                          value={draftVerifyCode}
                          getValue={this.handleChangeValue('draftVerifyCode')}
                          type='text'
                          label='Mã xác nhận'
                        />
                        {((error && action === ACTION_CONFIRM_CREATE_ORDER) || message) && (
                          <p className='text-left red-text'>{(error && error.message) || message}.</p>
                        )}
                        <p className='text-left font-italic mb-4'>
                          * Mã đơn hàng và mã xác nhận sẽ được dùng để xem lại thông tin đơn hàng của bạn.
                          <br />
                          Vui lòng kiểm tra mã được gửi về email.
                          <br />
                          Bạn chưa nhận được mã?{' '}
                          <Link onClick={this.resendVerifyOrder} to='#'>
                            Gửi lại
                          </Link>
                          .
                        </p>
                        <MDBBtn
                          disabled={total === 0}
                          className='button-default w-100'
                          onClick={this.confirmCreateOrder}
                          style={{ marginTop: 40 }}
                        >
                          {paymentType === PaymentType.CASH ? 'XÁC NHẬN' : 'XÁC NHẬN VÀ TỚI THANH TOÁN'}
                        </MDBBtn>
                      </div>
                    )}
                  </React.Fragment>
                )}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        {/* <MDBModal isOpen={isOpenModal} toggle={this.toggleModal}>
          <MDBModalHeader className='text-center' titleClass='w-100 font-weight-bold' toggle={this.toggleModal}>
            Xác nhận đơn hàng
          </MDBModalHeader>
          <MDBModalBody>
            <form className='mx-3 grey-text'>
              <MDBInput label='Mã xác nhận' group type='text' validate required />
              <p className='text-left font-italic mb-4'>
                Vui lòng kiểm tra mã được gửi về mail.
                <br />
                Bạn chưa nhận được mã?{' '}
                <Link onClick={this.resendVerifyCode} to='#'>
                  Gửi lại
                </Link>
                .
              </p>
            </form>
          </MDBModalBody>
          <MDBModalFooter className='justify-content-center'>
            <MDBBtn className='button-default' onClick={this.toggleModal}>
              Gửi
              <MDBIcon icon='paper-plane' className='ml-2' />
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { action, error, token, draftOrder, createdOrder, paymentUrl, cart, name, email, phone, address } =
    state.UserReducer || {};
  return { action, error, token, draftOrder, createdOrder, paymentUrl, cart, name, email, phone, address };
};
export const Checkout = connect(mapStateToProps, {
  actionResetSucces,
  actiondraftOrder,
  actionResendVerifyOrder,
  actionConfirmCreateOrder,
  actionCompleteCheckout,
})(withRouter(CheckoutComponent));
