import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../components/modal/modal";

describe("Modal component", () => {
  const onCloseMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should not render the modal when 'isOpen' is false", () => {
    render(
      <Modal isOpen={false} onClose={onCloseMock}>
        <div>Test Modal Content</div>
      </Modal>
    );

    const modalContent = screen.queryByText("Test Modal Content");
    expect(modalContent).not.toBeInTheDocument();
  });

  test("should render the modal when 'isOpen' is true", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Test Modal Content</div>
      </Modal>
    );

    const modalContent = screen.getByText("Test Modal Content");
    expect(modalContent).toBeInTheDocument();
  });

  test("should call 'onClose' when the close button is clicked", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Test Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("should have proper accessibility attributes", () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Test Modal Content</div>
      </Modal>
    );

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveAttribute("aria-modal", "true");
  });
});
