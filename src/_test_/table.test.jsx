import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Table from '../components/table/table'; 

describe('Table Component', () => {
  const columns = [
    { header: 'ID', accessor: 'id', width: '10%' },
    { header: 'Name', accessor: 'name', width: '45%' },
    { header: 'Description', accessor: 'categoryDesc', width: '45%' },
  ];

  const data = [
    { id: 1, name: 'Science', categoryDesc: 'Science related books' },
    { id: 2, name: 'Technology', categoryDesc: 'Technology related books' },
  ];

  test('renders table with correct headers and rows', () => {
    render(<Table columns={columns} data={data} />);

    // Check if table headers are rendered
    columns.forEach(column => {
      expect(screen.getByText(column.header)).toBeInTheDocument();
    });

    // Check if table rows are rendered
    data.forEach(row => {
      Object.values(row).forEach(value => {
        expect(screen.getByText(value)).toBeInTheDocument();
      });
    });
  });

  test('applies custom cell rendering function', () => {
    const customColumns = [
      { header: 'ID', accessor: 'id', width: '10%' },
      { header: 'Name', render: (row) => <strong>{row.name}</strong>, width: '45%' },
      { header: 'Description', accessor: 'categoryDesc', width: '45%' },
    ];

    render(<Table columns={customColumns} data={data} />);

    // Check if custom render function works
    data.forEach(row => {
      expect(screen.getByText(row.name).tagName).toBe('STRONG');
    });
  });

  test('applies correct styles based on column width', () => {
    render(<Table columns={columns} data={data} />);

    // Check if the columns have the correct width applied
    columns.forEach(column => {
      const th = screen.getByText(column.header).closest('th');
      expect(th).toHaveStyle(`width: ${column.width}`);
    });
  });
});
