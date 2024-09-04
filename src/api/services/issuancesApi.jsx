
import { get, post, del, patch } from "../apiClient";
import { ISSUANCE_BASE_URL } from "../apiConstants";





export const fetchIssuances = async (page = 0, size = 10, searchTerm = "") => {
  try {
    return await get(`${ISSUANCE_BASE_URL}/list`, {
      page,
      size,
      search: encodeURIComponent(searchTerm),
    });
  } catch (error) {
    console.error("Error fetching issuances:", error);
    throw error;
  }
};


export const createIssuance = async (issuance) => {
  try {

    if (!issuance.userId || !issuance.bookId) {
      throw new Error("User ID and Book ID are required");
    }

    const response = await post(`${ISSUANCE_BASE_URL}/save`, issuance);

    console.log("Response received:", response);

    return response; 
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

    console.log("Response received:", response);

    return response; 
  } catch (error) {
    console.error("Error updating issuance:", error);
    throw error;
  }
};


export const deleteIssuance = async (issuanceId) => {
  try {
    await del(`${ISSUANCE_BASE_URL}/${issuanceId}`);
    return true;
  } catch (error) {
    console.error("Error deleting issuance:", error);
    throw error;
  }
};


export const fetchIssuanceCount = async () => {
  try {
    const response = await get(`${ISSUANCE_BASE_URL}/count`);
    return response;
  } catch (error) {
    console.error("Error fetching issuance count:", error);
    throw error;
  }
};


export const fetchUserIssuanceDetails = async (userId, page = 0, size = 10) => {
    try {
      const response = await get(`${ISSUANCE_BASE_URL}/userIssuanceDetails`, {
        userId,
        page,
        size
      });
  
      console.log("Response received:", response);
  
      return response; 
    } catch (error) {
      console.error("Error fetching user issuance details:", error);
      throw error;
    }
  };


export const fetchBookIssuanceDetails = async (bookId , page =0,size = 10) => {
     try {
        const response =  await get(`${ISSUANCE_BASE_URL}/bookIssuanceDetails`, {
            bookId,
            page,
            size
        })

        console.log("Response received:", response);
  
        return response; 

     }catch(error) {
        console.error("Error fetching user issuance details:",error);
        throw error ;
     }
}  