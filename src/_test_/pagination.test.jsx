import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../components/pagination/pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  test('renders pagination with correct current page and total pages', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);
    
    expect(screen.getByText('2 of 5')).toBeInTheDocument(); 
  });

  test('calls onPageChange with "prev" when left arrow is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    const leftArrow = screen.getByAltText('Left');
    fireEvent.click(leftArrow);

    expect(mockOnPageChange).toHaveBeenCalledWith('prev');
  });

  test('calls onPageChange with "next" when right arrow is clicked', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    const rightArrow = screen.getByAltText('Right');
    fireEvent.click(rightArrow);

    expect(mockOnPageChange).toHaveBeenCalledWith('next');
  });

  test('left arrow is disabled when on the first page', () => {
    render(<Pagination currentPage={0} totalPages={5} onPageChange={mockOnPageChange} />);

    const leftArrow = screen.getByAltText('Left');
    expect(leftArrow).toHaveClass('disabled');
  });

  test('right arrow is disabled when on the last page', () => {
    render(<Pagination currentPage={4} totalPages={5} onPageChange={mockOnPageChange} />);

    const rightArrow = screen.getByAltText('Right');
    expect(rightArrow).toHaveClass('disabled');
  });

  test('displays "No pages available" when there are no pages', () => {
    render(<Pagination currentPage={0} totalPages={0} onPageChange={mockOnPageChange} />);
    
    expect(screen.getByText('No pages available')).toBeInTheDocument();
  });
});
