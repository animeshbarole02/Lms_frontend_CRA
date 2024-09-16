import { render, screen, fireEvent } from "@testing-library/react";
import Tooltip from "../components/tooltip/toolTip"; 
import EditIcon from "../assets/icons/EditIcom.png"; 
import DeleteIcon from "../assets/icons/DeleteIcon.png"; 

describe("Tooltip functionality", () => {
  const rowData = { id: 1, name: "Sample" }; 
  const handleEdit = jest.fn();
  const handleOpenConfirmModal = jest.fn();

  it("displays tooltip on hovering over edit and delete icons", async () => {
    render(
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

 
    const editIcon = screen.getByAltText("Edit");
    fireEvent.mouseOver(editIcon);
    
   
    expect(await screen.findByText("Edit")).toBeInTheDocument();

   
    const deleteIcon = screen.getByAltText("Delete");
    fireEvent.mouseOver(deleteIcon);

    expect(await screen.findByText("Delete")).toBeInTheDocument();
  });

  it("calls the correct function when clicking on icons", () => {
    render(
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

  
    const editIcon = screen.getByAltText("Edit");
    fireEvent.click(editIcon);

    
    expect(handleEdit).toHaveBeenCalledWith(rowData);


    const deleteIcon = screen.getByAltText("Delete");
    fireEvent.click(deleteIcon);


    expect(handleOpenConfirmModal).toHaveBeenCalledWith(rowData);
  });
});
