
import { get, post, del, patch } from "../../apiServices";
import { USERS_BASE_URL } from "../../apiConstants";




export const fetchUsers = async (page = 0, size = 7, searchTerm = "") => {
  try {

    const response = await get(`${USERS_BASE_URL}/list`, {
      page,
      size,
      search: encodeURIComponent(searchTerm),
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};


export const addUser = async (newUser) => {
  try {

    const response =  await post(`${USERS_BASE_URL}/register`, newUser);
   
     return response;
  } catch (error) {
    console.error("Error in addUser function:", error);
    throw error;
  }
};

export const fetchUserCount = async () => {
  try {
    const response = await get(`${USERS_BASE_URL}/count`);
    return response;
  } catch (error) {
    console.error("Failed to fetch user count:", error);
    throw error;
  }
};


export const deleteUser = async (id) => {
  try {

    const response = await del(`${USERS_BASE_URL}/delete/${id}`);
   return response;
    
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};


export const findUserByMobile = async (number) => {
  try {

    const response = await get(`${USERS_BASE_URL}/number/${number}`);
    return response;
  } catch (error) {
    console.error("Failed to get the user details:", error);
    throw error;
  }
};


export const updateUser = async (userId, updatedUser) => {
  try {

    const response = await patch(`${USERS_BASE_URL}/update/${userId}`, updatedUser);
    return response;
  } catch (error) {
    console.error("Error in updateUser function:", error);
    throw error;
  }
};



