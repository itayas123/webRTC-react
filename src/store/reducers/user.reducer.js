import * as actionTypes from "../actions";

const initialState = {
  isConnected: true,
  user: {
    name: "itay",
    email: "itay@gmail.com",
    admin: true
  }
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        isConnected: true,
        user: action.user
      };
    case actionTypes.REGISTER:
      return {
        isConnected: true,
        user: action.user
      };
    case actionTypes.LOGOUT:
      return {
        isConnected: false,
        user: {
          name: null,
          email: null,
          admin: false
        }
      };
    default:
      return state;
  }
};

export default userReducer;
