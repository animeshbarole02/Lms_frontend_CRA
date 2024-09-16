import { get, post, del, patch } from "../../apiServices";
import { CATEGORY_BASE_URL } from "../../apiConstants";

export const fetchCategories = async (page = 0, size = 8, searchTerm = "") => {
  try {
    const response = await get(`${CATEGORY_BASE_URL}/list`, {
      page,
      size,
      search: searchTerm,
    });

    return { success: true, data: response}
  } catch (error) {
    console.error("Failed to Fetch Categories :", error);
    throw error;
  }
};


export const addCategory = async (newCategory) => {
  try {
    const response = await post(`${CATEGORY_BASE_URL}/save`, newCategory);
    if (response.status === 200 || response.status === 201) {
      return { success: true, message: response.message };
    } else {
      
      return { success: false, message: response.message };
    }
  } catch (error) {
    console.error("Error in addCategory function:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await del(`${CATEGORY_BASE_URL}/${id}`);


    if (response.status === 200) {
      return { success: true, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
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
    const response = await patch(
      `${CATEGORY_BASE_URL}/update/${categoryId}`,
      updatedCategory
    );
    if (response.status === 200) {
      return { success: true, message: response.message };
    } else {
     
      return { success: false, message: response.message };
    }
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const fetchAllCategories = async () => {
  try {
    const response = await get(`${CATEGORY_BASE_URL}/getList`);

    return { success: true, data: response}
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw error;
  }
};
