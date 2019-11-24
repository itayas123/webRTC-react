import * as actionTypes from "../actions";

const initialState = {
  sourceArray: []
};

const sourceReducer = (state = initialState, action) => {
  const temp = [...state.sourceArray];
  switch (action.type) {
    case actionTypes.PUSH_ARRAY:
      temp.push(action.item);
      return {
        sourceArray: temp
      };
    case actionTypes.POP_ARRAY:
      temp.pop();
      return {
        sourceArray: temp
      };
    case actionTypes.POP_ITEM:
      const index = temp.indexOf(action.item);
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
