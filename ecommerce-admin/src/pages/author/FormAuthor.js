import React from 'react';
import { MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput, MDBDatePicker, MDBSelect, MDBIcon, MDBBtn } from 'mdbreact';
import './FormAuthor.css';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  actionPostAuthor,
  actionPutAuthor,
  ACTION_POST_AUTHOR,
  ACTION_PUT_AUTHOR,
} from '../../datas/redux/AdminAction';
import { actionResetSucces } from '../../datas/redux/AppAction';
import { SuccessPopup } from '../SuccessPopup';
import { editorConfiguration } from '../../Constant';

export const Gender = {
  UNKNOW: 0,
  MALE: 1,
  FEMALE: 2,
};

export const GenderText = {
  0: 'Unknow',
  1: 'Nam',
  2: 'Nữ',
};

class FormAuthorComponent extends React.Component {
  state = {
    draftName: '',
    draftAvatar: '',
    draftBirth: null,
    draftGender: Gender.UNKNOW,
    draftAddress: '',
    draftShortDescription: '',
    draftDescription: '',
    genderOptions: [],
    // extra state
    authorAddedCount: 0,
    isOpenSuccessPopup: false,
  };

  initGenderOptions(author) {
    const selected = author ? author.gender : Gender.UNKNOW;
    return Object.keys(Gender).map((key) => ({
      text: GenderText[Gender[key]],
      value: `${Gender[key]}`,
      checked: selected === Gender[key],
    }));
  }

  constructor(props) {
    super(props);
    const { author } = this.props;

    if (author) {
      this.state.draftName = author.name;
      this.state.draftAvatar = author.avatar;
      this.state.draftBirth = author.birth;
      this.state.draftGender = author.gender;
      this.state.draftAddress = author.address;
      this.state.draftShortDescription = author.shortDescription;
      this.state.draftDescription = author.description;
    }
    this.state.genderOptions = this.initGenderOptions(author);
  }

  resetInput = () => {
    const { author } = this.props;
    if (author) {
      this.setState({
        draftName: author.name,
        draftAvatar: author.avatar,
        draftBirth: author.birth,
        draftGender: author.gender,
        draftAddress: author.address,
        draftShortDescription: author.shortDescription,
        draftDescription: author.description,
        genderOptions: this.initGenderOptions(author),
      });
    } else {
      this.setState({
        draftName: '',
        draftAvatar: '',
        draftBirth: null,
        draftGender: Gender.UNKNOW,
        draftAddress: '',
        draftShortDescription: '',
        draftDescription: '',
        genderOptions: this.initGenderOptions(),
      });
    }
  };

  handleChangeValue = (name) => (value) => {
    this.setState({ [name]: value });
  };

  handleChangeValueEvent = (name) => (e) => {
    this.setState({ [name]: e.target.value });
  };

  handleChangeGender = (value) => {
    value.length > 0 &&
      this.setState({
        draftGender: +value[0],
      });
  };

  handleChoiceFile = (field) => () => {
    window.CKFinder.modal({
      chooseFiles: true,
      width: 800,
      height: 600,
      onInit: function (finder) {
        finder.on('files:choose', function (evt) {
          const file = evt.data.files.first();
          const url = file.getUrl();
          const output = document.getElementById(field);
          console.log(url);
          // output.value = url;
          // output.dispatchEvent(new Event('input', { bubbles: true }));

          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
            .set;
          nativeInputValueSetter.call(output, url);
          output.dispatchEvent(new Event('input', { bubbles: true }));
        });

        finder.on('file:choose:resizedImage', function (evt) {
          const url = evt.data.resizedUrl;
          const output = document.getElementById(field);
          console.log(url);
          // output.value = url;
          // output.dispatchEvent(new Event('input', { bubbles: true }));

          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
            .set;
          nativeInputValueSetter.call(output, url);
          output.dispatchEvent(new Event('input', { bubbles: true }));
        });
      },
    });
  };

  actionAdd = () => {
    const {
      draftName,
      draftAvatar,
      draftGender,
      draftBirth,
      draftAddress,
      draftShortDescription,
      draftDescription,
    } = this.state;
    this.props.actionPostAuthor({
      name: draftName,
      avatar: draftAvatar,
      gender: draftGender,
      birth: draftBirth,
      address: draftAddress,
      shortDescription: draftShortDescription,
      description: draftDescription,
    });
  };

  actionEdit = () => {
    const {
      draftName,
      draftAvatar,
      draftGender,
      draftBirth,
      draftAddress,
      draftShortDescription,
      draftDescription,
    } = this.state;
    this.props.actionPutAuthor({
      id: this.props.author.id,
      name: draftName,
      avatar: draftAvatar,
      gender: draftGender,
      birth: draftBirth,
      address: draftAddress,
      shortDescription: draftShortDescription,
      description: draftDescription,
    });
  };

  actionBack = () => {
    const { authorAddedCount } = this.state;
    this.props.onBack && this.props.onBack(authorAddedCount);
  };

  toggleSuccessPopup = () => {
    this.setState((prevState) => ({
      isOpenSuccessPopup: !prevState.isOpenSuccessPopup,
    }));
  };

  componentDidUpdate(prevProps) {
    const { action, success, doing, error, refreshData, actionResetSucces } = this.props;
    if (
      prevProps.action !== action ||
      prevProps.success !== success ||
      prevProps.doing !== doing ||
      prevProps.error !== error
    ) {
      if (action === ACTION_PUT_AUTHOR && success && !doing && !error) {
        // close form after update
        refreshData && refreshData();
      } else if (action === ACTION_POST_AUTHOR && success && !doing && !error) {
        // reset input after add
        const { authorAddedCount } = this.state;
        this.setState({ authorAddedCount: authorAddedCount + 1 });
        this.resetInput();
        actionResetSucces();
        // noti add success
        this.toggleSuccessPopup();
      }
    }
  }

  render() {
    const {
      draftName,
      draftAvatar,
      draftBirth,
      draftAddress,
      draftShortDescription,
      draftDescription,
      genderOptions,
      isOpenSuccessPopup,
    } = this.state;
    const { author } = this.props;

    const title = !author ? 'THÊM TÁC GIẢ' : 'CẬP NHẬT THÔNG TÁC GIẢ';

    return (
      <React.Fragment>
        <MDBCard>
          <MDBCardBody>
            <div className='fragment-header'>
              <MDBBtn onClick={this.actionBack} className='button-back' flat>
                <MDBIcon icon='arrow-left' />
              </MDBBtn>
              <span>{title}</span>
            </div>
            <MDBRow>
              <MDBCol lg='6'>
                <div style={{ marginTop: 8 }}>
                  <MDBInput
                    containerClass='mt-0'
                    value={draftName}
                    getValue={this.handleChangeValue('draftName')}
                    label='Tên tác giả'
                  />
                  <MDBRow>
                    <MDBCol>
                      <MDBSelect
                        className='mb-0 mt-0 select-input-mb-0'
                        getValue={this.handleChangeGender}
                        options={genderOptions}
                        label='Giới tính'
                      />
                    </MDBCol>
                    <MDBCol>
                      <div className='date-picker-w-100 mb-0 mt-0'>
                        <span className={`label ${draftBirth !== null ? 'active' : ''}`}>Ngày sinh</span>
                        <MDBDatePicker
                          getValue={this.handleChangeValue('draftBirth')}
                          value={draftBirth}
                          valueDefault={null}
                        />
                      </div>
                    </MDBCol>
                  </MDBRow>
                  <MDBInput value={draftAddress} getValue={this.handleChangeValue('draftAddress')} label='Địa chỉ' />
                  <MDBInput
                    value={draftShortDescription}
                    getValue={this.handleChangeValue('draftShortDescription')}
                    type='textarea'
                    label='Mô tả ngắn'
                  />
                </div>
              </MDBCol>

              <MDBCol lg='6'>
                <div className='images-input-container'>
                  <div className={`add-image-cover${draftAvatar ? '' : ' empty'}`}>
                    <img style={{ width: '100%' }} src={draftAvatar} alt='' />
                    <input
                      id='draftAvatar'
                      type='text'
                      onChange={this.handleChangeValueEvent('draftAvatar')}
                      style={{ display: 'none', width: '100%' }}
                    />
                    <div className='input-type-file' onClick={this.handleChoiceFile('draftAvatar')} />
                    <MDBIcon icon='plus' />
                  </div>
                </div>
              </MDBCol>

              <MDBCol lg='12'>
                <div style={{ marginBottom: 14 }}>Mô tả tác giả</div>
                {/* <div
                  className='ck-content preview-description'
                  dangerouslySetInnerHTML={{ __html: draftDescription }}
                />
                <MDBInput type='textarea' label='Mô tả tác giả' /> */}
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfiguration}
                  data={draftDescription}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    // console.log(data);
                    this.handleChangeValue('draftDescription')(data);
                  }}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol className='action-container'>
                {author ? (
                  <MDBBtn onClick={this.actionEdit}>Lưu</MDBBtn>
                ) : (
                  <MDBBtn onClick={this.actionAdd}>Thêm</MDBBtn>
                )}
                <MDBBtn onClick={this.resetInput}>Đặt lại</MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
        <SuccessPopup
          onFinish={this.actionBack}
          onContinue={this.toggleSuccessPopup}
          close={this.toggleSuccessPopup}
          isOpen={isOpenSuccessPopup}
          title='Thêm thành công'
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { action, success, doing, error } = state.AdminReducer || {};
  return { action, success, doing, error };
};
export const FormAuthor = connect(mapStateToProps, {
  actionPostAuthor,
  actionPutAuthor,
  actionResetSucces,
})(withRouter(FormAuthorComponent));
