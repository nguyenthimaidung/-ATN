import { MDBBtn, MDBMask, MDBView } from 'mdbreact';
import React from 'react';
import { withRouter } from 'react-router';
import { RouterUrl } from '../../Constant';
import { Navigate } from '../../utils/Navigate';
import './CarouselBanner.css';

export class CarouselBannerComponent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MDBView
          className='carousel-banner'
          src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2019/05/slider2-2.jpg'
        >
          <MDBMask overlay='indigo-slight' className='flex-center flex-column text-white text-center'>
            <h2>BỘ SƯU TẬP SÁCH 2020</h2>
            <h5>Giảm 40% Trên Mọi Loại Sách</h5>
            <p>Bởi Book Ecommerce</p>
            <MDBBtn
              onClick={Navigate.goTo(RouterUrl.CATEGORY).bind(this)}
              className='button-default'
              style={{ marginTop: 24, padding: '0 46px' }}
            >
              Mua Ngay
            </MDBBtn>
          </MDBMask>
        </MDBView>
      </React.Fragment>
    );
  }
}

export const CarouselBanner = withRouter(CarouselBannerComponent);
