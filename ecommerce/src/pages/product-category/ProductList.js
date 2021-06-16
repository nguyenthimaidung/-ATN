import {
  MDBBtn,
  MDBCol,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBRow,
  MDBPagination,
  MDBPageItem,
  MDBPageNav,
  MDBNotification,
  toast,
} from 'mdbreact';
import React from 'react';
import './ProductList.css';
import { SortBookBy } from '../../datas/ApiUrls';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { actionAddToCart, actionToggleWishlistItem } from '../../datas/redux/UserAction';
import { RouterUrl } from '../../Constant';
import { getDiscountBook } from '../../utils/BookUtil';
import { formatPrice, prepareImgUrl } from '../../utils/Util';

const ViewType = {
  // col-md-x
  GIRD_LIST: '12',
  GIRD_TWO: '6',
  GIRD_THREE: '4',
  GIRD_FOUR: '3',
};

const SortByText = {
  [SortBookBy.DEFAULT]: 'Mặc định',
  [SortBookBy.POPULAR]: 'Phổ biến',
  [SortBookBy.BEST_RATE]: 'Đánh giá',
  [SortBookBy.BEST_SELLERS]: 'Bán chạy nhất',
  [SortBookBy.PRICE_INCREASE]: 'Giá tăng dần',
  [SortBookBy.PRICE_DECREASE]: 'Giá giảm dần',
};

class ProductListComponent extends React.Component {
  state = {
    viewType: ViewType.GIRD_THREE,
  };

  handleSelectViewType = (viewType) => () => {
    this.setState({ viewType });
  };

  handleSelectSortBy = (sortBy) => () => {
    const { onChange } = this.props;
    onChange && onChange({ sortBy });
  };

  handleSelectPage = (page) => () => {
    const { onChange } = this.props;
    onChange && onChange({ page });
  };

  handleSelectTake = (take) => () => {
    const { onChange } = this.props;
    onChange && onChange({ take });
  };

  parserViewType(viewType) {
    return {
      containerClassName: viewType === ViewType.GIRD_LIST ? 'gird list' : 'gird',
      md: viewType,
    };
  }

  componentDidUpdate(prevState) {
    const { books, categoryId } = this.props;
    if (prevState.categoryId === categoryId && prevState.books !== books) {
      window.scrollTo({ top: 400 });
    }
  }

  toggleWishlistItem = (bookId) => () => {
    const { token, actionToggleWishlistItem } = this.props;
    if (!token) {
      toast.info(
        <MDBNotification
          iconClassName='deep-orange-text'
          icon='bell'
          show
          fade
          title='CHÀO BẠN'
          message='Vui lòng đăng nhập để thêm sản phầm vào danh sách của bạn.'
          text='just now'
        />,
        {
          closeButton: false,
        }
      );
    } else {
      actionToggleWishlistItem({ bookId });
    }
  };

  addToCart = (bookId) => () => {
    const { actionAddToCart } = this.props;
    actionAddToCart({ bookId });
  };

  render() {
    const { viewType } = this.state;
    const { take, sortBy, pagination, books, cart, wishlist, wishlistLoadingId, cartLoadingId } = this.props;
    const detail = (cart && cart.detail) || [];

    const viewTypeParsed = this.parserViewType(viewType);

    const { page = 0, total = 0 } = pagination;
    const numPages = Math.floor(total / take);
    const pages = [];
    for (let i = numPages < total / take ? numPages + 1 : numPages; i > 0; i--) {
      pages.push(i);
    }
    return (
      <React.Fragment>
        <div className='top-bar-view d-flex'>
          <div className='top-bar-view-type'>
            <div
              className={`btn-view two ${viewType === ViewType.GIRD_TWO ? 'active' : ''}`}
              onClick={this.handleSelectViewType(ViewType.GIRD_TWO)}
            >
              <span className='icon-column'>
                <span className='layer first'>
                  <span></span>
                  <span></span>
                </span>
                <span className='layer middle'>
                  <span></span>
                  <span></span>
                </span>
                <span className='layer last'>
                  <span></span>
                  <span></span>
                </span>
              </span>
            </div>
            <div
              className={`btn-view three ${viewType === ViewType.GIRD_THREE ? 'active' : ''}`}
              onClick={this.handleSelectViewType(ViewType.GIRD_THREE)}
            >
              <span className='icon-column'>
                <span className='layer first'>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span className='layer middle'>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span className='layer last'>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </span>
            </div>
            <div
              className={`btn-view four ${viewType === ViewType.GIRD_FOUR ? 'active' : ''}`}
              onClick={this.handleSelectViewType(ViewType.GIRD_FOUR)}
            >
              <span className='icon-column'>
                <span className='layer first'>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span className='layer middle'>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span className='layer last'>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </span>
            </div>
            <div
              className={`btn-view list ${viewType === ViewType.GIRD_LIST ? 'active' : ''}`}
              onClick={this.handleSelectViewType(ViewType.GIRD_LIST)}
            >
              <span className='icon-column'>
                <span className='layer first'>
                  <span></span>
                  <span></span>
                </span>
                <span className='layer middle'>
                  <span></span>
                  <span></span>
                </span>
                <span className='layer last'>
                  <span></span>
                  <span></span>
                </span>
              </span>
            </div>
          </div>
          <div className='ml-auto product-filter'>
            <MDBDropdown>
              <MDBDropdownToggle className='btn-flat btn-dropdown'>
                Hiển thị: <span>{take}</span>
                <i />
              </MDBDropdownToggle>
              <MDBDropdownMenu className='mw-5' right>
                <MDBDropdownItem onClick={this.handleSelectTake(12)}>12</MDBDropdownItem>
                <MDBDropdownItem onClick={this.handleSelectTake(24)}>24</MDBDropdownItem>
                <MDBDropdownItem onClick={this.handleSelectTake(36)}>36</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
            <span className='space'></span>
            <MDBDropdown>
              <MDBDropdownToggle className='btn-flat btn-dropdown'>
                Sắp xếp: <span>{SortByText[sortBy]}</span>
                <i />
              </MDBDropdownToggle>
              <MDBDropdownMenu right>
                <MDBDropdownItem onClick={this.handleSelectSortBy(SortBookBy.DEFAULT)}>
                  {SortByText[SortBookBy.DEFAULT]}
                </MDBDropdownItem>
                <MDBDropdownItem onClick={this.handleSelectSortBy(SortBookBy.POPULAR)}>
                  {SortByText[SortBookBy.POPULAR]}
                </MDBDropdownItem>
                <MDBDropdownItem onClick={this.handleSelectSortBy(SortBookBy.BEST_RATE)}>
                  {SortByText[SortBookBy.BEST_RATE]}
                </MDBDropdownItem>
                <MDBDropdownItem onClick={this.handleSelectSortBy(SortBookBy.BEST_SELLERS)}>
                  {SortByText[SortBookBy.BEST_SELLERS]}
                </MDBDropdownItem>
                <MDBDropdownItem onClick={this.handleSelectSortBy(SortBookBy.PRICE_INCREASE)}>
                  {SortByText[SortBookBy.PRICE_INCREASE]}
                </MDBDropdownItem>
                <MDBDropdownItem onClick={this.handleSelectSortBy(SortBookBy.PRICE_DECREASE)}>
                  {SortByText[SortBookBy.PRICE_DECREASE]}
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </div>
        </div>
        <MDBRow className={viewTypeParsed.containerClassName}>
          {books &&
            books.map((book) => {
              const isInWishlist = wishlist && wishlist.find((item) => item.id === book.id);
              const isInCart = detail && detail.find((item) => item.bookId === book.id);
              const discount = getDiscountBook(book);
              return (
                <MDBCol key={`book_${book.id}`} md={viewTypeParsed.md} sm='12'>
                  <div className='item-product'>
                    <div className='products-entry clearfix product-wapper'>
                      <div className='products-thumb'>
                        <div className='product-thumb-hover'>
                          <a href='#!'>
                            <img
                              width='720'
                              height='1040'
                              src={prepareImgUrl(book.thumbImg1)}
                              className='main-image'
                              alt=''
                            />
                            <img
                              width='720'
                              height='1040'
                              src={prepareImgUrl(book.thumbImg2 || book.thumbImg1)}
                              className='hover-image back'
                              alt=''
                            />
                          </a>
                        </div>
                        <div className='product-button'>
                          <div
                            onClick={this.addToCart(book.id)}
                            className={`product-add-to-cart ${cartLoadingId === book.id ? 'loading' : ''} ${
                              isInCart ? 'added' : ''
                            }`}
                          />
                          {/* <div className='product-quickview' /> */}
                          <div
                            onClick={this.toggleWishlistItem(book.id)}
                            className={`product-add-to-wishlist ${wishlistLoadingId === book.id ? 'loading' : ''} ${
                              isInWishlist ? 'added' : ''
                            }`}
                          />
                        </div>
                      </div>
                      <div className='products-content'>
                        <h3 className='product-title'>
                          <Link to={RouterUrl.productDetail(book.id)}>{book.name}</Link>
                        </h3>
                        <div className='list-author'>
                          by{' '}
                          <span className='item-author'>
                            <a href='#!'>{book.authors && book.authors[0] && book.authors[0].name}</a>
                          </span>
                        </div>
                        {book.rateAvg !== null && (
                          <div className='rating'>
                            <div className='star-rating'>
                              <span style={{ width: `${Math.floor(book.rateAvg * 20)}%` }} />
                            </div>
                            <div className='review-count'>({book.rateCount} nhận xét)</div>
                          </div>
                        )}
                        <span className='price'>
                          <span className='currency-price'>
                            {discount !== 0 && <span className='discount-price'>{formatPrice(book.price)}</span>}
                            {formatPrice(book.price - discount)}
                          </span>
                        </span>
                        <div className='description'>{book.shortDescription}</div>
                        <div className='product-button'>
                          <MDBBtn
                            onClick={this.addToCart(book.id)}
                            disabled={book.quantity === 0 || cartLoadingId === book.id}
                            className='button-default product-add-to-cart'
                          >
                            <div className={`button-container ${cartLoadingId === book.id ? 'doing' : ''}`}>
                              <span className='text-content'>{isInCart ? 'Đã Thêm' : 'Thêm Vào Giỏ'}</span>
                              <span className='loading' />
                            </div>
                          </MDBBtn>
                          <MDBBtn
                            onClick={this.toggleWishlistItem(book.id)}
                            className='button-default btn-icon product-like'
                          >
                            <i
                              className={`product-add-to-wishlist ${wishlistLoadingId === book.id ? 'loading' : ''} ${
                                isInWishlist ? 'added' : ''
                              }`}
                            />
                          </MDBBtn>
                          <MDBBtn className='button-default btn-icon product-search'>
                            <i className='product-quickview' />
                          </MDBBtn>
                        </div>
                      </div>
                    </div>
                  </div>
                </MDBCol>
              );
            })}
        </MDBRow>
        <div className='pagination-container'>
          <MDBPagination>
            <MDBPageItem onClick={this.handleSelectPage(page - 1)} disabled={page === 0}>
              <MDBPageNav>&laquo;</MDBPageNav>
            </MDBPageItem>
            {pages &&
              pages.map((item, idx) => (
                <MDBPageItem key={`pagination_${idx}`} onClick={this.handleSelectPage(idx)} active={idx === page}>
                  <MDBPageNav>{idx + 1}</MDBPageNav>
                </MDBPageItem>
              ))}
            <MDBPageItem
              onClick={this.handleSelectPage(page + 1)}
              disabled={pages.length === 0 || page === pages.length - 1}
            >
              <MDBPageNav>&raquo;</MDBPageNav>
            </MDBPageItem>
          </MDBPagination>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (State) => {
  const { books = [], pagination = {} } = State.SysReducer || {};
  const { token, cart, wishlist, wishlistLoadingId, cartLoadingId } = State.UserReducer || {};
  return { token, books, pagination, cart, wishlist, wishlistLoadingId, cartLoadingId };
};
export const ProductList = connect(mapStateToProps, {
  actionAddToCart,
  actionToggleWishlistItem,
})(withRouter(ProductListComponent));
