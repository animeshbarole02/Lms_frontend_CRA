import Table from "../../components/Table/table";
import { useState, useCallback, useEffect } from "react";
import Button from "../../components/Button/button";
import SearchIcon from "../../assets/icons/magnifying-glass.png";
import LeftPageIcon from "../../assets/icons/LeftPage.png";
import RightPageIcon from "../../assets/icons/Right-Page.png";
import EditIcon from "../../assets/icons/EditIcom.png";

import AdminHOC from "../../hoc/AdminHOC";
import Modal from "../../components/modal/modal";
import Dynamicform from "../../components/forms/dynamicform";
import DeleteIcon from "../../assets/icons/DeleteIcon.png";
import {
  fetchBooks,
  createBook,
  deleteBook,
  updateBook,
} from "../../api/services/bookApi";
import { fetchAllCategories, getCategoryByName } from "../../api/services/categoryApi";
import Tooltip from "../../components/tooltip/toolTip";

import "./books.css";
import IssuanceForm from "../../components/forms/issuancesform";
import { createIssuance } from "../../api/services/issuancesApi";
import { Navigate, useNavigate } from "react-router-dom";

const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const Books = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isIssuanceModalOpen, setIsIssuanceModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);



  const navigate = useNavigate();


  const debounceSearch = useCallback(
    debounce((newSearchTerm) => {
      loadBooks(newSearchTerm);
    }, 1000), 
    []
  );

  useEffect(() => {
    loadBooks();
    fetchCategories();
  }, [currentPage]);

  const loadBooks = async (search = "") => {
    try {
      const data = await fetchBooks(currentPage, 10, search);

     

      const startIndex = currentPage * data.size;
      const transformedBooks = data.content.map((book, index) => ({
        ...book,
     
        categoryName: book.category.name,
      }));
      setBooks(transformedBooks);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load books:", error);
    }
  };

const fetchCategories = async () => {
    try {
      const categoryList = await fetchAllCategories(); 
      setCategories(categoryList);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

 

  const handleAddBook = async (newBook) => {

    

    console.log(newBook);

    if (
      newBook.title &&
      newBook.author &&
      newBook.categoryId &&
      newBook.quantity
    ) {

      
  
    
        const bookToCreate = {
          title: newBook.title,
          author: newBook.author,
          categoryId : newBook.categoryId,
          quantity: parseInt(newBook.quantity),
        };
    

        console.log(bookToCreate);
         try {
          if(editingBook) {
            await updateBook(newBook.id, {...bookToCreate})
            setEditingBook(null);
          }else {
            await createBook(bookToCreate);
            
          }
         
   
      
          loadBooks();
       
        handleCloseModal();
      } catch (error) {
        console.error("Failed to add book:", error);
      }
    }
  };
  const handleDelete = async (rowData) => {
    const id = rowData.id;
  
    try {
      const message = await deleteBook(id);
  
      if (message === "Book deleted successfully") {
        setBooks(books.filter((book) => book.id !== id));
        alert(message);
      } else if (message === "Book cannot be deleted as it is currently issued.") {
        alert(message);
      } else if (message === "Book not found") {
        alert(message);
      } else {
        alert("An unexpected error occurred.");
      }
  
    } catch (error) {
      console.error("Failed to delete the book", error);
      alert("Failed to delete the book due to a server error.");
    }
  };

  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    debounceSearch(newSearchTerm); 
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleOpenModal = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleHistory = (rowData) => {
    console.log(rowData);

    navigate('/bookHistory' ,{state : {bookId : rowData.id ,
        bookName:rowData.title
    } 
       
    });
    
  }

  const columns = [
    { header: "ID", accessor: "id", width: "5%" },
    { header: "Title", accessor: "title", width: "10%" },
    { header: "Author", accessor: "author", width: "10%" },
    { header: "Category", accessor: "categoryName", width: "5%" },
    { header: "Quantity", accessor: "quantity", width: "0%" },

    {
      header: "Options",
      render: (rowData) => (
        <div className="button-container">
          <Button
            text="Issue"
            className="action-button issue-button"
            onClick={() => handleIssue(rowData)}
          />
          <Button
            text="History"
            className="action-button issue-button"
            onClick={() => handleHistory(rowData)}
          />
        </div>
      ),
      width: "2%",
    },
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
      width: "1%",
    },
    
  ];

  const handleIssuanceSubmit = async (issuanceDetails) => {
   
    try {

        console.log(issuanceDetails);
       const response = await createIssuance(issuanceDetails);

       console.log(response);
       

      if (response === "Issuance already exists for this user and book.") {
          alert(response); 
      } 
      else if (response==="No copies available for the selected book."){
             alert(response);
      }
      else {
          alert("Issuance created successfully.");
      }
      loadBooks();
  } catch (error) {
      console.error("Failed to create issuance:", error);
      alert("Failed to create issuance.");
  }
  };

  const handleIssue = (rowData)=> {

    setSelectedBook(rowData);
    setIsIssuanceModalOpen(true);


    
  }



  const handleEdit = (rowData) => {

   
    setEditingBook(rowData)
    setIsModalOpen(true);
     
  };

  const renderActions = (rowData) => (
   
    <div className="actionicons">
      
      <Tooltip message="Edit">
        <img
          src={EditIcon}
          alt="Edit"
          className="action-icon"
          
          onClick={() => handleEdit(rowData)}
          
        />
      </Tooltip>

      <Tooltip message="Delete">
        <img
          src={DeleteIcon}
          alt="Delete"
          className="action-icon"
          onClick={() => handleDelete(rowData)}
        />
      </Tooltip>
    </div>

  
  );

  return (
    <>
      <div className="center-div">
        <div className="upper-div">
          <div className="upper-div-text">
            <span>Books</span>
          </div>

          <div className="upper-div-btns">
            <div className="upper-search-div">
              <div className="search-input-div">
                <div className="search-icon-div">
                  <img src={SearchIcon} alt="" />
                </div>

                <div className="search-categories-div">
                  <input
                    type="text"
                    placeholder="Search Books..."
                    className="search-input"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="add-categories-div">
              <Button
                text="Add Book"
                className="add-categories-btn"
                onClick={handleOpenModal}
              />
            </div>
          </div>
        </div>

        <div className="lower-div">
          <Table data={books} columns={columns} />
        </div>
        <div className="pagination-div">
          <div className="left-pagination">
            <img
              src={LeftPageIcon}
              alt=""
              onClick={() => handlePageChange("prev")}
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
              onClick={() => handlePageChange("next")}
            />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <Dynamicform
           heading={editingBook ? "Edit Book" : "Add Book"}
          fields={[
            {
              name: "title",
              type: "text",
              placeholder: "Book Title",
              required: true,
            
            },
            {
              name: "author",
              type: "text",
              placeholder: "Author Name",
              required: true,
             
            },
            {
              name: "categoryId",
              type: "select", 
              placeholder: "Select Book Category",
              required: true,
              options: categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            },
            {
              name: "quantity",
              type: "number",
              placeholder: "Enter Quantity",
              required: true,
            },
          ]}
          onSubmit={handleAddBook}
          isEditMode={!!editingBook}
          initialData={editingBook||{}}
          
        />
      </Modal>


      <Modal isOpen={isIssuanceModalOpen} onClose={() => setIsIssuanceModalOpen(false)}>
        <IssuanceForm
          onSubmit={handleIssuanceSubmit}
          selectedBook={selectedBook}
          onClose={() => setIsIssuanceModalOpen(false)}
        />
      </Modal>


  

    </>
  );
};

export default AdminHOC(Books);