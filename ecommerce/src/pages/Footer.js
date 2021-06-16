import React from 'react';
import { MDBCol, MDBContainer, MDBFooter, MDBIcon, MDBRow } from 'mdbreact';
import './Footer.css';
import { RouterUrl } from '../Constant';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

class FooterComponent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MDBFooter className='font-small pt-4 mt-4'>
          <MDBContainer fluid className='rgba-grey-slight'>
            <MDBContainer className='text-center text-md-left footer-container'>
              <MDBRow>
                <MDBCol sm='12' md='6' lg='3'>
                  <h5 className='footer-title'>LIÊN HỆ</h5>
                  <div className='footer-wp'>
                    <div className='footer-icon'>
                      <MDBIcon icon='map-marker-alt' />
                    </div>
                    <div className='footer-info'>236 Hoàng Quốc Việt, Cổ Nhuế, Bắc Từ Liêm, Hà Nội</div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-icon'>
                      <MDBIcon far icon='envelope' />
                    </div>
                    <div className='footer-info'>
                      contact@ecommerce.com
                      <br />
                      support@gmail.com
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-icon'>
                      <MDBIcon icon='mobile-alt' />
                    </div>
                    <div className='footer-info'>
                      ( 84) 0123 456 789
                      <br />( 84) 00123 456 789
                    </div>
                  </div>
                </MDBCol>
                <MDBCol sm='12' md='6' lg='3'>
                  <h5 className='footer-title'>THÔNG TIN</h5>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to={RouterUrl.CONTACT}>Liên Hệ</Link>
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to={RouterUrl.RETURN_CHANGE}>Quy Định Đổi, Trả Hàng</Link>
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to={RouterUrl.PRIVACY}>Chính Sách Bảo Mật</Link>
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to={RouterUrl.INTRODUCE}>Về Chúng Tôi</Link>
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to={RouterUrl.GUIDE}>Hướng Dẫn Đặt Hàng</Link>
                    </div>
                  </div>
                </MDBCol>
                <MDBCol sm='12' md='6' lg='3'>
                  <h5 className='footer-title'>TÀI KHOẢN</h5>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to={RouterUrl.SIGN_IN}>Đăng Nhập</Link>
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to={RouterUrl.CART}>Xem Giỏ Hàng</Link>
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to={RouterUrl.WISHLIST}>Danh Sách Ưa Thích</Link>
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to={RouterUrl.CHECKOUT}>Theo Dõi Đơn Hàng</Link>
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to='#!'>Trợ Giúp</Link>
                    </div>
                  </div>
                </MDBCol>
                <MDBCol sm='12' md='6' lg='3'>
                  <h5 className='footer-title'>INSTAGRAM</h5>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <img
                        style={{ margin: 6 }}
                        width='54'
                        height='54'
                        src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2018/06/5.jpg'
                        alt=''
                      />
                      <img
                        style={{ margin: 6 }}
                        width='54'
                        height='54'
                        src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2018/06/4.jpg'
                        alt=''
                      />
                      <img
                        style={{ margin: 6 }}
                        width='54'
                        height='54'
                        src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2018/06/3.jpg'
                        alt=''
                      />
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link to='#!'>7 ngày trên tuần từ 8.00 sáng tới 5 chiều</Link>
                    </div>
                  </div>
                  <div className='footer-wp'>
                    <div className='footer-info'>
                      <Link className='social-icon' to='#!'>
                        <MDBIcon fab icon='facebook-f' />
                      </Link>
                      <Link className='social-icon' to='#!'>
                        <MDBIcon fab icon='twitter' />
                      </Link>
                      <Link className='social-icon' to='#!'>
                        <MDBIcon fab icon='google-plus-g' />
                      </Link>
                      <Link className='social-icon' to='#!'>
                        <MDBIcon fab icon='instagram' />
                      </Link>
                      <Link className='social-icon' to='#!'>
                        <MDBIcon fab icon='linkedin-in' />
                      </Link>
                    </div>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </MDBContainer>
          <MDBContainer>
            <div className='py-3'>
              <MDBRow>
                <MDBCol>
                  <div className='footer-copyright-info'>
                    Copyright &copy; {new Date().getFullYear()} <Link to='#!'> Book Ecommerce </Link> - Made by BB
                  </div>
                </MDBCol>
                <MDBCol>
                  <div className='footer-payment-info'>
                    <img
                      width='187'
                      height='20'
                      src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2018/06/paymet.png'
                      alt=''
                    />
                  </div>
                </MDBCol>
              </MDBRow>
            </div>
          </MDBContainer>
        </MDBFooter>
      </React.Fragment>
    );
  }
}

export const Footer = withRouter(FooterComponent);
