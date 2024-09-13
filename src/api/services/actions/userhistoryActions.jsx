import { get } from "../../apiServices";
import { USER_HISTORY_BASE_URL } from "../../apiConstants";

export const fetchUserHistoryDetails = async (userId, page = 0, size = 10) => {
  try {
    const response = await get(`${USER_HISTORY_BASE_URL}/userIssuanceDetails`, {
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
