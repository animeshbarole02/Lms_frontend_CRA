import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DynamicForm from '../components/forms/dynamicform';

describe('DynamicForm Component', () => {
  let mockOnSubmit;
  const fields = [
    { name: 'name', type: 'text', placeholder: 'Enter name' },
    { name: 'category', type: 'select', placeholder: 'Select category', options: [{ value: 'book', label: 'Book' }, { value: 'magazine', label: 'Magazine' }] },
  ];
  const initialData = { name: 'Sample name', category: 'book' };
  const errors = { name: 'Name is required', category: '' };

  beforeEach(() => {
    mockOnSubmit = jest.fn();
  });

  test('renders form with fields, heading, and button based on mode', () => {
    render(
      <DynamicForm
        fields={fields}
        onSubmit={mockOnSubmit}
        heading="Test Form"
        isEditMode={false}
      />
    );

    // Common elements
    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument(); // Add button
  });

  test('renders errors if provided', () => {
    render(
      <DynamicForm
        fields={fields}
        onSubmit={mockOnSubmit}
        heading="Test Form"
        errors={errors}
      />
    );

    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  test('handles input field updates and clears errors correctly', () => {
    render(
      <DynamicForm
        fields={fields}
        onSubmit={mockOnSubmit}
        heading="Test Form"
        initialData={initialData}
        errors={errors}
      />
    );

    const nameInput = screen.getByPlaceholderText('Enter name');
    fireEvent.change(nameInput, { target: { value: 'Updated name' } });

    // Input change reflected
    expect(nameInput.value).toBe('Updated name');

    // Error cleared
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  test('submits form data correctly on submit', () => {
    render(
      <DynamicForm
        fields={fields}
        onSubmit={mockOnSubmit}
        heading="Test Form"
        initialData={initialData}
      />
    );

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Sample name', category: 'book' });
  });

  test('renders Edit button in edit mode', () => {
    render(
      <DynamicForm
        fields={fields}
        onSubmit={mockOnSubmit}
        heading="Test Form"
        initialData={initialData}
        isEditMode={true}
      />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});
