import React, { useState, useEffect } from "react";
import AdminHOC from "../../hoc/AdminHOC";
import Table from "../../components/table/table";
import { fetchUserIssuanceDetails } from "../../api/services/actions/issuancesActions";

import { useLocation, useNavigate } from "react-router-dom";
import {
  formatDateOrTime,

} from "../../utils/formateDateOrTime";
import BackArrow from "../../assets/icons/back.png";
import "./historyPage.css";
import Pagination from "../../components/pagination/pagination";

const History = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const userName = location.state?.userName;

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [issuances, setIssuances] = useState([]);
  const columns = [
    { header: "ID", accessor: "id", width: "3%" },
    { header: "Book", accessor: "book", width: "3%" },
    { header: "Category", accessor: "category", width: "3%" },
    { header: "Issued At", accessor: "issuedAt", width: "3%" },
    { header: "Returned At", accessor: "returnedAt", width: "3%" },
    { header: "Status", accessor: "status", width: "3%" },
    {
      header: "Issuance Type",
      render: (rowData) =>
        rowData.issuanceType === "Home" ? "Take away" : "In House",
      width: "3%",
    },
  ];

  useEffect(() => {
    const loadIssuances = async () => {
      if (!userId) return;

      try {
        const response = await fetchUserIssuanceDetails(
          userId,
          currentPage,
          10
        );
        const data = response.data;
        const startIndex = currentPage * data.size;
        const formattedData = data.content.map((item, index) => ({
          ...item,
          id: startIndex + index + 1,
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

  const handleImageClick = () => {
    navigate("/users");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="History-div">
      <div className="center-div">
        <div className="upper-div">
          <div className="upper-div-text">
            <div className="img-back">
              <img src={BackArrow} alt="backarrow" onClick={handleImageClick} />
            </div>

            <div className="text">
              <span>{userName} History </span>
            </div>
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

export default AdminHOC(History);
