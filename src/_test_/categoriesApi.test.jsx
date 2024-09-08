// categoriesApi.test.js

import {
    fetchCategories,
    fetchCategoryCount,
    addCategory,
    deleteCategory,
    getCategoryByName,
    updateCategory,
    fetchAllCategories,
  } from '../api/services/actions/categoryActions';
  
  import { get, post, del, patch } from '../api/apiServices';
  
  jest.mock('../api/apiServices', () => ({
    get: jest.fn(),
    post: jest.fn(),
    del: jest.fn(),
    patch: jest.fn(),
  }));
  
  jest.mock('../api/apiConstants', () => ({
    CATEGORY_BASE_URL: '/api/categories',
  }));


  test('fetchCategories calls get with correct parameters', async () => {
    const mockResponse = { content: [], size: 8, totalPages: 1 };
    get.mockResolvedValue(mockResponse);
  
    const page = 0;
    const size = 8;
    const searchTerm = '';
  
    const response = await fetchCategories(page, size, searchTerm);
  
    expect(get).toHaveBeenCalledWith(
      '/api/categories/list',
      { page, size, search: searchTerm }
    );
    expect(response).toEqual(mockResponse);
  });

  
  test('fetchCategoryCount calls get with correct URL', async () => {
    const mockCount = 10;
    get.mockResolvedValue(mockCount);
  
    const count = await fetchCategoryCount();
  
    expect(get).toHaveBeenCalledWith('/api/categories/count');
    expect(count).toEqual(mockCount);
  });

  
  test('addCategory calls post with correct parameters', async () => {
    const newCategory = { name: 'New Category', categoryDesc: 'Description' };
    const mockResponse = { success: true };
    post.mockResolvedValue(mockResponse);
  
    const response = await addCategory(newCategory);
  
    expect(post).toHaveBeenCalledWith('/api/categories/save', newCategory);
    expect(response).toEqual(mockResponse);
  });

  
  test('deleteCategory calls del with correct URL', async () => {
    const id = 1;
    const mockResponse = { success: true };
    del.mockResolvedValue(mockResponse);
  
    const response = await deleteCategory(id);
  
    expect(del).toHaveBeenCalledWith('/api/categories/1');
    expect(response).toEqual(mockResponse);
  });

  
  test('getCategoryByName calls get with correct URL and returns ID', async () => {
    const name = 'Electronics';
    const mockData = { id: 1, name: 'Electronics' };
    get.mockResolvedValue(mockData);
  
    const id = await getCategoryByName(name);
  
    expect(get).toHaveBeenCalledWith('/api/categories/name/Electronics');
    expect(id).toEqual(1);
  });

  
  test('updateCategory calls patch with correct parameters', async () => {
    const categoryId = 1;
    const updatedCategory = { name: 'Updated Name', categoryDesc: 'Updated Description' };
    const mockResponse = { success: true };
    patch.mockResolvedValue(mockResponse);
  
    const response = await updateCategory(categoryId, updatedCategory);
  
    expect(patch).toHaveBeenCalledWith(
      '/api/categories/update/1',
      updatedCategory
    );
    expect(response).toEqual(mockResponse);
  });

  
  test('fetchAllCategories calls get with correct URL', async () => {
    const mockResponse = [{ id: 1, name: 'Category 1' }];
    get.mockResolvedValue(mockResponse);
  
    const response = await fetchAllCategories();
  
    expect(get).toHaveBeenCalledWith('/api/categories/getAll');
    expect(response).toEqual(mockResponse);
  });

  
  test('fetchCategories throws an error when get fails', async () => {
    const mockError = new Error('Network Error');
    get.mockRejectedValue(mockError);
   

    jest.spyOn(console, 'error').mockImplementation(() => {});
   
    await expect(fetchCategories()).rejects.toThrow('Network Error');

    console.error.mockRestore();
  });
  