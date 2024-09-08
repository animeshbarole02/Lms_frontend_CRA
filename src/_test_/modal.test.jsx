import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../components/modal/modal"; // Replace with correct path

describe("Modal Component", () => {
  it("renders the modal when open", () => {
    render(<Modal isOpen={true} onClose={() => {}}>Modal Content</Modal>);
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("closes the modal when close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(<Modal isOpen={true} onClose={onCloseMock}>Modal Content</Modal>);

  
    const closeButton = screen.getByRole("button", { name: /×/i });
    fireEvent.click(closeButton);
    
    expect(onCloseMock).toHaveBeenCalled();
    

   
  });
});
