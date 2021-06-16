import React from 'react';
import { MDBContainer, MDBInputGroup, MDBBtn, MDBRow, MDBCol } from 'mdbreact';
import './JoinCommunity.css';

export class JoinCommunity extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MDBContainer>
          <div className='join-community-container'>
            <MDBRow className='flex-center'>
              <MDBCol className='col-md-1/5' ms='12' lg='4'>
                <div style={{ paddingTop: 20, paddingBottom: 20, textAlign: 'center' }}>
                  <img
                    width='102'
                    height='102'
                    src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2019/07/banner1-5.jpg'
                    alt=''
                  />
                </div>
              </MDBCol>
              <MDBCol className='col-md-3/5' ms='12' lg='4' style={{ textAlign: 'center' }}>
                <div className='title'>Tham gia vào cộng đồng</div>
                <div className='sub-title'>Bản tin để liên lạc</div>
                <div className='content-newsletter'>
                  <MDBInputGroup
                    material
                    type='email'
                    hint='Địa chỉ email của bạn...'
                    append={
                      <MDBBtn className='m-0 button-default'>
                        Gia nhập
                      </MDBBtn>
                    }
                  />
                </div>
              </MDBCol>
              <MDBCol className='col-md-1/5' ms='12' lg='4'>
                <div
                  style={{ paddingTop: 20, paddingBottom: 20, paddingLeft: 15, paddingRight: 15, textAlign: 'center' }}
                >
                  <img
                    width='286'
                    height='82'
                    src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2019/07/banner1-4.jpg'
                    alt=''
                  />
                </div>
              </MDBCol>
            </MDBRow>
          </div>
        </MDBContainer>
      </React.Fragment>
    );
  }
}
