import React from 'react';
import { MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBBtn, MDBIcon } from 'mdbreact';
import './ConfirmPopup.css';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

class ConfirmPopupComponent extends React.Component {
  close = () => {
    const { close } = this.props;
    close && close();
  };

  confirm = () => {
    this.props.onConfirm && this.props.onConfirm();
  };

  render() {
    const { isOpen, title } = this.props;
    return (
      <React.Fragment>
        <MDBModal className='popup' isOpen={isOpen} toggle={this.close}>
          <MDBModalHeader className='justify-content-center'>{title}</MDBModalHeader>
          <MDBModalBody className='text-center mb-1'>
            <MDBIcon className='popup-confirm-icon' icon='exclamation-circle' />
          </MDBModalBody>
          <MDBModalFooter className='justify-content-center'>
            <MDBBtn onClick={this.close} className='button-back'>
              Quay lại
            </MDBBtn>
            <MDBBtn onClick={this.confirm} className='button-confirm'>
              Xác nhận
            </MDBBtn>
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
export const ConfirmPopup = connect(mapStateToProps, {})(withRouter(ConfirmPopupComponent));
