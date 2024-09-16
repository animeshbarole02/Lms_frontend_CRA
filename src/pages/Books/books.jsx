import Table from "../../components/table/table";
import { useState, useCallback, useEffect } from "react";
import Button from "../../components/button/button";
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
import { fetchAllCategories } from "../../api/services/actions/categoryActions";
import Tooltip from "../../components/tooltip/toolTip";

import "./books.css";
import IssuanceForm from "../../components/forms/issuancesform";
import { createIssuance } from "../../api/services/actions/issuancesActions";
import {useNavigate} from "react-router-dom";
import Toast from "../../components/toast/toast";
import ConfirmationModal from "../../components/modal/confirmationModal";
import debounce from "../../utils/debounce";
import SearchInput from "../../components/search/search";
import Loader from "../../components/loader/loader";
import Pagination from "../../components/pagination/pagination";

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); 
  const [bookToDelete, setBookToDelete] = useState(null); 
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isOpen: false,
  });
  const [errors, setErrors] = useState({
    title: "",
    author: "",
    categoryId: "",
    quantity: "",
  });
  const [rowsPerPage, setRowsPerPage] = useState(
    window.innerWidth <= 768 ? 15 : 9
  );
  const [loading, setLoading] = useState(false);

  const columns = [
    { header: "ID", accessor: "displayId", width: "2%" },
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
            disabled={rowData.quantity === 0}
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

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentPage]);

  const loadBooks = async (search = "") => {
    try {
      setLoading(true);
      const response = await fetchBooks(currentPage, rowsPerPage, search);
      const data = response.data;
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
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoryList = await fetchAllCategories();
      setCategories(categoryList.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (newBook) => {
    let hadError = false;

    setErrors({ title: "", author: "", categoryId: "", quantity: "" });

    const title = newBook.title ? newBook.title.trim() : "";
    const author = newBook.author ? newBook.author.trim() : "";
    const categoryId = newBook.categoryId || "";
    const quantity = newBook.quantity ? parseInt(newBook.quantity, 10) : null;

    if (!title) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: "Book title is required.",
      }));
      hadError = true;
    }
    if (!author) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        author: "Author name is required.",
      }));
      hadError = true;
    }
    if (!categoryId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categoryId: "Category is required.",
      }));
      hadError = true;
    }
    const parsedQuantity = Number(quantity);

    if (
      quantity === null || 
      isNaN(parsedQuantity) || 
      parsedQuantity <= 0 || 
      !Number.isInteger(parsedQuantity)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        quantity: "Quantity must be a positive whole number.",
      }));
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
      let response;
      if (editingBook) {
        setLoading(true);
        response = await updateBook(newBook.id, bookToCreate);
        if (response.success) {
          setToast({
            message: `Book updated: ${bookToCreate.title}`,
            type: "success",
            isOpen: true,
          });
        } else {
          setToast({ message: response.message, type: "error", isOpen: true });
        }
        setEditingBook(null);
      } else {
        setLoading(true);
        response = await createBook(bookToCreate);
        if (response.success) {
          setToast({
            message: `Book added: ${bookToCreate.title}`,
            type: "success",
            isOpen: true,
          });
        } else {
          setToast({ message: response.message, type: "error", isOpen: true });
        }
      }

      setShowToast(true);
      loadBooks();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add book:", error);
    } finally {
      setLoading(true);
    }
  };

  const handleDelete = async () => {
    if (!bookToDelete) return;

    const id = bookToDelete.id;

    try {
      setLoading(true);
      const response = await deleteBook(id);

      if (response.success) {
        setToast({
          message: "Book deleted successfully.",
          type: "success",
          isOpen: true,
        });
        setShowToast(true);
        loadBooks();
      } else {
        setToast({
          message: response.message,
          type: "error",
          isOpen: true,
        });
        setShowToast(true);
      }
    } catch (error) {
      console.error("Failed to delete the book", error);
      setToast({
        message: "Failed to delete the book due to a server error.",
        type: "error",
        isOpen: true,
      });
      setShowToast(true);
    } finally {
      setLoading(false);
      setBookToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value;
    const trimmedSearchTerm = newSearchTerm.trim();
    setSearchTerm(newSearchTerm);
  
    
    if (trimmedSearchTerm.length === 0) {
      loadBooks();
    } else if (trimmedSearchTerm.length >= 3) {
      debounceSearch(trimmedSearchTerm);
    }
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
    setErrors({ title: "", author: "", categoryId: "", quantity: "" });
    setIsModalOpen(false);
  };

  const handleHistory = (rowData) => {
    navigate("/bookHistory", {
      state: { bookId: rowData.id, bookName: rowData.title },
    });
  };

  const handleIssuanceSubmit = async (issuanceDetails) => {
    try {
      setLoading(true);
      const response = await createIssuance(issuanceDetails);

      if (response.success) {
        setToast({ message: response.message, type: "success", isOpen: true });
        setShowToast(true);

        setTimeout(() => {
          navigate("/issuances");
        }, 1000);
      } else {
        setToast({ message: response.message, type: "error", isOpen: true });
        setShowToast(true);
      }

      loadBooks();
    } catch (error) {
      console.error("Failed to create issuance:", error);
      alert("Failed to create issuance due to a server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = (rowData) => {
    setSelectedBook(rowData);
    setIsIssuanceModalOpen(true);
  };

  const handleEdit = (rowData) => {
    setEditingBook(rowData);
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

  const handleFieldFocus = (fieldName) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "", 
    }));
  };

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
          {loading ? (
            <Loader />
          ) : (
            <div className="lower-div">
              <Table data={books} columns={columns} />
            </div>
          )}
          <div className="pagination-div">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <Dynamicform
            heading={editingBook ? "Edit Book" : "Add Book"}
            fields={[
              {
                name: "title",
                type: "text",
                label:"Title",
                placeholder: "Book Title",
              },
              {
                name: "author",
                type: "text",
                label:"Author",
                placeholder: "Author Name",
              },
              {
                name: "categoryId",
                type: "select",
                label:"Category",
                placeholder: "Select Book Category",

                options: categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              },
              {
                name: "quantity",
                type: "number",
                label:"Quantity",
                placeholder: "Enter Quantity",
              },
            ]}
            onSubmit={handleAddBook}
            isEditMode={editingBook}
            initialData={{
              ...editingBook,
              categoryId: editingBook?.category?.id || "",
            }}
            errors={errors}
            onFieldFocus={handleFieldFocus}
          />
        </Modal>

        <Modal
          isOpen={isIssuanceModalOpen}
          onClose={() => setIsIssuanceModalOpen(false)}
        >
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
