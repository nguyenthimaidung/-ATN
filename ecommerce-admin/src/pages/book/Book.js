import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBSelect,
  MDBInput,
  MDBTable,
  MDBIcon,
  MDBBtn,
  MDBTooltip,
} from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Actions } from '../../Constant';
import {
  actionDelBook,
  actionGetAuthors,
  actionGetBooks,
  actionGetCategories,
  actionSetTake,
  ACTION_DEL_BOOK,
} from '../../datas/redux/AdminAction';
import { actionResetSucces } from '../../datas/redux/AppAction';
import { getDiscountBook } from '../../utils/BookUtil';
import { formatPrice, getTakeOptions } from '../../utils/Util';
import { ConfirmPopup } from '../ConfirmPopup';
import { Pagination } from '../Pagination';
import './Book.css';
import { BookDetail } from './BookDetail';
import { BookForm } from './BookForm';

class BookComponent extends React.Component {
  state = {
    page: 0,
    draftSearch: '',
    draftMinPrice: 0,
    draftMaxPrice: 10000000,
    draftAuthors: undefined,
    draftCategories: undefined,
    draftIsDiscounting: false,
    // action data
    doAction: Actions.LIST,
    doData: undefined,
    // view data
    takeOptions: [],
    discountOptions: [
      { text: 'Có hoặc không', value: '0', checked: true },
      { text: 'Đang giảm giá', value: '1', checked: false },
    ],
    categoryOptions: undefined,
    authorOptions: undefined,
  };

  initCategoryOptions(categories) {
    return categories
      ? categories.data.map((category) => ({
          text: category.name,
          value: `${category.id}`,
          checked: false,
        }))
      : [];
  }

  initAuthorOptions(authors) {
    return authors
      ? authors.data.map((author) => ({
          text: author.name,
          value: `${author.id}`,
          checked: false,
        }))
      : [];
  }

  constructor(props) {
    super(props);
    const { take } = props;
    this.state.takeOptions = getTakeOptions(take);
  }

  handleChangeValue = (name, isNumber) => (value) => {
    this.setState({ [name]: isNumber ? +value : value });
  };

  handleChangeAuthors = (value) => {
    this.setState({
      draftAuthors: value.length > 0 ? value.map((id) => ({ id: +id })) : undefined,
    });
  };

  handleChangeCategories = (value) => {
    this.setState({
      draftCategories: value.length > 0 ? value.map((id) => ({ id: +id })) : undefined,
    });
  };

  handleChangeIsDiscount = (value) => {
    this.setState({ draftIsDiscounting: value[0] === '1' });
  };

  handleChangeTake = (value) => {
    const { actionSetTake } = this.props;
    actionSetTake({ take: +value[0] });
  };

  handleGetBook = (e) => {
    e && e.preventDefault && e.preventDefault();
    const {
      draftSearch,
      draftMinPrice,
      draftMaxPrice,
      draftIsDiscounting,
      draftAuthors,
      draftCategories,
      page,
    } = this.state;
    const { take, actionGetBooks } = this.props;
    actionGetBooks({
      page: page || 0,
      take,
      search: draftSearch,
      minPrice: draftMinPrice,
      maxPrice: draftMaxPrice,
      isDiscounting: draftIsDiscounting,
      authorIds: draftAuthors,
      categoryIds: draftCategories,
    });
  };

  handleSelectPage = (value) => {
    this.setState({ page: value }, this.handleGetBook);
  };

  openView = (book) => () => {
    this.setState({ doAction: Actions.VIEW, doData: book });
  };

  openAdd = () => {
    this.props.actionResetSucces();
    this.setState({ doAction: Actions.ADD });
  };

  openEdit = (book) => () => {
    this.props.actionResetSucces();
    this.setState({ doAction: Actions.EDIT, doData: book });
  };

  openConfirmDel = (book) => () => {
    this.props.actionResetSucces();
    this.setState({ doAction: Actions.DEL, doData: book });
  };

  actionDel = () => {
    const { doData } = this.state;
    this.props.actionDelBook({ id: doData.id });
  };

  closeForm = (isNeedRefresh) => {
    if (isNeedRefresh) {
      this.setState({ doAction: Actions.LIST, page: 0 }, this.handleGetBook);
    } else {
      this.setState({ doAction: Actions.LIST });
    }
  };

  refreshData = (action) => () => {
    if (action === Actions.EDIT || action === Actions.DEL) {
      this.setState({ doAction: Actions.LIST }, this.handleGetBook);
    }
  };

  componentDidMount() {
    const { actionGetAuthors, actionGetCategories } = this.props;
    actionGetAuthors({ take: 1000000 });
    actionGetCategories();
    this.handleGetBook();
  }

  componentDidUpdate(prevProps) {
    const { take, authors, categories } = this.props;
    if (prevProps.take !== take) {
      this.setState({ page: 0, takeOptions: getTakeOptions(take) }, this.handleGetBook);
    }

    if (authors !== prevProps.authors) {
      this.setState({ authorOptions: this.initAuthorOptions(authors) });
    }

    if (categories !== prevProps.categories) {
      this.setState({ categoryOptions: this.initCategoryOptions(categories) });
    }

    const { action, success, doing, error } = this.props;
    if (
      prevProps.action !== action ||
      prevProps.success !== success ||
      prevProps.doing !== doing ||
      prevProps.error !== error
    ) {
      if (action === ACTION_DEL_BOOK && success && !doing && !error) {
        // refesh list
        this.refreshData(Actions.DEL)();
      }
    }

    const { books } = this.props;
    if (prevProps.books !== books) {
      if (books && books.data && books.data.length === 0 && books.pagination.page > 0) {
        this.handleSelectPage(books.pagination.page - 1);
      }
    }
  }

  render() {
    const {
      draftSearch,
      draftMinPrice,
      draftMaxPrice,
      doAction,
      doData,
      takeOptions,
      discountOptions,
      authorOptions,
      categoryOptions,
    } = this.state;
    const { books } = this.props;

    return (
      <MDBContainer fluid>
        {doAction === Actions.LIST || doAction === Actions.DEL ? (
          <React.Fragment>
            <section className='mb-5'>
              <MDBCard>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol md='12'>
                      <div className='d-flex'>
                        <MDBInput
                          value={draftSearch}
                          getValue={this.handleChangeValue('draftSearch')}
                          containerClass='flex-grow-1'
                          type='text'
                          label='Tìm kiếm'
                        />
                        <MDBBtn onClick={this.handleGetBook} className='button-search'>
                          <i className='search-icon'></i>
                        </MDBBtn>
                      </div>
                    </MDBCol>
                    <MDBCol lg='4' md='4'>
                      <MDBRow>
                        <MDBCol md='12' xs='6'>
                          <MDBSelect
                            getValue={this.handleChangeIsDiscount}
                            options={discountOptions}
                            label='Giảm giá'
                          />
                        </MDBCol>
                        <MDBCol md='12' xs='6'>
                          <MDBSelect
                            getValue={this.handleChangeTake}
                            options={takeOptions}
                            className='mt-md-0'
                            label='Hiển thị'
                          />
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>

                    <MDBCol lg='8' md='8'>
                      <MDBRow>
                        <MDBCol md='6' xs='6'>
                          <MDBInput
                            value={draftMinPrice}
                            getValue={this.handleChangeValue('draftMinPrice', true)}
                            type='number'
                            label='Giá nhỏ nhất'
                          />
                        </MDBCol>
                        <MDBCol md='6' xs='6'>
                          <MDBInput
                            value={draftMaxPrice}
                            getValue={this.handleChangeValue('draftMaxPrice', true)}
                            type='number'
                            label='Giá lớn nhất'
                          />
                        </MDBCol>
                        <MDBCol lg='6' md='6'>
                          <MDBSelect
                            search
                            multiple
                            getValue={this.handleChangeCategories}
                            options={categoryOptions}
                            label='Thể loại'
                            searchLabel='Tìm kiếm'
                            className='mt-md-0'
                          />
                        </MDBCol>
                        <MDBCol lg='6' md='6'>
                          <MDBSelect
                            search
                            multiple
                            getValue={this.handleChangeAuthors}
                            options={authorOptions}
                            label='Tác giả'
                            searchLabel='Tìm kiếm'
                            className='mt-md-0'
                          />
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </section>
            <section className='mb-5'>
              <MDBCard className='dashboard-card'>
                <MDBCardBody>
                  <div className='toolbar-actions'>
                    <MDBBtn onClick={this.openAdd} className='button-add'>
                      Thêm mới
                    </MDBBtn>
                  </div>
                  <MDBTable responsive hover className='data-table'>
                    <thead>
                      <tr>
                        <th className='th-lg'>
                          <div>
                            <span>ISBN</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Tên</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Số lượng</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Giá</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Dữ liệu</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg col-action'></th>
                      </tr>
                    </thead>

                    <tbody>
                      {books &&
                        books.data &&
                        books.data.map((book) => {
                          const discount = getDiscountBook(book);
                          return (
                            <tr key={`book_${book.id}`}>
                              <td>{book.isbn}</td>
                              <td>
                                <span className='link' onClick={this.openView(book)}>
                                  {book.name}
                                </span>
                              </td>
                              <td>{book.quantity}</td>
                              <td>
                                <span className='price'>
                                  <span className='currency-price'>
                                    {discount !== 0 && (
                                      <span className='discount-price'>{formatPrice(book.price)}</span>
                                    )}
                                    {formatPrice(book.price - discount)}
                                  </span>
                                </span>
                              </td>
                              <td>
                                <div className='data'>
                                  <MDBTooltip domElement tag='span' material sm placement='top'>
                                    <span>
                                      <MDBIcon far icon='comments' /> {book.viewCount}
                                    </span>
                                    <span>Lượt bình luận</span>
                                  </MDBTooltip>
                                  {book.rateAvg !== null && (
                                    <MDBTooltip domElement tag='span' material sm placement='top'>
                                      <span style={{ marginLeft: 20 }}>
                                        <MDBIcon far icon='star' /> {book.rateAvg}
                                      </span>
                                      <span>Điểm đánh giá</span>
                                    </MDBTooltip>
                                  )}
                                </div>
                              </td>
                              <td className='col-action'>
                                <MDBBtn onClick={this.openEdit(book)} flat className='button-edit'>
                                  <MDBIcon icon='pencil-alt' />
                                </MDBBtn>
                                <MDBBtn onClick={this.openConfirmDel(book)} flat className='button-del'>
                                  <MDBIcon icon='trash-alt' />
                                </MDBBtn>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </MDBTable>

                  <div className='mt-3 d-flex justify-content-center'>
                    <Pagination pagination={books && books.pagination} getValue={this.handleSelectPage} />
                  </div>
                </MDBCardBody>
              </MDBCard>
              <ConfirmPopup
                isOpen={doAction === Actions.DEL}
                close={this.closeForm}
                onConfirm={this.actionDel}
                title='Xác nhận xóa'
              />
            </section>
          </React.Fragment>
        ) : doAction === Actions.VIEW ? (
          <section className='mb-5'>
            <BookDetail onBack={this.closeForm} book={doData} />
          </section>
        ) : doAction === Actions.ADD ? (
          <section className='mb-5'>
            <BookForm onBack={this.closeForm} refreshData={this.refreshData(Actions.ADD)} />
          </section>
        ) : (
          <section className='mb-5'>
            <BookForm onBack={this.closeForm} refreshData={this.refreshData(Actions.EDIT)} book={doData} />
          </section>
        )}
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { take, authors, categories, books, action, success, doing, error } = state.AdminReducer || {};
  return { take, authors, categories, books, action, success, doing, error };
};
export const Book = connect(mapStateToProps, {
  actionSetTake,
  actionGetBooks,
  actionDelBook,
  actionResetSucces,
  actionGetAuthors,
  actionGetCategories,
})(withRouter(BookComponent));
