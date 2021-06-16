import React from 'react';
import { MDBMask, MDBBtn, MDBView, MDBCard, MDBCardBody, MDBInput, MDBIcon } from 'mdbreact';
import './SignUp.css';
import { RouterUrl } from '../../Constant';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionSignUp } from '../../datas/redux/UserAction';
import { actionResetSucces } from '../../datas/redux/AppAction';
import {
  validateName,
  validateEmail,
  validatePasword,
  validateConfirmPassword,
  combineValidate,
} from '../../utils/Validate';
import { hideTawkTo, showTawkTo } from '../TawkTo';

export class SignUpComponent extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    message: undefined,
    isInit: true,
  };

  constructor(props) {
    super(props);
    this.validateName = validateName('name').bind(this);
    this.validateEmail = validateEmail('email').bind(this);
    this.validatePasword = validatePasword('password').bind(this);
    this.validateConfirmPassword = validateConfirmPassword('password', 'confirmPassword').bind(this);
  }

  componentDidMount() {
    const { actionResetSucces } = this.props;
    actionResetSucces();
    hideTawkTo();
  }

  submitHandler = (event) => {
    event.preventDefault();
    // event.target.className += ' was-validated';
    if (!this.isInputValid()) {
      this.setState({ message: 'Vui lòng điền thông tin đăng ký chính xác.' });
      return;
    }
    const { name, email, password } = this.state;
    this.props.actionSignUp({ name, email, password });
    this.setState({ isInit: false });
  };

  isInputValid = () => {
    return combineValidate(this.validateName, this.validateEmail, this.validatePasword, this.validateConfirmPassword);
  };

  changeHandler = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, message: undefined });
  };

  componentDidUpdate() {
    const { isInit } = this.state;
    const { id, token, success, history } = this.props;
    if (token) {
      history.push(RouterUrl.HOME);
    } else if (success && !isInit) {
      history.push(RouterUrl.SIGN_IN + `?id=${id}`);
    }
  }

  componentWillUnmount() {
    showTawkTo();
  }

  render() {
    const { name, email, password, confirmPassword, message } = this.state;
    const { doing, error } = this.props;

    return (
      <div className='form-sign-up'>
        <MDBView>
          <MDBMask className='d-block gradient'>
            <div className='d-flex justify-content-center align-items-center w-100 h-100 scrollbar'>
              <div style={{ width: 580, display: 'block', margin: 'auto', padding: '45px 0' }}>
                <h2 className='text-center font-weight-normal white-text mb-5'>BOOK ECOMMERCE</h2>
                <MDBCard>
                  <MDBCardBody>
                    <form className='needs-validation' onSubmit={this.submitHandler} noValidate>
                      <h4 className='text-center white-text'>Đăng ký tài khoản</h4>
                      <hr className='hr-light' />
                      <MDBInput
                        value={name}
                        name='name'
                        iconClass='white-text icon-size'
                        label='Họ tên'
                        icon='user'
                        type='text'
                        onChange={this.changeHandler}
                        required
                        className={this.validateName()}
                      >
                        <div className='invalid-feedback'>Họ tên phải bao gồm ít nhất 6 kí tự.</div>
                        {/* <div className='valid-feedback'>Looks good!</div> */}
                      </MDBInput>
                      <MDBInput
                        value={email}
                        name='email'
                        iconClass='white-text icon-size'
                        label='Địa chỉ email'
                        icon='envelope'
                        type='email'
                        onChange={this.changeHandler}
                        required
                        className={this.validateEmail()}
                      >
                        <div className='invalid-feedback'>Vui lòng nhập email hợp lệ.</div>
                      </MDBInput>
                      <MDBInput
                        value={password}
                        name='password'
                        iconClass='white-text icon-size'
                        label='Mật khẩu'
                        icon='lock'
                        type='password'
                        onChange={this.changeHandler}
                        required
                        className={this.validatePasword()}
                      >
                        <div className='invalid-feedback'>Mật khẩu phải chứa ít nhất 6 kí tự.</div>
                      </MDBInput>
                      <MDBInput
                        value={confirmPassword}
                        name='confirmPassword'
                        iconClass='white-text icon-size'
                        label='Xác nhận mật khẩu'
                        icon='lock'
                        type='password'
                        onChange={this.changeHandler}
                        required
                        className={this.validateConfirmPassword()}
                      >
                        <div className='invalid-feedback'>Mật khẩu xác nhận phải giống mật khẩu ở trên.</div>
                      </MDBInput>
                      {(error || message) && (
                        <p className='text-left mb-4 red-text'>{(error && error.message) || message}.</p>
                      )}
                      <p className='text-left mb-4 white-text'>
                        Bạn đã có tài khoản? <Link to={RouterUrl.SIGN_IN}>Đăng nhập ngay</Link>.
                      </p>
                      <div className='text-center mt-4 black-text'>
                        <MDBBtn type='submit' className='button-default w-100'>
                          <div className={`button-container ${doing ? 'doing' : ''}`}>
                            <span className='text-content'>Đăng ký</span>
                            <span className='loading' />
                          </div>
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
    );
  }
}

const mapStateToProps = (State) => {
  const { id, token, doing, error, success } = State.UserReducer || {};
  return { id, token, doing, error, success };
};

export const SignUp = connect(mapStateToProps, { actionSignUp, actionResetSucces })(withRouter(SignUpComponent));
