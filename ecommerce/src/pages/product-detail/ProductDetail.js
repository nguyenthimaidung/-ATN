import React from 'react';
import { Breadcrumb } from '../Breadcrumb';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCarousel,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBIcon,
  MDBTabContent,
  MDBTabPane,
  MDBMedia,
  MDBInput,
  MDBPagination,
  MDBPageItem,
  MDBPageNav,
  MDBRating,
  MDBNotification,
  toast,
} from 'mdbreact';
import './ProductDetail.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  actionGetBook,
  actionGetComment,
  actionGetRecommendBooks,
  actionPostComment,
} from '../../datas/redux/SysAction';
import { actionAddToCart, actionToggleWishlistItem } from '../../datas/redux/UserAction';
import { Link } from 'react-router-dom';
import { RouterUrl } from '../../Constant';
import { getDiscountBook } from '../../utils/BookUtil';
import { formatPrice, prepareAvatarUrl, prepareContent, prepareImgUrl } from '../../utils/Util';

const Tab = {
  DESCRIPTION: 'description',
  REVIEW: 'review',
};

const commentNum = 5;

class ProductDetailComponent extends React.Component {
  state = {
    activeTab: Tab.DESCRIPTION,
    bookId: undefined,
    draftRate: null,
    draftName: '',
    draftEmail: '',
    draftComment: '',
    draftPhone: '',
    // form data
    errorMessage: undefined,
  };

  handleChangeValue = (name) => (val) => {
    this.setState({ [name]: val });
  };

  handleChangeRate = (val) => {
    const { draftRate } = this.state;
    if (draftRate !== val) {
      this.setState({ draftRate: val });
    }
  };

  handleSelectTab = (tab) => () => {
    this.setState({ activeTab: tab });
  };

  getId() {
    let id = new URLSearchParams(window.location.search).get('id');
    if (id && id.trim() !== '') {
      id = +id;
      return Number.isNaN(id) ? undefined : id;
    }
    return undefined;
  }

  updateBookId = () => {
    this.setState({ bookId: this.getId() }, () => {
      const { bookId } = this.state;
      const { actionGetBook, actionGetRecommendBooks, actionGetComment } = this.props;
      if (bookId !== undefined) {
        actionGetBook({ id: bookId });
        actionGetComment({ bookId, page: 0, take: commentNum });
        actionGetRecommendBooks({ id: bookId, take: 4 });
      }
    });
  };

  componentDidMount() {
    this.updateBookId();
  }

  componentDidUpdate(prevState) {
    const { location, comment } = this.props;
    if (prevState.location.search !== location.search) {
      this.updateBookId();
    }
    if (prevState.comment !== comment) {
      toast.info(
        <MDBNotification
          iconClassName='deep-orange-text'
          icon='bell'
          show
          fade
          title='CHÀO BẠN'
          message='Đánh giá của bạn đã được hệ thống ghi nhận!'
          text='just now'
        />,
        {
          closeButton: false,
        }
      );
      this.handleSelectCommentPage(0)();
    }
  }

  handleSelectCommentPage = (page) => () => {
    const { bookId } = this.state;
    const { actionGetComment } = this.props;
    if (bookId !== undefined) {
      actionGetComment({ bookId, page: page, take: commentNum });
    }
  };

  checkInput = () => {
    const { token } = this.props;
    const { draftName, draftEmail, draftPhone, draftComment, draftRate } = this.state;
    if (!token) {
      if (
        draftName.trim() === '' ||
        draftEmail.trim() === '' ||
        draftPhone.trim() === '' ||
        draftComment.trim() === ''
      ) {
        this.setState({ errorMessage: 'Xin vui lòng điền đầy đủ thông tin dữ liệu!' });
        return false;
      }
    } else {
      if (!draftRate) {
        this.setState({ errorMessage: 'Xin vui lòng chọn sao đánh giá của bạn!' });
        return false;
      }
    }
    return true;
  };

  handlePostComment = () => {
    if (!this.checkInput()) {
      return;
    }

    const { draftName, draftEmail, draftPhone, draftComment, draftRate, bookId } = this.state;
    const { token } = this.props;

    const postData = {};

    if (token) {
      postData.bookId = bookId;
      postData.rate = draftRate;
      postData.content = draftComment;
    } else {
      postData.bookId = bookId;
      postData.name = draftName;
      postData.phone = draftPhone;
      postData.email = draftEmail;
      postData.content = draftComment;
    }

    this.props.actionPostComment(postData);

    this.setState({
      draftName: '',
      draftEmail: '',
      draftPhone: '',
      draftComment: '',
      draftRate: undefined,
      errorMessage: undefined,
    });
  };

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

  renderComment(comment) {
    return (
      <MDBMedia key={`comment_${comment.id}`} className='d-block d-md-flex mt-4'>
        <img
          className='card-img-64 rounded-circle d-flex mx-auto mb-3'
          src={
            (comment.info && comment.info.avatar && prepareAvatarUrl(comment.info.avatar)) ||
            'https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png'
          }
          alt=''
        />
        <MDBMedia body className='text-center text-md-left ml-md-3 ml-0'>
          <h5 className='mt-0' style={{ fontWeight: 500, fontSize: 16 }}>
            {comment.name || (comment.info && comment.info.name)}
          </h5>
          {comment.rate !== null && (
            <div className='rating d-flex d-md-block justify-content-center' style={{ marginBottom: 8 }}>
              <div className='star-rating'>
                <span style={{ width: comment.rate * 20 + '%' }} />
              </div>
            </div>
          )}
          {comment.content}
          {this.renderComments(comment.child)}
        </MDBMedia>
      </MDBMedia>
    );
  }

  renderPagination() {
    const { commentPagination } = this.props;
    const { page = 0, total = 0 } = commentPagination;
    const numPages = Math.floor(total / commentNum);
    const pages = [];
    for (let i = numPages < total / commentNum ? numPages + 1 : numPages; i > 0; i--) {
      pages.push(i);
    }

    return (
      <div className='pagination-container'>
        <MDBPagination>
          <MDBPageItem onClick={this.handleSelectCommentPage(page - 1)} disabled={page === 0}>
            <MDBPageNav>&laquo;</MDBPageNav>
          </MDBPageItem>
          {pages &&
            pages.map((item, idx) => (
              <MDBPageItem key={`pagination_${idx}`} onClick={this.handleSelectCommentPage(idx)} active={idx === page}>
                <MDBPageNav>{idx + 1}</MDBPageNav>
              </MDBPageItem>
            ))}
          <MDBPageItem
            onClick={this.handleSelectCommentPage(page + 1)}
            disabled={pages.length === 0 || page === pages.length - 1}
          >
            <MDBPageNav>&raquo;</MDBPageNav>
          </MDBPageItem>
        </MDBPagination>
      </div>
    );
  }

  renderComments(comments) {
    if (comments && Array.isArray(comments) && comments.length !== 0) {
      return comments.map((comment) => {
        return this.renderComment(comment);
      });
    }
  }

  render() {
    const { activeTab, bookId, draftName, draftEmail, draftComment, draftPhone, errorMessage } = this.state;
    const { token, book, comments, recommendBooks, cart, wishlist, wishlistLoadingId, cartLoadingId } = this.props;
    const detail = (cart && cart.detail) || [];
    const isInWishlist = wishlist && wishlist.find((item) => item.id === bookId);
    const isInCart = detail && detail.find((item) => item.bookId === bookId);

    const { commentPagination } = this.props;
    const { total = 0 } = commentPagination;

    const images = book
      ? [book.thumbImg1, book.thumbImg2, book.thumbImg3, book.thumbImg4, book.thumbImg5].filter(
          (item) => item !== null && item.trim() !== ''
        )
      : [];

    const discount = getDiscountBook(book);

    return (
      <React.Fragment>
        <Breadcrumb />
        <MDBContainer className='product-detail'>
          {bookId !== undefined && book && (
            <React.Fragment>
              <MDBRow>
                <MDBCol lg='6'>
                  <MDBCarousel activeItem={1} length={images.length} showControls showIndicators>
                    <MDBCarouselInner>
                      {images &&
                        images.map((item, idx) => (
                          <MDBCarouselItem key={`img_${idx}`} itemId={idx + 1}>
                            <img className='d-block w-100' src={prepareImgUrl(item)} alt='' />
                          </MDBCarouselItem>
                        ))}
                    </MDBCarouselInner>
                  </MDBCarousel>
                </MDBCol>
                <MDBCol className='product-info' lg='6'>
                  <div className='products-content'>
                    <h1 className='product-title'>{book.name}</h1>
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
                    <div className={`product-stock ${book.quantity ? 'in-stock' : ''}`}>
                      <span className='stock-icon'>
                        <i className='fa fa-check-circle'></i>
                      </span>
                      <span>{book.quantity ? 'Còn hàng' : 'Hết hàng'}</span>
                    </div>
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
                    </div>
                    <div className='metadata'>
                      <div className='list-author'>
                        <span className='item-label'>Tác giả:</span>
                        {book.authors &&
                          book.authors.map((item) => (
                            <span key={`author_${item.id}`} className='item-author'>
                              <a href='#!'>{item.name}</a>
                            </span>
                          ))}
                      </div>
                      <div className='list-category'>
                        <span className='item-label'>Thể loại:</span>
                        {book.categories &&
                          book.categories.map((item) => (
                            <span key={`category_${item.id}`} className='item-category'>
                              <a href='#!'>{item.name}</a>
                            </span>
                          ))}
                      </div>
                      {/* <div className='list-tag'>
                        <span className='item-label'>Tags:</span>
                        <span className='item-tag'>
                          <a href='#!'>Classic</a>
                        </span>
                        <span className='item-tag'>
                          <a href='#!'>Horror</a>
                        </span>
                      </div> */}
                      <div className='list-share'>
                        <span className='item-label'> Share:</span>
                        <a className='social-icon' href='#!'>
                          <MDBIcon fab icon='facebook-f' />
                        </a>
                        <a className='social-icon' href='#!'>
                          <MDBIcon fab icon='twitter' />
                        </a>
                        <a className='social-icon' href='#!'>
                          <MDBIcon fab icon='google-plus-g' />
                        </a>
                        <a className='social-icon' href='#!'>
                          <MDBIcon fab icon='instagram' />
                        </a>
                        <a className='social-icon' href='#!'>
                          <MDBIcon fab icon='linkedin-in' />
                        </a>
                      </div>
                    </div>
                  </div>
                </MDBCol>
              </MDBRow>
              <div className='tab-container'>
                <div className='tab-header d-flex'>
                  <MDBCol>
                    <div
                      className={['d-flex justify-content-end', activeTab === Tab.DESCRIPTION ? 'active' : ''].join(
                        ' '
                      )}
                      style={{ margin: '10px 15px 10px 30px' }}
                      onClick={this.handleSelectTab(Tab.DESCRIPTION)}
                    >
                      Nội Dung Sách
                    </div>
                  </MDBCol>
                  <MDBCol>
                    <div
                      className={['d-flex justify-content-start', activeTab === Tab.REVIEW ? 'active' : ''].join(' ')}
                      style={{ margin: '10px 30px 10px 15px' }}
                      onClick={this.handleSelectTab(Tab.REVIEW)}
                    >
                      Bình Luận ({total || book.viewCount})
                    </div>
                  </MDBCol>
                </div>
                <MDBTabContent activeItem={activeTab}>
                  <MDBTabPane tabId={Tab.DESCRIPTION}>
                    <div
                      className='ck-content'
                      dangerouslySetInnerHTML={{ __html: prepareContent(book.description) }}
                    />
                  </MDBTabPane>
                  <MDBTabPane tabId={Tab.REVIEW}>
                    <div className='content-reviews'>
                      <h2 className='review-title'>
                        {total} Bình luận về {book.name}
                      </h2>
                      {this.renderComments(comments)}
                      {this.renderPagination()}
                    </div>
                    <div className='form-reviews'>
                      <div className='review-title'>Thêm nhận xét</div>
                      {!token && (
                        <p className='comment-notes'>
                          Địa chỉ email của bạn sẽ không được tiết lộ. Thông tin yêu cầu được đánh dấu *
                        </p>
                      )}
                      {errorMessage && <p className='error-message'>{errorMessage}</p>}
                      {token && (
                        <div className='comment-form-rating d-flex align-items-baseline'>
                          <span style={{ marginRight: 16 }}>Đánh giá của bạn</span>
                          <MDBRating
                            getValue={(e) => this.handleChangeRate(e.value)}
                            tag='span'
                            iconSize='1x'
                            iconRegular
                          />
                        </div>
                      )}
                      {!token && (
                        <MDBRow className='comment-form-author'>
                          <MDBCol md='4'>
                            <MDBInput
                              value={draftName}
                              getValue={this.handleChangeValue('draftName')}
                              type='text'
                              label='Họ tên *'
                            />
                          </MDBCol>
                          <MDBCol md='4'>
                            <MDBInput
                              value={draftEmail}
                              getValue={this.handleChangeValue('draftEmail')}
                              type='text'
                              label='Email *'
                            />
                          </MDBCol>
                          <MDBCol md='4'>
                            <MDBInput
                              value={draftPhone}
                              getValue={this.handleChangeValue('draftPhone')}
                              type='text'
                              label='Số điện thoại *'
                            />
                          </MDBCol>
                        </MDBRow>
                      )}
                      <div className='comment-form-comment'>
                        <MDBInput
                          value={draftComment}
                          getValue={this.handleChangeValue('draftComment')}
                          type='textarea'
                          label='Bình luận của bạn *'
                          rows='5'
                        />
                      </div>
                      <div className='comment-form-submit'>
                        <MDBBtn onClick={this.handlePostComment} className='button-default'>
                          Gửi
                          <MDBIcon icon='paper-plane' className='ml-2' />
                        </MDBBtn>
                      </div>
                    </div>
                  </MDBTabPane>
                </MDBTabContent>
              </div>
            </React.Fragment>
          )}

          <div className='related-product'>
            <div className='title-block'>
              <h2>Sản phẩm liên quan</h2>
            </div>
            <MDBRow className='gird'>
              {recommendBooks &&
                recommendBooks.map((book) => {
                  const isInWishlist = wishlist && wishlist.find((item) => item.id === book.id);
                  const isInCart = detail && detail.find((item) => item.bookId === book.id);
                  const discount = getDiscountBook(book);
                  return (
                    <MDBCol key={`book_${book.id}`} md='3' sm='12'>
                      <div className='item-product'>
                        <div className='products-entry clearfix product-wapper'>
                          <div className='products-thumb'>
                            <div className='product-thumb-hover'>
                              <Link to={RouterUrl.productDetail(book.id)}>
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
                              </Link>
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
                            {/* <div className='description'>
                          Curabitur egestas malesuada volutpat. Nunc vel vestibulum odio, ac pellentesque lacus.
                          Pellentesque dapibus nunc nec est imperdiet, a malesuada sem rutrum. Sed quam odio, porta…
                        </div>
                        <div className='product-button'>
                          <MDBBtn className='button-default product-add-to-cart'>Add to cart</MDBBtn>
                          <MDBBtn className='button-default btn-icon product-like'>
                            <i className='product-add-to-wishlist' />
                          </MDBBtn>
                          <MDBBtn className='button-default btn-icon product-search'>
                            <i className='product-quickview loading' />
                          </MDBBtn>
                        </div> */}
                          </div>
                        </div>
                      </div>
                    </MDBCol>
                  );
                })}
            </MDBRow>
          </div>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (State) => {
  const { book, comment, comments = [], commentPagination = {}, recommendBooks } = State.SysReducer || {};
  const { token, cart, wishlist, wishlistLoadingId, cartLoadingId } = State.UserReducer || {};
  return {
    token,
    book,
    comment,
    comments,
    commentPagination,
    recommendBooks,
    cart,
    wishlist,
    wishlistLoadingId,
    cartLoadingId,
  };
};
export const ProductDetail = connect(mapStateToProps, {
  actionGetBook,
  actionGetRecommendBooks,
  actionGetComment,
  actionPostComment,
  actionAddToCart,
  actionToggleWishlistItem,
})(withRouter(ProductDetailComponent));
