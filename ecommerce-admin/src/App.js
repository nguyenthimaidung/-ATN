import { ToastContainer } from 'mdbreact';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { SignIn } from './pages/sign-in/SignIn';
import { RouterUrl } from './Constant';
import Routes from './Routes';
import { SideNav } from './pages/SideNav';
import { TopNav } from './pages/TopNav';

class App extends React.Component {
  state = {
    toggle: false,
    windowWidth: 0,
    currentPage: '',
    isSideNavToggled: false,
    // isNavCollapsed: false,
    breakWidth: 1400,
  };

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      this.assessLocation(location.pathname);
    }
  }

  componentDidMount() {
    const { location } = this.props;
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    // window.addEventListener('scroll', this.handleScroll);
    this.assessLocation(location.pathname);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    // window.removeEventListener('scroll', this.handleScroll);
  }

  // handleScroll = () => {
  //   if (window.pageYOffset > 50) {
  //     this.setState({ isNavCollapsed: true });
  //   } else {
  //     this.setState({ isNavCollapsed: false });
  //   }
  // };

  handleResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
    });
  };

  toggleSideNav = () => {
    if (this.state.windowWidth < this.state.breakWidth) {
      this.setState({
        isSideNavToggled: !this.state.isSideNavToggled,
      });
    }
  };

  assessLocation = (location) => {
    const pages = {
      [RouterUrl.DASHBOARD]: 'Tổng Quan',
      [RouterUrl.ORDER]: 'Đơn Hàng',
      [RouterUrl.ACCOUNT]: 'Người Dùng',
      [RouterUrl.BOOK]: 'Sách',
      [RouterUrl.IMPORT_BOOK]: 'Nhập sách',
      [RouterUrl.CATEGORY]: 'Danh Mục',
      [RouterUrl.AUTHOR]: 'Tác Giả',
      [RouterUrl.SALE]: 'Khuyến Mãi',
      [RouterUrl.STATISTIC_SOLD]: 'Sách Đã Bán',
      [RouterUrl.INTRODUCE]: 'Giới Thiệu',
      [RouterUrl.PRIVACY]: 'Chính Sách Bảo Mật',
      [RouterUrl.DELIVERY]: 'Chính Sách Vận Chuyển',
      [RouterUrl.PAYMENT]: 'Hình Thức Thanh Toán',
    };
    this.setState({ currentPage: pages[location] });
  };

  render() {
    const { windowWidth, breakWidth, isSideNavToggled, currentPage } = this.state;

    const dynamicLeftPadding = {
      paddingLeft: windowWidth > breakWidth ? '240px' : '0',
      margin: '6.5rem 2% 4rem',
    };

    return (
      <React.Fragment>
        <Switch>
          <Route exact path={RouterUrl.SIGN_IN} component={SignIn} />
          <React.Fragment>
            <div className='app'>
              <div className='white-skin'>
                <SideNav
                  breakWidth={breakWidth}
                  style={{ transition: 'all .3s' }}
                  triggerOpening={isSideNavToggled}
                  onLinkClick={() => this.toggleSideNav()}
                />
              </div>
              <div className='flexible-content'>
                <TopNav
                  toggle={windowWidth < breakWidth}
                  onSideNavToggleClick={this.toggleSideNav}
                  routeName={currentPage}
                />
                <main style={{ ...dynamicLeftPadding }}>
                  <Routes onChange={() => this.assessLocation()} />
                </main>
              </div>
            </div>
            <ToastContainer hideProgressBar newestOnTop autoClose={5000} />
          </React.Fragment>
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
