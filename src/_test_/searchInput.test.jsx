import { render, screen, fireEvent } from '@testing-library/react'; 
import { act } from 'react';
import Categories from '../pages/categories/categories';
import { fetchCategories } from '../api/services/actions/categoryActions';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../api/services/actions/categoryActions');




test('renders search input and updates value', async () => {
  fetchCategories.mockResolvedValue({ content: [], size: 9, totalPages: 1 });

  
  await act(async () => {
    render(<Categories />);
  });

  const searchInput = screen.getByPlaceholderText('Search categories...');

  expect(searchInput).toBeInTheDocument();

  fireEvent.change(searchInput, { target: { value: 'Technology' } });

  expect(searchInput.value).toBe('Technology');
});
