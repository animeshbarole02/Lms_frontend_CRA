import React, { useEffect ,useState } from 'react'
import AdminHOC from '../../hoc/AdminHOC'
import Table from '../../components/table/table';
import { formatDateOrTime } from '../../utils/formateDateOrTime';
import { fetchBookIssuanceDetails } from '../../api/services/actions/issuancesActions';
import { useLocation } from 'react-router-dom';
import LeftPageIcon from "../../assets/icons/LeftPage.png";
import RightPageIcon from "../../assets/icons/Right-Page.png";


const BookHistory = () => {
 
   
  const location = useLocation();
  const bookId = location.state?.bookId; 
  const bookTitle = location.state?.bookName
  

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [issuances, setIssuances] = useState([]);
  const columns = [
    { header: 'ID', accessor: 'id', width: "2%" },
    { header: 'Name', accessor: 'name',width:"3%" },
    { header: 'Email', accessor: 'email' ,width:"3%"},
    { header: 'Issued At', accessor: 'issuedAt',width:"3%" },
    { header: 'Returned At', accessor: 'returnedAt',width:"3%" },
    { header: 'Status', accessor: 'status',width:"3%" },
    { header: 'Issuance Type', accessor: 'issuanceType',width:"3%" }
  ];
 


    useEffect(() => {
        const loadIssuances = async () => {
          if (!bookId) return; 
          
          try {
            const data = await fetchBookIssuanceDetails(bookId, currentPage, 10);
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
      }, [currentPage, bookId]);

      
      
     
     
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
            <span>{bookTitle} History </span>
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

export default AdminHOC( BookHistory);