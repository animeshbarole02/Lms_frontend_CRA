import { useCallback, useEffect, useState } from "react";
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
import { now } from "../../utils/currentDate";
import Loader from "../../components/loader/loader";
import Pagination from "../../components/pagination/pagination";

const Issuances = () => {
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [issuances, setIssuances] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingIssuance, setEditingIssuance] = useState(null);
  const [issuanceToDelete, setIssuanceToDelete] = useState(null);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isOpen: false,
  });
  const [loading, setLoading] = useState(false);
  const columns = [
    { header: "Id", accessor: "displayId", width: "3%" },
    { header: "User", accessor: "name", width: "8%" },
    { header: "Book", accessor: "title", width: "10%" },
    {
      header: "Issue",
      accessor: "issuedAt",

      width: "8%",
      render: (rowData) => formatDateOrTime(rowData.issuedAt),
    },
    {
      header: "Return",
      accessor: "expectedReturn",
      width: "8%",
      render: (rowData) => formatDateOrTime(rowData.expectedReturn),
    },

    { header: "Status", accessor: "status", width: "5%" },
    {
      header: "Issuance Type",
      render: (rowData) =>
        rowData.issuanceType === "Home" ? "Take away" : "In House",
      width: "5%",
    },
    {
      header: "Actions",
      render: (rowData) => renderActions(rowData),
      width: "5%",
    },
  ];

  //const todayDate = new Date().toISOString().split("T")[0];

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
      setLoading(true);
      const response = await fetchIssuances(currentPage, 9, search);
      const data = response.data;

      const startIndex = currentPage * data.size;
      const transformedIssuances = data.content.map((issuance, index) => ({
        ...issuance,
        displayId: startIndex + index + 1,
        name: issuance.user?.name || "Unknown",
        title: issuance.book?.title || "Unknown",
      }));
      setIssuances(transformedIssuances);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load issuances:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (event) => {
    const newSearchTerm = event.target.value;
    const trimmedSearchTerm = newSearchTerm.trim();
    setSearchTerm(newSearchTerm);
    if (trimmedSearchTerm.length < 3 && trimmedSearchTerm.length > 0) {
      loadIssuances();
    } else {
      debounceSearch(trimmedSearchTerm);
    }
  };

  const handleDelete = async () => {
    if (!issuanceToDelete) return;
    const id = issuanceToDelete.id;

    try {
      setLoading(true);
      const response = await deleteIssuance(id);

      if (response.success) {
        setIssuances(issuances.filter((issuance) => issuance.id !== id));
        setToast({ message: response.message, type: "success", isOpen: true });
      } else {
        setToast({ message: response.message, type: "error", isOpen: true });
      }
      setShowToast(true);
      loadIssuances();
    } catch (error) {
      console.error("Failed to delete the issuance:", error);
    } finally {
      setIssuanceToDelete(null);
      setLoading(false);
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
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const handleEditIssuance = async (issuance) => {
    const formattedDate = formatDateTime(issuance.expectedReturn);
    const updatedIssuance = {
      ...issuance,
      expectedReturn: formattedDate,
    };

    try {
      setLoading(true);
      const response = await updateIssuance(
        updatedIssuance.id,
        updatedIssuance
      );

      if (response.success) {
        setToast({ message: response.message, type: "success", isOpen: true });
        setShowToast(true);
        loadIssuances();
        handleCloseModal();
      } else {
        setToast({ message: response.message, type: "error", isOpen: true });
        setShowToast(true);
      }
    } catch (error) {
      console.error("Failed to update the issuance", error);
    } finally {
      setLoading(false);
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

  const renderActions = (rowData) => {
    const isEditDisabled = rowData.status === "Returned";

    return (
      <div className="actionicons">
        <Tooltip message="Edit">
          <img
            src={EditIcon}
            alt="Edit"
            className={`action-icon ${isEditDisabled ? "disabled" : ""}`}
            onClick={() => !isEditDisabled && handleEdit(rowData)}
            style={{ cursor: isEditDisabled ? "not-allowed" : "pointer" }}
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
  };
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
          {loading ? (
            <Loader />
          ) : (
            <div className="lower-div">
              <Table data={issuances} columns={columns} />

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
      </div>
      {/* Modal Component */}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <Dynamicform
          heading={editingIssuance ? "Edit Issuance" : "Add Issuance"}
          fields={[
            {
              name: "expectedReturn",
              type: "datetime-local",
              placeholder: "Return Time",
              min: now,
            },
            {
              name: "status",
              type: "select",
              placeholder: "Select Status",
              options: [
                { value: "Issued", label: "Issued" },
                { value: "Returned", label: "Returned" },
              ],
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
