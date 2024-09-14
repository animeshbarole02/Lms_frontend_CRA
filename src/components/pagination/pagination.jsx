import React from 'react';
import LeftPageIcon from "../../assets/icons/LeftPage.png";
import RightPageIcon from "../../assets/icons/Right-Page.png";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-div">
      <div className="left-pagination">
        <img
          src={LeftPageIcon}
          alt="Left"
          onClick={() => onPageChange('prev')}
          disabled={currentPage === 0}
        />
      </div>
      <div className="pagination-number">
        <span>
          {totalPages > 1
            ? `${currentPage + 1} of ${totalPages}`
            : totalPages === 1
            ? `1 of 1`
            : "No pages available"}
        </span>
      </div>
      <div className="right-pagination">
        <img
          src={RightPageIcon}
          alt="Right"
          onClick={() => onPageChange('next')}
          disabled={currentPage >= totalPages - 1}
        />
      </div>
    </div>
  );
};

export default Pagination;
