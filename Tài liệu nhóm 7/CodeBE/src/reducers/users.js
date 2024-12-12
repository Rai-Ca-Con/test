// src/reducers/users.js

const initialState = {
  users: [],
  currentUser: null,
  userInfo: null, // Store essential user information (userId, username, etc.)
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          userId: action.payload.userId,
          username: action.payload.username,
          name: action.payload.name,
          about: action.payload.description,
          tags: action.payload.tags,
          avatar: action.payload.avatar,
        },
      };
    case "LOGOUT":
      return initialState; // Reset state on logout
    default:
      return state; // Return current state for unhandled actions
  }
};

export default userReducer;