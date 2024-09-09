import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Categories from './categories';
import {
  fetchCategories,
} from '../../api/services/actions/categoryActions';
import { act } from 'react-dom/test-utils';

jest.mock('../../api/services/actions/categoryActions');

// Mock AdminHOC
jest.mock('../../hoc/AdminHOC', () => (Component) => (props) => <Component {...props} />);

test('renders Categories component with heading', async () => {
 
  fetchCategories.mockResolvedValue({
    content: [],
    size: 8,
    totalPages: 0,
  });

  render(<Categories />);

  
  expect(screen.getByText(/Categories/i)).toBeInTheDocument();
  

  await waitFor(() => {
    expect(fetchCategories).toHaveBeenCalled();
  });
});

describe('handleSearchInputChange', () => {
  it('should debounce and trigger search with the correct term', async () => {
    
    fetchCategories.mockResolvedValue({
      content: [],
      size: 9,
      totalPages: 1,
    });

    render(<Categories />);

   
    const searchInput = screen.getByPlaceholderText('Search categories...');

  
    fireEvent.change(searchInput, { target: { value: 'New search' } });

    expect(fetchCategories).not.toHaveBeenCalledWith(0, 9, 'New search');

   
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    expect(fetchCategories).toHaveBeenCalledWith(0, 9, 'New search');
  });
});
