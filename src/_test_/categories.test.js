import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import Categories from '../pages/categories/categories';
import { fetchCategories, deleteCategory ,addCategory} from '../api/services/actions/categoryActions';



jest.mock('../api/services/actions/categoryActions', () => ({
  fetchCategories: jest.fn(),
  deleteCategory: jest.fn(),
  addCategory:jest.fn(),
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

 
      fireEvent.click(screen.getByText('Add Category'));

      await waitFor(() => {
        expect(screen.getByText('Add Category')).toBeInTheDocument();
      });

      // Close modal
      fireEvent.click(screen.getByText('Close'));

      await waitFor(() => {
        expect(screen.queryByText('Add Category')).not.toBeInTheDocument();
      });
    });

    it('should handle form submission for adding and editing categories', async () => {
      const addCategoryMock = jest.fn().mockResolvedValue({ success: true });
      const updateCategoryMock = jest.fn().mockResolvedValue({ success: true });
      jest.spyOn(require('../api/services/actions/categoryActions'), 'addCategory').mockImplementation(addCategoryMock);
      jest.spyOn(require('../api/services/actions/categoryActions'), 'updateCategory').mockImplementation(updateCategoryMock);

      render(<Categories />);

  
      fireEvent.click(screen.getByText('Add Category'));

      await waitFor(() => {
        expect(screen.getByText('Add Category')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText('Category Name'), { target: { value: 'New Category' } });
      fireEvent.change(screen.getByPlaceholderText('Category Description'), { target: { value: 'Category Description' } });
      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(addCategoryMock).toHaveBeenCalledWith({ name: 'New Category', categoryDesc: 'Category Description' });
      });

      
      fireEvent.click(screen.getByText('Edit')); 
      await waitFor(() => {
        expect(screen.getByText('Edit Category')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByPlaceholderText('Category Name'), { target: { value: 'Updated Category' } });
      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(updateCategoryMock).toHaveBeenCalledWith(1, { name: 'Updated Category', categoryDesc: 'Category Description' }); // Adjust ID and data as needed
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

      expect(fetchCategories).not.toHaveBeenCalled();

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
  
    
      fireEvent.click(screen.getByText('Add Category'));
  
   
      await waitFor(() => {
        expect(screen.getByText('Add Category')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Close'));
  
      
      await waitFor(() => {
        expect(screen.queryByText('Add Category')).not.toBeInTheDocument();
      });
  
     
    });
  });

  describe('Categories component - handleOpenConfirmModal', () => {
    it('should open the confirmation modal with the correct category to delete', async () => {
      const mockCategory = { id: 1, name: 'Category 1' };
  
      render(<Categories />);
  
      fireEvent.click(screen.getByAltText('Delete'));
  
      await waitFor(() => {
        expect(screen.getByText('Are you sure you want to delete this category?')).toBeInTheDocument();
     
    
      });
    });
  });


  describe('Categories component - handleDelete', () => {
    it('should delete a category successfully and show a success toast', async () => {
      const mockCategory = { id: 1, name: 'Category 1' };
      const mockResponse = { success: true, message: 'Category deleted successfully' };
  
      deleteCategory.mockResolvedValue(mockResponse);
  
      render(<Categories />);
  
      const deleteIcon = await screen.findByAltText('Delete');
  fireEvent.click(deleteIcon);
  

      const confirmButton = await screen.findByText('Confirm');
      fireEvent.click(confirmButton);
    
 
      await waitFor(() => {
        expect(deleteCategory).toHaveBeenCalledWith(mockCategory.id);
      });
  
 
      await waitFor(() => {
        expect(screen.getByText('Category deleted successfully for category: Category 1')).toBeInTheDocument();
      });
    });
  
    it('should handle delete failure and show an error toast', async () => {
      const mockCategory = { id: 1, name: 'Category 1' };
      const mockErrorResponse = { success: false, message: 'Failed to delete category' };
  
      deleteCategory.mockResolvedValue(mockErrorResponse);
  
      render(<Categories />);
  
     
      const deleteIcon = await screen.findByAltText('Delete');
  fireEvent.click(deleteIcon);
  
   
      const confirmButton = await screen.findByText('Confirm');
      fireEvent.click(confirmButton);
 
      await waitFor(() => {
        expect(deleteCategory).toHaveBeenCalledWith(mockCategory.id);
      });

      await waitFor(() => {
        expect(screen.getByText('Failed to delete category')).toBeInTheDocument();
      });
    });
  
    it('should handle delete error and show an error toast', async () => {
      const mockCategory = { id: 1, name: 'Category 1' };
  
      deleteCategory.mockRejectedValue(new Error('Failed to delete category'));
  
      render(<Categories />);

      const deleteIcon = await screen.findByAltText('Delete');
      fireEvent.click(deleteIcon);
  

      const confirmButton = await screen.findByText('Confirm');
      fireEvent.click(confirmButton);
  
      await waitFor(() => {
        expect(deleteCategory).toHaveBeenCalledWith(mockCategory.id);
      })
      
      await waitFor(() => {
        expect(screen.getByText('An error occurred while deleting the category.')).toBeInTheDocument();
      });
    });
  });




  
});
