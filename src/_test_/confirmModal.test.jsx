import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from '../components/modal/confirmationModal';

import '@testing-library/jest-dom/extend-expect';

test('renders and handles confirmation modal actions', () => {

  const handleCancelDelete = jest.fn();
  const handleDelete = jest.fn();

  
  render(
    <ConfirmationModal
      isOpen={true}
      onClose={handleCancelDelete}
      onConfirm={handleDelete}
      message="Are you sure you want to delete this category?"
    />
  );

 
  expect(screen.getByText('Are you sure you want to delete this category?')).toBeInTheDocument();

  
  const confirmButton = screen.getByText('Yes');
  fireEvent.click(confirmButton);


  expect(handleDelete).toHaveBeenCalledTimes(1);

 
  const cancelButton = screen.getByText('No');
  fireEvent.click(cancelButton);


  expect(handleCancelDelete).toHaveBeenCalledTimes(1);
});
