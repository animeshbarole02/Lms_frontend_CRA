import React, { useState, useEffect } from 'react';
import AdminHOC from '../../hoc/AdminHOC';
import Table from '../../components/Table/table';
import { fetchUserIssuanceDetails } from '../../api/services/issuancesApi'; 
import SearchIcon from "../../assets/icons/magnifying-glass.png";
import LeftPageIcon from "../../assets/icons/LeftPage.png";
import RightPageIcon from "../../assets/icons/Right-Page.png";
import { useLocation } from 'react-router-dom';
import { formatDateOrTime, formatDateTime } from '../../utils/formateDateOrTime';

const History = () => {
  const location = useLocation();
  const userId = location.state?.userId; 
  const userName =location.state?.userName;

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [issuances, setIssuances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Book', accessor: 'book' },
    { header: 'Category', accessor: 'category' },
    { header: 'Issued At', accessor: 'issuedAt' },
    { header: 'Returned At', accessor: 'returnedAt' },
    { header: 'Status', accessor: 'status' },
    { header: 'Issuance Type', accessor: 'issuanceType' }
  ];

 
  useEffect(() => {
    const loadIssuances = async () => {
      if (!userId) return; 
      
      try {
        const data = await fetchUserIssuanceDetails(userId, currentPage, 10);
        const formattedData = data.content.map(item => ({
          ...item,
          issuedAt: formatDateOrTime(item.issuedAt,item.issuanceType),
          returnedAt: formatDateOrTime(item.returnedAt,item.issuanceType)
        }));
        setIssuances(formattedData);
        setTotalPages(data.totalPages); 
      } catch (error) {
        console.error('Error fetching issuances:', error);
      }
    };

    loadIssuances();
  }, [currentPage, userId]);

 
 
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className='History-div'>
      <div className="center-div">
        <div className="upper-div">
          <div className="upper-div-text">
            <span>{userName} History </span>
          </div>

        </div>

        <div className="lower-div">
          <Table data={issuances} columns={columns} />
        </div>

        <div className="pagination-div">
          <div className="left-pagination">
            <img
              src={LeftPageIcon}
              alt=""
              onClick={() => handlePageChange(currentPage - 1)}
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
              alt=""
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHOC(History);
