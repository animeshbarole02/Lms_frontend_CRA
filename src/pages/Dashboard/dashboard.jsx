import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Card from "../../components/card/card";
import Reading from "../../assets/icons/girl-reading-book.png";
import Books from "../../assets/icons/Books.png";
import TakeAway from "../../assets/icons/Categories1.png";
import TotalUsers from "../../assets/icons/TotalUsers.png";
import AdminHOC from "../../hoc/AdminHOC";
import Table from "../../components/table/table";
import { fetchBooks } from "../../api/services/actions/bookActions";
import { fetchCategories } from "../../api/services/actions/categoryActions";
import Loader from "../../components/loader/loader";
import { fetchCount } from "../../api/services/actions/dashboardActions";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [issuanceCount, setIssuanceCount] = useState(0);
  const [bookstableData, setBooksTableData] = useState([]);
  const [categoryTableData,setCategoryTableData] = useState([]);
  const [loading,setLoading] =  useState(false);
  const [isTabletView, setIsTabletView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsTabletView(window.innerWidth <= 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getCounts = async () => {
      try {
        setLoading(true);
        const response = await fetchCount();
       
        if(response.success) 
        {

        setBookCount(response.data.bookCount);
        setCategoryCount(response.data.categoryCount);
        setUserCount(response.data.userCount);
        setIssuanceCount(response.data.issuanceCount);

        }
        else 
        {
          console.log("Error Fetching in Counts");
        }

        const booksResponse = await fetchBooks(0, 5, "");
        const booksTable  =booksResponse.data;
        const transformedTable = booksTable.content.map((book, index) => ({
          ...book,
          id: index + 1,
        }));
        setBooksTableData(transformedTable);

        const categoryResponse = await fetchCategories(0,5,"");
        const categoryTable = categoryResponse.data;
        const tranformedCategoryTable = categoryTable.content.map((category ,index) => ({
          ...category,
          id : index +1,
        }));
        
        setCategoryTableData(tranformedCategoryTable);
        
      } catch (error) {
        console.error("Error fetching counts:", error);
      }finally {
        setLoading(false);
      }
    };

    getCounts();
  }, []);

  const columns = [
    { header: "ID", accessor: "id", width: "1%" },
    { header: "Book Title", accessor: "title", width: "7%" },
    { header: "Author", accessor: "author", width: "2%" },
  ];
  const categorycolumns = [
    { header: "ID", accessor: "id", width: "0.25%" },
    { header: "Category Name", accessor: "name", width: "1%" },
    { header: "Category Description", accessor: "categoryDesc", width: "3%" },
   
  ];

  return (
    <div className="dashboard-div">
      {loading ? (<Loader/>) : (
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
              <div className="table-one">
              <div className="dashborad-table-heading">
                <p>Newly Added Books</p>
               </div>
               <div className="dashboard-table">
                <Table data={bookstableData} columns={columns} />
              </div>
              </div>
              <div className="table-two">
              <div className="dashborad-table-heading">
                <p>Newly Added Category</p>
               </div>
               <div className="dashboard-table">
                <Table data={categoryTableData} columns={categorycolumns} />
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};

export default AdminHOC(Dashboard);
