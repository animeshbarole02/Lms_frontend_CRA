import { render, screen, fireEvent } from "@testing-library/react";
import SearchInput from "../components/search/search";

describe("Search  component", () => {
  const onChangeMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render the search input with the provided placeholder", () => {
    render(<SearchInput value="" onChange={onChangeMock} placeholder="Search categories..." />);

    const searchInput = screen.getByPlaceholderText("Search categories...");
    expect(searchInput).toBeInTheDocument();
  });

  test("should display the search icon", () => {
    render(<SearchInput value="" onChange={onChangeMock} />);

    const searchIcon = screen.getByAltText("Search");
    expect(searchIcon).toBeInTheDocument();
  });

  test("should update input value correctly", () => {
    render(<SearchInput value="Books" onChange={onChangeMock} />);

    const searchInput = screen.getByDisplayValue("Books");
    expect(searchInput).toBeInTheDocument();
  });

  test("should call 'onChange' when the input value changes", () => {
    render(<SearchInput value="" onChange={onChangeMock} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "New Search" } });

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(expect.any(Object));
  });

  test("should render the default placeholder when no placeholder is provided", () => {
    render(<SearchInput value="" onChange={onChangeMock} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    expect(searchInput).toBeInTheDocument();
  });
});
