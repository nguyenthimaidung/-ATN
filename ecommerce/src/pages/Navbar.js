import React from 'react';
import {
  MDBCollapse,
  MDBContainer,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBNavItem,
  MDBNavLink,
  MDBSideNav,
  MDBInput,
  MDBCollapseHeader,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
} from 'mdbreact';
import './Navbar.css';
import { CartQuickView } from './cart/CartPopup';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Navigate } from '../utils/Navigate';
import { DEFAULT_AVATAR, RouterUrl } from '../Constant';
import {
  actionGetCart,
  actionGetWishlist,
  actionPutCart,
  actionPutWishlist,
  actionSignOut,
} from '../datas/redux/UserAction';
import { actionGetCategories } from '../datas/redux/SysAction';
import { Profile } from './Profile';
import { prepareAvatarUrl } from '../utils/Util';

class NavbarComponent extends React.Component {
  state = {
    collapseID: '',
    collapseIDs: [],
    isOpenProfile: false,
  };

  constructor(props) {
    super(props);
    this.goToOrder = Navigate.goTo(RouterUrl.ORDER).bind(this);
    this.goToSignIn = Navigate.goTo(RouterUrl.SIGN_IN).bind(this);
    this.goToSignUp = Navigate.goTo(RouterUrl.SIGN_UP).bind(this);
    this.goToPrivacy = Navigate.goTo(RouterUrl.PRIVACY).bind(this);
    this.goToPayment = Navigate.goTo(RouterUrl.PAYMENT).bind(this);
    this.goToDelivery = Navigate.goTo(RouterUrl.DELIVERY).bind(this);
    this.goToReturnChange = Navigate.goTo(RouterUrl.RETURN_CHANGE).bind(this);
    this.goToGuide = Navigate.goTo(RouterUrl.GUIDE).bind(this);
    this.goToContact = Navigate.goTo(RouterUrl.CONTACT).bind(this);
  }

  goToCategory = (categoryId) => Navigate.goTo(`${RouterUrl.CATEGORY}?id=${categoryId}`).bind(this);

  toggleProfile = () => {
    this.setState((prevState) => ({
      isOpenProfile: !prevState.isOpenProfile,
    }));
  };

  toggleCollapse = (collapseID) => () =>
    this.setState((prevState) => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : '',
    }));

  closeCollapse = (collID) => () => {
    const { collapseID } = this.state;
    window.scrollTo(0, 0);
    collapseID === collID && this.setState({ collapseID: '' });
  };

  componentDidMount() {
    const { actionGetCategories, actionGetWishlist, actionGetCart } = this.props;
    actionGetCategories();
    actionGetWishlist();
    actionGetCart();
  }

  signOut = () => {
    this.props.actionSignOut();
  };

  getcollapseIDs(categoryIDs) {
    const { categories } = this.props;

    function pushStorage(storageIDs, step, id) {
      if (storageIDs.length > step) {
        storageIDs[step] = id;
      } else {
        storageIDs.push(id);
      }
    }

    function trace(datas, id, storageIDs, step) {
      if (Array.isArray(datas)) {
        for (let i = 0; i < datas.length; i++) {
          const item = datas[i];
          if (item.id === id) {
            pushStorage(storageIDs, step, item.id);
            return step;
          }
          if (item.child) {
            pushStorage(storageIDs, step, item.id);
            const found = trace(item.child, id, storageIDs, step + 1);
            if (found >= 0) {
              return found;
            }
          }
        }
      }
      return -1;
    }

    const storageIDs = [];
    const found = trace(categories, categoryIDs, storageIDs, 0);

    return found < 0 ? [] : storageIDs.slice(0, found + 1);
  }

  toggleCollapseCategory = (collapseCategoryID) => () => {
    const newcollapseIDs = this.getcollapseIDs(collapseCategoryID);
    this.setState((prevState) => ({
      collapseIDs: !prevState.collapseIDs.includes(collapseCategoryID)
        ? newcollapseIDs
        : newcollapseIDs.slice(0, newcollapseIDs.length - 1),
    }));
  };

  renderCategories(categories, collapseIDs) {
    return categories.map((category) => {
      return this.renderCategory(category, collapseIDs);
    });
  }

  renderCategory(category, collapseIDs) {
    const isOpen = collapseIDs.includes(category.id);
    return (
      <MDBCard key={`right_category_${category.id}`}>
        <MDBCollapseHeader tag='div' onClick={this.toggleCollapseCategory(category.id)}>
          <span onClick={this.goToCategory(category.id)}>{category.name}</span>
          {category.child && category.child.length > 0 && (
            <i className={isOpen ? 'fa fa-angle-down rotate-icon' : 'fa fa-angle-down'} />
          )}
        </MDBCollapseHeader>
        {category.child && category.child.length > 0 && (
          <MDBCollapse isOpen={isOpen}>
            <MDBCardBody>
              {category.child.map((item) => {
                return this.renderCategory(item, collapseIDs);
              })}
            </MDBCardBody>
          </MDBCollapse>
        )}
      </MDBCard>
    );
  }

  renderMainCategories(categories = []) {
    categories = Array.isArray(categories) ? categories : [];
    const store = categories.filter((item) => !item.child && item.child.length > 0);
    const queue = [...categories];

    while (queue.length) {
      const category = queue.shift();
      if (category.child && Array.isArray(category.child) && category.child.length > 0) {
        store.push(category);
        queue.push(...category.child);
      }
    }

    const sorted = store.sort((a, b) => ((b.child && b.child.length) || 0) - ((a.child && a.child.length) || 0));

    return sorted.map((category, idx) => {
      return (
        <React.Fragment key={`main_category_${category.id}`}>
          {idx > 0 && idx % 2 === 0 && (
            <MDBCol md='12' className='divider-content-categories'>
              <MDBDropdownItem divider />
            </MDBCol>
          )}
          <MDBCol md='6'>
            <MDBDropdownItem onClick={this.goToCategory(category.id)} className='main-category' tag='div'>
              {category.name}
            </MDBDropdownItem>
            <MDBDropdownItem divider />
            {category.child && (
              <React.Fragment>
                {category.child.map((child) => {
                  return (
                    <React.Fragment key={`main_category_child_${child.id}`}>
                      <MDBDropdownItem onClick={this.goToCategory(child.id)} tag='div'>
                        {child.name}
                      </MDBDropdownItem>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            )}
          </MDBCol>
        </React.Fragment>
      );
    });
  }

  componentDidUpdate(prevProps) {
    const { draftPutCart, actionPutCart } = this.props;
    if (prevProps.draftPutCart !== draftPutCart && draftPutCart !== undefined) {
      actionPutCart({ details: draftPutCart });
    }
    const { draftPutWishlist, actionPutWishlist } = this.props;
    if (prevProps.draftPutWishlist !== draftPutWishlist && draftPutWishlist !== undefined) {
      actionPutWishlist({ bookIds: draftPutWishlist });
    }
  }

  render() {
    const { isOpenProfile, collapseID, collapseIDs } = this.state;
    const { token, avatar, cart, wishlist, categories = [] } = this.props;
    const hiddenSideNav = collapseID !== '';

    return (
      <header>
        <MDBNavbar className='main-navbar' color='White' light expand='md' fixed='top' scrolling>
          <MDBSideNav
            breakWidth={Number.MAX_VALUE}
            triggerOpening={hiddenSideNav}
            fixed
            className='left-sidenav'
            hidden
          >
            <li>
              <ul className='social'>
                <li>
                  <a href='#!'>
                    <MDBIcon brand icon='facebook' />
                  </a>
                </li>
                <li>
                  <a href='#!'>
                    <MDBIcon brand icon='pinterest' />
                  </a>
                </li>
                <li>
                  <a href='#!'>
                    <MDBIcon brand icon='google-plus' />
                  </a>
                </li>
                <li>
                  <a href='#!'>
                    <MDBIcon brand icon='twitter' />
                  </a>
                </li>
              </ul>
            </li>
            <MDBInput
              className='input-search'
              type='text'
              hint='Search'
              style={{
                padding: '8px 10px 8px 30px',
              }}
            />
            <div className='md-accordion categories'>{this.renderCategories(categories, collapseIDs)}</div>

            {/* <MDBSideNavNav>
              <MDBSideNavItem>Submit listing</MDBSideNavItem>
              <MDBSideNavCat name='Submit blog' id='submit-blog-cat'>
                <MDBSideNavItem>Submit listing</MDBSideNavItem>
                <MDBSideNavItem>Registration form</MDBSideNavItem>
              </MDBSideNavCat>
              <MDBSideNavCat name='Instruction' id='instruction-cat'>
                <MDBSideNavItem>For bloggers</MDBSideNavItem>
                <MDBSideNavItem>For authors</MDBSideNavItem>
              </MDBSideNavCat>
              <MDBSideNavCat name='About' id='about-cat' icon='eye'>
                <MDBSideNavItem>Instruction</MDBSideNavItem>
                <MDBSideNavItem>Monthly meetings</MDBSideNavItem>
              </MDBSideNavCat>
              <MDBSideNavCat name='Contact me' id='contact-me-cat'>
                <MDBSideNavItem>FAQ</MDBSideNavItem>
                <MDBSideNavItem>Write a message</MDBSideNavItem>
              </MDBSideNavCat>
            </MDBSideNavNav> */}
          </MDBSideNav>

          <MDBContainer className='main-menu'>
            <MDBNavbarToggler
              className='left-sidenav-toggler'
              left
              onClick={this.toggleCollapse('mainNavbarCollapse')}
            />
            <MDBNavbarBrand href='/'>
              <strong>Book Ecommerce</strong>
            </MDBNavbarBrand>
            {/* <MDBCollapse id='mainNavbarCollapse' isOpen={collapseID} navbar> */}
            <MDBCollapse navbar>
              <MDBNavbarNav left className='left-menu'>
                <MDBNavItem active={['', '/', RouterUrl.HOME].includes(window.location.pathname)}>
                  <MDBNavLink to={RouterUrl.HOME}>Trang chủ</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active={[RouterUrl.PRODUCT_DETAIL, RouterUrl.CATEGORY].includes(window.location.pathname)}>
                  <MDBDropdown>
                    <MDBDropdownToggle nav>Danh mục</MDBDropdownToggle>
                    <MDBDropdownMenu className='menu-popup-categories'>
                      <MDBRow className='content-popup-categories'>{this.renderMainCategories(categories)}</MDBRow>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </MDBNavItem>
                {/* <MDBNavItem active={[RouterUrl.PRODUCT_DETAIL, RouterUrl.CATEGORY].includes(window.location.pathname)}>
                  <MDBNavLink to={RouterUrl.CATEGORY}>Danh mục</MDBNavLink>
                </MDBNavItem> */}
                {/* <MDBNavItem>
                  <MDBNavLink to='/home/author'>Tác giả</MDBNavLink>
                </MDBNavItem> */}
                <MDBNavItem>
                  <MDBDropdown>
                    <MDBDropdownToggle nav className='btn-flat btn-dropdown'>
                      <div className='nav-link-div'>Chính sách</div>
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem onClick={this.goToPrivacy}>Bảo mật</MDBDropdownItem>
                      <MDBDropdownItem onClick={this.goToPayment}>Thanh toán</MDBDropdownItem>
                      <MDBDropdownItem onClick={this.goToDelivery}>Vận chuyển</MDBDropdownItem>
                      <MDBDropdownItem onClick={this.goToReturnChange}>Đổi trả và hủy đơn hàng</MDBDropdownItem>
                      <MDBDropdownItem onClick={this.goToGuide}>Hướng dẫn đặt hàng</MDBDropdownItem>
                      <MDBDropdownItem onClick={this.goToContact}>Liên hệ</MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </MDBNavItem>
                <MDBNavItem>
                  <MDBNavLink to={RouterUrl.INTRODUCE}>Về chúng tôi</MDBNavLink>
                </MDBNavItem>
              </MDBNavbarNav>
            </MDBCollapse>
            <MDBNavbarNav right className='right-menu'>
              <MDBNavItem>
                <MDBNavLink className='bubble' to='/home/wishlist'>
                  <MDBIcon size='lg' far icon='heart' />
                  {wishlist && Array.isArray(wishlist) && wishlist.length > 0 && (
                    <span className='bubble-value'>{wishlist.length}</span>
                  )}
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBDropdown>
                  <MDBDropdownToggle className='btn-flat btn-dropdown button-cart'>
                    <div className='bubble nav-link-div'>
                      <MDBIcon size='lg' fab icon='opencart' />
                      {cart && Array.isArray(cart.detail) && cart.detail.length > 0 && (
                        <span className='bubble-value'>{cart.detail.length}</span>
                      )}
                    </div>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu right>
                    <CartQuickView />
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavItem>
              <MDBNavItem>
                <MDBDropdown>
                  <MDBDropdownToggle className='btn-flat btn-dropdown button-cart'>
                    <div className='nav-link-div'>
                      {!token ? (
                        <MDBIcon size='lg' far icon='user' />
                      ) : (
                        <img className='icon-avatar' src={prepareAvatarUrl(avatar, DEFAULT_AVATAR)} alt='' />
                      )}
                    </div>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu right>
                    <MDBDropdownItem onClick={this.goToOrder}>Đơn hàng</MDBDropdownItem>
                    {!token && <MDBDropdownItem onClick={this.goToSignIn}>Đăng nhập</MDBDropdownItem>}
                    {!token && <MDBDropdownItem onClick={this.goToSignUp}>Đăng kí</MDBDropdownItem>}
                    {token && <MDBDropdownItem onClick={this.toggleProfile}>Hồ sơ</MDBDropdownItem>}
                    {token && <MDBDropdownItem onClick={this.signOut}>Đăng xuất</MDBDropdownItem>}
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavItem>
            </MDBNavbarNav>
          </MDBContainer>
        </MDBNavbar>
        <Profile isOpen={isOpenProfile} close={this.toggleProfile} />
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  const { token, avatar, cart, wishlist, draftPutCart, draftPutWishlist } = state.UserReducer || {};
  const { categories } = state.SysReducer || {};
  return { token, avatar, cart, wishlist, categories, draftPutCart, draftPutWishlist };
};
export const Navbar = connect(mapStateToProps, {
  actionGetCategories,
  actionSignOut,
  actionGetWishlist,
  actionPutWishlist,
  actionGetCart,
  actionPutCart,
})(withRouter(NavbarComponent));
