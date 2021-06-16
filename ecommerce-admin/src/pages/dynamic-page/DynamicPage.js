import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBRow } from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './DynamicPage.css';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5';
import { actionGetPage, actionPatchPage } from '../../datas/redux/AdminAction';
import { editorConfiguration } from '../../Constant';

class DynamicPageComponent extends React.Component {
  state = {
    draftContent: '',
  };

  handleChangeContent = (content) => {
    this.setState({ draftContent: content });
  };

  handleGetPage = () => {
    this.props.actionGetPage({ path: this.props.location.pathname });
  };

  handlePathPage = () => {
    this.props.actionPatchPage({
      path: this.props.location.pathname,
      content: this.state.draftContent,
    });
  };

  resetContent = () => {
    const { dynamicPage } = this.props;
    this.setState({ draftContent: (dynamicPage && dynamicPage.content) || '' });
  };

  componentDidMount() {
    this.handleGetPage();
  }

  componentDidUpdate(prevState) {
    const { dynamicPage, location } = this.props;
    if (prevState.dynamicPage !== dynamicPage) {
      this.setState({ draftContent: (dynamicPage && dynamicPage.content) || '' });
    }
    if (prevState.location.pathname !== location.pathname) {
      this.handleGetPage();
    }
  }

  render() {
    const { dynamicPage } = this.props;
    const { draftContent } = this.state;
    return (
      <React.Fragment>
        <MDBCard>
          <MDBCardBody className='product-detail'>
            <CKEditor
              editor={ClassicEditor}
              config={editorConfiguration}
              data={draftContent}
              onChange={(event, editor) => {
                const data = editor.getData();
                this.handleChangeContent(data);
              }}
            />
            {draftContent !== (dynamicPage && dynamicPage.content) &&
              (draftContent || (dynamicPage && dynamicPage.content)) && (
                <MDBRow>
                  <MDBCol className='action-container'>
                    <MDBBtn onClick={this.resetContent}>Đặt lại</MDBBtn>
                    <MDBBtn onClick={this.handlePathPage}>Lưu</MDBBtn>
                  </MDBCol>
                </MDBRow>
              )}
          </MDBCardBody>
        </MDBCard>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { dynamicPage } = state.AdminReducer || {};
  return { dynamicPage };
};
export const DynamicPage = connect(mapStateToProps, {
  actionGetPage,
  actionPatchPage,
})(withRouter(DynamicPageComponent));
