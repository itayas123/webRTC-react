import * as actionTypes from "./actions";

const initialState = {
  isConnected: false,
  user: {
    name: null,
    email: null,
    isAdmin: false
  }
};

const reducer = (state = initialState, action) => {
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
          isAdmin: false
        }
      };
    default:
      return state;
  }
};

export default reducer;
