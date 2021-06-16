import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBSelect,
  MDBInput,
  MDBTable,
  MDBBtn,
} from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Account.css';
import { actionSetTake, actionGetAccounts } from '../../datas/redux/AdminAction';
import { Pagination } from '../Pagination';
import { getTakeOptions } from '../../utils/Util';

class AccountComponent extends React.Component {
  state = {
    draftSearch: '',
    draftState: 'undefined',
    draftUserType: 0,
    page: 0,
    // view data
    takeOptions: [],
    accountTypeOptions: [
      { text: 'Người dùng', value: '0', checked: true },
      { text: 'Admin', value: '1', checked: false },
    ],
    accountStateOptions: [
      { text: 'Tất cả', value: 'undefined', checked: true },
      { text: 'Chưa kích hoạt', value: '0', checked: false },
      { text: 'Đã kích hoạt', value: '1', checked: false },
    ],
  };

  constructor(props) {
    super(props);
    const { take } = props;
    this.state.takeOptions = getTakeOptions(take);
  }

  handleChangeValue = (name) => (value) => {
    this.setState({ [name]: value });
  };

  handleChangeSelectValue = (name) => (value) => {
    this.setState({ [name]: value[0] });
  };

  handleChangeTake = (value) => {
    const { actionSetTake } = this.props;
    actionSetTake({ take: +value[0] });
  };

  handleGetAccount = (e) => {
    e && e.preventDefault && e.preventDefault();
    const { draftSearch, draftState, draftUserType, page } = this.state;
    const { take, actionGetAccounts } = this.props;
    actionGetAccounts({
      page: page || 0,
      take,
      search: draftSearch,
      type: +draftUserType,
      state: draftState === 'undefined' ? '' : +draftState,
    });
  };

  handleSelectPage = (value) => {
    this.setState({ page: value }, this.handleGetAccount);
  };

  componentDidMount() {
    this.handleGetAccount();
  }

  componentDidUpdate(prevProps) {
    const { take } = this.props;
    if (prevProps.take !== take) {
      this.setState({ page: 0, takeOptions: getTakeOptions(take) }, this.handleGetAccount);
    }
  }

  render() {
    const { draftSearch, takeOptions, accountStateOptions, accountTypeOptions } = this.state;
    const { accounts } = this.props;

    return (
      <MDBContainer fluid>
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
                    <MDBBtn onClick={this.handleGetAccount} className='button-search'>
                      <i className='search-icon'></i>
                    </MDBBtn>
                  </div>
                </MDBCol>
                <MDBCol md='4' xs='3'>
                  <MDBSelect getValue={this.handleChangeTake} options={takeOptions} label='Hiển thị' />
                </MDBCol>
                <MDBCol md='4' xs='5'>
                  <MDBSelect
                    getValue={this.handleChangeSelectValue('draftState')}
                    options={accountStateOptions}
                    label='Trạng thái'
                  />
                </MDBCol>
                <MDBCol md='4' xs='4'>
                  <MDBSelect
                    getValue={this.handleChangeSelectValue('draftUserType')}
                    label='Loại tài khoản'
                    options={accountTypeOptions}
                  />
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </section>
        <section className='mb-5'>
          <MDBCard className='dashboard-card'>
            <MDBCardBody>
              <div></div>
              <MDBTable responsive hover className='data-table'>
                <thead>
                  <tr>
                    <th className='th-lg'>
                      <div>
                        <span>Tên</span>
                        {/* <MDBIcon icon='sort' /> */}
                      </div>
                    </th>
                    <th className='th-lg'>
                      <div>
                        <span>SĐT</span>
                        {/* <MDBIcon icon='sort' /> */}
                      </div>
                    </th>
                    <th className='th-lg'>
                      <div>
                        <span>Email</span>
                        {/* <MDBIcon icon='sort' /> */}
                      </div>
                    </th>
                    <th className='th-lg'>
                      <div>
                        <span>Địa chỉ</span>
                        {/* <MDBIcon icon='sort' /> */}
                      </div>
                    </th>
                    <th className='th-lg'>
                      <div>
                        <span>Trạng thái</span>
                        {/* <MDBIcon icon='sort' /> */}
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {accounts &&
                    accounts.data &&
                    accounts.data.map((account) => {
                      return (
                        <tr key={`account_${account.id}`}>
                          <td>{account.name}</td>
                          <td>{account.phone}</td>
                          <td>{account.email}</td>
                          <td>{account.address}</td>
                          <td>{account.account.state === 1 ? 'Đã kích hoạt' : 'Chưa kích hoạt'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </MDBTable>

              <div className='mt-3 d-flex justify-content-center'>
                <Pagination pagination={accounts && accounts.pagination} getValue={this.handleSelectPage} />
              </div>
            </MDBCardBody>
          </MDBCard>
        </section>
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { take, accounts } = state.AdminReducer || {};
  return { take, accounts };
};
export const Account = connect(mapStateToProps, {
  actionSetTake,
  actionGetAccounts,
})(withRouter(AccountComponent));
