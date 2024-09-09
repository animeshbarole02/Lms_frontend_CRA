import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchInput from '../components/search/search'; // Adjust the import path as necessary

describe('SearchInput Component', () => {
  // Test that the component renders correctly
  test('renders without crashing', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  // Test that the placeholder text is displayed correctly
  test('displays placeholder text', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Search categories..." />);
    expect(screen.getByPlaceholderText('Search categories...')).toBeInTheDocument();
  });

  // Test that the input value is controlled by the value prop
  test('displays the correct value', () => {
    render(<SearchInput value="Test value" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('Test value');
  });

  // Test that the onChange handler is called with the correct value
  test('calls onChange handler with correct value', () => {
    const handleChange = jest.fn();
    render(<SearchInput value="" onChange={handleChange} />);
    
    // Simulate input change
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New value' } });
    
    // Check if onChange handler was called with the correct value
    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ target: { value: 'New value' } }));
  });

  // Test that the search icon is displayed
  test('displays search icon', () => {
    render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.getByAltText('Search')).toBeInTheDocument();
  });
});
