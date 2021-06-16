import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTreeview,
  MDBTreeviewItem,
  MDBTreeviewList,
  MDBSelect,
} from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Category.css';
import {
  actionDelCategory,
  actionGetCategories,
  actionPostCategory,
  actionPutCategory,
} from '../../datas/redux/AdminAction';

const Actions = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  DEL: 'DEL',
};

class CategoryComponent extends React.Component {
  state = {
    formAction: Actions.ADD,
    openedCategories: {},
    selectedCategoryId: null,
    draftName: '',
    draftParentId: null,
    categoryMap: {},
    categoryTree: [],
    categoryOptions: [],
  };

  handleChangeValue = (name) => (value) => {
    this.setState({ [name]: value });
  };

  handleChangeParent = (value) => {
    value.length > 0 &&
      this.setState({
        draftParentId: value[0] !== 'null' ? +value[0] : null,
      });
  };

  handleSelectCategory = (categoryId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { openedCategories } = this.state;
    openedCategories[categoryId] = !openedCategories[categoryId];
    this.setState(
      {
        selectedCategoryId: categoryId,
        openedCategories: { ...openedCategories },
      },
      this.resetDraftForm
    );
  };

  handleClickActionAdd = (categoryId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(
      {
        formAction: Actions.ADD,
        selectedCategoryId: categoryId,
      },
      this.resetDraftForm
    );
  };

  handleClickActionEdit = (categoryId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(
      {
        formAction: Actions.EDIT,
        selectedCategoryId: categoryId,
      },
      this.resetDraftForm
    );
  };

  handleClickActionDel = (categoryId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(
      {
        formAction: Actions.DEL,
        selectedCategoryId: categoryId,
      },
      this.resetDraftForm
    );
  };

  resetDraftForm = () => {
    const { selectedCategoryId, categoryMap, formAction } = this.state;
    if (selectedCategoryId === null) {
      this.setState({
        draftName: '',
        draftParentId: null,
        categoryOptions: this.buildCategoryOptions(selectedCategoryId, formAction),
      });
    } else {
      this.setState({
        draftName: formAction === Actions.ADD ? '' : categoryMap[selectedCategoryId].name,
        draftParentId: formAction === Actions.ADD ? selectedCategoryId : categoryMap[selectedCategoryId].parentId,
        categoryOptions: this.buildCategoryOptions(selectedCategoryId, formAction),
      });
    }
  };

  buildCategoryOptions(categoryId, formAction) {
    if (!formAction) {
      // eslint-disable-next-line react/destructuring-assignment
      formAction = this.state.formAction;
    }
    const { categoryMap } = this.state;

    if (formAction === Actions.ADD) {
      return [
        {
          text: categoryId === null ? 'Danh mục gốc' : categoryMap[categoryId].name,
          value: categoryId === null ? 'null' : `${categoryMap[categoryId].id}`,
          checked: true,
          // disabled: true,
        },
      ];
    } else {
      function getIgnoreCategory(categoryId) {
        const ids = [categoryId];
        categoryMap[categoryId].child.forEach((item) => {
          ids.push(item.id);
          ids.push(...getIgnoreCategory(item.id));
        });
        return ids;
      }

      const ignoreIds = getIgnoreCategory(categoryId);

      return [
        {
          text: 'Danh mục gốc',
          value: 'null',
          checked: categoryMap[categoryId].parentId === null,
          // disabled: categoryMap[categoryId].parentId === null,
        },
        ...Object.keys(categoryMap)
          .filter((key) => !ignoreIds.includes(+key))
          .map((key) => {
            return {
              text: `${categoryMap[key].name}`,
              value: `${categoryMap[key].id}`,
              checked: categoryMap[categoryId].parentId === categoryMap[key].id,
              // disabled: categoryMap[categoryId].parentId === categoryMap[key].id,
            };
          })
          .sort((a, b) => a.text.localeCompare(b.text)),
      ];
    }
  }

  buildCategoryTree(categories = []) {
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.id] = { ...category, child: [] };
    });
    const categoryTree = [];
    for (const key in categoryMap) {
      if (categoryMap[key].parentId !== null && categoryMap[categoryMap[key].parentId]) {
        categoryMap[categoryMap[key].parentId].child.push(categoryMap[key]);
      } else {
        categoryTree.push(categoryMap[key]);
      }
    }
    // console.log(categoryMap, categoryTree);
    const { formAction, selectedCategoryId } = this.state;
    this.setState(
      {
        categoryMap,
        categoryTree,
        formAction: formAction === Actions.DEL ? Actions.ADD : formAction,
        selectedCategoryId: formAction === Actions.DEL ? null : selectedCategoryId,
      },
      this.resetDraftForm
    );
  }

  actionAdd = () => {
    const { draftName, draftParentId } = this.state;
    this.props.actionPostCategory({ name: draftName, parentId: draftParentId });
  };

  actionEdit = () => {
    const { selectedCategoryId, draftName, draftParentId } = this.state;
    this.props.actionPutCategory({ id: selectedCategoryId, name: draftName, parentId: draftParentId });
  };

  actionDel = () => {
    const { selectedCategoryId } = this.state;
    this.props.actionDelCategory({ id: selectedCategoryId });
  };

  componentDidMount() {
    const { actionGetCategories } = this.props;
    actionGetCategories();
  }

  componentDidUpdate(prevProps) {
    const { categories } = this.props;
    if (prevProps.categories !== categories && categories) {
      this.buildCategoryTree(categories.data);
    }
  }

  renderCategory(category = {}) {
    const { selectedCategoryId, openedCategories } = this.state;
    return category.child && category.child.length > 0 ? (
      <MDBTreeviewList
        disabled
        opened={openedCategories[category.id]}
        key={`category_${category.id}`}
        className={`${selectedCategoryId === category.id ? ' active' : ''}`}
        title={
          <div
            onClick={this.handleSelectCategory(category.id)}
            className={`category-title${selectedCategoryId === category.id ? ' active' : ''}`}
          >
            <span>{category.name}</span>
            <div className='category-action'>
              <MDBBtn onClick={this.handleClickActionAdd(category.id)} flat className='button-add'>
                <MDBIcon icon='plus' />
              </MDBBtn>
              <MDBBtn onClick={this.handleClickActionEdit(category.id)} flat className='button-edit'>
                <MDBIcon icon='pencil-alt' />
              </MDBBtn>
              <MDBBtn onClick={this.handleClickActionDel(category.id)} flat className='button-del'>
                <MDBIcon icon='trash-alt' />
              </MDBBtn>
            </div>
          </div>
        }
        far
      >
        {this.renderCategories(category.child)}
      </MDBTreeviewList>
    ) : (
      <MDBTreeviewItem
        disabled
        key={`category_${category.id}`}
        className={`${selectedCategoryId === category.id ? ' active' : ''}`}
        title={
          <div
            onClick={this.handleSelectCategory(category.id)}
            className={`category-title${selectedCategoryId === category.id ? ' active' : ''}`}
          >
            <span>{category.name}</span>
            <div className='category-action'>
              <MDBBtn onClick={this.handleClickActionAdd(category.id)} flat className='button-add'>
                <MDBIcon icon='plus' />
              </MDBBtn>
              <MDBBtn onClick={this.handleClickActionEdit(category.id)} flat className='button-edit'>
                <MDBIcon icon='pencil-alt' />
              </MDBBtn>
              <MDBBtn onClick={this.handleClickActionDel(category.id)} flat className='button-del'>
                <MDBIcon icon='trash-alt' />
              </MDBBtn>
            </div>
          </div>
        }
        far
      />
    );
  }

  renderCategories(categories = []) {
    // console.log(categories);
    return categories.map((item) => this.renderCategory(item));
  }

  render() {
    const { selectedCategoryId, draftName, categoryOptions, categoryMap, categoryTree, formAction } = this.state;

    return (
      <React.Fragment>
        <MDBCard>
          <MDBCardBody>
            <MDBRow>
              <MDBCol md='4'>
                <MDBTreeview
                  className='category-tree-view'
                  theme='animated'
                  header={
                    <div className='category-title'>
                      <span>Thể loại sách</span>
                      <div className='category-action'>
                        <MDBBtn onClick={this.handleClickActionAdd(null)} flat className='button-add'>
                          <MDBIcon icon='plus' />
                        </MDBBtn>
                      </div>
                    </div>
                  }
                >
                  {this.renderCategories(categoryTree)}
                </MDBTreeview>
              </MDBCol>
              <MDBCol md='8'>
                <div>
                  {formAction === Actions.ADD
                    ? 'THÊM THỂ LOẠI'
                    : formAction === Actions.EDIT
                    ? `CẬP NHẬT THỂ LOẠI "${categoryMap[selectedCategoryId].name}"`.toUpperCase()
                    : 'XÓA THỂ LOẠI'}
                </div>
                <MDBInput
                  disabled={formAction === Actions.DEL}
                  value={draftName}
                  getValue={this.handleChangeValue('draftName')}
                  label='Tên thể loại'
                />
                {/* <MDBInput value={draftParentId !== null ? draftParentId : ''} label='Thuộc thể loại' /> */}
                <MDBSelect
                  search
                  searchLabel='Tìm kiếm'
                  getValue={this.handleChangeParent}
                  selected='Chọn danh mục'
                  label='Thuộc danh mục'
                  options={categoryOptions}
                />
                <MDBRow>
                  {formAction === Actions.ADD ? (
                    <MDBBtn onClick={this.actionAdd}>Thêm</MDBBtn>
                  ) : formAction === Actions.EDIT ? (
                    <MDBBtn onClick={this.actionEdit}>Lưu</MDBBtn>
                  ) : (
                    <MDBBtn onClick={this.actionDel}>Xác nhận xóa</MDBBtn>
                  )}
                  {formAction !== Actions.DEL && <MDBBtn onClick={this.resetDraftForm}>Hủy</MDBBtn>}
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { categories } = state.AdminReducer || {};
  return { categories };
};
export const Category = connect(mapStateToProps, {
  actionGetCategories,
  actionPostCategory,
  actionPutCategory,
  actionDelCategory,
})(withRouter(CategoryComponent));
