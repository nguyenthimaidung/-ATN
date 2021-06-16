import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBDatePicker, MDBIcon, MDBInput, MDBRow, MDBSelect } from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './BookForm.css';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5';
import { editorConfiguration } from '../../Constant';
import {
  actionGetAuthors,
  actionGetCategories,
  actionPostBook,
  actionPutBook,
  ACTION_POST_BOOK,
  ACTION_PUT_BOOK,
} from '../../datas/redux/AdminAction';
import { SuccessPopup } from '../SuccessPopup';
import { actionResetSucces } from '../../datas/redux/AppAction';

class BookFormComponent extends React.Component {
  state = {
    draftThumbImg1: '',
    draftThumbImg2: '',
    draftThumbImg3: '',
    draftThumbImg4: '',
    draftThumbImg5: '',
    draftCoverImage: '',

    draftISBN: '',
    draftName: '',
    draftShortDescription: '',
    draftDescription: '',
    draftQuantity: 0,

    draftPrice: 0,
    draftDiscount: 0,
    draftDiscountBegin: null,
    draftDiscountEnd: null,

    rateAvg: undefined,
    rateCount: undefined,
    quantitySold: undefined,
    viewCount: undefined,

    draftCategories: [],
    draftAuthors: [],

    categoryOptions: undefined,
    authorOptions: undefined,

    // extra state
    bookAddedCount: 0,
    isOpenSuccessPopup: false,
  };

  initCategoryOptions(categories, book) {
    const selecteds = book ? book.categories.map((item) => item.id) : [];
    return categories
      ? categories.data.map((category) => ({
          text: category.name,
          value: `${category.id}`,
          checked: selecteds.includes(category.id),
        }))
      : [];
  }

  initAuthorOptions(authors, book) {
    const selecteds = book ? book.authors.map((item) => item.id) : [];
    return authors
      ? authors.data.map((author) => ({
          text: author.name,
          value: `${author.id}`,
          checked: selecteds.includes(author.id),
        }))
      : [];
  }

  constructor(props) {
    super(props);
    const { book } = this.props;

    if (book) {
      this.state.draftThumbImg1 = book.thumbImg1;
      this.state.draftThumbImg2 = book.thumbImg2;
      this.state.draftThumbImg3 = book.thumbImg3;
      this.state.draftThumbImg4 = book.thumbImg4;
      this.state.draftThumbImg5 = book.thumbImg5;
      this.state.draftCoverImage = book.coverImage;

      this.state.draftISBN = book.isbn;
      this.state.draftName = book.name;
      this.state.draftShortDescription = book.shortDescription;
      this.state.draftDescription = book.description;
      this.state.draftQuantity = book.quantity;

      this.state.draftPrice = book.price;
      this.state.draftDiscount = book.discount;
      this.state.draftDiscountBegin = book.discountBegin;
      this.state.draftDiscountEnd = book.discountEnd;

      this.state.rateAvg = book.rateAvg;
      this.state.rateCount = book.rateCount;
      this.state.quantitySold = book.quantitySold;
      this.state.viewCount = book.viewCount;
    }
  }

  resetInput = () => {
    const { authors, categories, book } = this.props;

    if (book) {
      this.setState({
        draftThumbImg1: book.thumbImg1,
        draftThumbImg2: book.thumbImg2,
        draftThumbImg3: book.thumbImg3,
        draftThumbImg4: book.thumbImg4,
        draftThumbImg5: book.thumbImg5,
        draftCoverImage: book.coverImage,

        draftISBN: book.isbn,
        draftName: book.name,
        draftShortDescription: book.shortDescription,
        draftDescription: book.description,
        draftQuantity: book.quantity,

        draftPrice: book.price,
        draftDiscount: book.discount,
        draftDiscountBegin: book.discountBegin,
        draftDiscountEnd: book.discountEnd,

        rateAvg: book.rateAvg,
        rateCount: book.rateCount,
        quantitySold: book.quantitySold,
        viewCount: book.viewCount,

        authorOptions: this.initAuthorOptions(authors, book),
        categoryOptions: this.initCategoryOptions(categories, book),
      });
    } else {
      this.setState({
        draftThumbImg1: '',
        draftThumbImg2: '',
        draftThumbImg3: '',
        draftThumbImg4: '',
        draftThumbImg5: '',
        draftCoverImage: '',

        draftISBN: '',
        draftName: '',
        draftShortDescription: '',
        draftDescription: '',
        draftQuantity: 0,

        draftPrice: 0,
        draftDiscount: 0,
        draftDiscountBegin: null,
        draftDiscountEnd: null,

        rateAvg: undefined,
        rateCount: undefined,
        quantitySold: undefined,
        viewCount: undefined,

        draftCategories: [],
        draftAuthors: [],

        authorOptions: this.initAuthorOptions(authors, book),
        categoryOptions: this.initCategoryOptions(categories, book),
      });
    }
  };

  handleChangeValue = (name, isNumber) => (value) => {
    this.setState({ [name]: isNumber ? +value : value });
  };

  handleChangeValueEvent = (name) => (e) => {
    this.setState({ [name]: e.target.value });
  };

  handleChoiceFile = (field) => () => {
    window.CKFinder.modal({
      chooseFiles: true,
      width: 800,
      height: 600,
      onInit: function (finder) {
        finder.on('files:choose', function (evt) {
          const file = evt.data.files.first();
          const url = file.getUrl();
          const output = document.getElementById(field);
          console.log(url);
          // output.value = url;
          // output.dispatchEvent(new Event('input', { bubbles: true }));

          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
            .set;
          nativeInputValueSetter.call(output, url);
          output.dispatchEvent(new Event('input', { bubbles: true }));
        });

        finder.on('file:choose:resizedImage', function (evt) {
          const url = evt.data.resizedUrl;
          const output = document.getElementById(field);
          console.log(url);
          // output.value = url;
          // output.dispatchEvent(new Event('input', { bubbles: true }));

          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
            .set;
          nativeInputValueSetter.call(output, url);
          output.dispatchEvent(new Event('input', { bubbles: true }));
        });
      },
    });
  };

  actionAdd = () => {
    const {
      draftThumbImg1,
      draftThumbImg2,
      draftThumbImg3,
      draftThumbImg4,
      draftThumbImg5,
      draftCoverImage,

      draftISBN,
      draftName,
      draftShortDescription,
      draftDescription,
      draftQuantity,

      draftPrice,
      draftDiscount,
      draftDiscountBegin,
      draftDiscountEnd,

      draftAuthors,
      draftCategories,
    } = this.state;
    this.props.actionPostBook({
      thumbImg1: draftThumbImg1,
      thumbImg2: draftThumbImg2,
      thumbImg3: draftThumbImg3,
      thumbImg4: draftThumbImg4,
      thumbImg5: draftThumbImg5,
      coverImage: draftCoverImage,

      isbn: draftISBN,
      name: draftName,
      shortDescription: draftShortDescription,
      description: draftDescription,
      quantity: draftQuantity,

      price: draftPrice,
      discount: draftDiscount,
      discountBegin: draftDiscountBegin,
      discountEnd: draftDiscountEnd,

      authorIds: draftAuthors,
      categoryIds: draftCategories,
    });
  };

  actionEdit = () => {
    const {
      draftThumbImg1,
      draftThumbImg2,
      draftThumbImg3,
      draftThumbImg4,
      draftThumbImg5,
      draftCoverImage,

      draftISBN,
      draftName,
      draftShortDescription,
      draftDescription,
      draftQuantity,

      draftPrice,
      draftDiscount,
      draftDiscountBegin,
      draftDiscountEnd,

      draftAuthors,
      draftCategories,
    } = this.state;
    this.props.actionPutBook({
      id: this.props.book.id,
      thumbImg1: draftThumbImg1,
      thumbImg2: draftThumbImg2,
      thumbImg3: draftThumbImg3,
      thumbImg4: draftThumbImg4,
      thumbImg5: draftThumbImg5,
      coverImage: draftCoverImage,

      isbn: draftISBN,
      name: draftName,
      shortDescription: draftShortDescription,
      description: draftDescription,
      quantity: draftQuantity,

      price: draftPrice,
      discount: draftDiscount,
      discountBegin: draftDiscountBegin,
      discountEnd: draftDiscountEnd,

      authorIds: draftAuthors,
      categoryIds: draftCategories,
    });
  };

  handleChangeAuthors = (value) => {
    this.setState({
      draftAuthors: value.map((id) => ({ id: +id })),
    });
  };

  handleChangeCategories = (value) => {
    this.setState({
      draftCategories: value.map((id) => ({ id: +id })),
    });
  };

  actionBack = () => {
    const { bookAddedCount } = this.state;
    this.props.onBack && this.props.onBack(bookAddedCount);
  };

  toggleSuccessPopup = () => {
    this.setState((prevState) => ({
      isOpenSuccessPopup: !prevState.isOpenSuccessPopup,
    }));
  };

  componentDidMount() {
    const { actionGetAuthors, actionGetCategories } = this.props;
    actionGetAuthors({ take: 1000000 });
    actionGetCategories();
  }

  componentDidUpdate(prevProps) {
    const { authors, categories, book } = this.props;

    if (authors !== prevProps.authors) {
      this.setState({ authorOptions: this.initAuthorOptions(authors, book) });
    }

    if (categories !== prevProps.categories) {
      this.setState({ categoryOptions: this.initCategoryOptions(categories, book) });
    }

    const { action, success, doing, error, refreshData, actionResetSucces } = this.props;
    if (
      prevProps.action !== action ||
      prevProps.success !== success ||
      prevProps.doing !== doing ||
      prevProps.error !== error
    ) {
      if (action === ACTION_PUT_BOOK && success && !doing && !error) {
        // close form after update
        refreshData && refreshData();
      } else if (action === ACTION_POST_BOOK && success && !doing && !error) {
        // reset input after add
        const { bookAddedCount } = this.state;
        this.setState({ bookAddedCount: bookAddedCount + 1 });
        this.resetInput();
        actionResetSucces();
        // noti add success
        this.toggleSuccessPopup();
      }
    }
  }

  render() {
    const {
      categoryOptions,
      authorOptions,

      draftThumbImg1,
      draftThumbImg2,
      draftThumbImg3,
      draftThumbImg4,
      draftThumbImg5,
      draftCoverImage,

      draftISBN,
      draftName,
      draftShortDescription,
      draftDescription,
      draftQuantity,

      draftPrice,
      draftDiscount,
      draftDiscountBegin,
      draftDiscountEnd,

      isOpenSuccessPopup,
    } = this.state;
    const { book } = this.props;

    const title = !book ? 'THÊM SÁCH MỚI' : 'CẬP NHẬT THÔNG TIN SÁCH';

    return (
      <React.Fragment>
        <MDBCard>
          <MDBCardBody>
            <div className='fragment-header'>
              <MDBBtn onClick={this.actionBack} className='button-back' flat>
                <MDBIcon icon='arrow-left' />
              </MDBBtn>
              <span>{title}</span>
            </div>
            <MDBRow>
              <MDBCol lg='6'>
                <div style={{ marginTop: 8 }}>
                  <MDBInput
                    value={draftName}
                    getValue={this.handleChangeValue('draftName')}
                    containerClass='mt-0'
                    label='Tên sách'
                  />
                  <MDBRow>
                    <MDBCol>
                      <MDBInput
                        value={draftISBN}
                        getValue={this.handleChangeValue('draftISBN')}
                        className='m-0'
                        containerClass='m-0'
                        label='ISBN'
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        value={draftQuantity}
                        getValue={this.handleChangeValue('draftQuantity', true)}
                        className='m-0'
                        containerClass='m-0'
                        type='number'
                        label='Số lượng'
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        value={draftPrice}
                        getValue={this.handleChangeValue('draftPrice', true)}
                        className='m-0'
                        containerClass='m-0'
                        type='number'
                        label='Giá'
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol>
                      <MDBInput
                        value={draftDiscount}
                        getValue={this.handleChangeValue('draftDiscount', true)}
                        className='mb-0'
                        containerClass='mb-0'
                        type='number'
                        label='Giảm giá'
                      />
                    </MDBCol>
                    <MDBCol>
                      <div className='date-picker-w-100 mb-0'>
                        <span className={`label ${draftDiscountBegin !== null ? 'active' : ''}`}>Từ ngày</span>
                        <MDBDatePicker
                          getValue={this.handleChangeValue('draftDiscountBegin')}
                          value={draftDiscountBegin}
                          valueDefault={null}
                        />
                      </div>
                    </MDBCol>
                    <MDBCol>
                      <div className='date-picker-w-100 mb-0'>
                        <span className={`label ${draftDiscountEnd !== null ? 'active' : ''}`}>Đến ngày</span>
                        <MDBDatePicker
                          getValue={this.handleChangeValue('draftDiscountEnd')}
                          value={draftDiscountEnd}
                          valueDefault={null}
                        />
                      </div>
                    </MDBCol>
                  </MDBRow>
                  <MDBSelect
                    selectAll
                    search
                    multiple
                    color='primary'
                    getValue={this.handleChangeCategories}
                    options={categoryOptions}
                    label='Thể loại'
                    searchLabel='Tìm kiếm'
                  />
                  <MDBSelect
                    selectAll
                    search
                    multiple
                    color='primary'
                    getValue={this.handleChangeAuthors}
                    options={authorOptions}
                    label='Tác Giả'
                    searchLabel='Tìm kiếm'
                  />

                  <MDBInput
                    value={draftShortDescription}
                    getValue={this.handleChangeValue('draftShortDescription')}
                    type='textarea'
                    label='Mô tả ngắn'
                  />
                </div>
              </MDBCol>

              <MDBCol lg='6'>
                <div className='images-input-container'>
                  <div className={`add-image${draftThumbImg1 ? '' : ' empty'}`}>
                    <img src={draftThumbImg1} alt='' />
                    <input
                      id='draftThumbImg1'
                      type='text'
                      onChange={this.handleChangeValueEvent('draftThumbImg1')}
                      style={{ display: 'none', width: '100%' }}
                    />
                    <div className='input-type-file' onClick={this.handleChoiceFile('draftThumbImg1')} />
                    <MDBIcon icon='plus' />
                  </div>
                  <div className={`add-image${draftThumbImg2 ? '' : ' empty'}`}>
                    <img src={draftThumbImg2} alt=''></img>
                    <input
                      id='draftThumbImg2'
                      type='text'
                      onChange={this.handleChangeValueEvent('draftThumbImg2')}
                      style={{ display: 'none', width: '100%' }}
                    />
                    <div className='input-type-file' onClick={this.handleChoiceFile('draftThumbImg2')} />
                    <MDBIcon icon='plus' />
                  </div>
                  <div className={`add-image${draftThumbImg3 ? '' : ' empty'}`}>
                    <img src={draftThumbImg3} alt='' />
                    <input
                      id='draftThumbImg3'
                      type='text'
                      onChange={this.handleChangeValueEvent('draftThumbImg3')}
                      style={{ display: 'none', width: '100%' }}
                    />
                    <div className='input-type-file' onClick={this.handleChoiceFile('draftThumbImg3')} />
                    <MDBIcon icon='plus' />
                  </div>
                  <div className={`add-image${draftThumbImg4 ? '' : ' empty'}`}>
                    <img src={draftThumbImg4} alt='' />
                    <input
                      id='draftThumbImg4'
                      type='text'
                      onChange={this.handleChangeValueEvent('draftThumbImg4')}
                      style={{ display: 'none', width: '100%' }}
                    />
                    <div className='input-type-file' onClick={this.handleChoiceFile('draftThumbImg4')} />
                    <MDBIcon icon='plus' />
                  </div>
                  <div className={`add-image${draftThumbImg5 ? '' : ' empty'}`}>
                    <img src={draftThumbImg5} alt='' className='' />
                    <input
                      id='draftThumbImg5'
                      type='text'
                      onChange={this.handleChangeValueEvent('draftThumbImg5')}
                      style={{ display: 'none', width: '100%' }}
                    />
                    <div className='input-type-file' onClick={this.handleChoiceFile('draftThumbImg5')} />
                    <MDBIcon icon='plus' />
                  </div>
                </div>
                <div className='images-input-container'>
                  <div className={`add-image-cover${draftCoverImage ? '' : ' empty'}`}>
                    <img src={draftCoverImage} alt='' />
                    <input
                      id='draftCoverImage'
                      type='text'
                      onChange={this.handleChangeValueEvent('draftCoverImage')}
                      style={{ display: 'none', width: '100%' }}
                    />
                    <div className='input-type-file' onClick={this.handleChoiceFile('draftCoverImage')} />
                    <MDBIcon icon='plus' />
                  </div>
                </div>
              </MDBCol>

              <MDBCol lg='12'>
                <div style={{ marginBottom: 14 }}>Mô tả sách</div>
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfiguration}
                  data={draftDescription}
                  // onInit={(editor) => {
                  //   // You can store the "editor" and use when it is needed.
                  //   console.log('Editor is ready to use!', editor);
                  //   console.log(Array.from(editor.ui.componentFactory.names()));
                  // }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    this.handleChangeValue('draftDescription')(data);
                  }}
                  // onBlur={(editor) => {
                  //   console.log('Blur.', editor);
                  // }}
                  // onFocus={(editor) => {
                  //   console.log('Focus.', editor);
                  // }}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol className='action-container'>
                {book ? <MDBBtn onClick={this.actionEdit}>Lưu</MDBBtn> : <MDBBtn onClick={this.actionAdd}>Thêm</MDBBtn>}
                <MDBBtn onClick={this.resetInput}>Đặt lại</MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
        <SuccessPopup
          onFinish={this.actionBack}
          onContinue={this.toggleSuccessPopup}
          close={this.toggleSuccessPopup}
          isOpen={isOpenSuccessPopup}
          title='Thêm thành công'
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { action, success, doing, error, authors, categories } = state.AdminReducer || {};
  return { action, success, doing, error, authors, categories };
};
export const BookForm = connect(mapStateToProps, {
  actionPostBook,
  actionPutBook,
  actionResetSucces,
  actionGetAuthors,
  actionGetCategories,
})(withRouter(BookFormComponent));
