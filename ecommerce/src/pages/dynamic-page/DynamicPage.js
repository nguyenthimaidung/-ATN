import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './DynamicPage.css';
import { actionGetPage } from '../../datas/redux/SysAction';
import { MDBContainer } from 'mdbreact';
import { prepareContent } from '../../utils/Util';

class DynamicPageComponent extends React.Component {
  handleGetPage = () => {
    this.props.actionGetPage({ path: this.props.location.pathname });
  };

  componentDidMount() {
    this.handleGetPage();
  }

  componentDidUpdate(prevState) {
    const { location } = this.props;
    if (prevState.location.pathname !== location.pathname) {
      this.handleGetPage();
    }
  }

  render() {
    const { dynamicPage } = this.props;
    return (
      <React.Fragment>
        <MDBContainer>
          <div
            className='ck-content'
            dangerouslySetInnerHTML={{ __html: prepareContent(dynamicPage && dynamicPage.content) }}
          />
        </MDBContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { dynamicPage } = state.SysReducer || {};
  return { dynamicPage };
};
export const DynamicPage = connect(mapStateToProps, {
  actionGetPage,
})(withRouter(DynamicPageComponent));
