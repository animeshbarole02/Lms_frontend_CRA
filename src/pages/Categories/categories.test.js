

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Categories from './categories';
import { act } from 'react';
import {
  fetchCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} from '../../api/services/actions/categoryActions';

jest.mock('../../api/services/actions/categoryActions',);

jest.mock('../../hoc/AdminHOC', () => (Component) => (props) => <Component {...props} />);

test('renders Categories component with heading', () => {
    fetchCategories.mockResolvedValue({
      content: [],
      size: 8,
      totalPages: 0,
    });
  
    render(<Categories />);
  
    expect(screen.getByText(/Categories/i)).toBeInTheDocument();
  });




//   test('fetches categories on component load', async () => {
//     const mockData = {
//       content: [
//         { id: 1, name: 'Category1', categoryDesc: 'Description1' },
//         { id: 2, name: 'Category2', categoryDesc: 'Description2' },
//       ],
//       size: 8,
//       totalPages: 0,
//     };
  
//     fetchCategories.mockResolvedValue(mockData);
  
//     await act(async () => {
//       render(<Categories />);
//     });
  
//     await waitFor(() => expect(fetchCategories).toHaveBeenCalled());
  
//     expect(screen.getByText('Category1')).toBeInTheDocument();
//     expect(screen.getByText('Category2')).toBeInTheDocument();
//   });
  
//   test('adds a new category', async () => {
//     const mockData = { content: [], size: 9, totalPages: 1 };
//     fetchCategories.mockResolvedValue(mockData);
//     addCategory.mockResolvedValue('Category added successfully');
  
//     await act(async () => {
//       render(<Categories />);
//     });
  
//     fireEvent.click(screen.getByText('Add Category'));
  
//     fireEvent.change(screen.getByPlaceholderText('Category Name'), { target: { value: 'New Category' } });
//     fireEvent.change(screen.getByPlaceholderText('Category Description'), { target: { value: 'New Description' } });
  
//     const submitButton = screen.getByRole('button', { name: /add category/i });
//     fireEvent.click(submitButton);
  
//     await waitFor(() => {
//         expect(addCategory).toHaveBeenCalledWith({ name: 'New Category', categoryDesc: 'New Description' });
//     });
  
//     await waitFor(() => {
//       expect(screen.getByText('Category added successfully')).toBeInTheDocument();
//     });
//   });
  
// // test('deletes a category', async () => {
// //     const mockData = { content: [{ id: 1, name: 'Category 1', categoryDesc: 'Description 1' }], size: 9, totalPages: 1 };
// //     fetchCategories.mockResolvedValue(mockData);
// //     deleteCategory.mockResolvedValue('Category deleted successfully');
  
// //     render(<Categories />);
  
// //     const deleteButton = await screen.findByAltText('Delete');
// //     fireEvent.click(deleteButton);
  
// //     fireEvent.click(screen.getByText('Confirm'));
  
// //     expect(deleteCategory).toHaveBeenCalledWith(1);
// //     expect(await screen.findByText('Category deleted successfully Category 1')).toBeInTheDocument();
// //   });
  

  
// // test('edits a category', async () => {
// //   const mockData = {
// //     content: [
// //       { id: 1, name: 'Category 1', categoryDesc: 'Description 1' },
// //     ],
// //     size: 8,
// //     totalPages: 1,
// //   };

// //   fetchCategories.mockResolvedValue(mockData);
// //   updateCategory.mockResolvedValue({ success: true });
// //   fetchCategories.mockResolvedValueOnce({
// //     content: [{ id: 1, name: 'Updated Category', categoryDesc: 'Updated Description' }],
// //     size: 8,
// //     totalPages: 1,
// //   });

// //   render(<Categories />);

// //   // Wait for categories to load
// //   const editButton = await screen.findByAltText(/Edit/i);
// //   fireEvent.click(editButton);

// //   // Update the form
// //   fireEvent.change(screen.getByPlaceholderText('Category Name'), {
// //     target: { value: 'Updated Category' },
// //   });
// //   fireEvent.change(screen.getByPlaceholderText('Category Description'), {
// //     target: { value: 'Updated Description' },
// //   });

// //   // Submit the form
// //   fireEvent.click(screen.getByText('Submit'));

// //   // Wait for updateCategory to be called
// //   await waitFor(() => expect(updateCategory).toHaveBeenCalledWith(1, {
// //     name: 'Updated Category',
// //     categoryDesc: 'Updated Description',
// //   }));

// //   // Wait for categories to reload
// //   await waitFor(() => expect(fetchCategories).toHaveBeenCalledTimes(2));

// //   // Check if the updated category is displayed
// //   expect(screen.getByText('Updated Category')).toBeInTheDocument();
// // });

  