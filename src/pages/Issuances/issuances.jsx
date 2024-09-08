import  { useCallback, useEffect, useState } from "react";
import SearchIcon from "../../assets/icons/magnifying-glass.png";
import Table from "../../components/table/table";
import Modal from "../../components/modal/modal";
import Dynamicform from "../../components/forms/dynamicform";
import LeftPageIcon from "../../assets/icons/LeftPage.png";
import RightPageIcon from "../../assets/icons/Right-Page.png";
import AdminHOC from "../../hoc/AdminHOC";
import {
  fetchIssuances,
  deleteIssuance,
  updateIssuance,
} from "../../api/services/actions/issuancesActions";
import Tooltip from "../../components/tooltip/toolTip";
import EditIcon from "../../assets/icons/EditIcom.png";
import DeleteIcon from "../../assets/icons/DeleteIcon.png";
import { formatDateOrTime } from "../../utils/formateDateOrTime";
import ConfirmationModal from "../../components/modal/confirmationModal";
import Toast from "../../components/toast/toast";
import debounce from "../../utils/debounce";
import SearchInput from "../../components/search/search";



const Issuances = () => {
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [issuances, setIssuances] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingIssuance, setEditingIssuance] = useState(null);
  const [issuanceToDelete , setIssuanceToDelete]  = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success", isOpen: false });
  const columns = [
    { header: "Id", accessor: "displayId", width: "3%" },
    { header: "User", accessor: "name", width: "8%" },
    { header: "Book", accessor: "title", width: "10%" },
    { header: "Issue", accessor: "issuedAt", 
      
      width: "8%",
      render: (rowData) => formatDateOrTime(rowData.issuedAt) 
     },
     {header :"Return",accessor:"expectedReturn", width:"8%",
      render: (rowData) => formatDateOrTime(rowData.expectedReturn) 
     },
    
    { header: "Status", accessor: "status", width: "5%" },
    {header : "Type" , accessor :"issuanceType",width : "5%"},
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
      width: "5%",
    },
  ];

  const todayDate = new Date().toISOString().split("T")[0];
  const now = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 16);

  

  const debounceSearch = useCallback(
    debounce((newSearchTerm) => {
      loadIssuances(newSearchTerm);
    }, 1000),
    []
  );

  useEffect(() => {
    loadIssuances(searchTerm);
  }, [currentPage]);

  

  
  const loadIssuances = async (search = "") => {
    try {
      const data = await fetchIssuances(currentPage, 8, search);
      console.log(data);
     
      const transformedIssuances = data.content.map((issuance, index) => ({
        ...issuance,
        displayId: index + 1,
        name: issuance.user?.name || "Unknown", 
        title: issuance.book?.title || "Unknown", 

      }));

      console.log(transformedIssuances);
      setIssuances(transformedIssuances);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load issuances:", error);
    }
  };

  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    debounceSearch(newSearchTerm);
  };

  

  const handleDelete = async (rowData) => {
    if (!issuanceToDelete) return;
    const id = issuanceToDelete.id;
    try {
      const response = await deleteIssuance(id);
      
      setIssuances(issuances.filter((issuance) => issuance.id !== id));
      setToast({ message: `${response}`, type: "success", isOpen: true });
      setShowToast(true);
      loadIssuances();
    } catch (error) {
      console.error("Failed to delete the issuance", error);
    }finally {
        setIssuanceToDelete(null);
        setIsConfirmModalOpen(false);
    }

  
  };

  const handleCancelDelete = () => {
    setIssuanceToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const day = String(d.getDate()).padStart(2, '0'); 
    const hours = String(d.getHours()).padStart(2, '0'); 
    const minutes = String(d.getMinutes()).padStart(2, '0'); 
    const seconds = String(d.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleEditIssuance = async (issuance) => {

    const formattedDate = formatDateTime(issuance.expectedReturn);
    const updatedIssuance = {
      ...issuance,
      expectedReturn: formattedDate,
    };
  
    try {
    const response =   await updateIssuance(updatedIssuance.id, updatedIssuance);
    setToast({ message: `${response}`, type: "success", isOpen: true });
    setShowToast(true);
      loadIssuances();
      handleCloseModal();

    } catch (error) {
      console.error("Failed to update the issuance", error);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

 
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIssuance(null);
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
   
    setEditingIssuance(rowData);
    setIsModalOpen(true);
  };

  const handleOpenConfirmModal = (rowData) => {
     setIssuanceToDelete(rowData);
    setIsConfirmModalOpen(true);
  };


  return (
    <>
      <div className="issuances-div">
        <div className="center-div">
          <div className="upper-div">
            <div className="upper-div-text">
              <span>Issuances</span>
            </div>

            <div className="upper-div-btns">
            <SearchInput
        value={searchTerm}
        onChange={handleSearchInputChange}
        placeholder="Search Issuances..."
      />

            
            </div>
          </div>

          <div className="lower-div">
            <Table data={issuances} columns={columns} />

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
          
          heading={editingIssuance ?"Edit Issuance":"Add Issuance"}
          fields={[
            {
               name :"expectedReturn",
               type:"datetime-local",
               placeholder :"Return Time",
               min: now,
              
            },
            {
                name: "status",
                type: "select", 
                placeholder: "Select Status",
                options: [
                  { value: "Issued", label: "Issued" },  
                  { value: "Returned", label: "Returned" }  
                ]
              },
          ]}

          onSubmit={handleEditIssuance}
          isEditMode={!!editingIssuance}
          initialData={editingIssuance}
          
        
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

export default AdminHOC(Issuances);
