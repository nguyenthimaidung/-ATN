import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCarousel,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBCol,
  MDBIcon,
  MDBRow,
  MDBTabContent,
  MDBTabPane,
} from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { getDiscountBook } from '../../utils/BookUtil';
import { formatPrice } from '../../utils/Util';
import './BookDetail.css';

class BookDetailComponent extends React.Component {
  actionBack = () => {
    this.props.onBack && this.props.onBack();
  };

  render() {
    const { book } = this.props;

    const images = book
      ? [book.thumbImg1, book.thumbImg2, book.thumbImg3, book.thumbImg4, book.thumbImg5].filter((item) => item !== null)
      : [];

    const discount = getDiscountBook(book);

    return (
      <React.Fragment>
        <MDBCard>
          <MDBCardBody className='product-detail'>
            <div className='fragment-header'>
              <MDBBtn onClick={this.actionBack} className='button-back' flat>
                <MDBIcon icon='arrow-left' />
              </MDBBtn>
              THÔNG TIN SÁCH
            </div>
            <MDBRow>
              <MDBCol lg='6'>
                <MDBCarousel activeItem={1} length={images.length} showControls showIndicators>
                  <MDBCarouselInner>
                    {images &&
                      images.map((item, idx) => (
                        <MDBCarouselItem key={`img_${idx}`} itemId={idx + 1}>
                          <img className='d-block w-100' src={item} alt='' />
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
                  </div>
                </div>
              </MDBCol>
            </MDBRow>
            <div className='tab-container'>
              <div className='tab-header d-flex'>
                <MDBCol>
                  <div style={{ textAlign: 'center' }}>Nội Dung Sách</div>
                </MDBCol>
              </div>
              <MDBTabContent activeItem='description'>
                <MDBTabPane tabId='description'>
                  <div className='ck-content' dangerouslySetInnerHTML={{ __html: book.description }} />
                </MDBTabPane>
              </MDBTabContent>
            </div>
          </MDBCardBody>
        </MDBCard>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  // const {} = state.AdminReducer || {};
  return {};
};
export const BookDetail = connect(mapStateToProps, {})(withRouter(BookDetailComponent));
