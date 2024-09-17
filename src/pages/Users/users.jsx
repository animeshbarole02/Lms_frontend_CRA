import { useCallback, useEffect, useState } from "react";

import EditIcon from "../../assets/icons/EditIcom.png";
import Button from "../../components/button/button";
import Table from "../../components/table/table";
import AdminHOC from "../../hoc/AdminHOC";
import Modal from "../../components/modal/modal";
import Dynamicform from "../../components/forms/dynamicform";
import DeleteIcon from "../../assets/icons/DeleteIcon.png";

import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../api/services/actions/usersActions";
import UserIssuanceform from "../../components/forms/userIssuanceform";
import { createIssuance } from "../../api/services/actions/issuancesActions";

import { generatePassword } from "../../utils/generatePassword";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/modal/confirmationModal";
import Tooltip from "../../components/tooltip/toolTip";
import Toast from "../../components/toast/toast";
import debounce from "../../utils/debounce";
import SearchInput from "../../components/search/search";
import Loader from "../../components/loader/loader";
import Pagination from "../../components/pagination/pagination";

const Users = () => {
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIssuanceModalOpen, setIsIssuanceModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isOpen: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const columns = [
    { header: "ID", accessor: "displayId", width: "2%" },
    { header: "User Name", accessor: "name", width: "3%" },
    { header: "User Email", accessor: "email", width: "5%" },
    { header: "Phone Number", accessor: "phoneNumber", width: "4%" },
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
            className="action-button history-button"
            onClick={() => handleHistory(rowData)}
          />
        </div>
      ),
      width: "4%",
    },
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
      width: "1%",
    },
  ];

  const navigate = useNavigate();
  
  const debounceSearch = useCallback(
    debounce((newSearchTerm) => {
      
      loadUsers(newSearchTerm);
    }, 1000),
    [] 
  );

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async (search = "") => {
    setLoading(true);
    try {
      const response = await fetchUsers(currentPage, 9, search);
      const data = response.data;
      const startIndex = currentPage * data.size;
      const transformedUsers = data.content.map((user, index) => ({
        ...user,
        displayId: startIndex + index + 1,
      }));
      setUsers(transformedUsers);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load Users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsEditMode(false);
    setEditUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrors({ name: "", email: "", phoneNumber: "" });
    setEditUser(null);
  };

  const handleAddUser = async (user) => {
    let hasError = false;
    const newErrors = { name: "", email: "", phoneNumber: "" };

    const name = user.name ? user.name.trim() : "";
    if (!name) {
      newErrors.name = "Enter a Name";
      hasError = true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.com$/;
    const email = user.email ? user.email.trim() : "";
    if (!email || !emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email (ending with '.com')";
      hasError = true;
    }

    const phonePattern = /^\d{10}$/;
    const phoneNumber = user.phoneNumber ? user.phoneNumber.trim() : "";
    if (!phoneNumber || !phonePattern.test(phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit Phone Number";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const newUser = {
      ...user,
      role: "USER",
      password: generatePassword(12),
    };

    try {
      let response;
      if (isEditMode && editUser) {
        setLoading(true);
        response = await updateUser(editUser.id, newUser);

        if (response.success) {
          setToast({
            message: "User updated successfully.",
            type: "success",
            isOpen: true,
          });
        } else {
          setToast({ message: response.message, type: "error", isOpen: true });
        }
        setShowToast(true);
      } else {
        setLoading(true);

        response = await addUser(newUser);
        if (response.success) {
          setToast({
            message: "User added successfully.",
            type: "success",
            isOpen: true,
          });
          setShowToast(true);
        } else {
          setToast({ message: response.message, type: "error", isOpen: true });
          setShowToast(true);
        }
      }

      loadUsers();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save User:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenConfirmModal = (rowData) => {
    setUserToDelete(rowData);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    const id = userToDelete.id;
    try {
      setLoading(true);
      const response = await deleteUser(id);

      if (response.success) {
        setUsers(users.filter((user) => user.id !== id));
        setToast({ message: response.message, type: "success", isOpen: true });
        setShowToast(true);
      } else {
        setToast({ message: response.message, type: "error", isOpen: true });
        setShowToast(true);
        loadUsers();
      }
    } catch (error) {
      console.log("Failed to delete User", error);
    } finally {
      setUserToDelete(null);
      setIsConfirmModalOpen(false);
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleIssue = (rowData) => {
    setSelectedUser(rowData);
    setIsIssuanceModalOpen(true);
  };

  const handleHistory = (rowData) => {
    navigate("/history", {
      state: { userId: rowData.id, userName: rowData.name },
    });
  };

  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value;
    const trimmedSearchTerm = newSearchTerm.trim();
    setSearchTerm(newSearchTerm);
  
    
    if (trimmedSearchTerm.length === 0) {
      debounceSearch.cancel();
      loadUsers();
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

      loadUsers();
    } catch (error) {
      console.error("Failed to create issuance:", error);
      alert("Failed to create issuance due to a server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rowData) => {
    setEditUser(rowData);
    setIsEditMode(true);
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
          alt="Assign-Book"
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
      <div className="center-div">
        <div className="upper-div">
          <div className="upper-div-text">
            <span>Users</span>
          </div>

          <div className="upper-div-btns">
            <div className="upper-search-div">
              <SearchInput
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Search Users..."
              />
            </div>

            <div className="add-categories-div">
              <Button
                text="Add User"
                className="add-categories-btn"
                onClick={handleOpenModal}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="loader">
            <div className="lower-div">
              <Table data={users} columns={columns} />
            </div>

            <div className="pagination-div">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <Dynamicform
          heading={isEditMode ? "Edit User" : "Add User"}
          fields={[
            {
              name: "name",
              type: "text",
              label:"Name",
              placeholder: "User Name",
            },
            {
              name: "email",
              type: "email",
              label:"Email",
              placeholder: "User Email",
            },
            {
              name: "phoneNumber",
              type: "tel",
              label:"Phone-Number",
              placeholder: "Phone Number",
            },
          ]}
          onSubmit={handleAddUser}
          isEditMode={isEditMode}
          initialData={editUser || {}}
          errors={errors}
          onFieldFocus={handleFieldFocus}
        />
      </Modal>

      <Modal
        isOpen={isIssuanceModalOpen}
        onClose={() => setIsIssuanceModalOpen(false)}
      >
        <UserIssuanceform
          onSubmit={handleIssuanceSubmit}
          selectedUser={selectedUser}
          onClose={() => setIsIssuanceModalOpen(false)}
        />
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this user?"
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

export default AdminHOC(Users);
