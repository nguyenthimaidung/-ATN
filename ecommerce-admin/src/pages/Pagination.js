import React from 'react';
import { MDBPagination, MDBPageItem, MDBPageNav } from 'mdbreact';

export class Pagination extends React.Component {
  handleSelectPage = (idx) => () => {
    this.props.getValue && this.props.getValue(idx);
  };

  render() {
    const { pagination } = this.props;
    const { page = 0, total = 0, take = 10 } = pagination || {};
    const numPages = Math.floor(total / take);
    const pages = [];
    for (let i = numPages < total / take ? numPages + 1 : numPages; i > 0; i--) {
      pages.push(i);
    }

    return (
      <React.Fragment>
        {total > 0 && pages.length > 0 && (
          <MDBPagination circle>
            <MDBPageItem onClick={this.handleSelectPage(page - 1)} disabled={page === 0}>
              <MDBPageNav>&laquo;</MDBPageNav>
            </MDBPageItem>
            {pages &&
              pages.map((item, idx) => (
                <MDBPageItem key={`pagination_${idx}`} onClick={this.handleSelectPage(idx)} active={idx === page}>
                  <MDBPageNav>{idx + 1}</MDBPageNav>
                </MDBPageItem>
              ))}
            <MDBPageItem
              onClick={this.handleSelectPage(page + 1)}
              disabled={pages.length === 0 || page === pages.length - 1}
            >
              <MDBPageNav>&raquo;</MDBPageNav>
            </MDBPageItem>
          </MDBPagination>
        )}
      </React.Fragment>
    );
  }
}
