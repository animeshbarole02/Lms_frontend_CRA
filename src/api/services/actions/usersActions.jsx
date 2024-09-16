import { get, post, del, patch } from "../../apiServices";
import { USERS_BASE_URL } from "../../apiConstants";

export const fetchUsers = async (page = 0, size = 7, searchTerm = "") => {
  try {
    const response = await get(`${USERS_BASE_URL}/list`, {
      page,
      size,
      search: searchTerm,
    });
    return { success: true, data: response}
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const addUser = async (newUser) => {
  try {
    const response = await post(`${USERS_BASE_URL}/register`, newUser);


    if (response.status === 200 || response.status === 201) {
      return { success: true, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    console.error("Error in addUser function:", error);
    return { success: false, message: "Failed to add user due to server error." };
  }
};




export const deleteUser = async (id) => {
  try {
    const response = await del(`${USERS_BASE_URL}/delete/${id}`);

    if (response.status === 200 || response.status === 204) {
      return { success: true, message: "User deleted successfully." };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, message: "Failed to delete user due to server error." };
  }
};

export const findUserByMobile = async (number) => {
  try {
    const response = await get(`${USERS_BASE_URL}/number/${number}`);
   
  
     return  { success : true , data : response}
    
  
  } catch (error) {
    console.error("Failed to get the user details:", error);
    throw error;
  }
};

export const updateUser = async (userId, updatedUser) => {
  try {
    const response = await patch(`${USERS_BASE_URL}/update/${userId}`, updatedUser);

    if (response.status === 200) {
      return { success: true, message: response.message || "User updated successfully." };
    } else {
      return { success: false, message: response.message || "Failed to update user." };
    }
  } catch (error) {
    console.error("Error in updateUser function:", error);
    return { success: false, message: "Failed to update user due to server error." };
  }
};

