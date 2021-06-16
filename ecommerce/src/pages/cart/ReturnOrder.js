import React from 'react';
import { Breadcrumb } from '../Breadcrumb';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import './Checkout.css';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { formatPrice } from '../../utils/Util';
import { actionCheckPaymentReturnUrl } from '../../datas/redux/UserAction';
import { OrderState, PaymentState, RouterUrl } from '../../Constant';

class ReturnOrderComponent extends React.Component {
  state = {
    orderResult: undefined,
  };

  componentDidMount() {
    const { actionCheckPaymentReturnUrl } = this.props;
    actionCheckPaymentReturnUrl({ query: window.location.search });
  }

  componentDidUpdate(prevProps) {
    const { orderResult } = this.props;
    if (prevProps.orderResult !== orderResult) {
      this.setState({ orderResult: orderResult });
    }
  }

  render() {
    const { orderResult } = this.state;

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
                    {orderResult &&
                      orderResult.details.map((row) => {
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
              <div className='checkout-form'>
                {orderResult && (
                  <div className='checkout-result'>
                    {orderResult.state === OrderState.DROP ? (
                      <React.Fragment>
                        <h3 className='title text-center red-text'>
                          <MDBIcon className='icon-fail' icon='exclamation-triangle' />
                        </h3>
                        <h4 className='title text-center'>Thanh toán thất bại</h4>
                        <div className='text-center'>
                          Đơn hàng của bạn đã bị hủy! <Link to={RouterUrl.HOME}>Về trang chủ</Link>.
                        </div>
                      </React.Fragment>
                    ) : (
                      orderResult.payState === PaymentState.PAID && (
                        <React.Fragment>
                          <h3 className='title text-center green-text'>
                            <MDBIcon size='9x' far icon='check-circle' />
                          </h3>
                          <h4 className='title text-center'>Thanh toán thành công</h4>
                          <div className='text-center'>
                            Đơn hàng của bạn đã được hệ thống ghi nhận! <Link to={RouterUrl.HOME}>Về trang chủ</Link>.
                          </div>
                        </React.Fragment>
                      )
                    )}
                  </div>
                )}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { orderResult } = state.UserReducer || {};
  return { orderResult };
};
export const ReturnOrder = connect(mapStateToProps, {
  actionCheckPaymentReturnUrl,
})(withRouter(ReturnOrderComponent));
