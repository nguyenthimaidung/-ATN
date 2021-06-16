import React from 'react';
import { MDBSideNavLink, MDBSideNavCat, MDBSideNavNav, MDBSideNav, MDBIcon } from 'mdbreact';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { actionSignOut } from '../datas/redux/AdminAction';
import { RouterUrl } from '../Constant';

class SideNavComponent extends React.Component {
  renderSideNavLink(to, text) {
    const { onLinkClick } = this.props;
    return (
      <MDBSideNavLink to={to} onClick={onLinkClick}>
        {text}
      </MDBSideNavLink>
    );
  }

  render() {
    const { onLinkClick, breakWidth, triggerOpening } = this.props;
    return (
      <div className='white-skin'>
        <MDBSideNav
          href={RouterUrl.HOME}
          bg='https://mdbootstrap.com/img/Photos/Others/sidenav4.jpg'
          mask='strong'
          fixed
          breakWidth={breakWidth}
          triggerOpening={triggerOpening}
          style={{ transition: 'padding-left .3s' }}
        >
          <h3 className='text-center w-100 mt-4 mb-2'>Admin</h3>
          <form role='search' className='search-form'>
            <div className='form-group md-form mt-0 pt-1 ripple-parent'>
              <input
                style={{ boxSizing: 'border-box', paddingRight: '1.5rem' }}
                type='text'
                // placeholder='Tìm kiếm'
                className='w-100 form-control'
              />
            </div>
          </form>
          <MDBSideNavNav>
            <MDBSideNavLink topLevel to={RouterUrl.HOME} onClick={onLinkClick}>
              <MDBIcon icon='tachometer-alt mr-2' />
              Tổng Quan
            </MDBSideNavLink>
            <MDBSideNavLink topLevel to={RouterUrl.ORDER} onClick={onLinkClick}>
              <MDBIcon icon='store mr-2' />
              Đơn Hàng
            </MDBSideNavLink>
            <MDBSideNavLink topLevel to={RouterUrl.ACCOUNT} onClick={onLinkClick}>
              <MDBIcon icon='id-card mr-2' />
              Người Dùng
            </MDBSideNavLink>
            <MDBSideNavCat name='Sản Phẩm' id='product' icon='book'>
              {this.renderSideNavLink(RouterUrl.BOOK, 'Sách')}
              {/* {this.renderSideNavLink(RouterUrl.IMPORT_BOOK, 'Nhập Sách')} */}
              {this.renderSideNavLink(RouterUrl.CATEGORY, 'Danh Mục')}
              {this.renderSideNavLink(RouterUrl.AUTHOR, 'Tác Giả')}
              {/* {this.renderSideNavLink(RouterUrl.SALE, 'Khuyến Mãi')} */}
            </MDBSideNavCat>
            <MDBSideNavLink topLevel to={RouterUrl.IMPORT_BOOK} onClick={onLinkClick}>
              <MDBIcon icon='poll mr-2' />
              Nhập Sách
            </MDBSideNavLink>
            {/* <MDBSideNavCat name='Thống Kê' id='statistic' icon='poll'>
              {this.renderSideNavLink(RouterUrl.STATISTIC_SOLD, 'Sách Đã Bán')}
            </MDBSideNavCat> */}
            <MDBSideNavCat name='Trang' id='page' icon='file'>
              {this.renderSideNavLink(RouterUrl.INTRODUCE, 'Giới Thiệu')}
              {this.renderSideNavLink(RouterUrl.PRIVACY, 'Chính sách bảo mật')}
              {this.renderSideNavLink(RouterUrl.DELIVERY, 'Chính sách vận chuyển')}
              {this.renderSideNavLink(RouterUrl.PAYMENT, 'Hình thức thanh toán')}
              {this.renderSideNavLink(RouterUrl.RETURN_CHANGE, 'Quy định đổi trả và hủy đơn hàng')}
              {this.renderSideNavLink(RouterUrl.GUIDE, 'Hướng dẫn đặt hàng')}
              {this.renderSideNavLink(RouterUrl.CONTACT, 'Liên hệ')}
            </MDBSideNavCat>
          </MDBSideNavNav>
        </MDBSideNav>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { token, cart, wishlist, draftPutCart, draftPutWishlist } = state.AdminReducer || {};
  const { categories } = state.SysReducer || {};
  return { token, cart, wishlist, categories, draftPutCart, draftPutWishlist };
};
export const SideNav = connect(mapStateToProps, {
  actionSignOut,
})(withRouter(SideNavComponent));
