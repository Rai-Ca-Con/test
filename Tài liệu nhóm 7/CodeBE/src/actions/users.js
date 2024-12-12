// src/actions/users.js
import axiosClient from '../api/axiosClient';

export const setUserInfo = (userInfo) => ({
  type: "SET_USER_INFO",
  payload: userInfo,
});

// Action to update user profile
export const updateUserProfile = (userId, profileData) => async (dispatch) => {
  try {
    // Make an API call to update the user profile
    const response = await axiosClient.put(`/users/update/${userId}`, profileData);
    
    // Dispatch action to update user info in the store
    dispatch(setUserInfo(response.data.result)); // Ensure this includes name, about, tags, etc.
    console.log("data:", response.data.result);
    
    return response.data.result; // Optionally return the updated user data
  } catch (error) {
    // console.error("Error updating profile:", error);
    // Handle errors (e.g., show a notification)
    console.log("Error updating profile:", error);
  }
};