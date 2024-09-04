// categoriesApi.js
import { get, post, put, del } from "../apiClient";
import { CATEGORY_BASE_URL } from "../apiConstants";




export const fetchCategories = async (page = 0, size = 8, searchTerm = "") => {
  try {
    
    return await get(`${CATEGORY_BASE_URL}/list`, { page, size, search: searchTerm }); // Removed encodeURIComponent as apiClient.js will handle query params encoding
  } catch (error) {
    console.error("Failed to Fetch Categories :", error);
    throw error; 
  }
};


export const fetchCategoryCount= async () => {
  try {
    const count = await get(`${CATEGORY_BASE_URL}/count`);
    return count;
  } catch (error) {
    console.error("Failed to fetch category count:", error);
    throw error; 
  }
};


export const addCategory = async (newCategory) => {
  try {
    console.log([newCategory]);
 
    return await post(`${CATEGORY_BASE_URL}/save`, [newCategory]);
  } catch (error) {
    console.error("Error in addCategory function:", error);
    throw error; 
  }
};


export const deleteCategory = async (id) => {
  try {
    
    return await del(`${CATEGORY_BASE_URL}/${id}`);
  } catch (error) {
    console.error("Failed to delete category:", error);
    throw error; 
  }
};

export const getCategoryByName = async (name) => {
  try {

    const data = await get(`${CATEGORY_BASE_URL}/name/${name}`);
    return data.id; 
  } catch (error) {
    console.error("Failed to find category By Name:", error);
    throw error; 
  }
};


export const updateCategory = async (categoryId, updatedCategory) => {
  try {

    return await put(`${CATEGORY_BASE_URL}/update/${categoryId}`, updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error; 
  }
};


export const fetchAllCategories = async () => {
  try {

    return await get(`${CATEGORY_BASE_URL}/getAll`);
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error; 
  }
};
