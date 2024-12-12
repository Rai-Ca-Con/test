const currentUserReducer = (state = null, action) => {
  switch (action.type) {
    case "FETCH_CURRENT_USER":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

export default currentUserReducer;