import { render, screen } from '@testing-library/react';
import Categories from '../pages/categories/categories';
import { act } from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fetchCategories } from '../api/services/actions/categoryActions'; // Import the mock service

// Mock the fetchCategories function
jest.mock('../api/services/actions/categoryActions');

test('renders table with category data', async () => {
  const mockCategories = [
    { id: 1, name: 'Science', categoryDesc: 'Science related books' },
    { id: 2, name: 'Technology', categoryDesc: 'Technology related books' },
  ];
  jest.mock('../src/services/categoryService');
  
  test('renders table with category data', async () => {
    const mockCategories = [
      { id: 1, name: 'Science', categoryDesc: 'Science related books' },
      { id: 2, name: 'Technology', categoryDesc: 'Technology related books' },
    ];
  

    fetchCategories.mockResolvedValue({
      content: mockCategories,
      size: 9,
      totalPages: 1,
    });
  
    await act(async () => {
      render(<Categories />);
    });
  
    
    await waitFor(() => {
      
      expect(screen.getByText('Science')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      

      expect(screen.getByText('Science related books')).toBeInTheDocument();
      expect(screen.getByText('Technology related books')).toBeInTheDocument();
      
      const tableRows = screen.getAllByRole('row');
      expect(tableRows.length).toBe(mockCategories.length + 1);
    });
  })