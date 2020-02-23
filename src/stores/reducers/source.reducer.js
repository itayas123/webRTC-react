import * as actionTypes from "../actions";

const initialState = {
  sourceArray: []
};

const sourceReducer = (state = initialState, action) => {
  const tempSources = state.sourceArray ? [...state.sourceArray] : [];
  switch (action.type) {
    case actionTypes.PUSH_SOURCE:
      tempSources.push(action.source);
      return {
        sourceArray: tempSources
      };
    case actionTypes.POP_SOURCE:
      const index = tempSources.indexOf(action.source);
      if (index > -1) {
        tempSources.splice(index, 1);
        return {
          sourceArray: tempSources
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
