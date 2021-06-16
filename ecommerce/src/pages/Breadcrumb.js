import { MDBBreadcrumb, MDBBreadcrumbItem, MDBContainer } from 'mdbreact';
import React from 'react';
import './Breadcrumb.css';
import { RouterUrl } from '../Constant';
import { Navigate } from '../utils/Navigate';
import { Link, withRouter } from 'react-router-dom';

const BreadcrumbNames = {
  home: {
    title: 'Trang chủ',
    name: 'Trang chủ',
    url: RouterUrl.HOME,
  },
  product: {
    title: 'Sản phẩm',
    name: 'Sản phẩm',
    url: RouterUrl.CATEGORY,
  },
  category: {
    title: 'Sản phẩm',
    name: 'Danh mục',
    url: RouterUrl.CATEGORY,
  },
  detail: {
    title: 'Chi tiết sản phẩm',
    name: 'Chi tiết sản phẩm',
    url: RouterUrl.PRODUCT_DETAIL,
  },
  cart: {
    title: 'Giỏ hàng',
    name: 'Giỏ hàng',
    url: RouterUrl.CART,
  },
  wishlist: {
    title: 'Ưa thích',
    name: 'Ưa thích',
    url: RouterUrl.WISHLIST,
  },
  checkout: {
    title: 'Thanh toán',
    name: 'Thanh toán',
    url: RouterUrl.CHECKOUT,
  },
  payment: {
    title: 'Thanh toán',
    name: 'Thanh toán',
    url: '#',
  },
  order: {
    title: 'Đơn hàng',
    name: 'Đơn hàng',
    url: '#',
  },
};

export class BreadcrumbComponent extends React.Component {
  render() {
    const breadcrumbs = window.location.pathname.split('/').filter((val) => val !== '');
    const activeBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    const { title = activeBreadcrumb } = BreadcrumbNames[activeBreadcrumb] || {};

    return (
      <React.Fragment>
        <MDBContainer className='breadcrumb-page'>
          <h1>{title}</h1>
          <MDBBreadcrumb color='transparent'>
            {breadcrumbs.map((item, idx, arr) => {
              const { url = item, name = item } = BreadcrumbNames[item] || {};
              return (
                <MDBBreadcrumbItem key={`${item}`} active={idx + 1 === arr.length}>
                  <Link onClick={Navigate.scrollToTop} to={url}>
                    {name}
                  </Link>
                </MDBBreadcrumbItem>
              );
            })}
          </MDBBreadcrumb>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

export const Breadcrumb = withRouter(BreadcrumbComponent);
