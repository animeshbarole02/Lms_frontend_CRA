import { useCallback, useEffect, useState } from "react";

import EditIcon from "../../assets/icons/EditIcom.png";
import SearchIcon from "../../assets/icons/magnifying-glass.png";
import Button from "../../components/button/button";
import Table from "../../components/table/table";
import LeftPageIcon from "../../assets/icons/LeftPage.png";
import RightPageIcon from "../../assets/icons/Right-Page.png";
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
import { Navigate, useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/modal/confirmationModal";
import Tooltip from "../../components/tooltip/toolTip";
import Toast from "../../components/toast/toast";
import debounce from "../../utils/debounce";
import SearchInput from "../../components/search/search";



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
  const [toast, setToast] = useState({ message: "", type: "success", isOpen: false });
  const[errors , setErrors] = useState({name :"",email :"",phoneNumber: ""});

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
    loadUsers(searchTerm);
  }, [currentPage]);

  const loadUsers = async (search = "") => {
    try {
      const data = await fetchUsers(currentPage, 9, search);

      
      const startIndex = currentPage * data.size;
      const transformedCategories = data.content.map((user, index) => ({
        ...user,
       displayId : startIndex + index + 1,
      }));
      setUsers(transformedCategories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load Users:", error);
    }
  };

  const handleOpenModal = () => {
    setIsEditMode(false); 
    setEditUser(null); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditUser(null)
  };

  const handleAddUser = async (user) => {

    let hasError = false;
    const newErrors = { name: "", email: "", phoneNumber: "" };

    // Validate Name
    const name = user.name ? user.name.trim() : "";
    if (!name) {
        newErrors.name = "Enter a Name";
        hasError = true;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = user.email ? user.email.trim() : "";
    if (!email || !emailPattern.test(email)) {
        newErrors.email = "Enter a valid Email Address";
        hasError = true;
    }

    // Validate Phone Number
    const phonePattern = /^\d{10}$/;
    const phoneNumber = user.phoneNumber ? user.phoneNumber.trim() : "";
    if (!phoneNumber || !phonePattern.test(phoneNumber)) {
        newErrors.phoneNumber = "Enter a valid 10-digit Phone Number";
        hasError = true;
    }

    // Set errors if there are any
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
      if (isEditMode && editUser) {
      
        const responseMessage = await updateUser(editUser.id, newUser);
        setToast({ message: "User updated successfully", type: "success", isOpen: true });
        setShowToast(true);
      } else {
        // Add new user
        await addUser(newUser);
        setToast({ message: "User added successfully.", type: "success", isOpen: true });
        setShowToast(true);
      }
  
      loadUsers(); 
      handleCloseModal(); 
    } catch (error) {
      console.error("Failed to save User:", error);
    
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
    const response = await deleteUser(id); 

    if (response === "User deleted successfully") {
      setUsers(users.filter((user) => user.id !== id)); 
      setToast({ message: response, type: "success", isOpen: true });
    } else {
      setToast({ message: response, type: "error", isOpen: true }); 
    
    setShowToast(true);
    loadUsers();
  } 
}catch (error) {
    console.log("Failed to delete User", error); 
  } finally {
    setUserToDelete(null);
    setIsConfirmModalOpen(false); 
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
    navigate('/history', { state: { userId: rowData.id ,
        userName : rowData.name
     } });
      
  };

  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value.trimStart();
    setSearchTerm(newSearchTerm);
    if (newSearchTerm.trim() !== "") {
      debounceSearch(newSearchTerm); 
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
      loadUsers();
      
    } catch (error) {
      console.error("Failed to create issuance:", error);
      alert("Failed to create issuance.");
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

        <div className="lower-div">
          <Table data={users} columns={columns} />
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
          heading={isEditMode ? "Edit User" : "Add User"}
          fields={[
            {
              name: "name",
              type: "text",
              placeholder: "User Name",
              
            },
            {
              name: "email",
              type: "email",
              placeholder: "User Email",
              
            },
            {
              name: "phoneNumber",
              type: "tel",
              placeholder: "Phone Number",
            
            },
          ]}
          onSubmit={handleAddUser}
          isEditMode={isEditMode}
          initialData={editUser || {}} 
          errors={errors}
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
