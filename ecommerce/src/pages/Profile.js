import React from 'react';
import { MDBModal, MDBModalHeader, MDBModalBody, MDBInput, MDBModalFooter, MDBBtn, MDBIcon } from 'mdbreact';
import './Profile.css';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { actionGetProfile, actionUpdateProfile, actionUploadAvatar } from '../datas/redux/UserAction';
import { BaseURL, DEFAULT_AVATAR } from '../Constant';
import { prepareAvatarUrl } from '../utils/Util';

class ProfileComponent extends React.Component {
  state = {
    draftAvatar: undefined,
    draftName: undefined,
    draftPhone: undefined,
    draftAddress: undefined,
    draftSrc: undefined,
  };

  onChangeHandler = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ draftAvatar: reader.result, draftSrc: files[0] });
      };
      reader.readAsDataURL(files[0]);
    } else {
      const { avatar } = this.props;
      this.setState({ draftAvatar: avatar ? prepareAvatarUrl(avatar) : undefined });
    }
  };

  handleChangeValue = (fieldName) => (value) => {
    this.setState({ [fieldName]: value });
  };

  close = () => {
    const { close } = this.props;
    close && close();
  };

  componentDidMount() {
    const { actionGetProfile } = this.props;
    actionGetProfile();
  }

  componentDidUpdate(prevProps) {
    const { isOpen, name, phone, address, avatar } = this.props;
    if (prevProps.isOpen !== isOpen || prevProps.avatar !== avatar) {
      this.setState({
        draftAvatar: avatar ? prepareAvatarUrl(avatar) : undefined,
        draftName: name || undefined,
        draftPhone: phone || undefined,
        draftAddress: address || undefined,
        draftSrc: undefined,
      });
    }
  }

  updateProfile = () => {
    let { draftName, draftPhone, draftAddress, draftSrc } = this.state;
    const { actionUpdateProfile, actionUploadAvatar, name, phone, address } = this.props;
    draftName = draftName && draftName.trim();
    draftPhone = draftPhone && draftPhone.trim();
    draftAddress = draftAddress && draftAddress.trim();

    if (draftSrc !== undefined) {
      actionUploadAvatar({ file: draftSrc });
    }
    if (draftName !== name || draftPhone !== phone || draftAddress !== address) {
      actionUpdateProfile({
        name: draftName || undefined,
        phone: draftPhone || undefined,
        address: draftAddress || undefined,
      });
    }
  };

  render() {
    const { draftAvatar, draftName, draftPhone, draftAddress } = this.state;
    const { isOpen, name, phone, address } = this.props;
    const hasUpdate =
      name !== draftName ||
      phone !== draftPhone ||
      address !== draftAddress ||
      !(draftAvatar && draftAvatar.startsWith(BaseURL));
    return (
      <React.Fragment>
        <MDBModal cascading className='modal-avatar' isOpen={isOpen} toggle={this.close}>
          <MDBModalHeader className='mx-auto'>
            <img src={draftAvatar || DEFAULT_AVATAR} alt='avatar' className='rounded-circle img-responsive' />
            <input onChange={this.onChangeHandler} type='file' />
            <MDBIcon far icon='edit' />
          </MDBModalHeader>
          <MDBModalBody className='text-center mb-1'>
            {/* <h5 className='mt-1 mb-2'>{draftName}</h5> */}
            <form className='mx-3 grey-text'>
              <MDBInput
                label='Họ tên'
                value={draftName}
                getValue={this.handleChangeValue('draftName')}
                group
                type='text'
                validate
              />
              <MDBInput
                label='Số điện thoại'
                value={draftPhone}
                getValue={this.handleChangeValue('draftPhone')}
                group
                type='text'
                validate
              />
              <MDBInput
                label='Địa chỉ liên hệ'
                value={draftAddress}
                getValue={this.handleChangeValue('draftAddress')}
                group
                type='text'
                validate
              />
            </form>
          </MDBModalBody>
          <MDBModalFooter className='justify-content-center'>
            <MDBBtn disabled={!hasUpdate} onClick={this.updateProfile} className='button-default'>
              Cập nhật
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { name, email, phone, address, avatar } = state.UserReducer || {};
  return { name, email, phone, address, avatar };
};
export const Profile = connect(mapStateToProps, {
  actionGetProfile,
  actionUploadAvatar,
  actionUpdateProfile,
})(withRouter(ProfileComponent));
