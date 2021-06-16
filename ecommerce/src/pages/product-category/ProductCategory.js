import React from 'react';
import { Breadcrumb } from '../Breadcrumb';
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import { SidebarProduct } from './SidebarProduct';
import { ProductList } from './ProductList';
import './ProductCategory.css';
import { SortBookBy } from '../../datas/ApiUrls';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionSearchBook, actionGetSomeAuthors, actionGetRamdomTags } from '../../datas/redux/SysAction';

class ProductCategoryComponent extends React.Component {
  state = {
    categoryId: undefined,
    authorId: undefined,
    page: 0,
    take: 12,
    searchText: undefined,
    sortBy: SortBookBy.DEFAULT,
    choiceTags: [],
    choiceAuthorIDs: [],
    minPrice: 0,
    maxPrice: 1000000000,
  };

  constructor(props) {
    super(props);
    this.state.categoryId = this.getCategoryId();
  }

  handleChangeValue = (value) => {
    const { page } = value;
    if (page === undefined) {
      value.page = 0;
    }
    this.setState(value, this.executeSearchBook);
  };

  getCategoryId() {
    let id = new URLSearchParams(window.location.search).get('id');
    if (id && id.trim() !== '') {
      id = +id;
      return Number.isNaN(id) ? undefined : id;
    }
    return undefined;
  }

  getAuthorId() {
    let id = new URLSearchParams(window.location.search).get('auid');
    if (id && id.trim() !== '') {
      id = +id;
      return Number.isNaN(id) ? undefined : id;
    }
    return undefined;
  }

  updateCategoryIdAndAuthorId = () => {
    this.setState({ categoryId: this.getCategoryId(), authorId: this.getAuthorId(), page: 0 }, () => {
      this.executeSearchBook();
    });
  };

  componentDidMount() {
    const { actionGetSomeAuthors, actionGetRamdomTags } = this.props;
    this.updateCategoryIdAndAuthorId();
    actionGetSomeAuthors({ take: 1000000000 });
    actionGetRamdomTags();
  }

  componentDidUpdate(prevState) {
    const { location } = this.props;
    if (prevState.location.search !== location.search) {
      this.updateCategoryIdAndAuthorId();
    }
  }

  executeSearchBook = () => {
    const { categoryId, authorId, page, take, searchText, sortBy, choiceAuthorIDs, minPrice, maxPrice } = this.state;
    const { actionSearchBook } = this.props;
    let authorIds = (authorId && [authorId]) || undefined;
    if (authorIds) {
      if (choiceAuthorIDs) {
        authorIds = [...authorIds, ...choiceAuthorIDs];
      }
    } else if (choiceAuthorIDs) {
      authorIds = [...choiceAuthorIDs];
    }
    actionSearchBook({
      page,
      take,
      name: (searchText && searchText.trim()) || undefined,
      minPrice,
      maxPrice,
      sortBy,
      categoryIds: categoryId !== undefined ? [{ id: categoryId }] : undefined,
      authorIds: authorIds && authorIds.length > 0 ? authorIds.map((item) => ({ id: item })) : undefined,
    });
  };

  render() {
    const { take, sortBy, categoryId } = this.state;
    return (
      <React.Fragment>
        <Breadcrumb />
        <MDBContainer>
          <MDBRow className='product-category-content'>
            <MDBCol xl='3' lg='3' md='12' sm='12'>
              <SidebarProduct categoryId={categoryId} onChange={this.handleChangeValue} />
            </MDBCol>
            <MDBCol xl='9' lg='9' md='12' sm='12'>
              <ProductList categoryId={categoryId} take={take} sortBy={sortBy} onChange={this.handleChangeValue} />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (State) => ({});
export const ProductCategory = connect(mapStateToProps, {
  actionSearchBook,
  actionGetSomeAuthors,
  actionGetRamdomTags,
})(withRouter(ProductCategoryComponent));
