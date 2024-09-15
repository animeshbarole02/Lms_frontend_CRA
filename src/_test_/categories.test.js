import React from 'react';
import { render, screen, waitFor, fireEvent, act} from '@testing-library/react';
import Categories from '../pages/categories/categories';
import { fetchCategories, deleteCategory } from '../api/services/actions/categoryActions';




jest.mock('../api/services/actions/categoryActions', () => ({
  fetchCategories: jest.fn(),
  deleteCategory: jest.fn(),
  addCategory:jest.fn(),
  updateCategory:jest.fn(),
  useState: jest.fn()
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

  

  

  
  describe('Categories component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should show an error toast if the delete fails', async () => {
     
      const mockCategories = [
        { id: 1, displayId: 1, name: 'Category 1', categoryDesc: 'Description 1' }
      ];
  
    
      fetchCategories.mockResolvedValue({
        data: {
          content: mockCategories,
          totalPages: 1,
          size: 1,
        }
      });
  
     
      deleteCategory.mockResolvedValue({ success: false, message: 'Failed to delete' });
  
      render(<Categories />);
 
      await waitFor(() => {
       
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(1); 
      });
  
     
      await waitFor(() => {
        const deleteButtons = screen.getAllByAltText('Delete');
        expect(deleteButtons.length).toBeGreaterThan(0); 
      });
  
   
      const deleteButton = screen.getAllByAltText('Delete')[0];
      fireEvent.click(deleteButton);
  
     
      const confirmButton = screen.getByText('Yes'); 
      fireEvent.click(confirmButton);
  
 
      await waitFor(() => {
        expect(screen.getByText('Failed to delete')).toBeInTheDocument();
      });
    });
  });

  describe('modal Edit operations', () => {
    it('should handle form submission for editing a category', async () => {
      const updateCategoryMock = jest.fn().mockResolvedValue({ success: true });
      
      jest.spyOn(require('../api/services/actions/categoryActions'), 'updateCategory').mockImplementation(updateCategoryMock);
  
      const mockCategories = [
        { id: 1, displayId: 1, name: 'Category 1', categoryDesc: 'Description 1' }
      ];
  
      fetchCategories.mockResolvedValue({
        data: {
          content: mockCategories,
          totalPages: 1,
          size: 1,
        }
      });
  
      render(<Categories />);
  
    
      await waitFor(() => {
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(1); 
      });
  
      // Open the edit modal
      fireEvent.click(screen.getAllByAltText('Edit')[0]);
  
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Edit Category' })).toBeInTheDocument();
      });
  
      fireEvent.change(screen.getByPlaceholderText('Category Name'), { target: { value: 'Updated Category' } });
      fireEvent.change(screen.getByPlaceholderText('Category Description'), { target: { value: 'Updated Description' } });
  
      fireEvent.click(screen.getByRole('button', { name: 'Edit' })); 
  
      await waitFor(() => {
        expect(updateCategoryMock).toHaveBeenCalledWith(1, { name: 'Updated Category', categoryDesc: 'Updated Description' });
      });
  

      await waitFor(() => {
        expect(screen.getByText('Category updated: Updated Category')).toBeInTheDocument();
      });
    });
  });
   

 
describe('Delete Modal component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reset categoryToDelete and close the confirmation modal when handleCancelDelete is called', async () => {
    const mockCategories = [
      { id: 1, displayId: 1, name: 'Category 1', categoryDesc: 'Description 1' }
    ];

    fetchCategories.mockResolvedValue({
      data: {
        content: mockCategories,
        totalPages: 1,
        size: 1,
      }
    });

    render(<Categories />);

  
    await waitFor(() => {
     
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1);
    });

    await waitFor(() => {
      const deleteButtons = screen.getAllByAltText('Delete');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

  
    const deleteButton = screen.getAllByAltText('Delete')[0];
    fireEvent.click(deleteButton);

   
    const deleteModalText = "Are you sure you want to delete this category?";
    expect(screen.getByText(deleteModalText)).toBeInTheDocument();

  
    fireEvent.click(screen.getByText('No'));

    await waitFor(() => {
     
      expect(screen.queryByText(deleteModalText)).not.toBeInTheDocument();
    });
  });
});

  describe('handleDelete component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('should show an error toast if the delete fails', async () => {
      const mockCategories = [
        { id: 1, displayId: 1, name: 'Category 1', categoryDesc: 'Description 1' }
      ];
  

      fetchCategories.mockResolvedValue({
        data: {
          content: mockCategories,
          totalPages: 1,
          size: 1,
        }
      });
  
   
      deleteCategory.mockResolvedValue({ success: false, message: 'Failed to delete' });
  
      render(<Categories />);
  
    
      await waitFor(() => {
       
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(1);
      });
  
      await waitFor(() => {
        const deleteButtons = screen.getAllByAltText('Delete');
        expect(deleteButtons.length).toBeGreaterThan(0); 
      });
  
   
      const deleteButton = screen.getAllByAltText('Delete')[0];
      fireEvent.click(deleteButton);
  
      
      const confirmButton = screen.getByText('Yes'); 
      fireEvent.click(confirmButton);
  

      await waitFor(() => {
        expect(screen.getByText('Failed to delete')).toBeInTheDocument();
      });
    });
  });
  
});

