import { MDBBtn, MDBCol, MDBContainer, MDBRow, MDBSelect } from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { actionGetAllCategories, actionGetSomeAuthors } from '../../datas/redux/SysAction';
import { Navigate } from '../../utils/Navigate';
import { RouterUrl } from '../../Constant';
import './FormFindBook.css';

export class FormFindBookComponent extends React.Component {
  state = {
    draftSelectedAuthor: undefined,
    draftSelectedCategory: undefined,
    // options
    categoryOptions: [],
    authorOptions: [],
  };

  goToCategory = (categoryId, authorId) => {
    const search = new URLSearchParams();
    categoryId && search.append('id', `${categoryId}`);
    authorId && search.append('auid', `${authorId}`);
    const query = search.toString();
    return Navigate.goTo(query ? `${RouterUrl.CATEGORY}?${query}` : RouterUrl.CATEGORY).bind(this);
  };

  componentDidMount() {
    const { actionGetAllCategories, actionGetSomeAuthors } = this.props;
    actionGetSomeAuthors({});
    actionGetAllCategories();
  }

  componentDidUpdate(prevProps) {
    const { allCategories, authors } = this.props;
    if (prevProps.allCategories !== allCategories) {
      this.setState({ categoryOptions: this.initCategoryOptions(allCategories) });
    }
    if (prevProps.authors !== authors) {
      this.setState({ authorOptions: this.initAuthorOptions(authors) });
    }
  }

  initCategoryOptions(categories) {
    return [
      {
        text: 'Mọi thể loại',
        value: 'all',
        checked: true,
      },
      ...(categories
        ? categories.map((category) => ({
            text: category.name,
            value: `${category.id}`,
            checked: false,
          }))
        : []),
    ];
  }

  initAuthorOptions(authors) {
    return [
      {
        text: 'Mọi tác giả',
        value: 'all',
        checked: true,
      },
      ...(authors
        ? authors.map((author) => ({
            text: author.name,
            value: `${author.id}`,
            checked: false,
          }))
        : []),
    ];
  }

  getValueOfSelectCategory = (value) => {
    // console.log((value[0] && value[0] !== 'all' && +value[0]) || undefined);
    this.setState({ draftSelectedCategory: (value[0] && value[0] !== 'all' && +value[0]) || undefined });
  };

  getValueOfSelectAuthor = (value) => {
    // console.log((value[0] && value[0] !== 'all' && +value[0]) || undefined);
    this.setState({ draftSelectedAuthor: (value[0] && value[0] !== 'all' && +value[0]) || undefined });
  };

  handleSearch = () => {
    const { draftSelectedCategory, draftSelectedAuthor } = this.state;
    this.goToCategory(draftSelectedCategory, draftSelectedAuthor)();
  };

  render() {
    const { categoryOptions, authorOptions } = this.state;

    return (
      <MDBContainer>
        <div className='form-find-book'>
          <MDBRow>
            <MDBCol md='4' lg='5'>
              <MDBSelect
                outline
                getValue={this.getValueOfSelectCategory}
                options={categoryOptions}
                className='input-select'
              >
                {/* <MDBSelectInput selected='Choose your option' /> */}
              </MDBSelect>
            </MDBCol>
            <MDBCol md='4' lg='5'>
              <MDBSelect
                outline
                getValue={this.getValueOfSelectAuthor}
                options={authorOptions}
                className='input-select'
              >
                {/* <MDBSelectInput selected='Choose your option' /> */}
              </MDBSelect>
            </MDBCol>
            <MDBCol md='4' lg='2'>
              <MDBBtn onClick={this.handleSearch} className='button-default btn-find-book'>
                Tìm Sách
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </div>
      </MDBContainer>
    );
  }
}

const mapStateToProps = (State) => {
  const { authors, allCategories } = State.SysReducer || {};
  return { authors, allCategories };
};
export const FormFindBook = connect(mapStateToProps, {
  actionGetSomeAuthors,
  actionGetAllCategories,
})(withRouter(FormFindBookComponent));
