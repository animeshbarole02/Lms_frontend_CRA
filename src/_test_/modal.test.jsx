import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Modal from '../components/modal/modal'; // Adjust the import path as necessary

describe('Modal Component', () => {
  
  // Test that the Modal component is not rendered when `isOpen` is false
  test('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={() => {}}>Test Content</Modal>);
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  // Test that the Modal component is rendered when `isOpen` is true
  test('renders when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Test Content</Modal>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  // Test that the close button triggers the onClose callback
  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Modal isOpen={true} onClose={handleClose}>Test Content</Modal>);
    
    // Click the close button
    fireEvent.click(screen.getByRole('button', { name: /×/i }));
    
    // Check if handleClose was called
    expect(handleClose).toHaveBeenCalled();
  });

  // Test that children are displayed correctly inside the modal
  test('displays children correctly', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Child Content</div>
      </Modal>
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  // Test that clicking outside the modal content does not trigger onClose (if you have such behavior)
  test('does not call onClose when clicking inside modal content', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Click inside the modal content
    fireEvent.click(screen.getByText('Modal Content'));
    
    // Check if handleClose was not called
    expect(handleClose).not.toHaveBeenCalled();
  });

  // Test that clicking outside the modal content triggers onClose (if you have such behavior)
  test('calls onClose when clicking outside modal content', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    // Click outside the modal content (overlay)
    fireEvent.click(screen.getByRole('dialog'));
    
    // Check if handleClose was called
    expect(handleClose).toHaveBeenCalled();
  });
});
