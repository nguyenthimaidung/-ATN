import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import HomePage1 from './pages/home/HomePage1';
import { ProductCategory } from './pages/product-category/ProductCategory';
import { ProductDetail } from './pages/product-detail/ProductDetail';
import { Wishlist } from './pages/wishlist/Wishlist';
import { Cart } from './pages/cart/Cart';
import { Checkout } from './pages/cart/Checkout';
import { RouterUrl } from './Constant';
import { ReturnOrder } from './pages/cart/ReturnOrder';
import { DynamicPage } from './pages/dynamic-page/DynamicPage';
import { Order } from './pages/order/Oder';

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path={RouterUrl.HOME} component={HomePage} />
        <Route exact path='/home1' component={HomePage1} />
        <Route exact path={RouterUrl.CATEGORY} component={ProductCategory} />
        <Route exact path={RouterUrl.PRODUCT_DETAIL} component={ProductDetail} />
        <Route exact path={RouterUrl.WISHLIST} component={Wishlist} />
        <Route exact path={RouterUrl.CART} component={Cart} />
        <Route exact path={RouterUrl.CHECKOUT} component={Checkout} />
        <Route exact path={RouterUrl.ORDER} component={Order} />
        <Route exact path={RouterUrl.PAYMENT_RETURN_URL} component={ReturnOrder} />
        <Route exact path={RouterUrl.INTRODUCE} component={DynamicPage} />
        <Route exact path={RouterUrl.PRIVACY} component={DynamicPage} />
        <Route exact path={RouterUrl.PAYMENT} component={DynamicPage} />
        <Route exact path={RouterUrl.DELIVERY} component={DynamicPage} />
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
