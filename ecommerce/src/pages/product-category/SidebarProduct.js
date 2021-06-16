import React from 'react';
import {
  MDBInputGroup,
  MDBBtn,
  MDBCollapse,
  MDBCard,
  MDBCollapseHeader,
  MDBCardBody,
  MDBRow,
  MDBInput,
  MDBCol,
  MDBCardImage,
  MDBSelect,
} from 'mdbreact';
import './SidebarProduct.css';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Navigate } from '../../utils/Navigate';
import { RouterUrl } from '../../Constant';

class SidebarProductComponent extends React.Component {
  state = {
    collapseIDs: [],
    choiceAuthorIDs: [],
    tags: ['classic', 'horror', 'kid', 'men', 'trend', 'women'],
    choiceTags: [],
    minPrice: 0,
    maxPrice: 1000000000,
    searchText: undefined,
  };

  constructor(props) {
    super(props);
    this.state.authorOptions = this.initAuthorOptions(props.authors);
  }

  goToCategory = (categoryId) => Navigate.goTo(`${RouterUrl.CATEGORY}?id=${categoryId}`).bind(this);

  handleChangeValue = (fieldName) => (value) => {
    this.setState({ [fieldName]: value });
  };

  handleChangeValueInputGroup = (fieldName) => (event) => {
    const { value } = event.target;
    this.setState({ [fieldName]: value });
  };

  handleApplyFilter = () => {
    const { choiceTags, choiceAuthorIDs, minPrice, maxPrice, searchText } = this.state;
    const { onChange } = this.props;
    onChange && onChange({ choiceTags, choiceAuthorIDs, minPrice, maxPrice, searchText });
  };

  getcollapseIDs(categoryIDs) {
    const { categories } = this.props;

    function pushStorage(storageIDs, step, id) {
      if (storageIDs.length > step) {
        storageIDs[step] = id;
      } else {
        storageIDs.push(id);
      }
    }

    function trace(datas, id, storageIDs, step) {
      if (Array.isArray(datas)) {
        for (let i = 0; i < datas.length; i++) {
          const item = datas[i];
          if (item.id === id) {
            pushStorage(storageIDs, step, item.id);
            return step;
          }
          if (item.child) {
            pushStorage(storageIDs, step, item.id);
            const found = trace(item.child, id, storageIDs, step + 1);
            if (found >= 0) {
              return found;
            }
          }
        }
      }
      return -1;
    }

    const storageIDs = [];
    const found = trace(categories, categoryIDs, storageIDs, 0);

    return found < 0 ? [] : storageIDs.slice(0, found + 1);
  }

  initAuthorOptions(authors) {
    return [
      ...(authors
        ? authors.map((author) => ({
            text: author.name,
            value: `${author.id}`,
            checked: false,
          }))
        : []),
    ];
  }

  toggleCollapse = (collapseID) => () => {
    const newcollapseIDs = this.getcollapseIDs(collapseID);
    this.setState((prevState) => ({
      collapseIDs: !prevState.collapseIDs.includes(collapseID)
        ? newcollapseIDs
        : newcollapseIDs.slice(0, newcollapseIDs.length - 1),
    }));
  };

  handleCheckboxChange = (authorId) => (e) => {
    const { checked } = e.target;
    this.setState((prevState) => ({
      choiceAuthorIDs: !checked
        ? prevState.choiceAuthorIDs.filter((id) => id !== authorId)
        : [...prevState.choiceAuthorIDs, authorId],
    }));
  };

  getValueOfSelectAuthor = (value) => {
    const { choiceAuthorIDs } = this.state;
    if (value[0]) {
      if (!choiceAuthorIDs.includes(+value[0])) {
        this.setState({
          authorOptions: this.initAuthorOptions(this.props.authors),
          choiceAuthorIDs: [...choiceAuthorIDs, +value[0]],
        });
      } else {
        this.setState({
          authorOptions: this.initAuthorOptions(this.props.authors),
        });
      }
    }
  };

  handleCheckTag = (tagname) => (e) => {
    this.setState((prevState) => ({
      choiceTags: prevState.choiceTags.includes(tagname)
        ? prevState.choiceTags.filter((tag) => tag !== tagname)
        : [...prevState.choiceTags, tagname],
    }));
  };

  renderCategories(categories, collapseIDs, defaultOpenIds) {
    return categories.map((category) => {
      return this.renderCategory(category, collapseIDs, defaultOpenIds);
    });
  }

  renderCategory(category, collapseIDs, defaultOpenIds) {
    const { categoryId } = this.props;
    const isOpen = collapseIDs.includes(category.id) || defaultOpenIds.includes(category.id);
    const isActive = category.id === categoryId;
    return (
      <MDBCard key={`${category.id}`}>
        <MDBCollapseHeader tag='div' onClick={this.toggleCollapse(category.id)}>
          <span className={isActive ? 'active' : ''} onClick={isActive ? () => 0 : this.goToCategory(category.id)}>
            {category.name}
          </span>
          {category.child && category.child.length > 0 && (
            <i className={isOpen ? 'fa fa-angle-down rotate-icon' : 'fa fa-angle-down'} />
          )}
        </MDBCollapseHeader>
        {category.child && category.child.length > 0 && (
          <MDBCollapse isOpen={isOpen}>
            <MDBCardBody>
              {category.child.map((item) => {
                return this.renderCategory(item, collapseIDs, defaultOpenIds);
              })}
            </MDBCardBody>
          </MDBCollapse>
        )}
      </MDBCard>
    );
  }

  renderAuthors(authors, choiceAuthorIDs) {
    if (Array.isArray(authors)) {
      return authors
        .filter((author) => choiceAuthorIDs.includes(author.id))
        .map((author) => {
          return (
            <MDBInput
              key={`${author.id}`}
              value={author.id}
              label={author.name}
              checked={choiceAuthorIDs.includes(author.id)}
              onChange={this.handleCheckboxChange(author.id)}
              type='checkbox'
              id={`${author.id}`}
              containerClass='author-checkbox'
            />
          );
        });
    }
  }

  componentDidUpdate(prevProps) {
    const { authors } = this.props;
    if (prevProps.authors !== authors) {
      this.setState({ authorOptions: this.initAuthorOptions(authors) });
    }
  }

  render() {
    //tags, choiceTags, 
    const { searchText, collapseIDs, choiceAuthorIDs, authorOptions } = this.state;
    const { categoryId, categories = [], authors } = this.props;
    const defaultOpenIds = this.getcollapseIDs(categoryId);

    return (
      <div className='sidebar-product'>
        <div className='widget widget-search'>
          <MDBInputGroup
            material
            type='text'
            hint='Tìm kiếm...'
            value={searchText}
            onChange={this.handleChangeValueInputGroup('searchText')}
            append={
              <MDBBtn onClick={this.handleApplyFilter} className='m-0 button-default btn-search'>
                <span>&#x55;</span>
              </MDBBtn>
            }
          />
        </div>
        <div className='widget product-categories'>
          <h3 className='widget-name'>Thể Loại</h3>
          <div className='md-accordion categories'>
            {this.renderCategories(categories, collapseIDs, defaultOpenIds)}
          </div>
        </div>
        <div className='widget product-price-filter'>
          <h3 className='widget-name'>Giá</h3>
          <MDBRow>
            <MDBCol md='12'>
              <MDBInput type='number' label='Giá nhỏ nhất' getValue={this.handleChangeValue('minPrice')} />
            </MDBCol>
            <MDBCol md='12'>
              <MDBInput type='number' label='Giá cao nhất' getValue={this.handleChangeValue('maxPrice')} />
            </MDBCol>
            <MDBCol md='12'>
              <MDBBtn onClick={this.handleApplyFilter} className='button-default w-100 m-0 m-btn'>
                Apply
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </div>
        <div className='widget product-author-filter'>
          <h3 className='widget-name'>Tác Giả</h3>
          <MDBSelect
            search
            searchLabel='Tìm kiếm'
            label='Chọn tác giả'
            getValue={this.getValueOfSelectAuthor}
            options={authorOptions}
            className='input-select'
          />
          {this.renderAuthors(authors, choiceAuthorIDs)}
          <MDBBtn onClick={this.handleApplyFilter} className='button-default w-100 m-0 m-btn'>
            Apply
          </MDBBtn>
        </div>
        <div className='widget sale-banner'>
          <MDBCardImage
            zoom
            cascade
            className='img-fluid'
            src='https://wpbingosite.com/wordpress/bootin/wp-content/uploads/2019/05/Image-1-2.jpg'
            waves
          />
        </div>
        {/* <div className='widget product-tags'>
          <h3 className='widget-name'>Thẻ</h3>
          <div className='masonry-with-columns'>
            {tags.map((tag) => {
              return (
                <div
                  key={tag}
                  className={choiceTags.includes(tag) ? 'tag active' : 'tag'}
                  onClick={this.handleCheckTag(tag)}
                >
                  {tag}
                </div>
              );
            })}
          </div>
          <MDBBtn onClick={this.handleApplyFilter} className='button-default w-100 m-0 m-btn'>
            Apply
          </MDBBtn>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (State) => {
  const { categories, authors = [], tags = [] } = State.SysReducer || {};
  return { categories, authors, tags };
};
export const SidebarProduct = connect(mapStateToProps, {})(withRouter(SidebarProductComponent));
