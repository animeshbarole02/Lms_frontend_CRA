import { render, screen } from "@testing-library/react";
import Toast from "../components/toast/toast";

describe("Toast Component", () => {
  it("renders the toast with a success message", () => {
    render(<Toast message="Category added successfully" type="success" isOpen={true} />);

    expect(screen.getByText("Category added successfully")).toBeInTheDocument();
  });

  it("does not render the toast when closed", () => {
    render(<Toast message="Category added successfully" type="success" isOpen={false} />);

    expect(screen.queryByText("Category added successfully")).not.toBeInTheDocument();
  });
});
