import "./categories.css";

import { useCallback, useEffect, useState } from "react";
import Button from "../../components/Button/button";
import EditIcon from "../../assets/icons/EditIcom.png";
import LeftPageIcon from "../../assets/icons/LeftPage.png";
import RightPageIcon from "../../assets/icons/Right-Page.png";


import DeleteIcon from "../../assets/icons/DeleteIcon.png";
import Table from "../../components/Table/table";

import SearchIcon from "../../assets/icons/magnifying-glass.png";
import AdminHOC from "../../hoc/AdminHOC";
import Modal from "../../components/modal/modal";
import Dynamicform from "../../components/forms/dynamicform";
import { fetchCategories, addCategory, deleteCategory, updateCategory } from "../../api/services/categoryApi";
import Tooltip from "../../components/tooltip/toolTip";
import { retry } from "@reduxjs/toolkit/query";
import ConfirmationModal from "../../components/modal/confirmationModal";

 // Debounce utility function
const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  
  const debounceSearch = useCallback(
    debounce((newSearchTerm) => {
      loadCategories(newSearchTerm);
    }, 1000), 
    []
  );

  useEffect(() => {
    loadCategories(searchTerm);
  }, [currentPage]);


  const loadCategories = async (search = "") => {
    try {
      const data = await fetchCategories(currentPage, 10, search);

   
      
      const startIndex = currentPage * data.size;
      const transformedCategories = data.content.map((category, index) => ({
        ...category,
        displayId: startIndex + index + 1,
      }));
      setCategories(transformedCategories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    debounceSearch(newSearchTerm); 
  };

 
  const handleAddCategory = async (category) => {

    console.log(category);

    const isValidName = /^[A-Za-z\s]+$/.test(category.name.trim());
  const isValidDescription = /^[A-Za-z\s]+$/.test(category.categoryDesc.trim());
    if (isValidName && isValidDescription) {
      try {
        if (editingCategory) {
       

         
          await updateCategory(editingCategory.id, category);
          setEditingCategory(null); 
        } else {

        
        
          await addCategory(category);
         
        }
        loadCategories();
        handleCloseModal();
      } catch (error) {
        console.error("Failed to save category:", error);
      }
    }else {
        alert("Please enter a valid category name and description with only letters.");
    }
  };
  

  const handleOpenConfirmModal = (rowData) => {
    setCategoryToDelete(rowData);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        const response = await deleteCategory(categoryToDelete.id);
  
       
        if (response.includes("Category deleted successfully")) {
          setCategories(categories.filter((category) => category.id !== categoryToDelete.id));
          loadCategories();
          alert("Category is Deleted");
        } else if (response.includes("Category cannot be deleted as some books under this category are currently issued.")) {
          alert("Category cannot be deleted as some books under this category are currently issued.");
        } else if (response.includes("Category and all related books deleted successfully with ID")) {
          setCategories(categories.filter((category) => category.id !== categoryToDelete.id));
          loadCategories();
          alert("Category and all related books deleted successfully.");
        } else if (response.includes("Category not found")) {
          alert("The category you are trying to delete does not exist.");
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Failed to delete the category", error);
        alert("Failed to delete the category. Please try again later.");
      } finally {
        setCategoryToDelete(null);
        setIsConfirmModalOpen(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setCategoryToDelete(null);
    setIsConfirmModalOpen(false);
  };



  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleOpenModal = () => {
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const columns = [
    { header: "ID", accessor: "displayId", width: "0.25%" },
    { header: "Category Name", accessor: "name", width: "1%" },
    { header: "Category Description", accessor: "categoryDesc", width: "3%" },
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
      width: "0.2%",
    },
  ];

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

  
  const handleEdit = (rowData) => {
    setEditingCategory(rowData); 
    setIsModalOpen(true); 
  };



  return (
    <>
      <div className="categories-div">
        <div className="center-div">
          <div className="upper-div">
            <div className="upper-div-text">
              <span>Categories</span>
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
                      placeholder="Search categories..."
                      className="search-input"
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                      
                    />
                  </div>
                </div>
              </div>

              <div className="add-categories-div">
                <Button
                  text="Add Category"
                  className="add-categories-btn"
                  onClick={handleOpenModal}
                />
              </div>
            </div>
          </div>

          <div className="lower-div">
            <Table data={categories} columns={columns} />

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
        </div>
      </div>
      {/* Modal Component */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
      <Dynamicform
          heading={editingCategory ? "Edit Category" : "Add Category"}
          fields={[
            {
              name: "name",
              type: "text",
              placeholder: "Category Name",
              required: true,
      
            },
            {
              name: "categoryDesc",
              type: "text",
              placeholder: "Category Description",
              required: true,
          
            },
          ]}
          onSubmit={handleAddCategory}
          isEditMode={!!editingCategory}
          initialData={editingCategory || {}}
        />
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this category?"
      />
    </>
  );
};

export default AdminHOC(Categories);
