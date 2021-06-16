import React from 'react';
import { MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBBtn, MDBIcon } from 'mdbreact';
import './SuccessPopup.css';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

class SuccessPopupComponent extends React.Component {
  close = () => {
    const { close } = this.props;
    close && close();
  };

  finish = () => {
    this.props.onFinish && this.props.onFinish();
  };

  continue = () => {
    this.props.onContinue && this.props.onContinue();
  };

  render() {
    const { isOpen, title, onContinue } = this.props;
    return (
      <React.Fragment>
        <MDBModal className='popup' isOpen={isOpen} toggle={this.close}>
          <MDBModalHeader className='justify-content-center'>{title}</MDBModalHeader>
          <MDBModalBody className='text-center mb-1'>
            <MDBIcon className='popup-success-icon' icon='check-circle' />
          </MDBModalBody>
          <MDBModalFooter className='justify-content-center'>
            <MDBBtn onClick={this.finish} className='button-finish'>
              {onContinue ? 'Xong' : 'Đồng ý'}
            </MDBBtn>
            {onContinue && (
              <MDBBtn onClick={this.continue} className='button-continue'>
                Nhập tiếp
              </MDBBtn>
            )}
          </MDBModalFooter>
        </MDBModal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  // const {} = state.AdminReducer || {};
  return {};
};
export const SuccessPopup = connect(mapStateToProps, {})(withRouter(SuccessPopupComponent));
