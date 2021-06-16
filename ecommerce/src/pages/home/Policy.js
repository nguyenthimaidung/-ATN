import { MDBCol, MDBContainer, MDBRow } from 'mdbreact'
import React from 'react'
import './Policy.css'

export class Policy extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MDBContainer>
          <MDBRow>
            <MDBCol middle>
              <div className='policy-wp'>
                <div className='policy-icon'>
                  <img src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2019/04/policy-1.png' alt='' />
                </div>
                <div className='policy-info'>
                  <h4>Miễn Phí Giao Hàng</h4>
                  <div>Áp dụng trên nhiều loại sách giáo khoa và phương tiện.</div>
                </div>
              </div>
            </MDBCol>
            <MDBCol>
              <div className='policy-wp'>
                <div className='policy-icon'>
                  <img src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2019/04/policy-2.png' alt='' />
                </div>
                <div className='policy-info'>
                  <h4>Vận Chuyển Nhanh</h4>
                  <div>Tận hưởng giao hàng miễn phí và dịch vụ giao hàng nhanh chóng của chúng tôi.</div>
                </div>
              </div>
            </MDBCol>
            <MDBCol>
              <div className='policy-wp'>
                <div className='policy-icon'>
                  <img src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2019/04/policy-3.png' alt='' />
                </div>
                <div className='policy-info'>
                  <h4>Khuyến Mại Đặc Biệt</h4>
                  <div>Nhận khuyến mại tuyệt vời cho sản phẩm được xếp hạng hàng đầu của chúng tôi vào mỗi chủ nhật.</div>
                </div>
              </div>
            </MDBCol>
          </MDBRow>
          <div className='divider'></div>
        </MDBContainer>
      </React.Fragment>
    )
  }
}