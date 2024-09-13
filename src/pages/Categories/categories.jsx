import "./categories.css";

import { useCallback, useEffect, useState } from "react";
import Button from "../../components/button/button";
import EditIcon from "../../assets/icons/EditIcom.png";
import LeftPageIcon from "../../assets/icons/LeftPage.png";
import RightPageIcon from "../../assets/icons/Right-Page.png";
import "../../components/toast/toast.css";

import DeleteIcon from "../../assets/icons/DeleteIcon.png";
import Table from "../../components/table/table";

import AdminHOC from "../../hoc/AdminHOC";
import Modal from "../../components/modal/modal";
import Dynamicform from "../../components/forms/dynamicform";
import {
  fetchCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from "../../api/services/actions/categoryActions";
import Tooltip from "../../components/tooltip/toolTip";

import ConfirmationModal from "../../components/modal/confirmationModal";
import Toast from "../../components/toast/toast";
import debounce from "../../utils/debounce";
import SearchInput from "../../components/search/search";
import Loader from "../../components/loader/loader";

const Categories = () => {
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isOpen: false,
  });
  const [errors, setErrors] = useState({ name: "", categoryDesc: "" });
  const [searchError, setSearchError] = useState("");
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
      setLoading(true);

      const response = await fetchCategories(currentPage, 9, search);
      const data = response.data;

      const startIndex = currentPage * data.size;
      const transformedCategories = data.content.map((category, index) => ({
        ...category,
        displayId: startIndex + index + 1,
      }));
      setCategories(transformedCategories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value;
    const trimmedSearchTerm = newSearchTerm.trim();
    setSearchTerm(newSearchTerm);

    

    if (trimmedSearchTerm.length < 3 && trimmedSearchTerm.length > 0) {
      
      loadCategories();
    } else {
      setSearchError("");
      debounceSearch(trimmedSearchTerm);
    }
  };

  const handleAddCategory = async (category) => {
    const name = category.name ? category.name.trim() : "";
    const categoryDesc = category.categoryDesc
      ? category.categoryDesc.trim()
      : "";
  
    const isValidName = /^[A-Za-z\s]+$/.test(name);
  
    let hasError = false;
    setErrors({ name: "", categoryDesc: "" });
  
    if (!name) {
      setErrors({
        name: "Please enter a valid category name.",
      });
      hasError = true;
    } else if (!isValidName) {
      setErrors({
        name: "Please enter a valid category name with only letters.",
      });
      hasError = true;
    }
  

    if (!categoryDesc) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categoryDesc: "Please enter a valid category description.",
      }));
      hasError = true;
    }
  
    if (hasError) return;
  
    try {
      let response;
      if (editingCategory) {
        setLoading(true);
        const response = await updateCategory(category.id, {
          name,
          categoryDesc,
        });
  
        if (response.success) {
          setToast({
            message: `Category updated: ${name}`,
            type: "success",
            isOpen: true,
          });
        } else {
          setToast({
            message: ` ${response.message}`,
            type: "error",
            isOpen: true,
          });
        }
      } else {
        setLoading(true);
        response = await addCategory({ name, categoryDesc });
        if (response.success) {
          setToast({
            message: `Category added: ${name}`,
            type: "success",
            isOpen: true,
          });
        } else {
          setToast({
            message: `Category with name '${name}' already exists.`,
            type: "error",
            isOpen: true,
          });
        }
      }
  
      setShowToast(true);
      loadCategories();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmModal = (rowData) => {
    setCategoryToDelete(rowData);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        setLoading(true);
        const response = await deleteCategory(categoryToDelete.id);

        if (response.success) {
          setCategories(
            categories.filter((category) => category.id !== categoryToDelete.id)
          );

          setToast({
            message: `${response.message} for category: ${categoryToDelete.name}`,
            type: "success",
            isOpen: true,
          });
          setShowToast(true);
        } else {
          setToast({
            message: response.message,
            type: "error",
            isOpen: true,
          });
          setShowToast(true);
        }

        loadCategories();
      } catch (error) {
        console.error("Failed to delete the category", error);
        setToast({
          message: "An error occurred while deleting the category.",
          type: "error",
          isOpen: true,
        });
      } finally {
        setCategoryToDelete(null);
        setIsConfirmModalOpen(false);
        setLoading(false);
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
    setErrors({ name: "", categoryDesc: "" });
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

  const handleEdit = (rowData) => {
    setEditingCategory(rowData);
    setIsModalOpen(true);
  };

  const handleFieldFocus = (fieldName) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
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
                <div className="search-span-input">
                  <SearchInput
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Search categories..."
                  />
                 
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
          {loading ? (
            <Loader />
          ) : (
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
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <Dynamicform
          heading={editingCategory ? "Edit Category" : "Add Category"}
          fields={[
            {
              name: "name",
              type: "text",
              placeholder: "Category Name",
              value: editingCategory ? editingCategory.name : "",
            },
            {
              name: "categoryDesc",
              type: "text",
              placeholder: "Category Description",

              value: editingCategory ? editingCategory.categoryDesc : "",
            },
          ]}
          onSubmit={handleAddCategory}
          isEditMode={editingCategory}
          initialData={editingCategory || {}}
          errors={errors}
          // onFieldFocus={handleFieldFocus}
        />
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this category?"
      />
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setShowToast(false)}
        isOpen={showToast}
      />
    </>
  );
};

export default AdminHOC(Categories);
