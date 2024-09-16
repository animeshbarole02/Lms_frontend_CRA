import { get, post, del, patch } from "../../apiServices";
import { ISSUANCE_BASE_URL } from "../../apiConstants";

export const fetchIssuances = async (page = 0, size = 10, searchTerm = "") => {
  try {
    const response = await get(`${ISSUANCE_BASE_URL}/list`, {
      page,
      size,
      search: searchTerm,
    });

    return { success: true, data: response}
  } catch (error) {
    console.error("Error fetching issuances:", error);
    throw error;
  }
};

export const createIssuance = async (issuance) => {
  try {
    const response = await post(`${ISSUANCE_BASE_URL}/save`, issuance);

    if (response.status === 200 || response.status === 201) {
      return { success: true, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    console.error("Error in createIssuance function:", error);
    throw error;
  }
};

export const updateIssuance = async (issuanceId, updatedData) => {
  try {
    const response = await patch(
      `${ISSUANCE_BASE_URL}/update/${issuanceId}`,
      updatedData
    );

    if (response.status === 200 || response.status === 201) {
      return { success: true, message: response.message };
    } else {
      return { success: false, message: response.message || 'An error occurred while updating the issuance.' };
    }
  } catch (error) {
    console.error("Error updating issuance:", error);
    return { success: false, message: "Failed to update issuance due to server error." };
  }
};

export const deleteIssuance = async (issuanceId) => {
  try {
    const response = await del(`${ISSUANCE_BASE_URL}/${issuanceId}`);
    if (response.status === 200 || response.status === 201) {
      return { success: true, message: response.message };
    } else {
      return { success: false, message: response.message };
    }
  } catch (error) {
    console.error("Error deleting issuance:", error);
    return { success: false, message: "Failed to delete issuance due to server error." };
  }
};





export const fetchUserIssuanceDetails = async (userId, page = 0, size = 10) => {
  try {
    const response = await get(`${ISSUANCE_BASE_URL}/userIssuanceDetails`, {
      userId,
      page,
      size,
    });

    return { success: true, data: response}
  } catch (error) {
    console.error("Error fetching user issuance details:", error);
    throw error;
  }
};

export const fetchBookIssuanceDetails = async (bookId, page = 0, size = 10) => {
  try {
    const response = await get(`${ISSUANCE_BASE_URL}/bookIssuanceDetails`, {
      bookId,
      page,
      size,
    });
    return { success: true, data: response}
  } catch (error) {
    console.error("Error fetching user issuance details:", error);
    throw error;
  }
};
