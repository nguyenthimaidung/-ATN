import { MDBBtn, MDBCard, MDBCardBody, MDBIcon, MDBInput, MDBTable } from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './ImportBook.css';
import { SuccessPopup } from '../SuccessPopup';
import { MSelect } from '../../components/Select/Select';
import {
  actionGetAllBook,
  actionUpdateQuantityBooks,
  ACTION_UPDATE_QUANTITY_BOOKS,
} from '../../datas/redux/AdminAction';

class ImportBookComponent extends React.Component {
  state = {
    draftSelectedBookId: undefined,
    draftQuantity: 0,
    draftImportBooks: [],
    // ui
    isOpenSuccessPopup: false,
    bookOptions: [],
  };

  createBookOptions = (allBooks) => {
    return allBooks
      ? allBooks.data.map((book) => {
          return {
            text: book.name,
            value: `@${book.id}${book.isbn ? `#${book.isbn}` : ''}`,
            checked: false,
          };
        })
      : [];
  };

  handleChangeValue = (name) => (value) => {
    this.setState({ [name]: (value && +value) || 0 });
  };

  handleChangeSelectValue = (value) => {
    this.setState({ draftSelectedBookId: (value[0] && value[0].split('#')[0].split('@')[1]) || undefined });
  };

  handleImport = () => {
    const { draftSelectedBookId, draftQuantity, draftImportBooks } = this.state;

    if (!draftSelectedBookId || !draftQuantity) {
      return;
    }

    const { allBooks } = this.props;
    const book = allBooks.data.find((book) => book.id === +draftSelectedBookId);

    if (book) {
      const importBook = { ...book, importQuantity: draftQuantity };
      this.setState({
        draftImportBooks: [importBook, ...draftImportBooks.filter((item) => item.id !== importBook.id)],
        draftQuantity: 0,
        draftSelectedBookId: undefined,
        bookOptions: this.createBookOptions(allBooks),
      });
    }
  };

  handleRemove = (id) => () => {
    const { draftImportBooks } = this.state;
    this.setState({
      draftImportBooks: [...draftImportBooks.filter((item) => item.id !== id)],
    });
  };

  handleUpdateQuantity = () => {
    const { draftImportBooks } = this.state;
    this.props.actionUpdateQuantityBooks({
      updates: draftImportBooks.map((book) => ({
        id: book.id,
        quantity: book.quantity + book.importQuantity,
      })),
    });
  };

  toggleSuccessPopup = () => {
    this.setState({ isOpenSuccessPopup: false });
  };

  componentDidMount() {
    const { actionGetAllBook } = this.props;
    actionGetAllBook();
  }

  componentDidUpdate(prevProps) {
    const { allBooks } = this.props;
    if (prevProps.allBooks !== allBooks) {
      this.setState({ bookOptions: this.createBookOptions(allBooks) });
    }
    const { action, success, doing, error } = this.props;
    if (
      prevProps.action !== action ||
      prevProps.success !== success ||
      prevProps.doing !== doing ||
      prevProps.error !== error
    ) {
      if (action === ACTION_UPDATE_QUANTITY_BOOKS && success && !doing && !error) {
        this.setState({ draftImportBooks: [], isOpenSuccessPopup: true });
      }
    }
  }

  render() {
    const { draftQuantity, draftImportBooks, isOpenSuccessPopup, bookOptions } = this.state;

    return (
      <React.Fragment>
        <section className='mb-5'>
          <MDBCard>
            <MDBCardBody>
              <div className='d-flex'>
                <MSelect
                  search
                  searchId='import-book-search'
                  className='select-book'
                  searchLabel='Tìm kiếm'
                  options={bookOptions}
                  getValue={this.handleChangeSelectValue}
                  label='Sách nhập'
                />
                <MDBInput
                  value={draftQuantity}
                  getValue={this.handleChangeValue('draftQuantity')}
                  containerClass='quantity-book'
                  type='number'
                  label='Số lượng'
                />
                <MDBBtn onClick={this.handleImport} className='button-import'>
                  Nhập
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </section>

        <section className='mb-5'>
          <MDBCard>
            <MDBCardBody>
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
                        <span>Số lượng trong kho</span>
                        {/* <MDBIcon icon='sort' /> */}
                      </div>
                    </th>
                    <th className='th-lg'>
                      <div>
                        <span>Số lượng nhập</span>
                        {/* <MDBIcon icon='sort' /> */}
                      </div>
                    </th>
                    <th className='th-lg col-action'></th>
                  </tr>
                </thead>

                <tbody>
                  {draftImportBooks.map((book) => (
                    <tr key={`book_${book.id}`}>
                      <td>{book.isbn}</td>
                      <td>{book.name}</td>
                      <td>{book.quantity}</td>
                      <td>{book.importQuantity}</td>
                      <td className='col-action'>
                        <MDBBtn onClick={this.handleRemove(book.id)} flat className='button-del'>
                          <MDBIcon icon='trash-alt' />
                        </MDBBtn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </MDBTable>

              {draftImportBooks.length > 0 && (
                <div className='d-flex justify-content-end'>
                  <MDBBtn onClick={this.handleUpdateQuantity} className='button-import'>
                    Lưu
                  </MDBBtn>
                </div>
              )}
            </MDBCardBody>
          </MDBCard>
        </section>

        <SuccessPopup
          onFinish={this.toggleSuccessPopup}
          close={this.toggleSuccessPopup}
          isOpen={isOpenSuccessPopup}
          title='Nhập sách thành công'
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { action, success, doing, error, allBooks } = state.AdminReducer || {};
  return { action, success, doing, error, allBooks };
};
export const ImportBook = connect(mapStateToProps, {
  actionGetAllBook,
  actionUpdateQuantityBooks,
})(withRouter(ImportBookComponent));
