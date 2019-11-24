import * as actionTypes from "../actions";

const initialState = {
  isConnected: true,
  user: {
    name: null,
    email: null,
    admin: true
  }
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        isConnected: true,
        user: action.user
      };
    case actionTypes.REGISTER:
      return {
        ...state,
        isConnected: true,
        user: action.user
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
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
