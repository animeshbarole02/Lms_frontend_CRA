import Table from "../../components/table/table";
import { useState, useCallback, useEffect } from "react";
import Button from "../../components/button/button";
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
} from "../../api/services/actions/bookActions";
import { fetchAllCategories} from "../../api/services/actions/categoryActions";
import Tooltip from "../../components/tooltip/toolTip";

import "./books.css";
import IssuanceForm from "../../components/forms/issuancesform";
import { createIssuance } from "../../api/services/actions/issuancesActions";
import { Navigate, useNavigate } from "react-router-dom";
import Toast from "../../components/toast/toast";
import ConfirmationModal from "../../components/modal/confirmationModal";
import debounce from "../../utils/debounce";
import SearchInput from "../../components/search/search";


const Books = () => {

  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isIssuanceModalOpen, setIsIssuanceModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Add state for confirm modal
  const [bookToDelete, setBookToDelete] = useState(null); // Add state for book to delete
  const [toast, setToast] = useState({ message: "", type: "success", isOpen: false });
  const [errors,setErrors] = useState({ title: "", author:"", categoryId:"",quantity: ""});
  const [rowsPerPage, setRowsPerPage] = useState(window.innerWidth <= 768 ? 15 : 9);

  const columns = [
    { header: "ID", accessor: "displayId", 
      width: "5%" },
    { header: "Title", accessor: "title", width: "10%" },
    { header: "Author", accessor: "author", width: "8%" },
    { header: "Category", accessor: "categoryName", width: "6%" },
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



  


  const debounceSearch = useCallback(
    debounce((newSearchTerm) => {
      loadBooks(newSearchTerm);
    }, 1000), 
    []
  );

 

  useEffect(() => {
    loadBooks();
    fetchCategories();

    const handleResize = () => {
      setRowsPerPage(window.innerWidth <= 768 ? 16 : 9);
    };
  
    window.addEventListener("resize", handleResize);
    
    // Initial call to set rowsPerPage correctly
    handleResize();
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
   
  
  }, [currentPage]);

  const loadBooks = async (search = "") => {
    try {
      const data = await fetchBooks(currentPage, rowsPerPage, search);

     

      const startIndex = currentPage * data.size;
      const transformedBooks = data.content.map((book, index) => ({
        ...book,
        displayId: startIndex + index + 1,
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
 

  let hadError = false;


  setErrors({ title: "", author: "", categoryId: "", quantity: "" });


  const title = newBook.title ? newBook.title.trim() : "";
  const author = newBook.author ? newBook.author.trim() : "";
  const categoryId = newBook.categoryId || "";
  const quantity = newBook.quantity ? parseInt(newBook.quantity) : null;

  if (!title) {
    setErrors((prevErrors) => ({ ...prevErrors, title: "Book title is required." }));
    hadError = true;
  }
  if (!author) {
    setErrors((prevErrors) => ({ ...prevErrors, author: "Author name is required." }));
    hadError = true;
  }
  if (!categoryId) {
    setErrors((prevErrors) => ({ ...prevErrors, categoryId: "Category is required." }));
    hadError = true;
  }
  if (quantity === null || isNaN(quantity) || quantity <= 0) {
    setErrors((prevErrors) => ({ ...prevErrors, quantity: "Quantity must be a positive number." }));
    hadError = true;
  }

  if (hadError) {
    return; 
  }

  const bookToCreate = {
    title: newBook.title.trim(),
    author: newBook.author.trim(),
    categoryId: newBook.categoryId,
    quantity: parseInt(newBook.quantity),
  };

  try {
    if (editingBook) {
      await updateBook(newBook.id, { ...bookToCreate });
      setEditingBook(null);
      setToast({ message: `Book Updated: ${editingBook.title}`, type: "success", isOpen: true });
    } else {
      await createBook(bookToCreate);
      setToast({ message: `Book added: ${bookToCreate.title}`, type: "success", isOpen: true });
    }

    setShowToast(true);
    loadBooks();
    handleCloseModal();
  } catch (error) {
    console.error("Failed to add book:", error);
   
   
  }
};

  const handleDelete = async () => {
    if (!bookToDelete) return;
  
    const id = bookToDelete.id;
  
    try {
      const message = await deleteBook(id);
  
      if (message === "Book deleted successfully") {
        setToast({ message: "Book deleted successfully.", type: "success", isOpen: true });
        setShowToast(true);
        loadBooks();
      } else {
        setToast({ message: message, type: "error", isOpen: true });
        setShowToast(true);
      }
  
    } catch (error) {
      console.error("Failed to delete the book", error);
      alert("Failed to delete the book due to a server error.");
    } finally {
      setBookToDelete(null);
      setIsConfirmModalOpen(false);
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
  const handleCancelDelete = () => {
    setBookToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleOpenConfirmModal = (rowData) => {
    setBookToDelete(rowData);
    setIsConfirmModalOpen(true);
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

 

  const handleIssuanceSubmit = async (issuanceDetails) => {
   
    try {

        console.log(issuanceDetails);
       const response = await createIssuance(issuanceDetails);
     console.log(response);
      if(response==="Issuance Added Successfully"){
       setToast({ message:response, type: "success", isOpen: true });
       setShowToast(true);
      }
       else {

        setToast({ message:response, type: "error", isOpen: true });
        setShowToast(true);
        
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

    console.log(rowData.category.id)
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
          onClick={() => handleOpenConfirmModal(rowData)}
        />
      </Tooltip>
    </div>

  
  );

  return (
    <>
    <div className="bookspage-div">
      <div className="center-div">
        <div className="upper-div">
          <div className="upper-div-text">
            <span>Books</span>
          </div>

          <div className="upper-div-btns">
            <div className="upper-search-div">

            <SearchInput
        value={searchTerm}
        onChange={handleSearchInputChange}
        placeholder="Search Books..."
      />
         
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
             
            
            },
            {
              name: "author",
              type: "text",
              placeholder: "Author Name",
             
             
            },
            {
              name: "categoryId",
              type: "select", 
              placeholder: "Select Book Category",
             
              options: categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            },
            {
              name: "quantity",
              type: "number",
              placeholder: "Enter Quantity",
             
            },
          ]}
          onSubmit={handleAddBook}
          isEditMode={editingBook}
          initialData={editingBook||{}}
          errors={errors}
          
        />
      </Modal>


      <Modal isOpen={isIssuanceModalOpen} onClose={() => setIsIssuanceModalOpen(false)}>
        <IssuanceForm
          onSubmit={handleIssuanceSubmit}
          selectedBook={selectedBook}
        
          onClose={() => setIsIssuanceModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this Book?"
      />


      <Toast
     message={toast.message} 
     type={toast.type} 
     onClose={() => setShowToast(false)} 
     isOpen={showToast}
   />
   </div>

    </>
  );
};

export default AdminHOC(Books);