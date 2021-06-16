import React from 'react';
import { MDBMask, MDBBtn, MDBView, MDBCard, MDBCardBody, MDBInput } from 'mdbreact';
import './SignIn.css';
import { RouterUrl } from '../../Constant';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { actionSignIn } from '../../datas/redux/AdminAction';

class SignInComponent extends React.Component {
  state = {
    email: '',
    password: '',
  };

  handleChangeValue = (fieldName) => (value) => {
    this.setState({ [fieldName]: value });
  };

  submitLoginHandler = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    this.props.actionSignIn({ email, password });
  };

  isExistsToken() {
    const { token, history } = this.props;
    if (token) {
      history.push(RouterUrl.HOME);
    }
  }

  componentDidMount() {
    this.isExistsToken();
  }

  componentDidUpdate() {
    this.isExistsToken();
  }

  render = () => {
    const { email, password } = this.state;
    const { error } = this.props;

    return (
      <React.Fragment>
        <div className='form-sign-in'>
          <MDBView>
            <MDBMask className='d-block gradient'>
              <div className='d-flex justify-content-center align-items-center w-100 h-100 scrollbar'>
                <div style={{ width: 520, display: 'block', margin: 'auto', padding: '45px 0' }}>
                  <h2 className='text-center font-weight-normal white-text mb-5'>ADMIN ECOMMERCE</h2>
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
                        <div className='text-center mt-4 mb-4 black-text'>
                          <MDBBtn type='submit' className='w-100 m-0'>
                            Đăng nhập
                          </MDBBtn>
                        </div>
                      </form>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              </div>
            </MDBMask>
          </MDBView>
        </div>
      </React.Fragment>
    );
  };
}

const mapStateToProps = (State) => {
  const { id, state, token, error } = State.AdminReducer || {};
  return { id, state, token, error };
};
export const SignIn = connect(mapStateToProps, { actionSignIn })(withRouter(SignInComponent));
