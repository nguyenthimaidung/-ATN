import React from 'react';
import { MDBMask, MDBBtn, MDBView, MDBCard, MDBCardBody, MDBInput, MDBIcon } from 'mdbreact';
import './SignIn.css';
import { RouterUrl } from '../../Constant';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { actionSignIn, actionVerifyCode, actionResendVerifyCode } from '../../datas/redux/UserAction';
import { Link } from 'react-router-dom';
import { hideTawkTo, showTawkTo } from '../TawkTo';

class SignInComponent extends React.Component {
  state = {
    email: '',
    password: '',
    verifyCode: '',
    isInit: true,
  };

  handleChangeValue = (fieldName) => (value) => {
    this.setState({ [fieldName]: value });
  };

  submitLoginHandler = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.actionSignIn({ email, password });
    this.setState({ isInit: false });
  };

  resendVerifyCode = () => {
    const { id } = this.props;
    this.props.actionResendVerifyCode({ accountId: id });
  };

  submitVerifyCodeHandler = (event) => {
    event.preventDefault();
    const { id } = this.props;
    const { verifyCode } = this.state;
    this.props.actionVerifyCode({ accountId: id, verifyCode });
  };

  isExistsToken() {
    const { token, history } = this.props;
    if (token) {
      history.push(RouterUrl.HOME);
    }
  }

  componentDidMount() {
    this.isExistsToken();
    hideTawkTo();
  }

  componentDidUpdate() {
    this.isExistsToken();
  }

  componentWillUnmount() {
    showTawkTo();
  }

  render = () => {
    const { email, password, verifyCode, isInit } = this.state;
    const { state, error } = this.props;
    const id = new URLSearchParams(window.location.search).get('id');

    return (
      <React.Fragment>
        {state === 0 && (!isInit || id) ? (
          <div>
            <div className='form-sign-in'>
              <MDBView>
                <MDBMask className='d-block gradient'>
                  <div className='d-flex justify-content-center align-items-center w-100 h-100 scrollbar'>
                    <div style={{ width: 520, display: 'block', margin: 'auto', padding: '45px 0' }}>
                      <h2 className='text-center font-weight-normal white-text mb-5'>BOOK ECOMMERCE</h2>
                      <MDBCard>
                        <MDBCardBody>
                          <form className='needs-validation' onSubmit={this.submitVerifyCodeHandler} noValidate>
                            <h4 className='text-center white-text'>Xác thực email</h4>
                            <hr className='hr-light' />
                            <MDBInput
                              value={verifyCode}
                              iconClass='white-text icon-size'
                              label='Mã xác nhận'
                              type='text'
                              getValue={this.handleChangeValue('verifyCode')}
                              className='mb-5'
                              required
                            />
                            {error && <p className='text-left mb-4 red-text'>{error.message}.</p>}
                            <p className='text-left mb-4 white-text'>
                              Bạn chưa nhận được mã?{' '}
                              <Link onClick={this.resendVerifyCode} to='#'>
                                Gửi lại
                              </Link>
                              . Thử tài khoản <a href={RouterUrl.SIGN_IN}>khác</a>.
                            </p>
                            <div className='text-center mt-4 black-text'>
                              <MDBBtn type='submit' className='button-default w-100'>
                                Xác nhận
                              </MDBBtn>
                              <div className='text-center d-flex justify-content-center white-label mt-5'>
                                <a href='#!' className='p-2 m-2'>
                                  <MDBIcon fab icon='twitter' className='white-text' />
                                </a>
                                <a href='#!' className='p-2 m-2'>
                                  <MDBIcon fab icon='linkedin' className='white-text' />
                                </a>
                                <a href='#!' className='p-2 m-2'>
                                  <MDBIcon fab icon='instagram' className='white-text' />
                                </a>
                              </div>
                            </div>
                          </form>
                        </MDBCardBody>
                      </MDBCard>
                    </div>
                  </div>
                </MDBMask>
              </MDBView>
            </div>
          </div>
        ) : (
          <div className='form-sign-in'>
            <MDBView>
              <MDBMask className='d-block gradient'>
                <div className='d-flex justify-content-center align-items-center w-100 h-100 scrollbar'>
                  <div style={{ width: 520, display: 'block', margin: 'auto', padding: '45px 0' }}>
                    <h2 className='text-center font-weight-normal white-text mb-5'>BOOK ECOMMERCE</h2>
                    <MDBCard>
                      <MDBCardBody>
                        <form className='needs-validation' onSubmit={this.submitLoginHandler} noValidate>
                          <h4 className='text-center white-text'>Đăng nhập</h4>
                          <hr className='hr-light' />
                          <MDBInput
                            value={email}
                            iconClass='white-text icon-size'
                            label='Địa chỉ email'
                            icon='envelope'
                            type='email'
                            required
                            getValue={this.handleChangeValue('email')}
                          />
                          <MDBInput
                            value={password}
                            iconClass='white-text icon-size'
                            label='Mật khẩu'
                            icon='lock'
                            type='password'
                            required
                            getValue={this.handleChangeValue('password')}
                          />
                          {error && <p className='text-left mb-4 red-text'>{error.message}.</p>}
                          <p className='text-left mb-4 white-text'>
                            Bạn chưa có tài khoản? <Link to={RouterUrl.SIGN_UP}>Đăng kí ngay</Link>.
                          </p>
                          <div className='text-center mt-4 black-text'>
                            <MDBBtn type='submit' className='button-default w-100'>
                              Đăng nhập
                            </MDBBtn>
                            <div className='text-center d-flex justify-content-center white-label mt-5'>
                              <a href='#!' className='p-2 m-2'>
                                <MDBIcon fab icon='twitter' className='white-text' />
                              </a>
                              <a href='#!' className='p-2 m-2'>
                                <MDBIcon fab icon='linkedin' className='white-text' />
                              </a>
                              <a href='#!' className='p-2 m-2'>
                                <MDBIcon fab icon='instagram' className='white-text' />
                              </a>
                            </div>
                          </div>
                        </form>
                      </MDBCardBody>
                    </MDBCard>
                  </div>
                </div>
              </MDBMask>
            </MDBView>
          </div>
        )}
      </React.Fragment>
    );
  };
}

const mapStateToProps = (State) => {
  const { id, state, token, error } = State.UserReducer || {};
  return { id, state, token, error };
};

export const SignIn = connect(mapStateToProps, { actionSignIn, actionVerifyCode, actionResendVerifyCode })(
  withRouter(SignInComponent)
);
