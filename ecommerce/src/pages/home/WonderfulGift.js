import React from 'react';
import { MDBView, MDBBtn } from 'mdbreact';
import './WonderfulGift.css';
import { withRouter } from 'react-router';
import { Navigate } from '../../utils/Navigate';
import { RouterUrl } from '../../Constant';

class WonderfulGiftComponent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MDBView className='wonderful-gift'>
          <div className='flex-center flex-column text-center'>
            <h2>QUÀ TẶNG TUYỆT VỜI</h2>
            <p>Dành tặng tới gia đình và bạn bè những cuốn sách ý nghĩa</p>
            <MDBBtn
              onClick={Navigate.goTo(RouterUrl.CATEGORY).bind(this)}
              className='button-default shop-now'
              color='danger'
            >
              Chọn Sách Ngay
            </MDBBtn>
          </div>
        </MDBView>
      </React.Fragment>
    );
  }
}

export const WonderfulGift = withRouter(WonderfulGiftComponent);
