import { ToastContainer } from 'mdbreact';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Footer } from './pages/Footer';
import { Navbar } from './pages/Navbar';
import { SignIn } from './pages/sign-in/SignIn';
import { SignUp } from './pages/sign-up/SignUp';
import { RouterUrl } from './Constant';
import Routes from './Routes';
import { TawkTo } from './pages/TawkTo';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Switch>
            <Route exact path={RouterUrl.SIGN_IN} component={SignIn} />
            <Route exact path={RouterUrl.SIGN_UP} component={SignUp} />
            <React.Fragment>
              <Navbar />
              <main>
                <Routes />
                {TawkTo('60a8e78476297c43b34cb999', '1f69sgo2u')}
              </main>
              <Footer />
              <ToastContainer hideProgressBar newestOnTop autoClose={5000} />
            </React.Fragment>
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
