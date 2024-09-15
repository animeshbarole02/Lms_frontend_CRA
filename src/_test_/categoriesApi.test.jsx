import {
 

  addCategory,
  deleteCategory,
  getCategoryByName,
  updateCategory,
  fetchAllCategories,
} from '../api/services/actions/categoryActions';

import { get, post, del, patch } from '../api/apiServices';
import { CATEGORY_BASE_URL } from '../api/apiConstants';

jest.mock('../api/apiServices', () => ({
  get: jest.fn(),
  post: jest.fn(),
  del: jest.fn(),
  patch: jest.fn(),
}));

jest.mock('../api/apiConstants', () => ({
  CATEGORY_BASE_URL: '/api/categories',
}));

describe('Category API functions', () => {
 
 
  test('addCategory calls post with correct parameters and handles success', async () => {
    const newCategory = { name: 'New Category', categoryDesc: 'Description' };
    const mockResponse = { status: 201, message: 'Category added successfully' };
    post.mockResolvedValue(mockResponse);

    const response = await addCategory(newCategory);

    expect(post).toHaveBeenCalledWith(`${CATEGORY_BASE_URL}/save`, newCategory);
    expect(response).toEqual({ success: true, message: mockResponse.message });
  });

  test('addCategory handles error response', async () => {
    const newCategory = { name: 'New Category', categoryDesc: 'Description' };
    const mockResponse = { status: 400, message: 'Failed to add category' };
    post.mockResolvedValue(mockResponse);

    const response = await addCategory(newCategory);

    expect(post).toHaveBeenCalledWith(`${CATEGORY_BASE_URL}/save`, newCategory);
    expect(response).toEqual({ success: false, message: mockResponse.message });
  });

  test('deleteCategory calls del with correct URL and handles success', async () => {
    const id = 1;
    const mockResponse = { status: 200, message: 'Category deleted successfully' };
    del.mockResolvedValue(mockResponse);

    const response = await deleteCategory(id);

    expect(del).toHaveBeenCalledWith(`${CATEGORY_BASE_URL}/${id}`);
    expect(response).toEqual({ success: true, message: mockResponse.message });
  });

  test('deleteCategory handles error response', async () => {
    const id = 1;
    const mockResponse = { status: 400, message: 'Failed to delete category' };
    del.mockResolvedValue(mockResponse);

    const response = await deleteCategory(id);

    expect(del).toHaveBeenCalledWith(`${CATEGORY_BASE_URL}/${id}`);
    expect(response).toEqual({ success: false, message: mockResponse.message });
  });

  test('getCategoryByName calls get with correct URL and returns ID', async () => {
    const name = 'Electronics';
    const mockData = { id: 1, name: 'Electronics' };
    get.mockResolvedValue(mockData);

    const id = await getCategoryByName(name);

    expect(get).toHaveBeenCalledWith(`${CATEGORY_BASE_URL}/name/${name}`);
    expect(id).toEqual(1);
  });

  test('updateCategory calls patch with correct parameters and handles success', async () => {
    const categoryId = 1;
    const updatedCategory = { name: 'Updated Name', categoryDesc: 'Updated Description' };
    const mockResponse = { status: 200, message: 'Category updated successfully' };
    patch.mockResolvedValue(mockResponse);

    const response = await updateCategory(categoryId, updatedCategory);

    expect(patch).toHaveBeenCalledWith(`${CATEGORY_BASE_URL}/update/${categoryId}`, updatedCategory);
    expect(response).toEqual({ success: true, message: mockResponse.message });
  });

  test('updateCategory handles error response', async () => {
    const categoryId = 1;
    const updatedCategory = { name: 'Updated Name', categoryDesc: 'Updated Description' };
    const mockResponse = { status: 400, message: 'Failed to update category' };
    patch.mockResolvedValue(mockResponse);

    const response = await updateCategory(categoryId, updatedCategory);

    expect(patch).toHaveBeenCalledWith(`${CATEGORY_BASE_URL}/update/${categoryId}`, updatedCategory);
    expect(response).toEqual({ success: false, message: mockResponse.message });
  });

  test('fetchAllCategories calls get with correct URL and returns data', async () => {
    const mockResponse = { categories: [] };
    get.mockResolvedValue(mockResponse);

    const response = await fetchAllCategories();

    expect(get).toHaveBeenCalledWith(`${CATEGORY_BASE_URL}/getList`);
    expect(response).toEqual({ success: true, data: mockResponse });
  });

  test('fetchAllCategories handles errors', async () => {
    get.mockRejectedValue(new Error('Network Error'));

    await expect(fetchAllCategories()).rejects.toThrow('Network Error');
  });
});
