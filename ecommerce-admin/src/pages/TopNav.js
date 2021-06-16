import React, { Component } from 'react';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';

import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdbreact';
import { connect } from 'react-redux';
import { DEFAULT_AVATAR, RouterUrl } from '../Constant';
import { actionSignOut } from '../datas/redux/AdminAction';
import { Profile } from './Profile';
import { prepareAvatarUrl } from '../utils/Util';
import './TopNav.css';

class TopNavComponent extends Component {
  state = {
    isOpenProfile: false,
    collapse: false,
  };

  toggleProfile = () => {
    this.setState((prevState) => ({
      isOpenProfile: !prevState.isOpenProfile,
    }));
  };

  isExistsToken() {
    const { token, history } = this.props;
    if (!token) {
      history.push(RouterUrl.SIGN_IN);
    }
  }

  componentDidMount() {
    this.isExistsToken();
  }

  componentDidUpdate() {
    this.isExistsToken();
  }

  onClick = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };

  handleToggleClickA = () => {
    this.props.onSideNavToggleClick();
  };

  signOut = () => {
    this.props.actionSignOut();
  };

  render() {
    const { isOpenProfile } = this.state;
    const { token, avatar, routeName, toggle } = this.props;
    const navStyle = {
      paddingLeft: toggle ? '16px' : '240px',
      transition: 'padding-left .3s',
      fontSize: '18px',
    };
    return (
      <Router>
        <MDBNavbar className='flexible-MDBNavbar white' expand='md' scrolling fixed='top' style={{ zIndex: 6 }}>
          <div
            onClick={this.handleToggleClickA}
            key='sideNavToggleA'
            style={{
              lineHeight: '32px',
              marginleft: '1em',
              verticalAlign: 'middle',
              cursor: 'pointer',
            }}
          >
            <MDBIcon icon='bars' color='white' size='lg' />
          </div>

          <MDBNavbarBrand style={navStyle}>
            <strong>{routeName}</strong>
          </MDBNavbarBrand>
          <MDBNavbarNav expand='sm' right style={{ flexDirection: 'row' }}>
            {/* <MDBDropdown>
              <MDBDropdownToggle nav>
                <MDBBadge color='red' className='mr-2'>
                  3
                </MDBBadge>
                <MDBIcon icon='bell' /> <span className='d-none d-md-inline'>Thông báo</span>
              </MDBDropdownToggle>
              <MDBDropdownMenu right style={{ minWidth: '400px' }}>
                <MDBDropdownItem href='#!'>
                  <MDBIcon icon='money-bill-alt' className='mr-2' />
                  New order received
                  <span className='float-right'>
                    <MDBIcon icon='clock' /> 13 min
                  </span>
                </MDBDropdownItem>
                <MDBDropdownItem href='#!'>
                  <MDBIcon icon='money-bill-alt' className='mr-2' />
                  New order received
                  <span className='float-right'>
                    <MDBIcon icon='clock' /> 33 min
                  </span>
                </MDBDropdownItem>
                <MDBDropdownItem href='#!'>
                  <MDBIcon icon='chart-line' className='mr-2' />
                  Your campaign is about to end
                  <span className='float-right'>
                    <MDBIcon icon='clock' /> 53 min
                  </span>
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
            <MDBNavItem>
              <MDBNavLink to='#'>
                <MDBIcon icon='envelope' />
                <span className='d-none d-md-inline ml-1'>Liên hệ</span>
              </MDBNavLink>
            </MDBNavItem>
            <MDBNavItem>
              <MDBNavLink to='#'>
                <MDBIcon icon='comments' />
                <span className='d-none d-md-inline ml-1'>Hỗ trợ</span>
              </MDBNavLink>
            </MDBNavItem> */}
            <MDBDropdown>
              <MDBDropdownToggle nav>
                <div className='nav-link-div'>
                  {!token ? (
                    <React.Fragment>
                      <MDBIcon icon='user' /> <span className='d-none d-md-inline'>Hồ sơ</span>
                    </React.Fragment>
                  ) : (
                    <img className='icon-avatar' src={prepareAvatarUrl(avatar, DEFAULT_AVATAR)} alt='' />
                  )}
                </div>
              </MDBDropdownToggle>
              <MDBDropdownMenu right style={{ minWidth: '200px' }}>
                <MDBDropdownItem onClick={this.signOut}>Đăng xuất</MDBDropdownItem>
                <MDBDropdownItem onClick={this.toggleProfile}>Tài khoản</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavbarNav>
        </MDBNavbar>
        <Profile isOpen={isOpenProfile} close={this.toggleProfile} />
      </Router>
    );
  }
}

const mapStateToProps = (State) => {
  const { token, avatar } = State.AdminReducer || {};
  return { token, avatar };
};
export const TopNav = connect(mapStateToProps, {
  actionSignOut,
})(withRouter(TopNavComponent));
