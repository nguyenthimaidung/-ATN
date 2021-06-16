import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { RouterUrl } from './Constant';
import { Account } from './pages/account/Account';
import { Author } from './pages/author/Author';
import { Book } from './pages/book/Book';
import { ImportBook } from './pages/book/ImportBook';
import { Category } from './pages/category/Category';
import { Dashboard } from './pages/dashboard/Dashboard';
import { DynamicPage } from './pages/dynamic-page/DynamicPage';
import { Order } from './pages/order/Order';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route exact path={RouterUrl.DASHBOARD} component={Dashboard} />
        <Route exact path={RouterUrl.ORDER} component={Order} />
        <Route exact path={RouterUrl.ACCOUNT} component={Account} />
        <Route exact path={RouterUrl.BOOK} component={Book} />
        <Route exact path={RouterUrl.IMPORT_BOOK} component={ImportBook} />
        <Route exact path={RouterUrl.CATEGORY} component={Category} />
        <Route exact path={RouterUrl.AUTHOR} component={Author} />
        <Route exact path={RouterUrl.INTRODUCE} component={DynamicPage} />
        <Route exact path={RouterUrl.PRIVACY} component={DynamicPage} />
        <Route exact path={RouterUrl.DELIVERY} component={DynamicPage} />
        <Route exact path={RouterUrl.PAYMENT} component={DynamicPage} />
        <Route exact path={RouterUrl.RETURN_CHANGE} component={DynamicPage} />
        <Route exact path={RouterUrl.GUIDE} component={DynamicPage} />
        <Route exact path={RouterUrl.CONTACT} component={DynamicPage} />

        <Route
          render={function () {
            return <h1>Not Found</h1>;
          }}
        />
      </Switch>
    );
  }
}

export default Routes;
