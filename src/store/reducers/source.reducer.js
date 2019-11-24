import * as actionTypes from "../actions";

const initialState = {
  sourceArray: []
};

const sourceReducer = (state = initialState, action) => {
  const temp = state.sourceArray ? [...state.sourceArray] : [];
  switch (action.type) {
    case actionTypes.PUSH_SOURCE:
      temp.push(action.source);
      return {
        sourceArray: temp
      };
    case actionTypes.POP_SOURCE:
      const index = temp.indexOf(action.source);
      if (index > -1) {
        temp.splice(index, 1);
        return {
          sourceArray: temp
        };
      } else {
        return state;
      }
    case actionTypes.INIT_SOURCE_ARRAY:
      return {
        sourceArray: action.array
      };
    default:
      return state;
  }
};

export default sourceReducer;
