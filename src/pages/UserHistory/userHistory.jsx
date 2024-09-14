import React, { useEffect, useState } from "react";
import UserHOC from "../../hoc/userHOC";
import Table from "../../components/table/table";
import LeftPageIcon from "../../assets/icons/LeftPage.png";
import RightPageIcon from "../../assets/icons/Right-Page.png";

import { formatDateOrTime } from "../../utils/formateDateOrTime";
import { useSelector } from "react-redux";
import { fetchUserHistoryDetails } from "../../api/services/actions/userhistoryActions";

import "./userHistory.css";
import Pagination from "../../components/pagination/pagination";

const UserHistory = () => {
  const user = useSelector((state) => state.auth.user);

  const userId = user?.id;

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [issuances, setIssuances] = useState([]);
  const columns = [
    { header: "ID", accessor: "id", width: "5%" },
    { header: "Book", accessor: "book", width: "5%" },
    { header: "Category", accessor: "category", width: "5%" },
    { header: "Issued At", accessor: "issuedAt", width: "5%" },
    { header: "Returned At", accessor: "returnedAt", width: "5%" },
    { header: "Status", accessor: "status", width: "5%" },
    { header: "Issuance Type", accessor: "issuanceType", width: "5%" },
  ];

  useEffect(() => {
    const loadIssuances = async () => {
      if (!userId) return;

      try {
        const response = await fetchUserHistoryDetails(userId, currentPage, 10);
        const data = response.data;
        const formattedData = data.content.map((item, index) => ({
          ...item,
          id: index + 1,
          issuedAt: formatDateOrTime(item.issuedAt, item.issuanceType),
          returnedAt: formatDateOrTime(item.returnedAt, item.issuanceType),
        }));
        setIssuances(formattedData);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching issuances:", error);
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
    <div className="History-div">
      <div className="center-div">
        <div className="upper-div">
          <div className="upper-div-text ">
            <span>You can see your History Here : </span>
          </div>
        </div>

        <div className="lower-div">
          <Table data={issuances} columns={columns} />
        </div>

        <div className="pagination-div">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default UserHOC(UserHistory);
