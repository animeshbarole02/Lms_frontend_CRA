import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Navbar from "../../components/navbar/navbar";
import SideBar from "../../components/sideBar/sideBar";
import Card from "../../components/card/card";

import Reading from "../../assets/icons/girl-reading-book.png";
import Books from "../../assets/icons/Books.png";
import TakeAway from "../../assets/icons/Categories1.png";
import TotalUsers from "../../assets/icons/TotalUsers.png";
import AdminHOC from "../../hoc/AdminHOC";
import { fetchUserCount } from "../../api/services/actions/usersActions";
import { fetchCategoryCount } from "../../api/services/actions/categoryActions";
import { fetchBooks, fetchTotalBookCount } from "../../api/services/actions/bookActions";
import { fetchIssuanceCount } from "../../api/services/actions/issuancesActions";
import Table from "../../components/table/table";
import { current } from "@reduxjs/toolkit";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);

  const [categoryCount, setCategoryCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [issuanceCount, setIssuanceCount] = useState(0);
  const [tableData, setTableData] = useState([]);

  const [isTabletView, setIsTabletView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsTabletView(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


 
  useEffect(() => {

    
    const getCounts = async () => {
      try {
        const userCount = await fetchUserCount();
        setUserCount(userCount);

        const issuanceCount = await fetchIssuanceCount();
        setIssuanceCount(issuanceCount);

        const bookCount = await fetchTotalBookCount();
        setBookCount(bookCount);

        const categoryCount = await fetchCategoryCount();
        setCategoryCount(categoryCount);

        const booksTable = await fetchBooks(0, 10, "");
        const transformedTable = booksTable.content.map((book, index) => ({
          ...book,
          id: index + 1,
        }));
        setTableData(transformedTable);
        
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    getCounts();
  }, []);



  const columns = [
    { header: "ID", accessor: "id", width: "2%" },
    { header: "Book Title", accessor: "title", width: "7%" },
    { header: "Author", accessor: "author", width: "2%" },
  ];

  return (
    <div className="dashboard-div">
      <div className="contains">
        <div className="card-table-div">
          <div className="leftdash-div">
            <div className="cards-div">
              <div className="card-div">
                <Card
                  src={Reading}
                  heading="Book Issued"
                  count={issuanceCount}
                />
              </div>

              <div className="card-div">
                <Card
                  src={TakeAway}
                  heading="Categories Available"
                  count={categoryCount}
                />
              </div>

              <div className="card-div">
                <Card
                  src={TotalUsers}
                  heading="Active Users"
                  count={userCount}
                />
              </div>

              <div className="card-div">
                <Card
                  className="books-card"
                  src={Books}
                  heading="Books Available"
                  count={bookCount}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rightdash-div">
          {!isTabletView && (
            <div className="rightdash-table">
              <div className="dashborad-table-heading">
                <p>Top Books</p>
              </div>
              <div className="dashboard-table">
                <Table data={tableData} columns={columns} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHOC(Dashboard);
