import React from "react";
import { render, screen } from "@testing-library/react";
import Table from "../components/table/table";

describe("Table Component", () => {
  const columns = [
    { header: "ID", accessor: "id", width: "10%" },
    { header: "Name", accessor: "name", width: "40%" },
    { header: "Description", accessor: "description", width: "50%" },
  ];

  const data = [
    { id: 1, name: "Category 1", description: "First category description" },
    { id: 2, name: "Category 2", description: "Second category description" },
  ];

  it("renders without crashing", () => {
    render(<Table data={data} columns={columns} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders correct number of headers", () => {
    render(<Table data={data} columns={columns} />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers.length).toBe(columns.length);
  });

  it("displays the correct header text", () => {
    render(<Table data={data} columns={columns} />);
    columns.forEach((column) => {
      expect(screen.getByText(column.header)).toBeInTheDocument();
    });
  });

  it("renders correct number of rows", () => {
    render(<Table data={data} columns={columns} />);
    const rows = screen.getAllByRole("row");
 
    expect(rows.length).toBe(data.length + 1);
  });

  it("renders the correct data in cells", () => {
    render(<Table data={data} columns={columns} />);
    data.forEach((row) => {
      expect(screen.getByText(row.id)).toBeInTheDocument();
      expect(screen.getByText(row.name)).toBeInTheDocument();
      expect(screen.getByText(row.description)).toBeInTheDocument();
    });
  });

  it("renders custom content with render function", () => {
    const columnsWithRender = [
      ...columns,
      {
        header: "Actions",
        width: "10%",
        render: () => <button>Edit</button>,
      },
    ];
    render(<Table data={data} columns={columnsWithRender} />);
    const buttons = screen.getAllByRole("button", { name: "Edit" });
    expect(buttons.length).toBe(data.length);
  });

  it("renders an empty table when no data is provided", () => {
    render(<Table data={[]} columns={columns} />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(1); 
  });
});
