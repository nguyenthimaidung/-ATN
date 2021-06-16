import React from 'react';
import { CarouselBanner } from './CarouselBanner';
import { FormFindBook } from './FormFindBook';
import { Policy } from './Policy';
import { PopularBook } from './PopularBook';
import { BestSellingBook } from './BestSellingBook';
import { WonderfulGift } from './WonderfulGift';
import { JoinCommunity } from './JoinCommunity';

class HomePage extends React.Component {
  scrollToTop = () => window.scrollTo(0, 0);

  render() {
    return (
      <React.Fragment>
        <CarouselBanner />
        <Policy />
        <FormFindBook />
        <PopularBook />
        <BestSellingBook />
        <WonderfulGift />
        <JoinCommunity />
        {/* <MDBContainer className='text-center my-5 rgba-grey-slight'>
          <p align='justify'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        </MDBContainer> */}
      </React.Fragment>
    );
  }
}

export default HomePage;
