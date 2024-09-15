import { DASHBOARD_COUNT_BASE_URL } from "../../apiConstants";
import { get } from "../../apiServices";

export const fetchCount = async () => {
    try {
      const response = await get(`${DASHBOARD_COUNT_BASE_URL}/count`);
  
       return { success: true, data: response}
      
      
    } catch (error) {
      console.error("Error fetching all counts:", error);
      throw error;
    }
  };
  