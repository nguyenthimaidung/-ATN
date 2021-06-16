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
} from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Author.css';
import { actionSetTake, actionGetAuthors, actionDelAuthor, ACTION_DEL_AUTHOR } from '../../datas/redux/AdminAction';
import { formatDate, getTakeOptions } from '../../utils/Util';
import { Pagination } from '../Pagination';
import { FormAuthor, GenderText } from './FormAuthor';
import { actionResetSucces } from '../../datas/redux/AppAction';
import { Actions } from '../../Constant';
import { ConfirmPopup } from '../ConfirmPopup';

class AuthorComponent extends React.Component {
  state = {
    draftSearch: '',
    page: 0,
    // action data
    doAction: Actions.LIST,
    doData: undefined,
    // view data
    takeOptions: [],
  };

  constructor(props) {
    super(props);
    const { take } = props;
    this.state.takeOptions = getTakeOptions(take);
  }

  handleChangeValue = (name) => (value) => {
    this.setState({ [name]: value });
  };

  handleChangeTake = (value) => {
    const { actionSetTake } = this.props;
    actionSetTake({ take: +value[0] });
  };

  handleGetAuthor = (e) => {
    e && e.preventDefault && e.preventDefault();
    const { draftSearch, page } = this.state;
    const { take, actionGetAuthors } = this.props;
    actionGetAuthors({
      page: page || 0,
      take,
      search: draftSearch,
    });
  };

  handleSelectPage = (value) => {
    this.setState({ page: value }, this.handleGetAuthor);
  };

  openAdd = () => {
    this.props.actionResetSucces();
    this.setState({ doAction: Actions.ADD });
  };

  openEdit = (author) => () => {
    this.props.actionResetSucces();
    this.setState({ doAction: Actions.EDIT, doData: author });
  };

  openConfirmDel = (author) => () => {
    this.props.actionResetSucces();
    this.setState({ doAction: Actions.DEL, doData: author });
  };

  actionDel = () => {
    const { doData } = this.state;
    this.props.actionDelAuthor({ id: doData.id });
  };

  closeForm = (isNeedRefresh) => {
    if (isNeedRefresh) {
      this.setState({ doAction: Actions.LIST, page: 0 }, this.handleGetAuthor);
    } else {
      this.setState({ doAction: Actions.LIST });
    }
  };

  refreshData = (action) => () => {
    if (action === Actions.EDIT || action === Actions.DEL) {
      this.setState({ doAction: Actions.LIST }, this.handleGetAuthor);
    }
  };

  componentDidMount() {
    this.handleGetAuthor();
  }

  componentDidUpdate(prevProps) {
    const { take } = this.props;
    if (prevProps.take !== take) {
      this.setState({ page: 0, takeOptions: getTakeOptions(take) }, this.handleGetAuthor);
    }

    const { action, success, doing, error } = this.props;
    if (
      prevProps.action !== action ||
      prevProps.success !== success ||
      prevProps.doing !== doing ||
      prevProps.error !== error
    ) {
      if (action === ACTION_DEL_AUTHOR && success && !doing && !error) {
        // refesh list
        this.refreshData(Actions.DEL)();
      }
    }

    const { authors } = this.props;
    if (prevProps.authors !== authors) {
      if (authors && authors.data && authors.data.length === 0 && authors.pagination.page > 0) {
        this.handleSelectPage(authors.pagination.page - 1);
      }
    }
  }

  render() {
    const { draftSearch, doAction, doData, takeOptions } = this.state;
    const { authors } = this.props;

    return (
      <MDBContainer fluid>
        {doAction === Actions.LIST || doAction === Actions.DEL ? (
          <React.Fragment>
            <section className='mb-5'>
              <MDBCard>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm='2'>
                      <MDBSelect getValue={this.handleChangeTake} options={takeOptions} label='Hiển thị' />
                    </MDBCol>
                    <MDBCol sm='10'>
                      <div className='d-flex'>
                        <MDBInput
                          value={draftSearch}
                          getValue={this.handleChangeValue('draftSearch')}
                          containerClass='flex-grow-1'
                          type='text'
                          label='Tìm kiếm'
                        />
                        <MDBBtn onClick={this.handleGetAuthor} className='button-search'>
                          <i className='search-icon'></i>
                        </MDBBtn>
                      </div>
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
                        <th className='th-lg'></th>
                        <th className='th-lg'>
                          <div>
                            <span>Tên</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Giới tính</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Ngày sinh</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg'>
                          <div>
                            <span>Địa chỉ</span>
                            {/* <MDBIcon icon='sort' /> */}
                          </div>
                        </th>
                        <th className='th-lg col-action'></th>
                      </tr>
                    </thead>

                    <tbody>
                      {authors &&
                        authors.data &&
                        authors.data.map((author) => (
                          <tr key={`author_${author.id}`}>
                            <td className='image-cell'>
                              <img src={author.avatar} alt='' />
                            </td>
                            <td>{author.name}</td>
                            <td>{GenderText[author.gender]}</td>
                            <td>{author.birth && formatDate(author.birth)}</td>
                            <td>{author.address}</td>
                            <td className='col-action'>
                              <MDBBtn onClick={this.openEdit(author)} flat className='button-edit'>
                                <MDBIcon icon='pencil-alt' />
                              </MDBBtn>
                              <MDBBtn onClick={this.openConfirmDel(author)} flat className='button-del'>
                                <MDBIcon icon='trash-alt' />
                              </MDBBtn>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </MDBTable>

                  <div className='mt-3 d-flex justify-content-center'>
                    <Pagination pagination={authors && authors.pagination} getValue={this.handleSelectPage} />
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
        ) : doAction === Actions.ADD ? (
          <section className='mb-5'>
            <FormAuthor onBack={this.closeForm} refreshData={this.refreshData(Actions.ADD)} />
          </section>
        ) : (
          <section className='mb-5'>
            <FormAuthor onBack={this.closeForm} refreshData={this.refreshData(Actions.EDIT)} author={doData} />
          </section>
        )}
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { take, authors, action, success, doing, error } = state.AdminReducer || {};
  return { take, authors, action, success, doing, error };
};
export const Author = connect(mapStateToProps, {
  actionSetTake,
  actionGetAuthors,
  actionDelAuthor,
  actionResetSucces,
})(withRouter(AuthorComponent));
