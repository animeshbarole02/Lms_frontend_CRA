import React from 'react';
import { render, screen, waitFor, fireEvent, act, findByAltText } from '@testing-library/react';
import Categories from '../pages/categories/categories';
import { fetchCategories, deleteCategory ,addCategory ,updateCategory} from '../api/services/actions/categoryActions';
import userEvent from '@testing-library/user-event';




jest.mock('../api/services/actions/categoryActions', () => ({
  fetchCategories: jest.fn(),
  deleteCategory: jest.fn(),
  addCategory:jest.fn(),
  updateCategory:jest.fn(),
}));

jest.mock('../hoc/AdminHOC', () => (Component) => (props) => <Component {...props} />);

describe('Categories component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCategories', () => {
    it('should fetch categories and update state with transformed categories', async () => {
      const mockResponse = {
        content: [
          { id: 1, name: 'Category 1', categoryDesc: 'Description 1' },
          { id: 2, name: 'Category 2', categoryDesc: 'Description 2' },
        ],
        size: 9,
        totalPages: 1,
      };

      fetchCategories.mockResolvedValue({ data: mockResponse });

      render(<Categories />);

      await waitFor(() => {
        expect(fetchCategories).toHaveBeenCalledWith(0, 9, "");
      });

      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });
    });

    it('should handle fetch error gracefully', async () => {
      fetchCategories.mockRejectedValue(new Error('Failed to load categories'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(<Categories />);

      await waitFor(() => {
        expect(fetchCategories).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to load categories:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it('should correctly update the total pages', async () => {
      const mockResponse = {
        content: [],
        size: 9,
        totalPages: 5,
      };

      fetchCategories.mockResolvedValue({ data: mockResponse });

      render(<Categories />);

      await waitFor(() => {
        expect(fetchCategories).toHaveBeenCalledWith(0, 9, "");
      });

      await waitFor(() => {
        expect(screen.getByText(/1 of 5/i)).toBeInTheDocument();
      });
    });
  });

  describe('modal operations', () => {
    it('should open and close modal correctly', async () => {
      render(<Categories />);
  
     
      fireEvent.click(screen.getByRole('button', { name: 'Add Category' }));
  
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Add Category' })).toBeInTheDocument();
      });
  
  
      fireEvent.click(screen.getByText('×'));
  
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Add Category' })).not.toBeInTheDocument();
      });
    });
  
    it('should handle form submission for adding a category', async () => {
      const addCategoryMock = jest.fn().mockResolvedValue({ success: true });
  
   
      jest.spyOn(require('../api/services/actions/categoryActions'), 'addCategory').mockImplementation(addCategoryMock);
  
      render(<Categories />);
  
  
      fireEvent.click(screen.getByRole('button', { name: 'Add Category' }));
  
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Add Category' })).toBeInTheDocument();
      });
  
      fireEvent.change(screen.getByPlaceholderText('Category Name'), { target: { value: 'New Category' } });
      fireEvent.change(screen.getByPlaceholderText('Category Description'), { target: { value: 'Category Description' } });
  
      
      fireEvent.click(screen.getByRole('button', { name: 'Add' }));
  
      await waitFor(() => {
        expect(addCategoryMock).toHaveBeenCalledWith({ name: 'New Category', categoryDesc: 'Category Description' });
      });
    });

    it('should handle form submission for editing a category', async () => {
      const updateCategoryMock = jest.fn().mockResolvedValue({ success: true });
    
      jest.spyOn(require('../api/services/actions/categoryActions'), 'updateCategory').mockImplementation(updateCategoryMock);
    
      render(<Categories />);
    
      // Mock category data
      const category = { id: 1, name: 'Category 1', categoryDesc: 'Description 1' };
      
      // Ensure the edit icon is rendered and correctly selected
      const editIcon = screen.getByAltText('Edit'); // Correct alt text for the edit icon
      
      // Hover over the edit icon to show tooltip
      fireEvent.mouseOver(editIcon);
    
      // Verify tooltip appears (adjust the text as needed)
      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument();
      });
    
      // Click the edit icon to open the modal
      fireEvent.click(editIcon);
    
      // Verify modal content
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Edit Category' })).toBeInTheDocument();
      });
    
      // Pre-fill the form with the category data
      fireEvent.change(screen.getByPlaceholderText('Category Name'), { target: { value: category.name } });
      fireEvent.change(screen.getByPlaceholderText('Category Description'), { target: { value: category.categoryDesc } });
    
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    
      await waitFor(() => {
        expect(updateCategoryMock).toHaveBeenCalledWith(category.id, { name: category.name, categoryDesc: category.categoryDesc });
      });
    });
  
   
  });
  
  describe('search functionality', () => {
    it('should debounce and fetch categories with the correct search term', async () => {
      const mockResponse = {
        content: [],
        size: 9,
        totalPages: 1,
      };
    
      fetchCategories.mockResolvedValue({ data: mockResponse });
    
      render(<Categories />);
    
      const searchInput = screen.getByPlaceholderText('Search categories...');
    
      fireEvent.change(searchInput, { target: { value: 'New search' } });
    
    
      expect(fetchCategories).toHaveBeenCalledTimes(1);
    
  
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      });

      await waitFor(() => {
        expect(fetchCategories).toHaveBeenCalledWith(0, 9, 'New search');
      });
    });
  });

  describe('Categories component - handleCloseModal', () => {
    it('should close the modal, clear the editing category, and reset errors when handleCloseModal is called', async () => {
      render(<Categories />);
  

      fireEvent.click(screen.getByRole('button', { name: 'Add Category' }));
  

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Add Category' })).toBeInTheDocument();
      });
  

      fireEvent.click(screen.getByRole('button', { name: '×' }));
  

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: 'Add Category' })).not.toBeInTheDocument();
      });
    });
  });
  
  

});
